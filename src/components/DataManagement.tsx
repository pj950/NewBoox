import React, { useState } from 'react';
import { Download, Upload, FileSpreadsheet, Database, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useDataExport } from '../hooks/useDataExport';

interface DataManagementProps {
  onClose: () => void;
  addNotification: (notification: any) => void;
}

export default function DataManagement({ onClose, addNotification }: DataManagementProps) {
  const { isExporting, isImporting, exportToExcel, importFromExcel, exportBackup, importBackup } = useDataExport();
  const [dragOver, setDragOver] = useState(false);

  const handleExportExcel = async () => {
    const success = await exportToExcel();
    if (success) {
      addNotification({
        type: 'success',
        title: '导出成功',
        message: 'Excel文件已保存到下载文件夹'
      });
    } else {
      addNotification({
        type: 'error',
        title: '导出失败',
        message: '无法导出Excel文件'
      });
    }
  };

  const handleExportBackup = async () => {
    const success = await exportBackup();
    if (success) {
      addNotification({
        type: 'success',
        title: '备份成功',
        message: '备份文件已保存到下载文件夹'
      });
    } else {
      addNotification({
        type: 'error',
        title: '备份失败',
        message: '无法创建备份文件'
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let success = false;

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      success = await importFromExcel(file);
      if (success) {
        addNotification({
          type: 'success',
          title: '导入成功',
          message: 'Excel数据已成功导入'
        });
      } else {
        addNotification({
          type: 'error',
          title: '导入失败',
          message: '无法解析Excel文件'
        });
      }
    } else if (fileExtension === 'json') {
      success = await importBackup(file);
      if (success) {
        addNotification({
          type: 'success',
          title: '恢复成功',
          message: '备份数据已成功恢复'
        });
      } else {
        addNotification({
          type: 'error',
          title: '恢复失败',
          message: '无法解析备份文件'
        });
      }
    } else {
      addNotification({
        type: 'error',
        title: '文件格式错误',
        message: '请选择Excel文件(.xlsx)或备份文件(.json)'
      });
    }

    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">数据管理</h2>
                <p className="text-sm text-gray-600">导入导出和备份数据</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Export Section */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">导出数据</h3>
          <div className="space-y-3">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 disabled:opacity-50"
            >
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-green-800">导出为Excel</p>
                <p className="text-sm text-green-600">包含所有仓库、盒子和物品数据</p>
              </div>
              {isExporting && <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />}
            </button>

            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 disabled:opacity-50"
            >
              <Download className="h-6 w-6 text-blue-600" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-blue-800">创建备份</p>
                <p className="text-sm text-blue-600">完整的JSON格式备份文件</p>
              </div>
              {isExporting && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">导入数据</h3>
          
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.json"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isImporting}
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className={`h-12 w-12 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {isImporting ? '正在导入...' : '拖拽文件到这里或点击选择'}
                </p>
                <p className="text-sm text-gray-500">
                  支持Excel文件(.xlsx)和备份文件(.json)
                </p>
              </div>

              {isImporting && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-blue-600">处理中...</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200/50">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">注意事项</p>
                <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                  <li>• 导入备份文件会覆盖现有数据</li>
                  <li>• 导入Excel文件会与现有数据合并</li>
                  <li>• 建议在导入前先创建备份</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}