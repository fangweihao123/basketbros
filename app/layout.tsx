import { siteConfig } from '@/lib/config/site';
import './globals.css';

import type { ReactNode } from 'react';

// is required, even if it's just passing children through.
export default function RootLayout({ children }: { children: ReactNode }) {
    // 从配置中获取用户的自定义内容
  const customHeadContent = siteConfig.customHeadContent || ''
    + '<script type="text/javascript" src="//pl27594313.revenuecpmgate.com/d5/bf/e3/d5bfe3805a67b3f2907e853dba767a95.js"></script>';
  
  const bodyEndContent = '<script type="text/javascript" src="//pl27606083.revenuecpmgate.com/62/62/90/626290388c2c2d083c8170dcf17d73bf.js"></script>';

  return (
    <html lang="en">
      <head  dangerouslySetInnerHTML={{ __html: customHeadContent }}>
      </head>
      <body suppressHydrationWarning>
        {children}
        <div dangerouslySetInnerHTML={ {__html: bodyEndContent}}></div>  
      </body>
    </html>
  );
}
