import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  X,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStatistics } from '../hooks/useStatistics';
import LoadingSpinner from './LoadingSpinner';

interface StatisticsPanelProps {
  onClose: () => void;
}

type TabId = 'overview' | 'category' | 'warehouse' | 'usage' | 'trend';

const directionLabels: Record<'up' | 'down' | 'flat', string> = {
  up: '上升',
  down: '下降',
  flat: '平稳'
};

type DirectionStyleKey = 'up' | 'down' | 'flat';

const directionStyles: Record<DirectionStyleKey, { bg: string; text: string; border: string; Icon: typeof ArrowUpRight }> = {
  up: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    Icon: ArrowUpRight
  },
  down: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    Icon: ArrowDownRight
  },
  flat: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    Icon: ArrowRight
  }
};

const tabItems: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: '总览', icon: BarChart3 },
  { id: 'category', label: '分类分析', icon: PieChart },
  { id: 'warehouse', label: '仓库分析', icon: Package },
  { id: 'usage', label: '使用分析', icon: Clock },
  { id: 'trend', label: '趋势分析', icon: Activity }
];

const formatMomentum = (value: number) => (value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1));
const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export default function StatisticsPanel({ onClose }: StatisticsPanelProps) {
  const { statistics, isLoading, refreshStatistics } = useStatistics();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

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

  const { trendAnalysis } = statistics;
  const hasTrendData = trendAnalysis.points.length > 0;
  const averageSeasonality = hasTrendData
    ? (trendAnalysis.metrics.addedSeasonalityStrength + trendAnalysis.metrics.usedSeasonalityStrength) / 2
    : 0;
  const maxAddedValue = hasTrendData
    ? Math.max(...trendAnalysis.points.map((point) => Math.max(point.added, point.addedTrend))) || 1
    : 1;
  const maxUsedValue = hasTrendData
    ? Math.max(...trendAnalysis.points.map((point) => Math.max(point.used, point.usedTrend))) || 1
    : 1;

  const toWidth = (value: number, max: number) => {
    if (max <= 0) {
      return '0%';
    }
    const width = Math.min(100, Math.max(0, (value / max) * 100));
    return `${width}%`;
  };

  const diffBadgeClass = (value: number) => {
    if (value > 0) {
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
    if (value < 0) {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    return 'bg-gray-100 text-gray-600 border-gray-200';
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
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex space-x-8 px-6">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                      <p className="text-lg font-bold text-orange-900">{new Intl.NumberFormat('zh-CN', {
                        style: 'currency',
                        currency: 'CNY'
                      }).format(statistics.overview.totalValue)}</p>
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
                        <p className="text-xs text-gray-500">
                          {new Intl.NumberFormat('zh-CN', {
                            style: 'currency',
                            currency: 'CNY'
                          }).format(category.value)}
                        </p>
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
                        <span className="font-medium">
                          {new Intl.NumberFormat('zh-CN', {
                            style: 'currency',
                            currency: 'CNY'
                          }).format(warehouse.value)}
                        </span>
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

          {activeTab === 'trend' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['added', 'used'] as const).map((key) => {
                  const metrics = trendAnalysis.metrics;
                  const directionKey = (key === 'added' ? metrics.addedDirection : metrics.usedDirection) as DirectionStyleKey;
                  const directionStyle = directionStyles[directionKey];
                  const Icon = directionStyle.Icon;
                  const momentumValue = key === 'added' ? metrics.addedMomentum : metrics.usedMomentum;
                  const label = key === 'added' ? '新增趋势动量' : '使用趋势动量';

                  return (
                    <div key={key} className={`rounded-2xl border ${directionStyle.border} bg-white p-4 shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">{label}</p>
                          <p className="text-2xl font-bold text-gray-900">{formatMomentum(momentumValue)}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${directionStyle.bg}`}>
                          <Icon className={`h-6 w-6 ${directionStyle.text}`} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${directionStyle.border} ${directionStyle.bg} ${directionStyle.text}`}
                        >
                          {directionLabels[directionKey]}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">趋势稳定性</p>
                      <p className="text-2xl font-bold text-purple-900">{formatPercent(trendAnalysis.metrics.stability)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/70">
                      <Activity className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 mt-3">
                    季节性指数 {formatPercent(averageSeasonality)} · 综合动量 {formatMomentum(trendAnalysis.metrics.overallMomentum)}
                  </p>
                  <div className="w-full bg-white/60 rounded-full h-2 mt-3">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: formatPercent(trendAnalysis.metrics.stability) }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">趋势洞察</h3>
                  <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                    傅里叶趋势分析
                  </span>
                </div>
                {trendAnalysis.insights.length === 0 ? (
                  <p className="text-sm text-gray-500">暂无可用趋势洞察。</p>
                ) : (
                  <ul className="space-y-2">
                    {trendAnalysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5"></span>
                        <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">月度趋势对比</h3>
                  <span className="text-xs text-gray-500">低频分量提取的趋势线对比</span>
                </div>

                {!hasTrendData ? (
                  <div className="text-center py-8">
                    <Activity className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">暂无足够的数据生成趋势分析。</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {trendAnalysis.points.map((point, index) => {
                      const addedDiff = Number((point.added - point.addedTrend).toFixed(1));
                      const usedDiff = Number((point.used - point.usedTrend).toFixed(1));

                      return (
                        <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{point.month}</span>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${diffBadgeClass(
                                  addedDiff
                                )}`}
                              >
                                新增偏差 {formatMomentum(addedDiff)}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${diffBadgeClass(
                                  usedDiff
                                )}`}
                              >
                                使用偏差 {formatMomentum(usedDiff)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between text-xs text-blue-600">
                                <span>新增实际</span>
                                <span className="font-medium text-gray-700">{point.added}</span>
                              </div>
                              <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden mt-2">
                                <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: toWidth(point.added, maxAddedValue) }}></div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-blue-500 mt-2">
                                <span>趋势</span>
                                <span className="font-medium text-gray-600">{point.addedTrend}</span>
                              </div>
                              <div className="relative h-1.5 bg-blue-50 rounded-full overflow-hidden mt-1">
                                <div className="absolute inset-y-0 left-0 bg-blue-900/40 rounded-full" style={{ width: toWidth(point.addedTrend, maxAddedValue) }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-xs text-purple-600">
                                <span>使用实际</span>
                                <span className="font-medium text-gray-700">{point.used}</span>
                              </div>
                              <div className="relative h-2 bg-purple-100 rounded-full overflow-hidden mt-2">
                                <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-full" style={{ width: toWidth(point.used, maxUsedValue) }}></div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-purple-500 mt-2">
                                <span>趋势</span>
                                <span className="font-medium text-gray-600">{point.usedTrend}</span>
                              </div>
                              <div className="relative h-1.5 bg-purple-50 rounded-full overflow-hidden mt-1">
                                <div className="absolute inset-y-0 left-0 bg-purple-900/40 rounded-full" style={{ width: toWidth(point.usedTrend, maxUsedValue) }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
