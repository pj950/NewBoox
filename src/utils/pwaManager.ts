// PWA功能管理器
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private notificationPermission: NotificationPermission = 'default';

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  constructor() {
    this.initializePWA();
  }

  private initializePWA(): void {
    // 检查是否已安装
    this.checkInstallStatus();
    
    // 监听安装提示事件
    window.addEventListener('beforeinstallprompt', this.handleInstallPrompt.bind(this));
    
    // 监听应用安装事件
    window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));
    
    // 注册Service Worker
    this.registerServiceWorker();
    
    // 请求通知权限
    this.requestNotificationPermission();
    
    // 设置通知点击处理
    this.setupNotificationHandlers();
  }

  private checkInstallStatus(): void {
    // 检查是否在独立模式下运行（已安装）
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone === true;
  }

  private handleInstallPrompt(event: Event): void {
    // 阻止默认的安装提示
    event.preventDefault();
    
    // 保存事件以便后续使用
    this.deferredPrompt = event as any;
    
    // 显示自定义安装提示
    this.showInstallBanner();
  }

  private handleAppInstalled(): void {
    this.isInstalled = true;
    this.deferredPrompt = null;
    
    // 隐藏安装横幅
    this.hideInstallBanner();
    
    // 显示安装成功消息
    this.showNotification({
      title: '安装成功！',
      body: '智能仓库应用已成功安装到您的设备',
      icon: '/vite.svg'
    });
  }

  private async registerServiceWorker(): Promise<void> {
    // Skip Service Worker registration in StackBlitz environment
    if (window.location.hostname.includes('webcontainer') || 
        window.location.hostname.includes('stackblitz') ||
        window.location.hostname.includes('local-credentialless')) {
      console.log('Service Worker registration skipped in development environment');
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker 注册成功:', registration);
        
        // 监听Service Worker更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 有新版本可用
                this.showUpdateAvailable();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker 注册失败:', error);
      }
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
  }

  private setupNotificationHandlers(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
          // 处理通知点击
          this.handleNotificationClick(event.data.data);
        }
      });
    }
  }

  // 显示安装横幅
  private showInstallBanner(): void {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'fixed bottom-20 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
    banner.innerHTML = `
      <div class="flex-1">
        <h3 class="font-semibold mb-1">安装应用</h3>
        <p class="text-sm opacity-90">将智能仓库添加到主屏幕，获得更好的体验</p>
      </div>
      <div class="flex space-x-2 ml-4">
        <button id="pwa-install-dismiss" class="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors">
          稍后
        </button>
        <button id="pwa-install-accept" class="px-3 py-1 text-sm bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors">
          安装
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // 绑定事件
    document.getElementById('pwa-install-dismiss')?.addEventListener('click', () => {
      this.hideInstallBanner();
    });
    
    document.getElementById('pwa-install-accept')?.addEventListener('click', () => {
      this.installApp();
    });
  }

  private hideInstallBanner(): void {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private showUpdateAvailable(): void {
    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'fixed top-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
    banner.innerHTML = `
      <div class="flex-1">
        <h3 class="font-semibold mb-1">新版本可用</h3>
        <p class="text-sm opacity-90">发现新版本，点击更新获得最新功能</p>
      </div>
      <div class="flex space-x-2 ml-4">
        <button id="pwa-update-dismiss" class="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors">
          稍后
        </button>
        <button id="pwa-update-accept" class="px-3 py-1 text-sm bg-white text-green-600 rounded hover:bg-gray-100 transition-colors">
          更新
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // 绑定事件
    document.getElementById('pwa-update-dismiss')?.addEventListener('click', () => {
      const updateBanner = document.getElementById('pwa-update-banner');
      if (updateBanner) updateBanner.remove();
    });
    
    document.getElementById('pwa-update-accept')?.addEventListener('click', () => {
      this.updateApp();
    });
  }

  // 安装应用
  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('用户接受了安装提示');
        this.hideInstallBanner();
        return true;
      } else {
        console.log('用户拒绝了安装提示');
        return false;
      }
    } catch (error) {
      console.error('安装失败:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  // 更新应用
  async updateApp(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // 告诉等待中的Service Worker跳过等待
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // 刷新页面以应用更新
        window.location.reload();
      }
    }
  }

  // 显示通知
  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.notificationPermission !== 'granted') {
      return;
    }

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/vite.svg',
          badge: options.badge || '/vite.svg',
          tag: options.tag,
          data: options.data,
          actions: options.actions,
          requireInteraction: true,
          vibrate: [200, 100, 200]
        });
      }
    } else if ('Notification' in window) {
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/vite.svg',
        tag: options.tag,
        data: options.data
      });
    }
  }

  // 处理通知点击
  private handleNotificationClick(data: any): void {
    // 根据通知数据执行相应操作
    if (data && data.action) {
      switch (data.action) {
        case 'view_item':
          window.location.hash = `#/item/${data.itemId}`;
          break;
        case 'view_warehouse':
          window.location.hash = `#/warehouse/${data.warehouseId}`;
          break;
        default:
          window.focus();
      }
    }
  }

  // 调度通知
  scheduleNotification(options: NotificationOptions, delay: number): void {
    setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }

  // 取消通知
  async cancelNotification(tag: string): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const notifications = await registration.getNotifications({ tag });
        notifications.forEach(notification => notification.close());
      }
    }
  }

  // 获取PWA状态
  getPWAStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      notificationPermission: this.notificationPermission,
      isOnline: navigator.onLine,
      hasServiceWorker: 'serviceWorker' in navigator
    };
  }

  // 检查是否支持PWA功能
  checkPWASupport() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      notification: 'Notification' in window,
      installPrompt: 'BeforeInstallPromptEvent' in window,
      standalone: 'standalone' in window.navigator,
      fullscreen: 'requestFullscreen' in document.documentElement
    };
  }
}

export default PWAManager;