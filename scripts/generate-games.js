const fs = require('fs').promises;
const path = require('path');

function toPascalCase(input) {
  // Prefer namespace when available; otherwise, use title
  const base = (input || '').toString();
  return base
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const cwd = process.cwd();
  const gamesJsonPath = path.join(cwd, 'resources', 'games.json');
  const templatePagePath = path.join(cwd, 'lib', 'components', 'games-template', 'page.tsx');
  const templateConfigPath = path.join(cwd, 'lib', 'components', 'games-template', 'config', 'config.json');
  const outGamesRoot = path.join(cwd, 'app', '[locale]', '(public)', 'games');
  const outMessagesRoot = path.join(cwd, 'messages', 'en', 'games');
  const messagesMapPath = path.join(cwd, 'lib', 'config', 'game-page-messages.json');

  const gamesFeed = JSON.parse(await fs.readFile(gamesJsonPath, 'utf8'));
  const items = Array.isArray(gamesFeed.items) ? gamesFeed.items : [];
  if (items.length === 0) {
    console.log('No games found in resources/games.json');
    return;
  }

  const templateConfig = JSON.parse(await fs.readFile(templateConfigPath, 'utf8'));
  const templatePage = await fs.readFile(templatePagePath, 'utf8');

  await ensureDir(outGamesRoot);
  await ensureDir(outMessagesRoot);

  // load or init game-page-messages map
  let messagesMap = { en: [] };
  if (await fileExists(messagesMapPath)) {
    try {
      messagesMap = JSON.parse(await fs.readFile(messagesMapPath, 'utf8')) || { en: [] };
    } catch {
      // keep default
    }
  }
  if (!Array.isArray(messagesMap.en)) messagesMap.en = [];

  for (const item of items) {
    const pageName = toPascalCase(item.namespace || item.title || 'Game');
    const pagePath = `/games/${pageName}`;
    const gameDir = path.join(outGamesRoot, pageName);
    const configDir = path.join(gameDir, 'config');
    const featuresDir = path.join(configDir, 'features');
    const faqsDir = path.join(configDir, 'faqs');
    const enFaqDir = path.join(faqsDir, 'en.json');

    await ensureDir(configDir);
    await ensureDir(featuresDir);
    await ensureDir(faqsDir);

    // page.tsx
    const pageFile = path.join(gameDir, 'page.tsx');
    if (!(await fileExists(pageFile))) {
      await fs.writeFile(pageFile, templatePage, 'utf8');
    }

    // config/config.json
    const cfg = JSON.parse(JSON.stringify(templateConfig));
    cfg.name = item.title || pageName;
    cfg.pagePath = pagePath;
    cfg.pageName = pageName;
    cfg.gameType = 'iframe';
    cfg.gameIframeUrl = item.url || '';
    cfg.gameRedirectUrl = '';
    cfg.bgType = 'image';
    cfg.bgImage = item.banner_image || item.image || '';
    cfg.screenshotUrl = item.banner_image || item.image || '';
    cfg.isShowTweets = false;
    cfg.useRealTweets = false;
    // Comments: provide a small default set referencing the game title
    cfg.comments = [
      {
        author: 'Alex Carter',
        role: 'Gamer',
        content: `${item.title} is fun and runs smoothly in my browser!`,
        avatar: 'https://api.multiavatar.com/Alex%20Carter.png',
      },
      {
        author: 'Maya Singh',
        role: 'Casual Player',
        content: `Quick matches and simple controls make ${item.title} easy to pick up.`,
        avatar: 'https://api.multiavatar.com/Maya%20Singh.png',
      },
    ];
    await fs.writeFile(path.join(configDir, 'config.json'), JSON.stringify(cfg, null, 2), 'utf8');

    // features/en.mdx
    const mdx = `# ${item.title} — Play Online\n\n## About ${item.title}\n\n${item.description || 'Enjoy this basketball title right in your browser with responsive controls and quick matches.'}\n\n## How to Play\n\n1. Use arrow keys or WASD to move and Space to jump\n2. Time your shots or dunks to score efficiently\n3. Try fullscreen for an immersive experience\n\n## Key Features\n\n- Fast, fluid gameplay with responsive controls\n- Clean visuals and readable court action\n- Play instantly in your browser\n`;
    await fs.writeFile(path.join(featuresDir, 'en.mdx'), mdx, 'utf8');

    // faqs/en.json
    const faqs = [
      { question: `What is ${item.title}?`, answer: `${item.title} is an online basketball game you can play for free in your browser.` },
      { question: 'How do I control the game?', answer: 'Use Arrow keys or WASD to move and Space to jump. Some games may show extra actions on screen.' },
      { question: 'Can I play in fullscreen?', answer: 'Yes. Use the Fullscreen button below the game area. Press Esc to exit.' },
      { question: 'Does it work on mobile?', answer: 'Most titles work on modern mobile browsers. Rotate to landscape and enable fullscreen for the best view.' },
    ];
    await fs.writeFile(path.join(faqsDir, 'en.json'), JSON.stringify(faqs, null, 2), 'utf8');

    // messages/en/games/<PageName>.json
    const messagesPath = path.join(outMessagesRoot, `${pageName}.json`);
    if (!(await fileExists(messagesPath))) {
      const seoTitle = `${item.title} - Play Online Free`;
      const seoDesc = (item.description || `${item.title} — Play free in your browser. Enjoy fluid controls, quick matches, and clean visuals.`).trim();
      const messages = {
        [pageName]: {
          title: seoTitle,
          slogan: `Play ${item.title} Online`,
          description: seoDesc,
          Loading: { title: `Loading ${item.title}...` },
          Navbar: { title: 'Nav' },
          Common: {
            createAt: 'Create At', guide: 'Guide', privacyPolicy: 'Privacy Policy', termsOfServices: 'Terms of Services', text: 'Content', help: 'Help', friendlyLinks: 'Friendly Links', articleList: 'Article List', home: 'Home', next: 'Next', previous: 'Previous'
          },
          HomeIframe: {
            title: `Play ${item.title} Online`,
            description: seoDesc,
            iframeTitle: `${item.title} Game`,
            fullscreenButton: 'Fullscreen',
            shareButton: 'Share',
            urlCopied: 'URL copied to clipboard!',
            downloadGame: 'Download Game',
            playGame: `Play ${item.title}`
          },
          HomeFeatures: {
            gameTitle: item.title,
            whatIsTitle: `What is ${item.title}?`,
            whatIsDescription: seoDesc,
            howToPlayTitle: 'How to Play',
            howToPlayStep1: 'Use Arrow/WASD to move',
            howToPlayStep2: 'Press Space to jump',
            howToPlayStep3: 'Time shots and dunks to score',
            keyFeaturesTitle: 'Key Features',
            feature1Title: 'Fast, Fluid Gameplay',
            feature1Description: 'Tight controls keep every possession exciting',
            feature2Title: 'Clean Visuals',
            feature2Description: 'Smooth animations and readable court action',
            feature3Title: 'Instant Play',
            feature3Description: 'Runs in the browser — no installs',
            feature4Title: 'Fullscreen Support',
            feature4Description: 'Toggle fullscreen for immersion'
          },
          HomeFAQs: { title: 'FAQs' },
          HomeRelatedVideo: { title: 'Game Video' },
          HomeRecommendation: { title: 'Recommends' },
          HomeComments: { title: 'Play Comments' }
        }
      };
      await ensureDir(outMessagesRoot);
      await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), 'utf8');
    }

    // update game-page-messages map
    const rel = `/games/${pageName}.json`;
    if (!messagesMap.en.includes(rel)) {
      messagesMap.en.push(rel);
    }
  }

  await fs.writeFile(messagesMapPath, JSON.stringify(messagesMap, null, 2), 'utf8');
  console.log('Game pages generation completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

