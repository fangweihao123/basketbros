'use client';

import { useEffect, useRef, useState } from 'react';

interface PopunderAdProps {
  scrollThreshold?: number; // 滚动触发的阈值（像素）
  delayAfterScroll?: number; // 滚动后延迟触发时间（毫秒）
  maxTriggerCount?: number; // 最大触发次数
}

export default function PopunderAd({ 
  scrollThreshold = 500, 
  delayAfterScroll = 2000,
  maxTriggerCount = 1 
}: PopunderAdProps) {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 检查 localStorage 中的触发记录
    const storageKey = 'popunder-trigger-count';
    const storedCount = localStorage.getItem(storageKey);
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
    
    setTriggerCount(currentCount);

    // 如果已达到最大触发次数，不再执行
    if (currentCount >= maxTriggerCount) {
      return;
    }

    const handleScroll = () => {
      if (hasTriggered || triggerCount >= maxTriggerCount) return;

      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY >= scrollThreshold) {
        setHasTriggered(true);
        
        // 延迟触发广告
        timeoutRef.current = setTimeout(() => {
          loadPopunderScript();
          
          // 更新触发次数
          const newCount = triggerCount + 1;
          setTriggerCount(newCount);
          localStorage.setItem(storageKey, newCount.toString());
        }, delayAfterScroll);

        // 移除滚动监听器
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // 添加滚动监听器
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [hasTriggered, scrollThreshold, delayAfterScroll, triggerCount, maxTriggerCount]);

  const loadPopunderScript = () => {
    // 防止重复加载
    if (scriptRef.current) return;

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pl27594313.revenuecpmgate.com/d5/bf/e3/d5bfe3805a67b3f2907e853dba767a95.js';
      script.async = true;
      
      // 添加错误处理
      script.onerror = () => {
        console.warn('Popunder ad script failed to load');
      };

      script.onload = () => {
        console.log('Popunder ad script loaded successfully');
      };

      scriptRef.current = script;
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading popunder script:', error);
    }
  };

  // 组件不渲染任何可见内容
  return null;
}

// Hook 版本，用于更灵活的使用
export const usePopunderAd = ({ 
  scrollThreshold = 500, 
  delayAfterScroll = 2000,
  maxTriggerCount = 1 
}: PopunderAdProps = {}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    const storageKey = 'popunder-trigger-count';
    const storedCount = localStorage.getItem(storageKey);
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
    
    setTriggerCount(currentCount);

    if (currentCount >= maxTriggerCount) {
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let scriptElement: HTMLScriptElement | null = null;

    const handleScroll = () => {
      if (hasTriggered || triggerCount >= maxTriggerCount) return;

      const scrollY = window.scrollY || window.pageYOffset;
      console.log("scroll y", scrollY);
      if (scrollY >= scrollThreshold) {
        setHasTriggered(true);
        console.log("reach scroll threshold");
        timeoutId = setTimeout(() => {
          try {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//pl27594313.revenuecpmgate.com/d5/bf/e3/d5bfe3805a67b3f2907e853dba767a95.js';
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            
            scriptElement = script;
            document.head.appendChild(script);
            
            const newCount = triggerCount + 1;
            setTriggerCount(newCount);
            localStorage.setItem(storageKey, newCount.toString());
          } catch (error) {
            console.error('Error loading popunder script:', error);
          }
        }, delayAfterScroll);

        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
      if (scriptElement && document.head.contains(scriptElement)) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [hasTriggered, scrollThreshold, delayAfterScroll, triggerCount, maxTriggerCount]);

  return { hasTriggered, triggerCount };
};