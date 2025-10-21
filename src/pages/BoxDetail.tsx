import React, { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search, Grid, List, Package, MoreVertical, Tag, Clock, Sparkles, CheckSquare, Square, Trash2, Edit3, HardDrive } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import DataManager, { Box as BoxModel } from '../utils/dataManager';

interface BoxDetailProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  boxId?: string;
  warehouseId?: string;
}

export default function BoxDetail({ onNavigate, boxId, warehouseId }: BoxDetailProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const dm = useMemo(() => DataManager.getInstance(), []);

  const box: BoxModel = useMemo(() => {
    const b = boxId ? dm.getBoxes().find(b => b.id === boxId) : undefined;
    if (b) return b as BoxModel;
    return {
      id: boxId || '1',
      name: '电子设备盒',
      type: '电子产品',
      gradient: 'from-blue-500 to-cyan-500',
      capacity: 20,
      description: '存放各种电子设备和配件',
      warehouseId: warehouseId || '1',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
    } as BoxModel;
  }, [dm, boxId, warehouseId]);

  type UIItem = {
    id: string;
    name: string;
    category: string;
    status: string;
    lastUsed: string;
    addedDate: string;
    image?: string;
    tags: string[];
    description: string;
  };

  const [items, setItems] = useState<UIItem[]>(() => {
    const fetched = boxId ? dm.getItemsByBox(boxId) : [];
    if (fetched.length > 0) {
      return fetched as unknown as UIItem[];
    }
    // 回退示例数据
    return [
      {
        id: 'demo-1',
        name: 'MacBook Pro 16"',
        category: '笔记本电脑',
        status: '在用',
        lastUsed: '2小时前',
        addedDate: '2024-01-15',
        image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['工作', '便携', '苹果'],
        description: '主要用于日常工作和开发'
      },
      {
        id: 'demo-2',
        name: 'iPad Pro 12.9"',
        category: '平板电脑',
        status: '闲置',
        lastUsed: '3天前',
        addedDate: '2024-01-10',
        image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['绘画', '便携', '苹果'],
        description: '用于绘画和阅读的大屏平板'
      }
    ];
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在用': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '闲置': return 'bg-gray-100 text-gray-700 border-gray-200';
      case '借出': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '维修中': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const utilizationRate = Math.round((items.length / box.capacity) * 100);
  const isFull = items.length >= box.capacity;

  const toggleSelect = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allSelectedIds = Object.keys(selected).filter(id => selected[id]);

  const bulkDelete = () => {
    if (allSelectedIds.length === 0) return;
    // 从数据管理器删除
    allSelectedIds.forEach(id => dm.deleteItem(id));
    // 从本地状态删除
    setItems(prev => prev.filter(i => !allSelectedIds.includes(i.id)));
    setSelected({});
    setSelectionMode(false);
  };

  const bulkTag = () => {
    const tag = window.prompt('请输入要添加的标签（单个）');
    if (!tag) return;
    setItems(prev => prev.map(i => allSelectedIds.includes(i.id) ? { ...i, tags: Array.from(new Set([...(i.tags || []), tag])) } : i));
    setSelected({});
    setSelectionMode(false);
  };

  const increaseCapacity = (delta = 5) => {
    const updated: BoxModel = { ...box, capacity: box.capacity + delta };
    dm.saveBox(updated);
    // 触发本地 UI 更新（box 是 memo 对象，简单处理：刷新页面）
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${box.gradient}`}></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('warehouse-detail', { warehouseId })}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{box.name}</h1>
                <p className="text-blue-100">容量 {items.length}/{box.capacity} • {utilizationRate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectionMode(v => !v)}
                className={`p-3 rounded-2xl border border-white/30 backdrop-blur-sm ${selectionMode ? 'bg-white/40 text-white' : 'bg-white/20 text-white/80'}`}
                title={selectionMode ? '退出批量选择' : '进入批量选择'}
              >
                {selectionMode ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <MoreVertical className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-40 rounded-3xl overflow-hidden mb-6 shadow-xl">
            <img 
              src={box.image}
              alt={box.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm opacity-90">{box.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{items.length}</p>
              <p className="text-sm text-blue-100">物品数量</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{box.capacity}</p>
              <p className="text-sm text-blue-100">容量上限</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{utilizationRate}%</p>
              <p className="text-sm text-blue-100">利用率</p>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30">
            <div className="flex justify-between text-sm text-white mb-2">
              <span className="font-medium">容量使用情况</span>
              <span className="font-semibold">{items.length} / {box.capacity}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${Math.min(100, utilizationRate)}%` }}
              ></div>
            </div>
            {isFull && (
              <div className="mt-3 flex items-center justify-between text-sm text-white">
                <span>容量已满，无法继续添加物品</span>
                <button onClick={() => increaseCapacity(5)} className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/20 border border-white/30">
                  <HardDrive className="h-4 w-4" />
                  扩容 +5
                </button>
              </div>
            )}
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-white/70" />
                <input
                  type="text"
                  placeholder="搜索物品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 border border-white/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white/30 text-white' : 'text-white/70'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white/30 text-white' : 'text-white/70'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Add Item / Full */}
          <div className="flex gap-3">
            <button
              disabled={isFull}
              onClick={() => onNavigate('add-item', { boxId: box.id, warehouseId })}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl border border-white/30 transition-all duration-300 font-semibold ${isFull ? 'bg-white/10 text-white/60 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <Plus className="h-6 w-6" />
              <span>{isFull ? '容量已满' : '添加物品'}</span>
            </button>
            {selectionMode && (
              <div className="flex-1 flex gap-2">
                <button onClick={bulkDelete} className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/80 text-white font-semibold hover:bg-red-600/90">
                  <Trash2 className="h-5 w-5" /> 批量删除
                </button>
                <button onClick={bulkTag} className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500/80 text-white font-semibold hover:bg-blue-600/90">
                  <Edit3 className="h-5 w-5" /> 标签修改
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {selectionMode && (
                      <button onClick={() => toggleSelect(item.id)} className="p-1.5 rounded-lg bg-white/20 border border-white/30">
                        {selected[item.id] ? <CheckSquare className="h-5 w-5 text-white" /> : <Square className="h-5 w-5 text-white/70" />}
                      </button>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>最后使用：{item.lastUsed}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(item.tags || []).map((tag: string) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200/50"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      {selectionMode && (
                        <button onClick={() => toggleSelect(item.id)} className="p-1.5 rounded-lg bg-gray-100">
                          {selected[item.id] ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span>{item.lastUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">没有找到物品</h3>
            <p className="text-gray-500 mb-6">尝试调整搜索条件或添加新物品</p>
            <button
              disabled={isFull}
              onClick={() => onNavigate('add-item', { boxId: box.id, warehouseId })}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${isFull ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25'}`}
            >
              {isFull ? '容量已满' : '添加第一个物品'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
