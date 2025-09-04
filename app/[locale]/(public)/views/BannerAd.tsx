'use client';

import { useEffect } from 'react';

export default function BannerAd() {
  useEffect(() => {
    // 设置广告配置
    (window as any).atOptions = {
      'key': 'faba8c51cc3e38ae5e238375752aec55',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    // 动态加载广告脚本
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/faba8c51cc3e38ae5e238375752aec55/invoke.js';
    script.async = true;
    
    const adContainer = document.getElementById('banner-ad-top');
    if (adContainer) {
      adContainer.appendChild(script);
    }

    return () => {
      // 清理脚本
      if (adContainer && script) {
        try {
          adContainer.removeChild(script);
        } catch (e) {
          // 脚本可能已经被移除
        }
      }
    };
  }, []);

  return (
    <div className="flex justify-center py-4 bg-gray-50 dark:bg-gray-900">
      <div
        id="banner-ad-top"
        style={{ width: '300px', height: '250px' }}
      />
    </div>
  );
}