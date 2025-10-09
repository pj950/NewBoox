import React, { useState } from 'react';
import { Package, Search, Plus, Bell, User, Settings, Grid3X3, BarChart3, TrendingUp, Clock, Star, Award } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: '总物品数量', value: '1,247', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '活跃仓库', value: '8', icon: Grid3X3, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '本月新增', value: '+156', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '使用频率', value: '87%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentItems = [
    { id: 1, name: 'MacBook Pro 16"', location: '办公室 > 电子设备 > 笔记本', status: '在用', lastUsed: '2小时前' },
    { id: 2, name: '佳能EOS R5相机', location: '储物间 > 摄影设备 > 相机', status: '闲置', lastUsed: '3天前' },
    { id: 3, name: 'Nintendo Switch', location: '客厅 > 娱乐设备 > 游戏机', status: '在用', lastUsed: '1天前' },
    { id: 4, name: '蓝牙耳机', location: '卧室 > 数码配件 > 耳机', status: '充电中', lastUsed: '6小时前' },
  ];

  const achievements = [
    { name: '收纳达人', description: '管理超过1000件物品', icon: Star, completed: true },
    { name: '效率专家', description: '连续30天使用系统', icon: Award, completed: true },
    { name: '整理大师', description: '创建了10个仓库', icon: Grid3X3, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">智能仓库</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索物品、位置或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来！</h2>
          <p className="text-gray-600">今天是管理您物品的好时光</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">最近使用的物品</h3>
                <button 
                  onClick={() => onNavigate('items')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  查看全部
                </button>
              </div>
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === '在用' ? 'bg-green-100 text-green-800' :
                        item.status === '闲置' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.lastUsed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">成就系统</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <achievement.icon className={`h-4 w-4 ${
                        achievement.completed ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        achievement.completed ? 'text-green-900' : 'text-gray-700'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate('add-item')}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">添加新物品</span>
                </button>
                <button 
                  onClick={() => onNavigate('warehouses')}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Grid3X3 className="h-5 w-5" />
                  <span className="font-medium">管理仓库</span>
                </button>
                <button 
                  onClick={() => onNavigate('analytics')}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">查看分析</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}