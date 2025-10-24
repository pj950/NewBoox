import { useState, useEffect, useCallback } from 'react';
import DataManager from '../utils/dataManager';
import { fourierLowPass, FourierDecomposition } from '../utils/fourier';

type TrendDirection = 'up' | 'down' | 'flat';

interface TrendPoint {
  month: string;
  added: number;
  used: number;
  addedTrend: number;
  usedTrend: number;
  addedSeasonal: number;
  usedSeasonal: number;
}

interface TrendMetrics {
  addedMomentum: number;
  usedMomentum: number;
  addedDirection: TrendDirection;
  usedDirection: TrendDirection;
  addedSeasonalityStrength: number;
  usedSeasonalityStrength: number;
  overallMomentum: number;
  overallDirection: TrendDirection;
  stability: number;
}

interface TrendAnalysis {
  months: string[];
  points: TrendPoint[];
  metrics: TrendMetrics;
  insights: string[];
}

interface TrendSeriesAnalysis {
  trend: number[];
  residual: number[];
  momentum: number;
  direction: TrendDirection;
  seasonalStrength: number;
  stability: number;
}

export interface StatisticsData {
  overview: {
    totalWarehouses: number;
    totalBoxes: number;
    totalItems: number;
    totalValue: number;
    utilizationRate: number;
  };
  categoryStats: Array<{
    category: string;
    count: number;
    value: number;
    percentage: number;
  }>;
  statusStats: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  warehouseStats: Array<{
    id: string;
    name: string;
    itemCount: number;
    utilization: number;
    value: number;
  }>;
  monthlyStats: Array<{
    month: string;
    added: number;
    used: number;
  }>;
  valueStats: {
    totalValue: number;
    averageValue: number;
    highestValue: number;
    lowestValue: number;
  };
  usageStats: Array<{
    itemId: string;
    name: string;
    category: string;
    usageCount: number;
    lastUsed: string;
  }>;
  trendAnalysis: TrendAnalysis;
}

const DEFAULT_TREND_ANALYSIS: TrendAnalysis = {
  months: [],
  points: [],
  metrics: {
    addedMomentum: 0,
    usedMomentum: 0,
    addedDirection: 'flat',
    usedDirection: 'flat',
    addedSeasonalityStrength: 0,
    usedSeasonalityStrength: 0,
    overallMomentum: 0,
    overallDirection: 'flat',
    stability: 1
  },
  insights: []
};

function calculateStdDev(values: number[]): number {
  if (values.length <= 1) {
    return 0;
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}

function determineDirection(momentum: number, threshold: number): TrendDirection {
  if (momentum > threshold) {
    return 'up';
  }

  if (momentum < -threshold) {
    return 'down';
  }

  return 'flat';
}

function describeDirection(label: string, direction: TrendDirection, momentum: number): string {
  const formattedMomentum = momentum >= 0 ? `+${momentum.toFixed(1)}` : momentum.toFixed(1);

  switch (direction) {
    case 'up':
      return `${label}呈上升趋势（动量 ${formattedMomentum}）`;
    case 'down':
      return `${label}呈下降趋势（动量 ${formattedMomentum}）`;
    default:
      return `${label}整体平稳（动量 ${formattedMomentum}）`;
  }
}

function describeSeasonality(seasonality: number, stability: number): string {
  const seasonalityPercent = Math.round(seasonality * 100);
  const stabilityPercent = Math.round(stability * 100);

  if (seasonality > 0.6) {
    return `季节性波动显著（指数 ${seasonalityPercent}%），建议提前规划库存节奏。`;
  }

  if (seasonality > 0.35) {
    return `季节性影响中等（指数 ${seasonalityPercent}%），适度关注阶段性变化。`;
  }

  return `季节性影响较弱（指数 ${seasonalityPercent}%），趋势稳定性约 ${stabilityPercent}%。`;
}

function analyzeSeries(series: number[], decomposition: FourierDecomposition): TrendSeriesAnalysis {
  if (series.length === 0) {
    return {
      trend: [],
      residual: [],
      momentum: 0,
      direction: 'flat',
      seasonalStrength: 0,
      stability: 1
    };
  }

  const trend = decomposition.trend;
  const residual = decomposition.residual;
  const lookback = Math.min(3, trend.length - 1);
  let momentum = 0;

  if (lookback > 0) {
    const baseIndex = Math.max(0, trend.length - lookback - 1);
    const baseValue = trend[baseIndex] ?? 0;
    const latest = trend[trend.length - 1] ?? 0;
    momentum = Number((latest - baseValue).toFixed(2));
  }

  const seriesStd = calculateStdDev(series);
  const residualStd = calculateStdDev(residual);
  const seasonalStrength = seriesStd === 0 ? 0 : Math.min(1, residualStd / seriesStd);
  const stability = Math.max(0, Math.min(1, 1 - seasonalStrength));
  const threshold = Math.max(1, seriesStd * 0.35);
  const direction = determineDirection(momentum, threshold);

  return {
    trend,
    residual,
    momentum,
    direction,
    seasonalStrength,
    stability
  };
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataManager = DataManager.getInstance();

  const calculateStatistics = useCallback(() => {
    setIsLoading(true);

    try {
      const warehouses = dataManager.getWarehouses();
      const boxes = dataManager.getBoxes();
      const items = dataManager.getItems();

      const totalCapacity = boxes.reduce((sum, box) => sum + box.capacity, 0);
      const utilizationRate = totalCapacity > 0 ? Math.round((items.length / totalCapacity) * 100) : 0;

      const totalValue = items.reduce((sum, item) => {
        const price = parseFloat(item.description.match(/\d+/)?.[0] || '0') || Math.random() * 1000;
        return sum + price;
      }, 0);

      const categoryMap = new Map<string, { count: number; value: number }>();
      items.forEach((item) => {
        const category = item.category;
        const value = parseFloat(item.description.match(/\d+/)?.[0] || '0') || Math.random() * 1000;

        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)!;
          categoryMap.set(category, {
            count: existing.count + 1,
            value: existing.value + value
          });
        } else {
          categoryMap.set(category, { count: 1, value });
        }
      });

      const categoryStats = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          count: data.count,
          value: data.value,
          percentage: items.length > 0 ? Math.round((data.count / items.length) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);

      const statusMap = new Map<string, number>();
      items.forEach((item) => {
        const status = item.status;
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      const statusStats = Array.from(statusMap.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: items.length > 0 ? Math.round((count / items.length) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);

      const warehouseStats = warehouses
        .map((warehouse) => {
          const warehouseBoxes = boxes.filter((box) => box.warehouseId === warehouse.id);
          const warehouseItems = items.filter((item) => item.warehouseId === warehouse.id);
          const warehouseCapacity = warehouseBoxes.reduce((sum, box) => sum + box.capacity, 0);
          const warehouseValue = warehouseItems.reduce((sum, item) => {
            const price = parseFloat(item.description.match(/\d+/)?.[0] || '0') || Math.random() * 1000;
            return sum + price;
          }, 0);

          return {
            id: warehouse.id,
            name: warehouse.name,
            itemCount: warehouseItems.length,
            utilization: warehouseCapacity > 0 ? Math.round((warehouseItems.length / warehouseCapacity) * 100) : 0,
            value: warehouseValue
          };
        })
        .sort((a, b) => b.itemCount - a.itemCount);

      const monthlyStats = [
        { month: '1月', added: 45, used: 120 },
        { month: '2月', added: 38, used: 95 },
        { month: '3月', added: 52, used: 110 },
        { month: '4月', added: 41, used: 88 },
        { month: '5月', added: 47, used: 102 },
        { month: '6月', added: 55, used: 125 }
      ];

      let trendAnalysis: TrendAnalysis = {
        ...DEFAULT_TREND_ANALYSIS,
        metrics: { ...DEFAULT_TREND_ANALYSIS.metrics }
      };

      if (monthlyStats.length > 0) {
        const addedSeries = monthlyStats.map((item) => item.added);
        const usedSeries = monthlyStats.map((item) => item.used);
        const harmonics = Math.max(1, Math.floor(monthlyStats.length / 3));

        const addedDecomposition = fourierLowPass(addedSeries, harmonics);
        const usedDecomposition = fourierLowPass(usedSeries, harmonics);

        const addedAnalysis = analyzeSeries(addedSeries, addedDecomposition);
        const usedAnalysis = analyzeSeries(usedSeries, usedDecomposition);

        const points: TrendPoint[] = monthlyStats.map((item, index) => ({
          month: item.month,
          added: item.added,
          used: item.used,
          addedTrend: Number(addedAnalysis.trend[index].toFixed(2)),
          usedTrend: Number(usedAnalysis.trend[index].toFixed(2)),
          addedSeasonal: Number(addedAnalysis.residual[index].toFixed(2)),
          usedSeasonal: Number(usedAnalysis.residual[index].toFixed(2))
        }));

        const overallMomentum = Number(((addedAnalysis.momentum + usedAnalysis.momentum) / 2).toFixed(2));
        const overallStandardDeviation = (calculateStdDev(addedSeries) + calculateStdDev(usedSeries)) / 2;
        const overallThreshold = Math.max(1, overallStandardDeviation * 0.35);
        const overallDirection = determineDirection(overallMomentum, overallThreshold);
        const averageSeasonality = (addedAnalysis.seasonalStrength + usedAnalysis.seasonalStrength) / 2;
        const stability = Math.max(0, Math.min(1, (addedAnalysis.stability + usedAnalysis.stability) / 2));

        const insights = [
          describeDirection('新增物品', addedAnalysis.direction, addedAnalysis.momentum),
          describeDirection('物品使用', usedAnalysis.direction, usedAnalysis.momentum),
          describeSeasonality(averageSeasonality, stability)
        ];

        trendAnalysis = {
          months: monthlyStats.map((item) => item.month),
          points,
          metrics: {
            addedMomentum: addedAnalysis.momentum,
            usedMomentum: usedAnalysis.momentum,
            addedDirection: addedAnalysis.direction,
            usedDirection: usedAnalysis.direction,
            addedSeasonalityStrength: addedAnalysis.seasonalStrength,
            usedSeasonalityStrength: usedAnalysis.seasonalStrength,
            overallMomentum,
            overallDirection,
            stability
          },
          insights
        };
      }

      const itemValues = items.map((item) => parseFloat(item.description.match(/\d+/)?.[0] || '0') || Math.random() * 1000);

      const valueStats = {
        totalValue,
        averageValue: itemValues.length > 0 ? totalValue / itemValues.length : 0,
        highestValue: itemValues.length > 0 ? Math.max(...itemValues) : 0,
        lowestValue: itemValues.length > 0 ? Math.min(...itemValues) : 0
      };

      const usageStats = items
        .slice(0, 10)
        .map((item) => ({
          itemId: item.id,
          name: item.name,
          category: item.category,
          usageCount: Math.floor(Math.random() * 50) + 1,
          lastUsed: item.lastUsed
        }))
        .sort((a, b) => b.usageCount - a.usageCount);

      const statisticsData: StatisticsData = {
        overview: {
          totalWarehouses: warehouses.length,
          totalBoxes: boxes.length,
          totalItems: items.length,
          totalValue,
          utilizationRate
        },
        categoryStats,
        statusStats,
        warehouseStats,
        monthlyStats,
        valueStats,
        usageStats,
        trendAnalysis
      };

      setStatistics(statisticsData);
    } catch (error) {
      console.error('Failed to calculate statistics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dataManager]);

  useEffect(() => {
    calculateStatistics();
  }, [calculateStatistics]);

  const refreshStatistics = useCallback(() => {
    calculateStatistics();
  }, [calculateStatistics]);

  return {
    statistics,
    isLoading,
    refreshStatistics
  };
}
