import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const gameName = String(args._[0] || '').trim();
if (!gameName) {
  console.error('Usage: npm run init:game -- "Game Name" [--domain example.com] [--out output/game-name] [--force]');
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
    language: 'en',
    mode: 'auto',
    domain,
    canonical,
    stack: 'static-html',
    deploymentTarget: 'unspecified',
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
      ...(canonical ? [] : ['Resolve the production domain/canonical before deployment.']),
      'Run On-Page SEO, security, browser and final QA.',
    ],
  },
};

const brief = `# Open WebGame build brief\n\nGame keyword: **${gameName}**\n\nThis project was bootstrapped in Zero-Config Mode. The next agent must follow \`SKILL.md\` and treat \`open-webgame.json\` as the single source of truth.\n\n## Defaults\n\n- Language: English\n- Stack: static HTML\n- Research: automatic\n- Mode: play-first only when a real third-party runtime is verified; otherwise guide mode\n- On-Page SEO: mandatory\n- Content provenance: mandatory for factual claims\n- Iframe permissions: least privilege\n- Responsive browser QA: mandatory\n- Clarifying questions: avoid unless entity resolution or deployment is genuinely blocked\n\n## Required sequence\n\n1. Resolve the exact game and official sources.\n2. Add sources and source-backed claims to \`open-webgame.json\`.\n3. Verify browser playability and update \`embed\` + \`site.mode\`.\n4. Define search intent and update \`seo\` + \`pages\`.\n5. Derive visual DNA and update \`design\`.\n6. Generate the site with minimum iframe permissions.\n7. Run config, content, site, SEO, security and embed QA.\n8. Run Playwright browser QA at desktop/mobile widths.\n9. Set \`status.deploymentReady\` to true only after every hard gate passes.\n`;

fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
fs.writeFileSync(briefPath, brief, 'utf8');

console.log(`Created ${path.relative(process.cwd(), configPath)}`);
console.log(`Created ${path.relative(process.cwd(), briefPath)}`);
console.log('Next: give the game keyword/project folder to an agent that follows SKILL.md.');
