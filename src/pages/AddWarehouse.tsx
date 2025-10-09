import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload, Package, MapPin, Palette, Home, Briefcase, Car, Archive, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import DataManager, { Warehouse } from '../utils/dataManager';

interface AddWarehouseProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  addNotification: (notification: any) => void;
}

export default function AddWarehouse({ onNavigate, addNotification }: AddWarehouseProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    gradient: 'from-blue-500 to-cyan-500'
  });
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dataManager = DataManager.getInstance();

  const warehouseTypes = [
    { id: 'office', label: '办公室', icon: Briefcase, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'bedroom', label: '卧室', icon: Home, gradient: 'from-pink-500 to-rose-500' },
    { id: 'kitchen', label: '厨房', icon: Home, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'storage', label: '储物间', icon: Archive, gradient: 'from-orange-500 to-amber-500' },
    { id: 'garage', label: '车库', icon: Car, gradient: 'from-gray-500 to-slate-600' },
    { id: 'living', label: '客厅', icon: Home, gradient: 'from-purple-500 to-indigo-500' },
  ];

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-pink-500',
    'from-yellow-500 to-orange-500',
    'from-gray-500 to-slate-600',
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeSelect = (type: any) => {
    setFormData(prev => ({
      ...prev,
      type: type.label,
      gradient: type.gradient
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        title: '创建失败',
        message: '请输入仓库名称'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newWarehouse: Warehouse = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        type: formData.type || '其他',
        gradient: formData.gradient,
        description: formData.description.trim(),
        image: image || undefined
      };

      dataManager.saveWarehouse(newWarehouse);
      
      addNotification({
        type: 'success',
        title: '创建成功',
        message: `仓库 "${newWarehouse.name}" 已创建`
      });
      
      onNavigate('warehouses');
    } catch (error) {
      addNotification({
        type: 'error',
        title: '创建失败',
        message: '无法保存仓库数据'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('warehouses')}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">创建仓库</h1>
                <p className="text-purple-100">为你的物品创建新的存储空间</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Image Upload */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">仓库照片</h3>
            </div>
            
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">上传仓库照片</p>
                  <p className="text-sm text-gray-500">支持 JPG、PNG 格式</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img src={image} alt="仓库照片" className="w-full h-48 object-cover rounded-2xl" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Basic Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">基本信息</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  仓库名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="请输入仓库名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  仓库描述
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="描述这个仓库的用途和特点"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Warehouse Type */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">仓库类型</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {warehouseTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    formData.type === type.label
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${type.gradient}`}>
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Color Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">主题颜色</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {gradients.map((gradient) => (
                <button
                  key={gradient}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gradient }))}
                  className={`h-16 rounded-2xl bg-gradient-to-r ${gradient} border-4 transition-all duration-300 ${
                    formData.gradient === gradient ? 'border-gray-800 scale-105 shadow-lg' : 'border-gray-200 hover:scale-102'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('warehouses')}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '创建中...' : '创建仓库'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}