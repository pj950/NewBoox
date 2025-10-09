import React, { useState } from 'react';
import { Search, Filter, Plus, Package, MapPin, Calendar, Tag, Eye, Edit, Trash2, Camera, ArrowLeft } from 'lucide-react';

interface ItemManagementProps {
  onNavigate: (view: string) => void;
}

export default function ItemManagement({ onNavigate }: ItemManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  const categories = ['全部', '电子设备', '书籍', '文具', '衣物', '家具', '运动器材', '其他'];
  const statusOptions = ['全部', '在用', '闲置', '借出', '维修中'];

  const items = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      category: '电子设备',
      location: '办公室 > 电子设备 > 笔记本',
      status: '在用',
      lastUsed: '2小时前',
      addedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['工作', '便携', '苹果'],
      description: '主要用于日常工作和开发'
    },
    {
      id: 2,
      name: '佳能EOS R5相机',
      category: '电子设备',
      location: '储物间 > 摄影设备 > 相机',
      status: '闲置',
      lastUsed: '3天前',
      addedDate: '2024-01-10',
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['摄影', '专业', '佳能'],
      description: '专业级无反相机，适合拍摄高质量照片'
    },
    {
      id: 3,
      name: 'JavaScript权威指南',
      category: '书籍',
      location: '书房 > 技术书籍 > 编程',
      status: '在用',
      lastUsed: '1天前',
      addedDate: '2023-12-20',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['编程', '学习', 'JavaScript'],
      description: 'JavaScript学习的经典教材'
    },
    {
      id: 4,
      name: 'Nike Air Max 270',
      category: '衣物',
      location: '卧室 > 鞋柜 > 运动鞋',
      status: '在用',
      lastUsed: '6小时前',
      addedDate: '2024-01-05',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['运动', '舒适', 'Nike'],
      description: '日常运动和休闲穿着'
    },
    {
      id: 5,
      name: 'iPad Pro 12.9"',
      category: '电子设备',
      location: '客厅 > 娱乐设备 > 平板',
      status: '借出',
      lastUsed: '1周前',
      addedDate: '2023-11-30',
      image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['绘画', '便携', '苹果'],
      description: '用于绘画和阅读的大屏平板'
    },
    {
      id: 6,
      name: '无线蓝牙耳机',
      category: '电子设备',
      location: '办公室 > 数码配件 > 耳机',
      status: '维修中',
      lastUsed: '2周前',
      addedDate: '2023-10-15',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['音乐', '无线', '降噪'],
      description: '高品质降噪耳机，通勤必备'
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === '全部' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在用': return 'bg-green-100 text-green-800';
      case '闲置': return 'bg-gray-100 text-gray-800';
      case '借出': return 'bg-yellow-100 text-yellow-800';
      case '维修中': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">物品管理</h1>
            </div>
            
            <button 
              onClick={() => onNavigate('add-item')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>添加物品</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索物品、位置或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>最后使用：{item.lastUsed}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到物品</h3>
            <p className="text-gray-500">尝试调整搜索条件或添加新物品</p>
          </div>
        )}
      </div>
    </div>
  );
}