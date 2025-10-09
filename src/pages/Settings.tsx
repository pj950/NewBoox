import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Globe, Bell, Shield, Trash2, Download, Upload, Smartphone, Palette, Volume2 } from 'lucide-react';
import { Page, NavigationParams } from '../App';

interface SettingsProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  addNotification: (notification: any) => void;
}

export default function Settings({ onNavigate, addNotification }: SettingsProps) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      sound: true,
      autoSync: true,
      dataBackup: true,
      vibration: true
    };
  });

  const saveSettings = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    addNotification({
      type: 'success',
      title: '设置已保存',
      message: '您的偏好设置已成功保存'
    });
  };

  const handleThemeChange = (theme: string) => {
    const newSettings = { ...settings, theme };
    saveSettings(newSettings);
    
    // 应用主题
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleLanguageChange = (language: string) => {
    const newSettings = { ...settings, language };
    saveSettings(newSettings);
  };

  const handleToggleSetting = (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      localStorage.clear();
      addNotification({
        type: 'warning',
        title: '数据已清除',
        message: '所有本地数据已被清除'
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const settingsSections = [
    {
      title: '外观设置',
      icon: Palette,
      items: [
        {
          label: '主题模式',
          type: 'select',
          key: 'theme',
          options: [
            { value: 'light', label: '浅色模式' },
            { value: 'dark', label: '深色模式' },
            { value: 'auto', label: '跟随系统' }
          ]
        }
      ]
    },
    {
      title: '语言设置',
      icon: Globe,
      items: [
        {
          label: '界面语言',
          type: 'select',
          key: 'language',
          options: [
            { value: 'zh-CN', label: '简体中文' },
            { value: 'zh-TW', label: '繁体中文' },
            { value: 'en-US', label: 'English' }
          ]
        }
      ]
    },
    {
      title: '通知设置',
      icon: Bell,
      items: [
        {
          label: '推送通知',
          type: 'toggle',
          key: 'notifications',
          description: '接收重要提醒和更新通知'
        },
        {
          label: '声音提示',
          type: 'toggle',
          key: 'sound',
          description: '操作时播放提示音'
        },
        {
          label: '震动反馈',
          type: 'toggle',
          key: 'vibration',
          description: '操作时提供触觉反馈'
        }
      ]
    },
    {
      title: '数据设置',
      icon: Shield,
      items: [
        {
          label: '自动同步',
          type: 'toggle',
          key: 'autoSync',
          description: '自动同步数据到云端'
        },
        {
          label: '自动备份',
          type: 'toggle',
          key: 'dataBackup',
          description: '定期自动备份数据'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('profile')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">设置</h1>
              <p className="text-gray-100">个性化您的应用体验</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <section.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => handleToggleSetting(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[item.key] ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'select' ? (
                      <select
                        value={settings[item.key]}
                        onChange={(e) => {
                          if (item.key === 'theme') {
                            handleThemeChange(e.target.value);
                          } else if (item.key === 'language') {
                            handleLanguageChange(e.target.value);
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {item.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-red-200/50">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-red-900">危险操作</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-red-900">清除所有数据</p>
                <p className="text-sm text-red-600">删除所有仓库、盒子和物品数据</p>
              </div>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
              >
                清除数据
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}