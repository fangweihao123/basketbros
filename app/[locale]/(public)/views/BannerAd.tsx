'use client';

import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    atOptions: any;
  }
}

export default function BannerAd() {
  const [adWidth, setAdWidth] = useState(300);
  const [adHeight, setAdHeight] = useState(250);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      setAdWidth(window.innerWidth >= 768 ? 300 : 150);
      setAdHeight(window.innerWidth >= 768 ? 250 : 125);
    };
    updateWidth();

    // 延迟加载广告，确保DOM准备就绪
    const loadAd = () => {
      // Set up ad configuration before loading script
      window.atOptions = {
        'key': 'faba8c51cc3e38ae5e238375752aec55',
        'format': 'iframe',
        'height': window.innerWidth >= 768 ? 250 : 125,
        'width': window.innerWidth >= 768 ? 300 : 150,
        'params': {}
      };

      // Load the ad script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//www.highperformanceformat.com/faba8c51cc3e38ae5e238375752aec55/invoke.js';
      
      // 添加错误处理
      script.onerror = () => {
        console.warn('Banner ad script failed to load');
      };

      script.onload = () => {
        console.log('Banner ad script loaded successfully');
      };
      
      // Store reference for cleanup
      scriptRef.current = script;
      
      // 直接添加到容器中而不是head
      if (containerRef.current) {
        containerRef.current.appendChild(script);
      } else {
        document.head.appendChild(script);
      }
    };

    // 延迟执行以确保DOM完全加载
    const timeoutId = setTimeout(loadAd, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (scriptRef.current) {
        const parent = scriptRef.current.parentNode;
        if (parent && parent.contains(scriptRef.current)) {
          parent.removeChild(scriptRef.current);
        }
      }
    };
  }, []);

  return (
    <div className="flex justify-center my-4 bg-background">
      <div 
        ref={containerRef}
        style={{ 
          width: `${adWidth}px`, 
          height: `${adHeight}px`,
          minHeight: `${adHeight}px`,
          display: 'block'
        }}
        className="banner-ad-container bg-background"
      />
    </div>
  );
}