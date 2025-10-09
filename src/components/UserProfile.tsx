import React, { useState } from 'react';
import { User, Trophy, Target, BarChart3, Settings, ArrowLeft, Star, Award, Calendar, Package, TrendingUp, Clock } from 'lucide-react';

interface UserProfileProps {
  onNavigate: (view: string) => void;
}

export default function UserProfile({ onNavigate }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const userStats = {
    totalItems: 1247,
    totalWarehouses: 8,
    level: 12,
    experience: 8750,
    nextLevelExp: 10000,
    joinDate: '2023年6月',
    consecutiveDays: 45,
    itemsAddedThisMonth: 156,
    mostUsedCategory: '电子设备',
    averageUsageRate: 87
  };

  const achievements = [
    { 
      id: 1, 
      name: '收纳达人', 
      description: '管理超过1000件物品', 
      icon: Package, 
      completed: true, 
      progress: 100,
      points: 500,
      completedDate: '2024-01-15'
    },
    { 
      id: 2, 
      name: '效率专家', 
      description: '连续30天使用系统', 
      icon: Clock, 
      completed: true, 
      progress: 100,
      points: 300,
      completedDate: '2024-01-20'
    },
    { 
      id: 3, 
      name: '整理大师', 
      description: '创建了10个仓库', 
      icon: Target, 
      completed: false, 
      progress: 80,
      points: 400,
      completedDate: null
    },
    { 
      id: 4, 
      name: '分享达人', 
      description: '分享了50个物品', 
      icon: Star, 
      completed: false, 
      progress: 60,
      points: 250,
      completedDate: null
    },
    { 
      id: 5, 
      name: '科技先锋', 
      description: '使用AI识别功能100次', 
      icon: Award, 
      completed: true, 
      progress: 100,
      points: 350,
      completedDate: '2024-01-10'
    },
    { 
      id: 6, 
      name: '社区贡献者', 
      description: '帮助其他用户获得100个赞', 
      icon: TrendingUp, 
      completed: false, 
      progress: 35,
      points: 600,
      completedDate: null
    }
  ];

  const recentActivity = [
    { date: '2024-01-25', action: '添加了物品', detail: 'MacBook Pro 16"', type: 'add' },
    { date: '2024-01-24', action: '完成成就', detail: '"效率专家"', type: 'achievement' },
    { date: '2024-01-23', action: '使用了物品', detail: '佳能EOS R5相机', type: 'use' },
    { date: '2024-01-22', action: '创建了仓库', detail: '办公室存储区', type: 'create' },
    { date: '2024-01-21', action: '分享了物品', detail: 'Nintendo Switch', type: 'share' }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'add': return '➕';
      case 'achievement': return '🏆';
      case 'use': return '👆';
      case 'create': return '🏗️';
      case 'share': return '🔗';
      default: return '📝';
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
              <h1 className="text-xl font-bold text-gray-900">个人资料</h1>
            </div>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
              <span>设置</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">张三</h2>
              <p className="text-gray-600">智能仓库管理员</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">等级 {userStats.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">加入于 {userStats.joinDate}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalItems}</div>
              <div className="text-sm text-gray-600">管理物品数</div>
            </div>
          </div>
          
          {/* Experience Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>经验值进度</span>
              <span>{userStats.experience} / {userStats.nextLevelExp}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(userStats.experience / userStats.nextLevelExp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: '概览', icon: BarChart3 },
                { id: 'achievements', name: '成就', icon: Trophy },
                { id: 'activity', name: '活动记录', icon: Clock }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">总仓库数</p>
                      <p className="text-2xl font-bold text-blue-900">{userStats.totalWarehouses}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">连续使用天数</p>
                      <p className="text-2xl font-bold text-green-900">{userStats.consecutiveDays}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">本月新增</p>
                      <p className="text-2xl font-bold text-orange-900">{userStats.itemsAddedThisMonth}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">使用率</p>
                      <p className="text-2xl font-bold text-purple-900">{userStats.averageUsageRate}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <achievement.icon className={`h-6 w-6 ${
                          achievement.completed ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${
                            achievement.completed ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {achievement.name}
                          </h3>
                          <span className={`text-sm font-medium ${
                            achievement.completed ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            +{achievement.points}分
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">进度</span>
                            <span className={achievement.completed ? 'text-green-600' : 'text-gray-600'}>
                              {achievement.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(achievement.progress)}`}
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          {achievement.completedDate && (
                            <p className="text-xs text-green-600 mt-2">
                              完成于 {achievement.completedDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.action} <span className="text-blue-600">{activity.detail}</span>
                      </p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}