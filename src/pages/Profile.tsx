import React, { useState } from 'react';
import { User, Trophy, Star, Settings, Bell, Shield, HelpCircle, LogOut, Calendar, Package, TrendingUp, Sparkles, FileText } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import AchievementManager from '../utils/achievementManager';

interface ProfileProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');
  const achievementManager = AchievementManager.getInstance();
  const [achievements, setAchievements] = useState(() => {
    const unlockedAchievements = achievementManager.checkAchievements();
    return achievementManager.getAchievements();
  });
  const [userProgress] = useState(() => achievementManager.getUserProgress());
  const [achievementStats] = useState(() => achievementManager.getAchievementStats());

  const userInfo = {
    name: '张三',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    level: 12,
    experience: 8750,
    nextLevelExp: 10000,
    joinDate: '2023年6月',
    totalItems: 1247,
    totalWarehouses: 8,
    totalBoxes: 45,
    consecutiveDays: 45
  };

  const recentActivity = [
    { date: '2024-01-25', action: '添加了物品', detail: 'MacBook Pro 16"', type: 'add', icon: '➕' },
    { date: '2024-01-24', action: '完成成就', detail: '"效率专家"', type: 'achievement', icon: '🏆' },
    { date: '2024-01-23', action: '使用了物品', detail: '佳能EOS R5相机', type: 'use', icon: '👆' },
    { date: '2024-01-22', action: '创建了仓库', detail: '办公室存储区', type: 'create', icon: '🏗️' },
    { date: '2024-01-21', action: '分享了物品', detail: 'Nintendo Switch', type: 'share', icon: '🔗' }
  ];

  const menuItems = [
    { icon: Settings, label: '设置', action: () => onNavigate('settings'), gradient: 'from-gray-500 to-slate-600' },
    { icon: Bell, label: '通知设置', action: () => {}, gradient: 'from-blue-500 to-cyan-500' },
    { icon: Shield, label: '隐私设置', action: () => {}, gradient: 'from-emerald-500 to-teal-500' },
    { icon: HelpCircle, label: '帮助中心', action: () => {}, gradient: 'from-orange-500 to-amber-500' },
    { icon: FileText, label: '需求文档', action: () => onNavigate('requirements'), gradient: 'from-indigo-500 to-blue-600' },
    { icon: LogOut, label: '退出登录', action: () => {}, gradient: 'from-red-500 to-pink-500', danger: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 超紧凑Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"></div>
        <div className="relative px-3 pt-6 pb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative">
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-12 h-12 rounded-xl border-2 border-white/30 object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-base font-bold text-white mb-0.5">{userInfo.name}</h1>
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30">
                  <Sparkles className="h-2.5 w-2.5 text-yellow-300" />
                  <span className="text-xs font-semibold text-white">等级 {userInfo.level}</span>
                </div>
                <span className="text-xs text-purple-100">加入于 {userInfo.joinDate}</span>
              </div>
            </div>
          </div>
          
          {/* 超紧凑经验条 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5 border border-white/30">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="font-medium">经验值进度</span>
              <span className="font-semibold">{userInfo.experience} / {userInfo.nextLevelExp}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(userInfo.experience / userInfo.nextLevelExp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 -mt-3 space-y-3">
        {/* 超紧凑统计卡片 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100">
            <div className="inline-flex p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-1">
              <Package className="h-4 w-4 text-white" />
            </div>
            <p className="text-base font-bold text-gray-900 mb-0.5">{userInfo.totalItems}</p>
            <p className="text-xs font-medium text-gray-600">管理物品</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100">
            <div className="inline-flex p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 mb-1">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-base font-bold text-gray-900 mb-0.5">{userInfo.consecutiveDays}</p>
            <p className="text-xs font-medium text-gray-600">连续天数</p>
          </div>
        </div>

        {/* 超紧凑Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-100">
            {[
              { id: 'overview', label: '概览', icon: User },
              { id: 'achievements', label: '成就', icon: Trophy },
              { id: 'activity', label: '动态', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2.5 px-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                  <p className="text-base font-bold text-blue-600 mb-0.5">{userInfo.totalWarehouses}</p>
                  <p className="text-xs font-medium text-blue-700">仓库数量</p>
                </div>
                <div className="text-center p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200/50">
                  <p className="text-base font-bold text-emerald-600 mb-0.5">{userInfo.totalBoxes}</p>
                  <p className="text-xs font-medium text-emerald-700">盒子数量</p>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-2.5">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-2.5 rounded-lg border-2 transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 ${
                        achievement.unlocked ? 'shadow-lg' : 'opacity-75'
                      }`}>
                        <span className="text-sm">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-xs font-bold ${
                            achievement.unlocked ? 'text-green-800' : 'text-gray-900'
                          }`}>
                            {achievement.name}
                          </h4>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                            achievement.unlocked 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            +{achievement.points}分
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1.5">{achievement.description}</p>
                        <div className="space-y-1">
                          <>
                            <div className="flex justify-between text-xs">
                              <span className={achievement.unlocked ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                {achievement.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="h-1 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-600"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                            {achievement.unlockedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                完成于 {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2.5 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-base">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">
                        {activity.action} <span className="text-blue-600">{activity.detail}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 超紧凑菜单项 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center space-x-2.5 p-3 hover:bg-gray-50 transition-all duration-300 active:scale-95 ${
                  item.danger ? 'hover:bg-red-50' : ''
                }`}
              >
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.gradient}`}>
                  <item.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className={`text-xs font-semibold ${item.danger ? 'text-red-600' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}