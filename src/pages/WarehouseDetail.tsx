import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Grid, List, Package, Box, MapPin, MoreVertical, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';

interface WarehouseDetailProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  warehouseId?: string;
}

export default function WarehouseDetail({ onNavigate, warehouseId }: WarehouseDetailProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟仓库数据
  const warehouse = {
    id: warehouseId || '1',
    name: '办公室',
    type: '工作区域',
    gradient: 'from-blue-500 to-cyan-500',
    description: '主要存放办公用品和电子设备',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  const boxes = [
    {
      id: '1',
      name: '电子设备盒',
      type: '电子产品',
      gradient: 'from-blue-500 to-cyan-500',
      itemCount: 15,
      capacity: 20,
      lastUsed: '2小时前',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: '文具收纳盒',
      type: '办公用品',
      gradient: 'from-emerald-500 to-teal-500',
      itemCount: 8,
      capacity: 15,
      lastUsed: '1天前',
      image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: '充电器收纳盒',
      type: '配件',
      gradient: 'from-purple-500 to-pink-500',
      itemCount: 12,
      capacity: 15,
      lastUsed: '3天前',
      image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      name: '备用物品盒',
      type: '杂物',
      gradient: 'from-gray-500 to-slate-600',
      itemCount: 5,
      capacity: 10,
      lastUsed: '1周前',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredBoxes = boxes.filter(box =>
    box.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    box.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = boxes.reduce((sum, box) => sum + box.itemCount, 0);
  const totalCapacity = boxes.reduce((sum, box) => sum + box.capacity, 0);
  const utilizationRate = Math.round((totalItems / totalCapacity) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${warehouse.gradient}`}></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('warehouses')}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{warehouse.name}</h1>
                <p className="text-blue-100">{warehouse.type}</p>
              </div>
            </div>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Enhanced Warehouse Image */}
          <div className="relative h-40 rounded-3xl overflow-hidden mb-6 shadow-xl">
            <img 
              src={warehouse.image} 
              alt={warehouse.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm opacity-90">{warehouse.description}</p>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{boxes.length}</p>
              <p className="text-sm text-blue-100">盒子</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{totalItems}</p>
              <p className="text-sm text-blue-100">物品</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{utilizationRate}%</p>
              <p className="text-sm text-blue-100">利用率</p>
            </div>
          </div>

          {/* Enhanced Search and Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-white/70" />
                <input
                  type="text"
                  placeholder="搜索盒子..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 border border-white/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white/30 text-white' : 'text-white/70'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white/30 text-white' : 'text-white/70'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Add Box Button */}
          <button
            onClick={() => onNavigate('add-box', { warehouseId: warehouse.id })}
            className="w-full flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm text-white py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 font-semibold"
          >
            <Plus className="h-6 w-6" />
            <span>添加盒子</span>
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Enhanced Boxes */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredBoxes.map((box) => (
              <div
                key={box.id}
                onClick={() => onNavigate('box-detail', { boxId: box.id, warehouseId: warehouse.id })}
                className="group bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={box.image} 
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-r ${box.gradient}`}>
                    <Box className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {box.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {box.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="font-medium">{box.itemCount}/{box.capacity} 件物品</span>
                    <span className="text-xs text-gray-500">最后使用：{box.lastUsed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${box.gradient} transition-all duration-500`}
                      style={{ width: `${(box.itemCount / box.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBoxes.map((box) => (
              <div
                key={box.id}
                onClick={() => onNavigate('box-detail', { boxId: box.id, warehouseId: warehouse.id })}
                className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${box.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Box className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {box.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{box.type}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{box.itemCount}/{box.capacity} 物品</span>
                      <span>{box.lastUsed}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${box.gradient}`}
                        style={{ width: `${(box.itemCount / box.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{Math.round((box.itemCount / box.capacity) * 100)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBoxes.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
              <Box className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">没有找到盒子</h3>
            <p className="text-gray-500 mb-6">尝试调整搜索条件或创建新盒子</p>
            <button
              onClick={() => onNavigate('add-box', { warehouseId: warehouse.id })}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              创建第一个盒子
            </button>
          </div>
        )}
      </div>
    </div>
  );
}