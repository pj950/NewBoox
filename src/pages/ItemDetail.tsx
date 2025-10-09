import React, { useState } from 'react';
import { ArrowLeft, Edit, Share, Trash2, Tag, Clock, Calendar, MapPin, Package, Camera, Star, MoreVertical, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import DataManager from '../utils/dataManager';

interface ItemDetailProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  itemId?: string;
  addNotification?: (notification: any) => void;
}

export default function ItemDetail({ onNavigate, itemId }: ItemDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'related'>('info');

  // 模拟物品数据
  const item = {
    id: itemId || '1',
    name: 'MacBook Pro 16"',
    category: '笔记本电脑',
    status: '在用',
    description: '主要用于日常工作和开发，性能强劲，屏幕显示效果出色。',
    location: '办公室 > 电子设备盒',
    addedDate: '2024-01-15',
    lastUsed: '2小时前',
    purchaseDate: '2023-12-01',
    warrantyDate: '2025-12-01',
    price: '16999',
    brand: 'Apple',
    model: 'MacBook Pro 16" M3 Max',
    serialNumber: 'C02XJ0XJMD6T',
    condition: '良好',
    gradient: 'from-blue-500 to-purple-600',
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    tags: ['工作', '便携', '苹果', '高性能'],
    specifications: {
      '处理器': 'Apple M3 Max',
      '内存': '32GB',
      '存储': '1TB SSD',
      '屏幕': '16.2英寸 Liquid Retina XDR',
      '重量': '2.16kg'
    }
  };

  const usageHistory = [
    { date: '2024-01-25 14:30', action: '使用', detail: '开始工作会议', icon: '👆' },
    { date: '2024-01-24 09:15', action: '使用', detail: '代码开发', icon: '👆' },
    { date: '2024-01-23 16:45', action: '使用', detail: '视频剪辑', icon: '👆' },
    { date: '2024-01-22 11:20', action: '维护', detail: '系统更新', icon: '🔧' },
    { date: '2024-01-21 13:10', action: '使用', detail: '在线会议', icon: '👆' }
  ];

  const relatedItems = [
    {
      id: '2',
      name: 'Magic Mouse',
      category: '鼠标',
      image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=200',
      relation: '经常一起使用'
    },
    {
      id: '3',
      name: 'USB-C 充电器',
      category: '充电器',
      image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=200',
      relation: '配套使用'
    },
    {
      id: '4',
      name: '笔记本支架',
      category: '配件',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200',
      relation: '同时使用'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在用': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '闲置': return 'bg-gray-100 text-gray-700 border-gray-200';
      case '借出': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '维修中': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleUseItem = () => {
    // 记录使用
    const dataManager = DataManager.getInstance();
    dataManager.recordItemUsage(item.id, '使用', '手动标记使用');
    
    // 显示成功提示
    addNotification({
      type: 'success',
      title: '使用记录',
      message: `已记录 "${item.name}" 的使用`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`}></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('warehouses')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <Edit 
                  className="h-5 w-5 text-white" 
                  onClick={() => onNavigate('edit-item', { itemId: item.id })}
                />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <Share className="h-5 w-5 text-white" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <MoreVertical className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Enhanced Item Images */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {item.images.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                {index === 0 && (
                  <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Basic Info */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">{item.name}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(item.status)} bg-white`}>
                {item.status}
              </span>
            </div>
            <p className="text-blue-100 mb-4 leading-relaxed">{item.description}</p>
            
            <div className="flex items-center text-sm text-blue-100 mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{item.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-blue-100 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>最后使用：{item.lastUsed}</span>
            </div>

            {/* Enhanced Tags */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { id: 'info', label: '详细信息', icon: Package },
              { id: 'history', label: '使用记录', icon: Clock },
              { id: 'related', label: '相关物品', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-4 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Enhanced Basic Details */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">基本信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">品牌</p>
                      <p className="font-semibold text-gray-900">{item.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">型号</p>
                      <p className="font-semibold text-gray-900">{item.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">序列号</p>
                      <p className="font-semibold text-gray-900">{item.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">状况</p>
                      <p className="font-semibold text-gray-900">{item.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">购买价格</p>
                      <p className="font-semibold text-gray-900">¥{item.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">分类</p>
                      <p className="font-semibold text-gray-900">{item.category}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Specifications */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">技术规格</h3>
                  <div className="space-y-3">
                    {Object.entries(item.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-blue-200/30 last:border-b-0">
                        <span className="text-gray-600 font-medium">{key}</span>
                        <span className="font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Dates */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">重要日期</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        <span className="text-gray-600 font-medium">添加日期</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.addedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-600 font-medium">购买日期</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.purchaseDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span className="text-gray-600 font-medium">保修期至</span>
                      </div>
                      <span className="font-semibold text-green-600">{item.warrantyDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {usageHistory.map((record, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                    <div className="text-2xl">{record.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{record.action}</p>
                      <p className="text-sm text-gray-600">{record.detail}</p>
                      <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'related' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">相关物品</h3>
                  <p className="text-sm text-gray-600">基于使用习惯推荐的相关物品</p>
                </div>
                
                {relatedItems.map((relatedItem) => (
                  <div
                    key={relatedItem.id}
                    onClick={() => onNavigate('item-detail', { itemId: relatedItem.id })}
                    className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200/50 hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.name}
                        className="w-16 h-16 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {relatedItem.name}
                        </h4>
                        <p className="text-sm text-gray-600">{relatedItem.category}</p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">{relatedItem.relation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 p-6">
        <div className="flex space-x-4">
          <button 
            onClick={handleUseItem}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            标记为已使用
          </button>
          <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300">
            移动位置
          </button>
        </div>
      </div>
    </div>
  );
}