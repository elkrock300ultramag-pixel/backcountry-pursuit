const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const OUTPUT_DIR = path.join(ROOT, 'articles');

const CATEGORY_PAGES = [
  { category: 'Hunting', file: 'hunting.html', key: 'HUNTING', heading: 'Latest Hunting Articles' },
  { category: 'Fishing', file: 'fishing.html', key: 'FISHING', heading: 'Latest Fishing Articles' },
  { category: 'Camping', file: 'camping.html', key: 'CAMPING', heading: 'Latest Camping Articles' },
  { category: 'Survival', file: 'survival.html', key: 'SURVIVAL', heading: 'Latest Survival Articles' },
  { category: 'Gear', file: 'gear.html', key: 'GEAR', heading: 'Latest Gear Articles' },
  { category: 'Family Outdoors', file: 'guides.html', key: 'FAMILY-OUTDOORS', heading: 'Latest Family Outdoors Articles' }
];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function unquote(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return v;
}

function parseFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) throw new Error('Missing YAML frontmatter (file must start with ---)');
  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) throw new Error('Unclosed YAML frontmatter');
  const yaml = normalized.slice(4, end);
  const body = normalized.slice(end + 5).trim();
  const data = {};
  const lines = yaml.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (raw === '|' || raw === '>') {
      const chunks = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) chunks.push(lines[++i].trim());
      data[key] = raw === '|' ? chunks.join('\n') : chunks.join(' ');
    } else data[key] = unquote(raw);
  }
  return { data, body };
}

function slugFromFilename(file) { return path.basename(file, path.extname(file)); }

function categoryLink(category) {
  const map = { Hunting: 'hunting.html', Fishing: 'fishing.html', Camping: 'camping.html', Survival: 'survival.html', Gear: 'gear.html', 'Family Outdoors': 'guides.html' };
  return map[category] || 'guides.html';
}

function normalizedImagePath(image, fromArticle = false) {
  if (!image) return '';
  const src = image.trim();
  if (/^https?:\/\//i.test(src)) return src;
  if (!fromArticle) return src;
  if (src.startsWith('/')) return `..${src}`;
  if (!src.startsWith('../')) return `../${src}`;
  return src;
}

function imageMarkup(image, title) {
  if (!image) return '';
  return `<div class="container"><img class="guide-photo" src="${escapeHtml(normalizedImagePath(image, true))}" alt="${escapeHtml(title)}"></div>`;
}

function renderArticle(meta, body, slug) {
  const title = meta.title || slug.replace(/-/g, ' ');
  const category = meta.category || 'Guides';
  const description = meta.description || '';
  const catHref = categoryLink(category);
  const image = imageMarkup(meta.image, title);
  const year = new Date().getUTCFullYear();
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="${escapeHtml(description)}"><title>${escapeHtml(title)} | Backcountry Pursuit</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="../styles.css"></head><body>
<header class="site-header"><div class="container nav-wrap"><a class="brand" href="../index.html"><span class="brand-mark">BP</span><span><strong>BACKCOUNTRY</strong><small>PURSUIT</small></span></a><button class="menu-toggle" aria-label="Open menu">☰</button><nav class="main-nav"><a href="../hunting.html">Hunting</a><a href="../fishing.html">Fishing</a><a href="../camping.html">Camping</a><a href="../gear.html">Gear Reviews</a><a href="../survival.html">Survival</a><a href="../about.html">About</a><a href="../guides.html">Field Guides</a></nav></div></header>
<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="../index.html">Home</a> / <a href="../${catHref}">${escapeHtml(category)}</a> / ${escapeHtml(title)}</div><p class="eyebrow">${escapeHtml(category.toUpperCase())}</p><h1>${escapeHtml(title)}</h1><p class="article-hero-note">${escapeHtml(description)}</p></div></section>
${image}
<section class="section"><div class="container prose"><div class="article-meta">Backcountry Pursuit • ${escapeHtml(category)}</div>${body}</div></section>
<footer class="site-footer"><div class="container"><div class="footer-v6"><div><a class="brand" href="../index.html"><span class="brand-mark">BP</span><span><strong>BACKCOUNTRY</strong><small>PURSUIT</small></span></a><p>Western hunting, fishing, camping, survival, family outdoor stories, and gear guidance built around real days outside.</p></div><div class="footer-links"><h4>Explore</h4><a href="../hunting.html">Hunting</a><a href="../fishing.html">Fishing</a><a href="../camping.html">Camping</a><a href="../survival.html">Survival</a><a href="../gear.html">Gear Reviews</a></div><div class="footer-links"><h4>Backcountry Pursuit</h4><a href="../about.html">About</a><a href="../guides.html">Field Guides</a><a href="../contact.html">Contact</a><a href="../privacy.html">Privacy</a><p class="affiliate-note">Some links may be affiliate links. We may earn a commission at no additional cost to you.</p></div></div><div class="footer-bottom">© ${year} Backcountry Pursuit. Built for the next ridge.</div></div></footer><script src="../app.js"></script></body></html>\n`;
}

function categorySection(config) {
  return `<!-- CMS-${config.key}-START -->\n<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Latest From the Field</p><h2>${config.heading}</h2></div></div><div class="latest-grid">\n<!-- CMS-${config.key}-ARTICLES -->\n</div></div></section>\n<!-- CMS-${config.key}-END -->\n`;
}

function renderCategoryCard(article, config) {
  const title = article.data.title || article.slug.replace(/-/g, ' ');
  const description = article.data.description || '';
  const src = normalizedImagePath(article.data.image, false);
  const media = src ? `<div class="story-thumb"><img loading="lazy" src="${escapeHtml(src)}" alt="${escapeHtml(title)}" style="width:100%;height:100%;object-fit:cover;display:block"></div>` : `<div class="story-thumb">${escapeHtml(config.category)}</div>`;
  return `<article class="story-card">${media}<div class="story-body"><span class="tag">${escapeHtml(config.category.toUpperCase())}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><a class="text-link" href="articles/${article.slug}.html">Read article →</a></div></article>`;
}

function updateCategoryPage(config, articles) {
  const pagePath = path.join(ROOT, config.file);
  if (!fs.existsSync(pagePath)) return;
  let html = fs.readFileSync(pagePath, 'utf8');
  const marker = `<!-- CMS-${config.key}-ARTICLES -->`;
  const endMarker = `<!-- CMS-${config.key}-END -->`;
  if (!html.includes(marker)) {
    const footerIndex = html.indexOf('<footer class="site-footer">');
    if (footerIndex === -1) throw new Error(`${config.file}: footer marker not found`);
    html = `${html.slice(0, footerIndex)}${categorySection(config)}${html.slice(footerIndex)}`;
  }
  const cardHtml = articles.filter(a => a.data.category === config.category).map(a => renderCategoryCard(a, config)).join('\n');
  const markerIndex = html.indexOf(marker);
  const endIndex = html.indexOf(endMarker, markerIndex);
  if (markerIndex === -1 || endIndex === -1) throw new Error(`${config.file}: CMS marker block is incomplete`);
  const cardsStart = markerIndex + marker.length;
  const beforeEnd = html.slice(cardsStart, endIndex);
  const closingMatch = beforeEnd.match(/<\/div>\s*<\/div>\s*<\/section>\s*$/);
  if (!closingMatch) throw new Error(`${config.file}: CMS section closing tags not found`);
  const closingStart = cardsStart + beforeEnd.length - closingMatch[0].length;
  html = `${html.slice(0, cardsStart)}\n${cardHtml}\n${html.slice(closingStart)}`;
  fs.writeFileSync(pagePath, html);
  console.log(`Updated ${config.file}.`);
}

fs.mkdirSync(CONTENT_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.(md|html)$/i.test(f)).sort();
const articles = [];
let built = 0;
for (const file of files) {
  const source = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const { data, body } = parseFrontmatter(source);
  if (!data.title) throw new Error(`${file}: title is required`);
  if (!data.category) throw new Error(`${file}: category is required`);
  const slug = slugFromFilename(file);
  fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), renderArticle(data, body, slug));
  articles.push({ slug, data });
  built++;
  console.log(`Built articles/${slug}.html`);
}
for (const config of CATEGORY_PAGES) updateCategoryPage(config, articles);
console.log(`Done. Built ${built} article(s).`);
