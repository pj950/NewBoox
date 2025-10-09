import { useState, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export interface ScanResult {
  text: string;
  format: string;
}

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanning = useCallback((elementId: string) => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    scannerRef.current = new Html5QrcodeScanner(elementId, config, false);
    
    scannerRef.current.render(
      (decodedText, decodedResult) => {
        setScanResult({
          text: decodedText,
          format: decodedResult.result.format?.formatName || 'Unknown'
        });
        stopScanning();
      },
      (errorMessage) => {
        // 忽略常见的扫描错误，只记录真正的错误
        if (!errorMessage.includes('No QR code found')) {
          setError(errorMessage);
        }
      }
    );
  }, []);

  const stopScanning = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  return {
    isScanning,
    scanResult,
    error,
    startScanning,
    stopScanning
  };
}