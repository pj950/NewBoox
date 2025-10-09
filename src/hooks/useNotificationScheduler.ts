import { useState, useEffect, useCallback } from 'react';
import DataManager from '../utils/dataManager';

export interface ScheduledNotification {
  id: string;
  type: 'warranty' | 'unused' | 'maintenance' | 'capacity' | 'reminder';
  title: string;
  message: string;
  itemId?: string;
  warehouseId?: string;
  boxId?: string;
  scheduledTime: Date;
  isActive: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly';
}

export function useNotificationScheduler() {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const dataManager = DataManager.getInstance();

  // 加载已保存的通知
  useEffect(() => {
    const saved = localStorage.getItem('scheduledNotifications');
    if (saved) {
      const notifications = JSON.parse(saved).map((n: any) => ({
        ...n,
        scheduledTime: new Date(n.scheduledTime)
      }));
      setScheduledNotifications(notifications);
    }
  }, []);

  // 保存通知到本地存储
  const saveNotifications = useCallback((notifications: ScheduledNotification[]) => {
    localStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
    setScheduledNotifications(notifications);
  }, []);

  // 检查保修期到期提醒
  const checkWarrantyExpiration = useCallback(() => {
    const items = dataManager.getItems();
    const notifications: ScheduledNotification[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    items.forEach(item => {
      // 从物品描述或其他字段中提取保修期信息
      const warrantyMatch = item.description.match(/保修.*?(\d{4}-\d{2}-\d{2})/);
      if (warrantyMatch) {
        const warrantyDate = new Date(warrantyMatch[1]);
        
        if (warrantyDate > now && warrantyDate <= thirtyDaysFromNow) {
          notifications.push({
            id: `warranty-${item.id}-${Date.now()}`,
            type: 'warranty',
            title: '保修期即将到期',
            message: `物品"${item.name}"的保修期将在${warrantyDate.toLocaleDateString()}到期`,
            itemId: item.id,
            scheduledTime: new Date(warrantyDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 提前7天提醒
            isActive: true
          });
        }
      }
    });

    return notifications;
  }, [dataManager]);

  // 检查长期未使用物品
  const checkUnusedItems = useCallback(() => {
    const items = dataManager.getItems();
    const notifications: ScheduledNotification[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    items.forEach(item => {
      const usageHistory = dataManager.getItemUsageHistory(item.id);
      const lastUsed = usageHistory.length > 0 
        ? new Date(usageHistory[0].timestamp)
        : new Date(item.addedDate);

      if (lastUsed < sixMonthsAgo && item.status === '闲置') {
        notifications.push({
          id: `unused-${item.id}-${Date.now()}`,
          type: 'unused',
          title: '长期未使用物品',
          message: `物品"${item.name}"已超过6个月未使用，考虑整理或处理`,
          itemId: item.id,
          scheduledTime: now,
          isActive: true,
          recurring: 'monthly'
        });
      }
    });

    return notifications;
  }, [dataManager]);

  // 检查仓库容量预警
  const checkCapacityWarnings = useCallback(() => {
    const warehouses = dataManager.getWarehouses();
    const boxes = dataManager.getBoxes();
    const items = dataManager.getItems();
    const notifications: ScheduledNotification[] = [];

    warehouses.forEach(warehouse => {
      const warehouseBoxes = boxes.filter(box => box.warehouseId === warehouse.id);
      const warehouseItems = items.filter(item => item.warehouseId === warehouse.id);
      const totalCapacity = warehouseBoxes.reduce((sum, box) => sum + box.capacity, 0);
      const utilizationRate = totalCapacity > 0 ? (warehouseItems.length / totalCapacity) : 0;

      if (utilizationRate > 0.9) {
        notifications.push({
          id: `capacity-${warehouse.id}-${Date.now()}`,
          type: 'capacity',
          title: '仓库容量预警',
          message: `仓库"${warehouse.name}"使用率已达${Math.round(utilizationRate * 100)}%，建议整理或扩容`,
          warehouseId: warehouse.id,
          scheduledTime: new Date(),
          isActive: true
        });
      }
    });

    return notifications;
  }, [dataManager]);

  // 生成定期整理提醒
  const generateMaintenanceReminders = useCallback(() => {
    const warehouses = dataManager.getWarehouses();
    const notifications: ScheduledNotification[] = [];
    const now = new Date();

    warehouses.forEach(warehouse => {
      // 每月第一个周末提醒整理
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const firstSaturday = new Date(nextMonth);
      firstSaturday.setDate(1 + (6 - nextMonth.getDay()) % 7);

      notifications.push({
        id: `maintenance-${warehouse.id}-${nextMonth.getMonth()}`,
        type: 'maintenance',
        title: '定期整理提醒',
        message: `建议对仓库"${warehouse.name}"进行定期整理和清洁`,
        warehouseId: warehouse.id,
        scheduledTime: firstSaturday,
        isActive: true,
        recurring: 'monthly'
      });
    });

    return notifications;
  }, [dataManager]);

  // 添加自定义提醒
  const addCustomReminder = useCallback((
    title: string,
    message: string,
    scheduledTime: Date,
    itemId?: string,
    warehouseId?: string,
    boxId?: string,
    recurring?: 'daily' | 'weekly' | 'monthly'
  ) => {
    const newNotification: ScheduledNotification = {
      id: `custom-${Date.now()}`,
      type: 'reminder',
      title,
      message,
      itemId,
      warehouseId,
      boxId,
      scheduledTime,
      isActive: true,
      recurring
    };

    const updated = [...scheduledNotifications, newNotification];
    saveNotifications(updated);
  }, [scheduledNotifications, saveNotifications]);

  // 更新所有通知
  const updateAllNotifications = useCallback(() => {
    const warrantyNotifications = checkWarrantyExpiration();
    const unusedNotifications = checkUnusedItems();
    const capacityNotifications = checkCapacityWarnings();
    const maintenanceNotifications = generateMaintenanceReminders();

    const systemNotifications = [
      ...warrantyNotifications,
      ...unusedNotifications,
      ...capacityNotifications,
      ...maintenanceNotifications
    ];

    // 合并系统通知和用户自定义通知
    const customNotifications = scheduledNotifications.filter(n => n.type === 'reminder');
    const allNotifications = [...systemNotifications, ...customNotifications];

    // 去重（基于类型和关联ID）
    const uniqueNotifications = allNotifications.filter((notification, index, array) => {
      return array.findIndex(n => 
        n.type === notification.type && 
        n.itemId === notification.itemId &&
        n.warehouseId === notification.warehouseId
      ) === index;
    });

    saveNotifications(uniqueNotifications);
  }, [
    checkWarrantyExpiration,
    checkUnusedItems,
    checkCapacityWarnings,
    generateMaintenanceReminders,
    scheduledNotifications,
    saveNotifications
  ]);

  // 获取待触发的通知
  const getPendingNotifications = useCallback(() => {
    const now = new Date();
    return scheduledNotifications.filter(notification => 
      notification.isActive && 
      notification.scheduledTime <= now
    );
  }, [scheduledNotifications]);

  // 标记通知为已处理
  const markAsProcessed = useCallback((notificationId: string) => {
    const updated = scheduledNotifications.map(notification => {
      if (notification.id === notificationId) {
        if (notification.recurring) {
          // 如果是重复通知，计算下次提醒时间
          const nextTime = new Date(notification.scheduledTime);
          switch (notification.recurring) {
            case 'daily':
              nextTime.setDate(nextTime.getDate() + 1);
              break;
            case 'weekly':
              nextTime.setDate(nextTime.getDate() + 7);
              break;
            case 'monthly':
              nextTime.setMonth(nextTime.getMonth() + 1);
              break;
          }
          return { ...notification, scheduledTime: nextTime };
        } else {
          return { ...notification, isActive: false };
        }
      }
      return notification;
    });

    saveNotifications(updated);
  }, [scheduledNotifications, saveNotifications]);

  // 删除通知
  const deleteNotification = useCallback((notificationId: string) => {
    const updated = scheduledNotifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
  }, [scheduledNotifications, saveNotifications]);

  // 定期检查通知（每分钟检查一次）
  useEffect(() => {
    const interval = setInterval(() => {
      updateAllNotifications();
    }, 60000); // 每分钟检查一次

    // 初始检查
    updateAllNotifications();

    return () => clearInterval(interval);
  }, [updateAllNotifications]);

  return {
    scheduledNotifications,
    addCustomReminder,
    updateAllNotifications,
    getPendingNotifications,
    markAsProcessed,
    deleteNotification
  };
}