'use client';

import { useEffect, useState  } from 'react';

export default function BannerAd() {
  const [adWidth, setAdWidth] = useState(300);
  const [adHeight, setAdHeight] = useState(250);

  useEffect(() => {
      const updateWidth = () => {
          setAdWidth(window.innerWidth >= 768 ? 300 : 150);
          setAdHeight(window.innerWidth >= 768 ? 250 : 125);
      };
      updateWidth()
  }, []);

  return (
      <div className="flex justify-center">
          <iframe
              src={`/adsterra_${adWidth}.html`}
              width={`${adWidth}px`}
              height={`${adHeight}px`}
              scrolling="no"
          />
      </div>
    );
}