import React, { useState } from 'react';
import { QrCode, Download, Share, X, Package, Box, Home } from 'lucide-react';
import QRCodeManager from '../utils/qrCodeManager';

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  entityType?: 'item' | 'box' | 'warehouse';
  entityId?: string;
  entityName?: string;
}

export default function QRCodeGenerator({ 
  isOpen, 
  onClose, 
  entityType = 'item', 
  entityId, 
  entityName 
}: QRCodeGeneratorProps) {
  const [selectedType, setSelectedType] = useState<'item' | 'box' | 'warehouse'>(entityType);
  const [selectedEntity, setSelectedEntity] = useState<string>(entityId || '');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrData, setQrData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const qrManager = QRCodeManager.getInstance();

  const entityTypes = [
    { id: 'item', label: '物品', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { id: 'box', label: '盒子', icon: Box, color: 'from-emerald-500 to-teal-500' },
    { id: 'warehouse', label: '仓库', icon: Home, color: 'from-purple-500 to-pink-500' }
  ];

  const generateQRCode = async () => {
    if (!selectedEntity) return;
    
    setIsGenerating(true);
    try {
      const data = qrManager.generateQRData(selectedType, selectedEntity);
      if (data) {
        const url = qrManager.generateQRCodeURL(data, 300);
        setQrData(data);
        setQrCodeUrl(url);
      }
    } catch (error) {
      console.error('生成QR码失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-${qrData?.name || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (!qrData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${qrData.name} - QR码`,
          text: `扫描此QR码查看${qrData.name}的详细信息`,
          url: qrCodeUrl
        });
      } catch (error) {
        console.log('分享取消或失败');
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(qrCodeUrl);
      alert('QR码链接已复制到剪贴板');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">生成QR码</h2>
                <p className="text-sm text-gray-600">为物品生成专属QR码</p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              选择类型
            </label>
            <div className="grid grid-cols-3 gap-3">
              {entityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${type.color}`}>
                    <type.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Entity Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              选择{entityTypes.find(t => t.id === selectedType)?.label}
            </label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">请选择...</option>
              {/* 这里需要根据selectedType动态加载选项 */}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateQRCode}
            disabled={!selectedEntity || isGenerating}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '生成中...' : '生成QR码'}
          </button>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={qrCodeUrl}
                  alt="生成的QR码"
                  className="mx-auto rounded-2xl shadow-lg"
                />
              </div>
              
              {qrData && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{qrData.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">类型: {qrData.type}</p>
                  {qrData.location && (
                    <p className="text-sm text-gray-600">位置: {qrData.location}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors font-semibold"
                >
                  <Download className="h-5 w-5" />
                  <span>下载</span>
                </button>
                <button
                  onClick={shareQRCode}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  <Share className="h-5 w-5" />
                  <span>分享</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}