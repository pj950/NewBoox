import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload, Box, Package, Smartphone, Book, Shirt, Utensils, Wrench, Gamepad2, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import DataManager, { Box as BoxModel } from '../utils/dataManager';

interface AddBoxProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  warehouseId?: string;
}

export default function AddBox({ onNavigate, warehouseId }: AddBoxProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    capacity: 10,
    gradient: 'from-blue-500 to-cyan-500'
  });
  const [image, setImage] = useState<string | null>(null);

  const boxTypes = [
    { id: 'electronics', label: '电子设备盒', icon: Smartphone, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'books', label: '书籍收纳盒', icon: Book, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'clothes', label: '衣物收纳盒', icon: Shirt, gradient: 'from-pink-500 to-rose-500' },
    { id: 'kitchen', label: '厨具收纳盒', icon: Utensils, gradient: 'from-orange-500 to-amber-500' },
    { id: 'tools', label: '工具收纳盒', icon: Wrench, gradient: 'from-gray-500 to-slate-600' },
    { id: 'games', label: '游戏收纳盒', icon: Gamepad2, gradient: 'from-purple-500 to-indigo-500' },
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

  const handleTypeSelect = (type: typeof boxTypes[number]) => {
    setFormData(prev => ({
      ...prev,
      type: type.label,
      gradient: type.gradient
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataManager = DataManager.getInstance();
    const newBox: BoxModel = {
      id: Date.now().toString(),
      name: formData.name.trim() || '新建盒子',
      type: formData.type || '其他',
      gradient: formData.gradient,
      capacity: Math.max(1, formData.capacity),
      description: formData.description.trim(),
      warehouseId: warehouseId || '1',
      image: image || undefined
    };

    dataManager.saveBox(newBox);
    onNavigate('warehouse-detail', { warehouseId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('warehouse-detail', { warehouseId })}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">创建盒子</h1>
                <p className="text-emerald-100">为你的物品创建新的收纳盒</p>
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
              <h3 className="text-lg font-bold text-gray-900">盒子照片</h3>
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
                  <p className="text-lg font-semibold text-gray-700 mb-2">上传盒子照片</p>
                  <p className="text-sm text-gray-500">支持 JPG、PNG 格式</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img src={image} alt="盒子照片" className="w-full h-48 object-cover rounded-2xl" />
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
                  盒子名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="请输入盒子名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  容量上限
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="设置盒子可容纳的物品数量"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  盒子描述
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="描述这个盒子的用途和特点"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Box Type */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">盒子类型</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {boxTypes.map((type) => (
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
                <Box className="h-5 w-5 text-white" />
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
              onClick={() => onNavigate('warehouse-detail', { warehouseId })}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25"
            >
              创建盒子
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}