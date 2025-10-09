import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Grid, List, Package, MoreVertical, Tag, Clock, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';

interface BoxDetailProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  boxId?: string;
  warehouseId?: string;
}

export default function BoxDetail({ onNavigate, boxId, warehouseId }: BoxDetailProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟盒子数据
  const box = {
    id: boxId || '1',
    name: '电子设备盒',
    type: '电子产品',
    gradient: 'from-blue-500 to-cyan-500',
    capacity: 20,
    description: '存放各种电子设备和配件',
    warehouseName: '办公室',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  const items = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      category: '笔记本电脑',
      status: '在用',
      lastUsed: '2小时前',
      addedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['工作', '便携', '苹果'],
      description: '主要用于日常工作和开发'
    },
    {
      id: '2',
      name: 'iPad Pro 12.9"',
      category: '平板电脑',
      status: '闲置',
      lastUsed: '3天前',
      addedDate: '2024-01-10',
      image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['绘画', '便携', '苹果'],
      description: '用于绘画和阅读的大屏平板'
    },
    {
      id: '3',
      name: '无线蓝牙耳机',
      category: '音频设备',
      status: '在用',
      lastUsed: '1天前',
      addedDate: '2024-01-05',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['音乐', '无线', '降噪'],
      description: '高品质降噪耳机，通勤必备'
    },
    {
      id: '4',
      name: '移动硬盘 2TB',
      category: '存储设备',
      status: '闲置',
      lastUsed: '1周前',
      addedDate: '2023-12-20',
      image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['存储', '备份', '便携'],
      description: '用于数据备份和文件传输'
    }
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在用': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '闲置': return 'bg-gray-100 text-gray-700 border-gray-200';
      case '借出': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '维修中': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const utilizationRate = Math.round((items.length / box.capacity) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${box.gradient}`}></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('warehouse-detail', { warehouseId })}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{box.name}</h1>
                <p className="text-blue-100">{box.warehouseName} • {box.type}</p>
              </div>
            </div>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Enhanced Box Image */}
          <div className="relative h-40 rounded-3xl overflow-hidden mb-6 shadow-xl">
            <img 
              src={box.image} 
              alt={box.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm opacity-90">{box.description}</p>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{items.length}</p>
              <p className="text-sm text-blue-100">物品数量</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{box.capacity}</p>
              <p className="text-sm text-blue-100">容量上限</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{utilizationRate}%</p>
              <p className="text-sm text-blue-100">利用率</p>
            </div>
          </div>

          {/* Enhanced Capacity Bar */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30">
            <div className="flex justify-between text-sm text-white mb-2">
              <span className="font-medium">容量使用情况</span>
              <span className="font-semibold">{items.length} / {box.capacity}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${utilizationRate}%` }}
              ></div>
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
                  placeholder="搜索物品..."
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

          {/* Enhanced Add Item Button */}
          <button
            onClick={() => onNavigate('add-item', { boxId: box.id, warehouseId })}
            className="w-full flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm text-white py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 font-semibold"
          >
            <Plus className="h-6 w-6" />
            <span>添加物品</span>
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Enhanced Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('item-detail', { itemId: item.id })}
                className="group bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>最后使用：{item.lastUsed}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200/50"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('item-detail', { itemId: item.id })}
                className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span>{item.lastUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">没有找到物品</h3>
            <p className="text-gray-500 mb-6">尝试调整搜索条件或添加新物品</p>
            <button
              onClick={() => onNavigate('add-item', { boxId: box.id, warehouseId })}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              添加第一个物品
            </button>
          </div>
        )}
      </div>
    </div>
  );
}