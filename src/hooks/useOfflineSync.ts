import { useState, useEffect } from 'react';

interface SyncStatus {
  isOnline: boolean;
  pendingChanges: number;
  lastSync: Date | null;
}

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingChanges: 0,
    lastSync: null
  });

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // 触发同步
      syncPendingChanges();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingChanges = async () => {
    try {
      // 模拟同步过程
      const pendingData = localStorage.getItem('pendingSync');
      if (pendingData) {
        // 这里应该发送到服务器
        console.log('Syncing pending changes:', JSON.parse(pendingData));
        
        // 清除待同步数据
        localStorage.removeItem('pendingSync');
        
        setSyncStatus(prev => ({
          ...prev,
          pendingChanges: 0,
          lastSync: new Date()
        }));
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const addPendingChange = (change: any) => {
    const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    pending.push({ ...change, timestamp: new Date().toISOString() });
    localStorage.setItem('pendingSync', JSON.stringify(pending));
    
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: pending.length
    }));
  };

  return {
    syncStatus,
    addPendingChange,
    syncPendingChanges
  };
}