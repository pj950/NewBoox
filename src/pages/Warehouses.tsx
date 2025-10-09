import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Grid, List, MapPin, Box, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import SearchComponent from '../components/SearchComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import DataManager from '../utils/dataManager';

interface WarehousesProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  addNotification: (notification: any) => void;
}

export default function Warehouses({ onNavigate, addNotification }: WarehousesProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    warehouses: 0,
    boxes: 0,
    items: 0
  });

  const dataManager = DataManager.getInstance();

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const warehousesData = dataManager.getWarehouses();
      const boxes = dataManager.getBoxes();
      const items = dataManager.getItems();
      
      const warehousesWithStats = warehousesData.map(warehouse => {
        const warehouseBoxes = boxes.filter(box => box.warehouseId === warehouse.id);
        const warehouseItems = items.filter(item => item.warehouseId === warehouse.id);
        const totalCapacity = warehouseBoxes.reduce((sum, box) => sum + box.capacity, 0);
        
        return {
          ...warehouse,
          boxCount: warehouseBoxes.length,
          itemCount: warehouseItems.length,
          utilization: totalCapacity > 0 ? Math.round((warehouseItems.length / totalCapacity) * 100) : 0,
          lastUsed: warehouseItems.length > 0 ? '2小时前' : '未使用'
        };
      });
      
      setWarehouses(warehousesWithStats);
      setFilteredWarehouses(warehousesWithStats);
      
      setTotalStats({
        warehouses: warehousesData.length,
        boxes: boxes.length,
        items: items.length
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: '加载失败',
        message: '无法加载仓库数据'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, filters: any) => {
    let filtered = warehouses;
    
    if (query) {
      filtered = filtered.filter(warehouse =>
        warehouse.name.toLowerCase().includes(query.toLowerCase()) ||
        warehouse.type.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredWarehouses(filtered);
    
    addNotification({
      type: 'info',
      title: '搜索完成',
      message: `找到 ${filtered.length} 个仓库`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载仓库中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 超紧凑Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="relative px-3 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">我的仓库</h1>
              <p className="text-xs text-indigo-100">管理你的所有空间</p>
            </div>
            <button
              onClick={() => {
                onNavigate('add-warehouse');
                addNotification({
                  type: 'info',
                  title: '创建仓库',
                  message: '开始创建新的仓库空间'
                });
              }}
              className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">添加</span>
            </button>
          </div>
          
          {/* 紧凑搜索和视图切换 */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1">
              <SearchComponent 
                onSearch={handleSearch}
                placeholder="搜索仓库..."
              />
            </div>
            <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-0.5 border border-white/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white/30 text-white' : 'text-white/70'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white/30 text-white' : 'text-white/70'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 -mt-3 space-y-3">
        {/* 超紧凑统计卡片 */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onNavigate('warehouses')}
            className="bg-white rounded-lg p-2 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="inline-flex p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 mb-1">
              <Package className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{totalStats.warehouses}</p>
            <p className="text-xs font-medium text-gray-600">仓库</p>
          </button>
          
          <button
            onClick={() => onNavigate('warehouses')}
            className="bg-white rounded-lg p-2 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="inline-flex p-1.5 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 mb-1">
              <Box className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{totalStats.boxes}</p>
            <p className="text-xs font-medium text-gray-600">盒子</p>
          </button>
          
          <button
            onClick={() => onNavigate('warehouses')}
            className="bg-white rounded-lg p-2 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="inline-flex p-1.5 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 mb-1">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900">{totalStats.items}</p>
            <p className="text-xs font-medium text-gray-600">物品</p>
          </button>
        </div>

        {/* 超紧凑仓库列表 */}
        {filteredWarehouses.length === 0 ? (
          <EmptyState
            icon={Package}
            title="没有找到仓库"
            description="尝试调整搜索条件或创建新仓库"
            action={{
              label: "创建第一个仓库",
              onClick: () => onNavigate('add-warehouse')
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                onClick={() => {
                  onNavigate('warehouse-detail', { warehouseId: warehouse.id });
                  addNotification({
                    type: 'info',
                    title: '进入仓库',
                    message: `正在查看 ${warehouse.name}`
                  });
                }}
                className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
              >
                <div className="relative h-24 overflow-hidden">
                  <img 
                    src={warehouse.image || 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={warehouse.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className={`absolute top-2 right-2 p-1 rounded-md bg-gradient-to-r ${warehouse.gradient}`}>
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-xs font-medium opacity-90">{warehouse.type}</span>
                      <span className="text-xs opacity-75">{warehouse.lastUsed}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {warehouse.name}
                    </h3>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-900">{warehouse.utilization}%</p>
                      <p className="text-xs text-gray-500">利用率</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Box className="h-3 w-3 mr-0.5" />
                      {warehouse.boxCount} 个盒子
                    </span>
                    <span className="flex items-center">
                      <Package className="h-3 w-3 mr-0.5" />
                      {warehouse.itemCount} 件物品
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full bg-gradient-to-r ${warehouse.gradient} transition-all duration-500`}
                      style={{ width: `${warehouse.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                onClick={() => {
                  onNavigate('warehouse-detail', { warehouseId: warehouse.id });
                  addNotification({
                    type: 'info',
                    title: '进入仓库',
                    message: `正在查看 ${warehouse.name}`
                  });
                }}
                className="group bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${warehouse.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {warehouse.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">{warehouse.type}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>{warehouse.boxCount} 盒子</span>
                      <span>{warehouse.itemCount} 物品</span>
                      <span>{warehouse.lastUsed}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-10 bg-gray-200 rounded-full h-1 mb-1">
                      <div 
                        className={`h-1 rounded-full bg-gradient-to-r ${warehouse.gradient}`}
                        style={{ width: `${warehouse.utilization}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{warehouse.utilization}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}