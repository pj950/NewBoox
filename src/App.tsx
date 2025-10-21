import React, { useState, useEffect } from 'react';
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import Community from './pages/Community';
import Profile from './pages/Profile';
import WarehouseDetail from './pages/WarehouseDetail';
import BoxDetail from './pages/BoxDetail';
import ItemDetail from './pages/ItemDetail';
import AddWarehouse from './pages/AddWarehouse';
import AddBox from './pages/AddBox';
import AddItem from './pages/AddItem';
import CommunityPost from './pages/CommunityPost';
import CreatePost from './pages/CreatePost';
import Settings from './pages/Settings';
import EditItem from './pages/EditItem';
import Requirements from './pages/Requirements';
import NotificationSystem from './components/NotificationSystem';
import { useNotifications } from './hooks/useNotifications';
import OfflineIndicator from './components/OfflineIndicator';
import DataManager from './utils/dataManager';
import SyncManager from './utils/syncManager';
import PWAManager from './utils/pwaManager';

export type Page = 
  | 'dashboard' 
  | 'warehouses' 
  | 'community' 
  | 'profile'
  | 'warehouse-detail'
  | 'box-detail'
  | 'item-detail'
  | 'add-warehouse'
  | 'add-box'
  | 'add-item'
  | 'community-post'
  | 'create-post'
  | 'settings'
  | 'edit-item'
  | 'requirements';

export interface NavigationParams {
  warehouseId?: string;
  boxId?: string;
  itemId?: string;
  postId?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [navigationParams, setNavigationParams] = useState<NavigationParams>({});
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [syncStatus, setSyncStatus] = useState({
    isOnline: navigator.onLine,
    pendingChanges: 0,
    lastSync: null as Date | null,
    isSyncing: false
  });

  useEffect(() => {
    // 初始化管理器
    const dataManager = DataManager.getInstance();
    const syncManager = SyncManager.getInstance();
    const pwaManager = PWAManager.getInstance();
    
    // 初始化示例数据
    dataManager.initializeSampleData();
    
    // 监听同步状态
    syncManager.addStatusListener(setSyncStatus);
    
    // 欢迎通知
    addNotification({
      type: 'success',
      title: '欢迎使用智能仓库',
      message: '您的数据已安全保存在本地'
    });
    
    // 清理函数
    return () => {
      syncManager.removeStatusListener(setSyncStatus);
    };
  }, [addNotification]);

  const navigate = (page: Page, params: NavigationParams = {}) => {
    setCurrentPage(page);
    setNavigationParams(params);
  };

  const renderCurrentPage = () => {
    const pageProps = {
      onNavigate: navigate,
      addNotification,
      addPendingChange: (change: any) => {
        const syncManager = SyncManager.getInstance();
        syncManager.addPendingChange(change);
      }
    };

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} />;
      case 'warehouses':
        return <Warehouses {...pageProps} />;
      case 'community':
        return <Community onNavigate={navigate} />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      case 'warehouse-detail':
        return <WarehouseDetail {...pageProps} warehouseId={navigationParams.warehouseId} />;
      case 'box-detail':
        return <BoxDetail {...pageProps} boxId={navigationParams.boxId} warehouseId={navigationParams.warehouseId} />;
      case 'item-detail':
        return <ItemDetail {...pageProps} itemId={navigationParams.itemId} addNotification={addNotification} />;
      case 'edit-item':
        return <EditItem onNavigate={navigate} itemId={navigationParams.itemId} addNotification={addNotification} />;
      case 'add-warehouse':
        return <AddWarehouse {...pageProps} />;
      case 'add-box':
        return <AddBox {...pageProps} warehouseId={navigationParams.warehouseId} />;
      case 'add-item':
        return <AddItem {...pageProps} boxId={navigationParams.boxId} warehouseId={navigationParams.warehouseId} />;
      case 'community-post':
        return <CommunityPost onNavigate={navigate} postId={navigationParams.postId} />;
      case 'create-post':
        return <CreatePost onNavigate={navigate} />;
      case 'settings':
        return <Settings onNavigate={navigate} addNotification={addNotification} />;
      case 'requirements':
        return <Requirements onNavigate={navigate} />;
      default:
        return <Dashboard {...pageProps} />;
    }
  };

  const showBottomNav = !['warehouse-detail', 'box-detail', 'item-detail', 'add-warehouse', 'add-box', 'add-item', 'community-post', 'create-post', 'settings', 'edit-item'].includes(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <OfflineIndicator 
        isOnline={syncStatus.isOnline}
        pendingChanges={syncStatus.pendingChanges}
        lastSync={syncStatus.lastSync}
        isSyncing={syncStatus.isSyncing}
        onForceSync={() => {
          const syncManager = SyncManager.getInstance();
          syncManager.forceSync();
        }}
      />
      <div className={showBottomNav ? 'pb-20' : ''}>
        {renderCurrentPage()}
      </div>
      {showBottomNav && (
        <BottomNavigation currentPage={currentPage} onNavigate={navigate} />
      )}
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}

export default App;