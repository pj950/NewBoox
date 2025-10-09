import React, { useEffect, useRef } from 'react';
import { X, Camera, Zap } from 'lucide-react';
import { useQRScanner } from '../hooks/useQRScanner';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const { isScanning, scanResult, error, startScanning, stopScanning } = useQRScanner();
  const scannerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scannerElementRef.current) {
      startScanning('qr-scanner-container');
    }
    
    return () => {
      if (isScanning) {
        stopScanning();
      }
    };
  }, [isOpen, startScanning, stopScanning, isScanning]);

  useEffect(() => {
    if (scanResult) {
      onScan(scanResult.text);
      onClose();
    }
  }, [scanResult, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-white rounded-t-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">扫码识别</h2>
                <p className="text-sm text-gray-600">扫描二维码或条形码</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">使用提示</span>
            </div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 将摄像头对准二维码或条形码</li>
              <li>• 保持适当距离，确保码清晰可见</li>
              <li>• 扫描成功后会自动识别物品信息</li>
            </ul>
          </div>
        </div>

        {/* Scanner Container */}
        <div className="bg-white px-6 pb-6">
          <div 
            id="qr-scanner-container" 
            ref={scannerElementRef}
            className="w-full rounded-2xl overflow-hidden border-2 border-gray-200"
            style={{ minHeight: '300px' }}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-3xl p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
          >
            取消扫描
          </button>
        </div>
      </div>
    </div>
  );
}