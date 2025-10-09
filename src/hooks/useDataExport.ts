import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DataManager from '../utils/dataManager';

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const dataManager = DataManager.getInstance();

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const warehouses = dataManager.getWarehouses();
      const boxes = dataManager.getBoxes();
      const items = dataManager.getItems();

      // 创建工作簿
      const workbook = XLSX.utils.book_new();

      // 仓库数据
      const warehouseData = warehouses.map(w => ({
        ID: w.id,
        名称: w.name,
        类型: w.type,
        描述: w.description,
        主题色: w.gradient
      }));
      const warehouseSheet = XLSX.utils.json_to_sheet(warehouseData);
      XLSX.utils.book_append_sheet(workbook, warehouseSheet, '仓库');

      // 盒子数据
      const boxData = boxes.map(b => ({
        ID: b.id,
        名称: b.name,
        类型: b.type,
        容量: b.capacity,
        描述: b.description,
        所属仓库: warehouses.find(w => w.id === b.warehouseId)?.name || '',
        主题色: b.gradient
      }));
      const boxSheet = XLSX.utils.json_to_sheet(boxData);
      XLSX.utils.book_append_sheet(workbook, boxSheet, '盒子');

      // 物品数据
      const itemData = items.map(i => ({
        ID: i.id,
        名称: i.name,
        分类: i.category,
        状态: i.status,
        描述: i.description,
        位置: i.location,
        添加日期: i.addedDate,
        最后使用: i.lastUsed,
        标签: i.tags.join(', '),
        所属盒子: boxes.find(b => b.id === i.boxId)?.name || '',
        所属仓库: warehouses.find(w => w.id === i.warehouseId)?.name || ''
      }));
      const itemSheet = XLSX.utils.json_to_sheet(itemData);
      XLSX.utils.book_append_sheet(workbook, itemSheet, '物品');

      // 导出文件
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `智能仓库数据_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(data, fileName);

      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const importFromExcel = async (file: File) => {
    setIsImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // 导入仓库数据
      if (workbook.SheetNames.includes('仓库')) {
        const warehouseSheet = workbook.Sheets['仓库'];
        const warehouseData = XLSX.utils.sheet_to_json(warehouseSheet);
        
        warehouseData.forEach((row: any) => {
          if (row.ID && row.名称) {
            dataManager.saveWarehouse({
              id: row.ID,
              name: row.名称,
              type: row.类型 || '其他',
              description: row.描述 || '',
              gradient: row.主题色 || 'from-blue-500 to-cyan-500'
            });
          }
        });
      }

      // 导入盒子数据
      if (workbook.SheetNames.includes('盒子')) {
        const boxSheet = workbook.Sheets['盒子'];
        const boxData = XLSX.utils.sheet_to_json(boxSheet);
        
        boxData.forEach((row: any) => {
          if (row.ID && row.名称) {
            const warehouse = dataManager.getWarehouses().find(w => w.name === row.所属仓库);
            if (warehouse) {
              dataManager.saveBox({
                id: row.ID,
                name: row.名称,
                type: row.类型 || '其他',
                capacity: row.容量 || 10,
                description: row.描述 || '',
                warehouseId: warehouse.id,
                gradient: row.主题色 || 'from-blue-500 to-cyan-500'
              });
            }
          }
        });
      }

      // 导入物品数据
      if (workbook.SheetNames.includes('物品')) {
        const itemSheet = workbook.Sheets['物品'];
        const itemData = XLSX.utils.sheet_to_json(itemSheet);
        
        itemData.forEach((row: any) => {
          if (row.ID && row.名称) {
            const box = dataManager.getBoxes().find(b => b.name === row.所属盒子);
            const warehouse = dataManager.getWarehouses().find(w => w.name === row.所属仓库);
            
            if (box && warehouse) {
              dataManager.saveItem({
                id: row.ID,
                name: row.名称,
                category: row.分类 || '其他',
                status: row.状态 || '在用',
                description: row.描述 || '',
                location: row.位置 || '',
                addedDate: row.添加日期 || new Date().toISOString().split('T')[0],
                lastUsed: row.最后使用 || '未使用',
                tags: row.标签 ? row.标签.split(', ') : [],
                boxId: box.id,
                warehouseId: warehouse.id
              });
            }
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const exportBackup = async () => {
    setIsExporting(true);
    try {
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          warehouses: dataManager.getWarehouses(),
          boxes: dataManager.getBoxes(),
          items: dataManager.getItems()
        }
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const fileName = `智能仓库备份_${new Date().toISOString().split('T')[0]}.json`;
      saveAs(dataBlob, fileName);

      return true;
    } catch (error) {
      console.error('Backup export failed:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const importBackup = async (file: File) => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (backupData.data) {
        // 清除现有数据
        localStorage.removeItem('warehouses');
        localStorage.removeItem('boxes');
        localStorage.removeItem('items');

        // 导入备份数据
        if (backupData.data.warehouses) {
          backupData.data.warehouses.forEach((warehouse: any) => {
            dataManager.saveWarehouse(warehouse);
          });
        }

        if (backupData.data.boxes) {
          backupData.data.boxes.forEach((box: any) => {
            dataManager.saveBox(box);
          });
        }

        if (backupData.data.items) {
          backupData.data.items.forEach((item: any) => {
            dataManager.saveItem(item);
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Backup import failed:', error);
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isExporting,
    isImporting,
    exportToExcel,
    importFromExcel,
    exportBackup,
    importBackup
  };
}