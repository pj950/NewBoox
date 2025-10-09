import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Loader2, RefreshCw } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  pendingChanges: number;
  lastSync: Date | null;
  isSyncing?: boolean;
  onForceSync?: () => void;
}

export default function OfflineIndicator({ 
  isOnline, 
  pendingChanges, 
  lastSync, 
  isSyncing = false,
  onForceSync 
}: OfflineIndicatorProps) {
  if (isOnline && pendingChanges === 0) return null;

  return (
    <div className={`fixed top-4 left-4 z-50 px-3 py-2 rounded-xl shadow-lg border ${
      isOnline 
        ? isSyncing
          ? 'bg-blue-50 border-blue-200 text-blue-800'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center space-x-2 mb-1">
        {isOnline ? (
          isSyncing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs font-medium">同步中...</span>
            </>
          ) : (
            <>
              <Cloud className="h-3 w-3" />
              <span className="text-xs font-medium">
                {pendingChanges > 0 ? `${pendingChanges} 项待同步` : '已同步'}
              </span>
              {pendingChanges > 0 && onForceSync && (
                <button
                  onClick={onForceSync}
                  className="ml-1 p-0.5 hover:bg-yellow-200 rounded transition-colors"
                  title="立即同步"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                </button>
              )}
            </>
          )
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">离线模式</span>
          </>
        )}
      </div>
      {lastSync && (
        <p className="text-xs opacity-75">
          上次同步：{lastSync.toLocaleTimeString()}
        </p>
      )}
      {!isOnline && pendingChanges > 0 && (
        <p className="text-xs opacity-75">
          {pendingChanges} 项更改将在联网后同步
        </p>
      )}
    </div>
  );
}