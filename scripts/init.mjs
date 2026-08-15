import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const gameName = String(args._[0] || '').trim();
if (!gameName) {
  console.error('Usage: npm run init:game -- "Game Name" [--domain example.com] [--languages en,ja,ko] [--out output/game-name] [--force]');
  process.exit(1);
}

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'game-site';

const slug = slugify(gameName);
const outDir = path.resolve(process.cwd(), args.out || `output/${slug}`);
const configPath = path.join(outDir, 'open-webgame.json');
const briefPath = path.join(outDir, 'BUILD-BRIEF.md');

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(configPath) && !args.force) {
  console.error(`Refusing to overwrite ${path.relative(process.cwd(), configPath)}. Pass --force to replace it.`);
  process.exit(1);
}

const domain = String(args.domain || '').trim();
const canonical = domain ? `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/` : '';
const schemaUrl = 'https://raw.githubusercontent.com/foxigaoqian/open-webgame/main/schema/open-webgame.schema.json';
const requestedLanguages = String(args.languages || 'en')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const languages = [...new Set(requestedLanguages.length ? requestedLanguages : ['en'])];
const defaultLanguage = languages[0];
const languageLabels = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
};

const config = {
  $schema: schemaUrl,
  schemaVersion: '0.3',
  game: {
    name: gameName,
    developer: '',
    genre: '',
    officialUrl: '',
    platforms: [],
  },
  site: {
    language: defaultLanguage,
    mode: 'auto',
    domain,
    canonical,
    stack: 'static-html',
    deploymentTarget: 'unspecified',
  },
  i18n: {
    enabled: languages.length > 1,
    defaultLanguage,
    xDefaultLanguage: defaultLanguage,
    languages: languages.map((code, index) => ({
      code,
      label: languageLabels[code] || code,
      prefix: index === 0 ? '' : `/${code}`,
    })),
  },
  seo: {
    primaryIntent: 'mixed',
    primaryKeyword: gameName,
    secondaryIntents: [],
    canonicalPagePurpose: 'Resolve after game and search-intent research.',
  },
  embed: {
    status: 'pending',
    runtimeUrl: '',
    officialPage: '',
    host: '',
  },
  design: {
    direction: 'Derive from official screenshots and game UI after research.',
    palette: [],
    density: 'derive',
    notes: 'Do not reuse a previous game visual system.',
  },
  sources: [],
  claims: [],
  pages: [
    {
      path: '/',
      file: 'index.html',
      intent: 'Resolve after search-intent research.',
      canonical,
      title: '',
      indexable: true,
      language: defaultLanguage,
      translationKey: 'home',
    },
  ],
  security: {
    allowedIframePermissions: ['autoplay', 'fullscreen', 'gamepad'],
    requireNoopenerForBlankTargets: true,
    allowInlineScripts: true,
  },
  status: {
    research: 'pending',
    onPageSeo: 'pending',
    deploymentReady: false,
    blockingIssues: [
      'Resolve the real game entity and official sources.',
      'Record source-backed factual claims.',
      'Resolve browser/embed status.',
      ...(languages.length > 1 ? ['Generate and QA every configured language route, hreflang set and multilingual sitemap.'] : []),
      ...(canonical ? [] : ['Resolve the production domain/canonical before deployment.']),
      'Generate production site identity assets including favicon.ico and favicon-32x32.png.',
      'Run On-Page SEO, security, live HTTP, browser/axe, Lighthouse and final release QA.',
    ],
  },
};

const brief = `# Open WebGame build brief\n\nGame keyword: **${gameName}**\n\nThis project was bootstrapped in Zero-Config Mode. The next agent must follow \`SKILL.md\` and treat \`open-webgame.json\` as the single source of truth.\n\n## Defaults\n\n- Languages: ${languages.join(', ')}\n- Default language: ${defaultLanguage}\n- Stack: static HTML\n- Research: automatic\n- Mode: play-first only when a real third-party runtime is verified; otherwise guide mode\n- On-Page SEO: mandatory\n- Multilingual SEO: ${languages.length > 1 ? 'enabled; localize intent/metadata/content and generate hreflang + x-default + sitemap alternates' : 'disabled'}\n- Content provenance: mandatory for factual claims\n- Iframe permissions: least privilege\n- Site identity: generate a real \`favicon.ico\` plus a real 32x32 PNG favicon and declare both statically in every locale page\n- Responsive browser QA: mandatory\n- Accessibility + Lighthouse QA: mandatory before deployment-ready\n- Clarifying questions: avoid unless entity resolution or deployment is genuinely blocked\n\n## Required sequence\n\n1. Resolve the exact game and official sources.\n2. Add sources and source-backed claims to \`open-webgame.json\`.\n3. Verify browser playability and update \`embed\` + \`site.mode\`.\n4. Define search intent and update \`seo\` + \`pages\`.\n5. If multilingual, create language-specific page entries sharing translation keys, then localize metadata and content for each language's real search intent.\n6. Derive visual DNA and update \`design\`.\n7. Generate the site with minimum iframe permissions and real favicon assets.\n8. Run config, content, site, i18n, SEO, security, HTTP and embed QA.\n9. Run Playwright browser/axe QA at desktop/tablet/mobile widths; favicon declarations and bytes must pass.\n10. Run Lighthouse shell QA.\n11. Run \`npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site\` for the final readiness decision.\n12. Set \`status.deploymentReady\` to true only after every hard gate passes.\n`;

fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
fs.writeFileSync(briefPath, brief, 'utf8');

console.log(`Created ${path.relative(process.cwd(), configPath)}`);
console.log(`Created ${path.relative(process.cwd(), briefPath)}`);
console.log('Next: give the game keyword/project folder to an agent that follows SKILL.md.');
