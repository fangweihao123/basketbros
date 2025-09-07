'use client';

import { useEffect, useRef } from 'react';

export default function NativeBannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Load the native banner ad script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl27575746.revenuecpmgate.com/6a76cd946202d5c963aa64e34b939f07/invoke.js';
    
    // Store reference for cleanup
    scriptRef.current = script;
    
    // Add script to document head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-center bg-background">
      <div 
        id="container-6a76cd946202d5c963aa64e34b939f07" 
        ref={containerRef}
        className="native-banner-ad bg-background"
      />
    </div>
  );
}