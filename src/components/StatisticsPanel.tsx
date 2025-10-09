import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Package, DollarSign, Clock, X, RefreshCw } from 'lucide-react';
import { useStatistics } from '../hooks/useStatistics';
import LoadingSpinner from './LoadingSpinner';

interface StatisticsPanelProps {
  onClose: () => void;
}

export default function StatisticsPanel({ onClose }: StatisticsPanelProps) {
  const { statistics, isLoading, refreshStatistics } = useStatistics();
  const [activeTab, setActiveTab] = useState<'overview' | 'category' | 'warehouse' | 'usage'>('overview');

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8">
          <LoadingSpinner size="lg" text="正在计算统计数据..." />
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">数据统计</h2>
                <p className="text-sm text-gray-600">详细的使用和价值分析</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshStatistics}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="刷新数据"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: '总览', icon: BarChart3 },
              { id: 'category', label: '分类分析', icon: PieChart },
              { id: 'warehouse', label: '仓库分析', icon: Package },
              { id: 'usage', label: '使用分析', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">总仓库</p>
                      <p className="text-2xl font-bold text-blue-900">{statistics.overview.totalWarehouses}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600">总物品</p>
                      <p className="text-2xl font-bold text-emerald-900">{statistics.overview.totalItems}</p>
                    </div>
                    <Package className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">总价值</p>
                      <p className="text-lg font-bold text-orange-900">{formatCurrency(statistics.overview.totalValue)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">利用率</p>
                      <p className="text-2xl font-bold text-purple-900">{statistics.overview.utilizationRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">月度趋势</h3>
                <div className="space-y-3">
                  {statistics.monthlyStats.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">新增 {month.added}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">使用 {month.used}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'category' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">分类统计</h3>
              <div className="space-y-4">
                {statistics.categoryStats.map((category, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{category.category}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{category.count} 件</p>
                        <p className="text-xs text-gray-500">{formatCurrency(category.value)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{category.percentage}% 占比</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'warehouse' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">仓库分析</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statistics.warehouseStats.map((warehouse, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200/50">
                    <h4 className="font-semibold text-gray-900 mb-3">{warehouse.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">物品数量</span>
                        <span className="font-medium">{warehouse.itemCount} 件</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">利用率</span>
                        <span className="font-medium">{warehouse.utilization}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">总价值</span>
                        <span className="font-medium">{formatCurrency(warehouse.value)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${warehouse.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">使用频率排行</h3>
              <div className="space-y-3">
                {statistics.usageStats.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.usageCount} 次</p>
                      <p className="text-xs text-gray-500">{item.lastUsed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}