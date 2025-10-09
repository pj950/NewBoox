import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Camera, Package, Tag, Calendar, Trash2 } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import DataManager from '../utils/dataManager';

interface EditItemProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  itemId?: string;
  addNotification: (notification: any) => void;
}

export default function EditItem({ onNavigate, itemId, addNotification }: EditItemProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    tags: '',
    status: '在用',
    condition: '良好',
    brand: '',
    model: '',
    serialNumber: '',
    price: '',
    purchaseDate: '',
    warrantyDate: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dataManager = DataManager.getInstance();

  useEffect(() => {
    if (itemId) {
      loadItemData();
    }
  }, [itemId]);

  const loadItemData = () => {
    const items = dataManager.getItems();
    const item = items.find(i => i.id === itemId);
    
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        tags: item.tags.join(', '),
        status: item.status,
        condition: 'condition' in item ? (item as any).condition : '良好',
        brand: 'brand' in item ? (item as any).brand : '',
        model: 'model' in item ? (item as any).model : '',
        serialNumber: 'serialNumber' in item ? (item as any).serialNumber : '',
        price: 'price' in item ? (item as any).price : '',
        purchaseDate: 'purchaseDate' in item ? (item as any).purchaseDate : '',
        warrantyDate: 'warrantyDate' in item ? (item as any).warrantyDate : ''
      });
      setImage(item.image || null);
    }
    setIsLoading(false);
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const items = dataManager.getItems();
      const itemIndex = items.findIndex(i => i.id === itemId);
      
      if (itemIndex >= 0) {
        const updatedItem = {
          ...items[itemIndex],
          name: formData.name,
          category: formData.category,
          description: formData.description,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: formData.status,
          image: image || undefined,
          // 扩展字段
          condition: formData.condition,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          price: formData.price,
          purchaseDate: formData.purchaseDate,
          warrantyDate: formData.warrantyDate
        };
        
        dataManager.saveItem(updatedItem);
        
        addNotification({
          type: 'success',
          title: '保存成功',
          message: `物品 "${formData.name}" 已更新`
        });
        
        onNavigate('item-detail', { itemId });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: '保存失败',
        message: '无法保存物品信息'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`确定要删除物品 "${formData.name}" 吗？此操作不可恢复。`)) {
      dataManager.deleteItem(itemId!);
      addNotification({
        type: 'success',
        title: '删除成功',
        message: `物品 "${formData.name}" 已删除`
      });
      onNavigate('warehouses');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载物品信息...</p>
        </div>
      </div>
    );
  }

  const categories = ['电子设备', '书籍', '衣物', '厨具', '工具', '运动器材', '其他'];
  const statusOptions = ['在用', '闲置', '借出', '维修中'];
  const conditionOptions = ['全新', '良好', '一般', '需要维修'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('item-detail', { itemId })}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">编辑物品</h1>
                <p className="text-orange-100">修改物品信息</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-red-500/50 transition-all duration-300"
            >
              <Trash2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Image Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">物品照片</h3>
            </div>
            
            {image ? (
              <div className="relative">
                <img src={image} alt="物品照片" className="w-full h-48 object-cover rounded-2xl" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700">更换照片</p>
                </label>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">基本信息</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">物品名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">描述</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">标签</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="用逗号分隔多个标签"
                />
              </div>
            </div>
          </div>

          {/* Extended Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">详细信息</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">品牌</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">型号</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">状况</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {conditionOptions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">价格</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">购买日期</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">保修期至</label>
                <input
                  type="date"
                  value={formData.warrantyDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, warrantyDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('item-detail', { itemId })}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}