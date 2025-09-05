'use client';

import { JSX, useEffect, useRef } from 'react';

export default function BannerAd() : JSX.Element {
  const banner = useRef<HTMLDivElement>(null)

  const atOptions = {
    'key': 'faba8c51cc3e38ae5e238375752aec55',
    'format': 'iframe',
    'height': 250,
    'width': 300,
    'params': {}
  };

  useEffect(() => {
    if(banner.current && !banner.current.firstChild){
      const conf = document.createElement('script')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      if (banner.current) {
          banner.current.append(conf)
          banner.current.append(script)
      }
      console.log("banner" , banner)
    }
  }, [banner]);

  return <div ref={banner}></div>;
}