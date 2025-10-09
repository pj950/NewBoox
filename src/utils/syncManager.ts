// 数据同步管理器
export interface SyncChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'warehouse' | 'box' | 'item' | 'post' | 'comment';
  data: any;
  timestamp: string;
  synced: boolean;
  retryCount: number;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  lastSync: Date | null;
  syncErrors: string[];
}

class SyncManager {
  private static instance: SyncManager;
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingChanges: 0,
    lastSync: null,
    syncErrors: []
  };
  private listeners: ((status: SyncStatus) => void)[] = [];
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  constructor() {
    this.initializeSync();
  }

  private initializeSync(): void {
    // 监听网络状态变化
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // 加载待同步的更改
    this.loadPendingChanges();
    
    // 启动定期同步
    this.startPeriodicSync();
  }

  private handleOnline(): void {
    this.syncStatus.isOnline = true;
    this.notifyListeners();
    this.syncPendingChanges();
  }

  private handleOffline(): void {
    this.syncStatus.isOnline = false;
    this.syncStatus.isSyncing = false;
    this.notifyListeners();
  }

  private loadPendingChanges(): void {
    const changes = this.getPendingChanges();
    this.syncStatus.pendingChanges = changes.length;
    this.notifyListeners();
  }

  private startPeriodicSync(): void {
    // 每5分钟尝试同步一次
    this.syncInterval = setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.isSyncing) {
        this.syncPendingChanges();
      }
    }, 5 * 60 * 1000);
  }

  // 添加待同步的更改
  addPendingChange(change: Omit<SyncChange, 'id' | 'timestamp' | 'synced' | 'retryCount'>): void {
    const newChange: SyncChange = {
      ...change,
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      synced: false,
      retryCount: 0
    };

    const changes = this.getPendingChanges();
    changes.push(newChange);
    localStorage.setItem('pendingSync', JSON.stringify(changes));
    
    this.syncStatus.pendingChanges = changes.length;
    this.notifyListeners();

    // 如果在线，立即尝试同步
    if (this.syncStatus.isOnline && !this.syncStatus.isSyncing) {
      setTimeout(() => this.syncPendingChanges(), 1000);
    }
  }

  // 获取待同步的更改
  getPendingChanges(): SyncChange[] {
    const changes = localStorage.getItem('pendingSync');
    return changes ? JSON.parse(changes) : [];
  }

  // 同步待处理的更改
  async syncPendingChanges(): Promise<void> {
    if (!this.syncStatus.isOnline || this.syncStatus.isSyncing) {
      return;
    }

    const changes = this.getPendingChanges();
    if (changes.length === 0) {
      return;
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.syncErrors = [];
    this.notifyListeners();

    try {
      const syncedChanges: string[] = [];
      
      for (const change of changes) {
        try {
          const success = await this.syncSingleChange(change);
          if (success) {
            syncedChanges.push(change.id);
          } else {
            change.retryCount += 1;
            if (change.retryCount >= 3) {
              this.syncStatus.syncErrors.push(`同步失败: ${change.entity} ${change.type}`);
            }
          }
        } catch (error) {
          change.retryCount += 1;
          if (change.retryCount >= 3) {
            this.syncStatus.syncErrors.push(`同步错误: ${error}`);
          }
        }
      }

      // 移除已同步的更改
      const remainingChanges = changes.filter(c => !syncedChanges.includes(c.id));
      localStorage.setItem('pendingSync', JSON.stringify(remainingChanges));
      
      this.syncStatus.pendingChanges = remainingChanges.length;
      this.syncStatus.lastSync = new Date();
      
    } catch (error) {
      this.syncStatus.syncErrors.push(`同步失败: ${error}`);
    } finally {
      this.syncStatus.isSyncing = false;
      this.notifyListeners();
    }
  }

  // 同步单个更改
  private async syncSingleChange(change: SyncChange): Promise<boolean> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟90%的成功率
        const success = Math.random() > 0.1;
        resolve(success);
      }, 500 + Math.random() * 1000);
    });
  }

  // 强制同步
  async forceSync(): Promise<void> {
    if (this.syncStatus.isOnline) {
      await this.syncPendingChanges();
    }
  }

  // 添加状态监听器
  addStatusListener(listener: (status: SyncStatus) => void): void {
    this.listeners.push(listener);
    listener(this.syncStatus); // 立即调用一次
  }

  // 移除状态监听器
  removeStatusListener(listener: (status: SyncStatus) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  // 获取当前同步状态
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // 清除同步错误
  clearSyncErrors(): void {
    this.syncStatus.syncErrors = [];
    this.notifyListeners();
  }

  // 重置所有待同步数据
  resetPendingChanges(): void {
    localStorage.removeItem('pendingSync');
    this.syncStatus.pendingChanges = 0;
    this.syncStatus.syncErrors = [];
    this.notifyListeners();
  }

  // 导出待同步数据（用于调试）
  exportPendingChanges(): string {
    const changes = this.getPendingChanges();
    return JSON.stringify(changes, null, 2);
  }

  // 销毁同步管理器
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
  }
}

export default SyncManager;