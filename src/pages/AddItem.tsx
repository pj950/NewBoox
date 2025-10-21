import React, { useState } from 'react';
import { ArrowLeft, Camera, Package, Smartphone, Laptop, Headphones, Book, Sparkles, QrCode } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import { AIImageAnalysis } from '../components/AIImageAnalysis';
import QRScanner from '../components/QRScanner';
import DataManager from '../utils/dataManager';

interface AddItemProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  boxId?: string;
  warehouseId?: string;
  addPendingChange?: (change: unknown) => void;
  addNotification?: (notification: { type: string; title: string; message: string }) => void;
}

export default function AddItem({ onNavigate, boxId, warehouseId, addPendingChange, addNotification }: AddItemProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    tags: '',
    purchaseDate: '',
    warrantyDate: '',
    price: '',
    brand: '',
    model: '',
    serialNumber: '',
    condition: '良好',
    status: '在用'
  });
  
  const [image, setImage] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const categories = [
    { id: 'electronics', label: '电子设备', icon: Smartphone, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'computers', label: '电脑设备', icon: Laptop, gradient: 'from-purple-500 to-indigo-500' },
    { id: 'audio', label: '音频设备', icon: Headphones, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'books', label: '书籍', icon: Book, gradient: 'from-orange-500 to-amber-500' },
    { id: 'clothes', label: '衣物', icon: Package, gradient: 'from-pink-500 to-rose-500' },
    { id: 'tools', label: '工具', icon: Package, gradient: 'from-gray-500 to-slate-600' },
    { id: 'kitchen', label: '厨具', icon: Package, gradient: 'from-red-500 to-pink-500' },
    { id: 'sports', label: '运动器材', icon: Package, gradient: 'from-green-500 to-emerald-500' },
    { id: 'other', label: '其他', icon: Package, gradient: 'from-yellow-500 to-orange-500' },
  ];

  const statusOptions = ['在用', '闲置', '借出', '维修中'];
  const conditionOptions = ['全新', '良好', '一般', '需要维修'];

  const handleAIAnalysisComplete = (result: { name: string; category: string; brand?: string; model?: string; tags: string[]; description: string }) => {
    if (result) {
      setFormData(prev => ({
        ...prev,
        name: result.name,
        category: result.category,
        brand: result.brand || '',
        model: result.model || '',
        tags: result.tags.join(', '),
        description: result.description
      }));
    }
  };

  const handleQRScan = (result: string) => {
    // 根据扫码结果填充表单
    setFormData(prev => ({
      ...prev,
      serialNumber: result,
      name: `扫码物品 ${result.slice(-6)}`
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dm = DataManager.getInstance();

    // 容量校验
    if (boxId) {
      const boxes = dm.getBoxes();
      const thisBox = boxes.find(b => b.id === boxId);
      if (thisBox) {
        const currentCount = dm.getItemsByBox(boxId).length;
        if (currentCount >= thisBox.capacity) {
          addNotification?.({
            type: 'error',
            title: '容量已满',
            message: `盒子 "${thisBox.name}" 已达容量上限 (${thisBox.capacity})，请先整理或扩容`
          });
          return;
        }
      }
    }

    // 构造物品数据并保存到本地（离线优先）
    const id = Date.now().toString();
    const tags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const descWithWarranty = formData.warrantyDate
      ? `${formData.description}\n保修至：${formData.warrantyDate}`
      : formData.description;

    dm.saveItem({
      id,
      name: formData.name,
      category: formData.category || '其他',
      status: formData.status,
      description: descWithWarranty,
      location: '',
      addedDate: formData.purchaseDate || new Date().toISOString().slice(0,10),
      lastUsed: '刚刚',
      tags,
      image: image || undefined,
      boxId: boxId || '',
      warehouseId: warehouseId || ''
    });

    // 添加到离线同步队列
    addPendingChange?.({
      type: 'create',
      entity: 'item',
      data: { ...formData, id, boxId, warehouseId, tags }
    });

    addNotification?.({
      type: 'success',
      title: '添加成功',
      message: `物品 "${formData.name}" 已添加`
    });
    
    onNavigate('box-detail', { boxId, warehouseId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('box-detail', { boxId, warehouseId })}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">添加物品</h1>
                <p className="text-purple-100">为你的收纳盒添加新物品</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Image Upload Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">物品照片</h3>
              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="ml-auto p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-colors"
                title="扫码识别"
              >
                <QrCode className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <AIImageAnalysis 
              onAnalysisComplete={handleAIAnalysisComplete}
              onImageUpload={setImage}
            />
          </div>

          {/* Enhanced Basic Information */}
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
                  物品名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="请输入物品名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  分类 *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.label }))}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                        formData.category === category.label
                          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${category.gradient}`}>
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    状况
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    {conditionOptions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Detailed Information */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">详细信息</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  物品描述
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="请描述物品的特征、用途等信息"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="例如：工作, 便携, 苹果"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    品牌
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="品牌名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    型号
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="产品型号"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    购买价格
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="购买价格"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    序列号
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="产品序列号"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    购买日期
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    保修期至
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, warrantyDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('box-detail', { boxId, warehouseId })}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/25"
            >
              添加物品
            </button>
          </div>
        </form>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner 
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
    </div>
  );
}