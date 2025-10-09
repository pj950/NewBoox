import React, { useState, useEffect } from 'react';
import { Package, Plus, TrendingUp, Clock, Star, Search, Bell, Sparkles, Zap, Target, Box, Users, QrCode, BarChart3, Database, Lightbulb } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import SearchComponent from '../components/SearchComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import QRScanner from '../components/QRScanner';
import StatisticsPanel from '../components/StatisticsPanel';
import DataManagement from '../components/DataManagement';
import DataManager from '../utils/dataManager';
import { useDebounce } from '../hooks/useDebounce';

interface DashboardProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  addNotification: (notification: any) => void;
  addPendingChange?: (change: any) => void;
}

export default function Dashboard({ onNavigate, addNotification, addPendingChange }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [stats, setStats] = useState({
    totalWarehouses: 0,
    totalBoxes: 0,
    totalItems: 0,
    utilizationRate: 0
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const dataManager = DataManager.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch(debouncedSearchQuery, {});
    }
  }, [debouncedSearchQuery]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const statsData = dataManager.getStats();
      setStats(statsData);
      
      const items = dataManager.getItems().slice(0, 3);
      setRecentItems(items);
    } catch (error) {
      addNotification({
        type: 'error',
        title: '加载失败',
        message: '无法加载数据，请重试'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, filters: any) => {
    const results = dataManager.searchItems(query, filters);
    addNotification({
      type: 'info',
      title: '搜索完成',
      message: `找到 ${results.length} 个相关物品`
    });
  };

  const handleQRScan = (result: string) => {
    addNotification({
      type: 'info',
      title: '扫码成功',
      message: `识别到：${result}`
    });
    
    // 这里可以根据扫码结果进行相应处理
    // 比如查找物品或添加新物品
  };

  const quickActions = [
    { 
      label: '添加仓库', 
      icon: Package, 
      color: 'from-blue-500 to-purple-600',
      action: () => {
        onNavigate('add-warehouse');
        addNotification({
          type: 'info',
          title: '创建仓库',
          message: '开始创建新的仓库'
        });
      }
    },
    { 
      label: '扫码识别', 
      icon: QrCode, 
      color: 'from-orange-500 to-red-500',
      action: () => {
        setShowQRScanner(true);
      }
    },
    { 
      label: '扫码添加', 
      icon: Plus, 
      color: 'from-emerald-500 to-cyan-500',
      action: () => {
        onNavigate('add-item');
        addNotification({
          type: 'info',
          title: '添加物品',
          message: '开始添加新物品'
        });
      }
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 超紧凑Header */}
      <div className="relative bg-white shadow-sm">
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-base font-bold text-gray-900">智能仓库</h1>
              <p className="text-xs text-gray-500">让整理变得简单</p>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => addNotification({
                  type: 'info',
                  title: '搜索提示',
                  message: '使用下方搜索框快速查找物品'
                })}
                className="p-1.5 bg-gray-100 rounded-lg"
              >
                <Search className="h-3.5 w-3.5 text-gray-600" />
              </button>
              <button 
                onClick={() => addNotification({
                  type: 'info',
                  title: '通知中心',
                  message: '暂无新通知'
                })}
                className="p-1.5 bg-gray-100 rounded-lg relative"
              >
                <Bell className="h-3.5 w-3.5 text-gray-600" />
                <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-red-500 rounded-full"></div>
              </button>
              <button 
                onClick={() => setShowStatistics(true)}
                className="p-1.5 bg-gray-100 rounded-lg"
                title="数据统计"
              >
                <BarChart3 className="h-3.5 w-3.5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowDataManagement(true)}
                className="p-1.5 bg-gray-100 rounded-lg"
                title="数据管理"
              >
                <Database className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* 紧凑搜索栏 */}
          <SearchComponent 
            onSearch={handleSearch}
            placeholder="搜索物品、位置..."
            items={recentItems}
          />
        </div>
      </div>

      <div className="px-3 py-2 space-y-3">
        {/* 超紧凑统计卡片 */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => onNavigate('warehouses')}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-1 mx-auto">
              <Package className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{stats.totalWarehouses}</p>
            <p className="text-xs text-gray-500">仓库</p>
          </button>
          
          <button
            onClick={() => onNavigate('warehouses')}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-1 mx-auto">
              <Box className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{stats.totalBoxes}</p>
            <p className="text-xs text-gray-500">盒子</p>
          </button>
          
          <button
            onClick={() => onNavigate('warehouses')}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-1 mx-auto">
              <Star className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{stats.totalItems}</p>
            <p className="text-xs text-gray-500">物品</p>
          </button>
          
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-1 mx-auto">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{stats.utilizationRate}%</p>
            <p className="text-xs text-gray-500">利用率</p>
          </div>
        </div>

        {/* 紧凑快速操作 */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">快速操作</h3>
            <Target className="h-3 w-3 text-gray-400" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 紧凑最近使用 */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">最近使用</h3>
            <button 
              onClick={() => onNavigate('warehouses')}
              className="text-blue-600 text-xs font-medium"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            {recentItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate('item-detail', { itemId: item.id })}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
              >
                <img 
                  src={item.image || 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=200'} 
                  alt={item.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.location}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === '在用' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 紧凑成就预览 */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">收纳达人</h3>
              <p className="text-xs opacity-90 mb-1">管理超过{stats.totalItems}件物品</p>
              <div className="w-16 bg-white/20 rounded-full h-1 mb-1">
                <div className="bg-white h-1 rounded-full" style={{ width: `${Math.min((stats.totalItems / 1000) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs opacity-75">{Math.min(Math.round((stats.totalItems / 1000) * 100), 100)}% 完成</p>
            </div>
            <div className="relative ml-3">
              <Star className="h-5 w-5 text-yellow-300 fill-current" />
            </div>
          </div>
        </div>

        {/* 紧凑社区动态预览 */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">社区动态</h3>
            <button 
              onClick={() => onNavigate('community')}
              className="text-blue-600 text-xs font-medium"
            >
              查看更多
            </button>
          </div>
          <div className="space-y-2">
            <div 
              onClick={() => onNavigate('community')}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
            >
              <img 
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="用户头像"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">整理达人小王</p>
                <p className="text-xs text-gray-500 truncate">分享了办公室整理心得</p>
              </div>
              <div className="flex items-center space-x-0.5">
                <Users className="h-2.5 w-2.5 text-gray-400" />
                <span className="text-xs text-gray-500">156</span>
              </div>
            </div>
            <div 
              onClick={() => onNavigate('community')}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
            >
              <img 
                src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="用户头像"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">收纳女王</p>
                <p className="text-xs text-gray-500 truncate">厨房收纳大改造完成</p>
              </div>
              <div className="flex items-center space-x-0.5">
                <Users className="h-2.5 w-2.5 text-gray-400" />
                <span className="text-xs text-gray-500">289</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QRScanner 
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
      
      {showStatistics && (
        <StatisticsPanel onClose={() => setShowStatistics(false)} />
      )}
      
      {showDataManagement && (
        <DataManagement 
          onClose={() => setShowDataManagement(false)}
          addNotification={addNotification}
        />
      )}
      
    </div>
  );
}