import { useState, useEffect } from 'react';
import DataManager from '../utils/dataManager';

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
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataManager = DataManager.getInstance();

  const calculateStatistics = () => {
    setIsLoading(true);
    
    try {
      const warehouses = dataManager.getWarehouses();
      const boxes = dataManager.getBoxes();
      const items = dataManager.getItems();

      // 基础统计
      const totalCapacity = boxes.reduce((sum, box) => sum + box.capacity, 0);
      const utilizationRate = totalCapacity > 0 ? Math.round((items.length / totalCapacity) * 100) : 0;

      // 计算总价值（模拟数据）
      const totalValue = items.reduce((sum, item) => {
        const price = parseFloat(item.description.match(/\d+/)?.[0] || '0') || Math.random() * 1000;
        return sum + price;
      }, 0);

      // 分类统计
      const categoryMap = new Map<string, { count: number; value: number }>();
      items.forEach(item => {
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

      const categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        value: data.value,
        percentage: Math.round((data.count / items.length) * 100)
      })).sort((a, b) => b.count - a.count);

      // 状态统计
      const statusMap = new Map<string, number>();
      items.forEach(item => {
        const status = item.status;
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      const statusStats = Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / items.length) * 100)
      })).sort((a, b) => b.count - a.count);

      // 仓库统计
      const warehouseStats = warehouses.map(warehouse => {
        const warehouseBoxes = boxes.filter(box => box.warehouseId === warehouse.id);
        const warehouseItems = items.filter(item => item.warehouseId === warehouse.id);
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
      }).sort((a, b) => b.itemCount - a.itemCount);

      // 月度统计（模拟数据）
      const monthlyStats = [
        { month: '1月', added: 45, used: 120 },
        { month: '2月', added: 38, used: 95 },
        { month: '3月', added: 52, used: 110 },
        { month: '4月', added: 41, used: 88 },
        { month: '5月', added: 47, used: 102 },
        { month: '6月', added: 55, used: 125 }
      ];

      // 价值统计
      const itemValues = items.map(item => 
        parseFloat(item.description.match(/\d+/)?.[0] || '0') || Math.random() * 1000
      );
      
      const valueStats = {
        totalValue,
        averageValue: itemValues.length > 0 ? totalValue / itemValues.length : 0,
        highestValue: itemValues.length > 0 ? Math.max(...itemValues) : 0,
        lowestValue: itemValues.length > 0 ? Math.min(...itemValues) : 0
      };

      // 使用统计（模拟数据）
      const usageStats = items.slice(0, 10).map(item => ({
        itemId: item.id,
        name: item.name,
        category: item.category,
        usageCount: Math.floor(Math.random() * 50) + 1,
        lastUsed: item.lastUsed
      })).sort((a, b) => b.usageCount - a.usageCount);

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
        usageStats
      };

      setStatistics(statisticsData);
    } catch (error) {
      console.error('Failed to calculate statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateStatistics();
  }, []);

  const refreshStatistics = () => {
    calculateStatistics();
  };

  return {
    statistics,
    isLoading,
    refreshStatistics
  };
}