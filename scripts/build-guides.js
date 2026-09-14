const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'content', 'guides');

function unquote(v='') { v=v.trim(); if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) { try { return JSON.parse(v); } catch {} return v.slice(1,-1); } return v; }
function parse(text) {
  text=text.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
  const end=text.indexOf('\n---\n',4); if(!text.startsWith('---\n')||end<0) throw new Error('Invalid frontmatter');
  const data={}; const lines=text.slice(4,end).split('\n');
  for(let i=0;i<lines.length;i++){ const m=lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/); if(!m)continue; let raw=m[2];
    if((raw.startsWith('"')&&!raw.endsWith('"'))||(raw.startsWith("'")&&!raw.endsWith("'"))){ const q=raw[0], chunks=[raw]; while(i+1<lines.length&&/^\s+/.test(lines[i+1])){chunks.push(lines[++i].trim());if(chunks.at(-1).endsWith(q))break;} raw=chunks.join(' '); }
    data[m[1]]=unquote(raw);
  }
  return {data,body:text.slice(end+5).trim()};
}
function esc(s=''){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
function normalizeLegacyAssets(s='') {
  return String(s)
    .replace(/(?:\.\.\/)?assets\/images\//g, '')
    .replace(/\/assets\/images\//g, '');
}
function imageSrc(s=''){ return normalizeLegacyAssets(s); }
function render(meta,body){
 const title=meta.title||'Field Guide', cat=meta.category||'Field Guides', desc=meta.description||'', img=imageSrc(meta.image);
 body=normalizeLegacyAssets(body);
 const cover=img?`<div class="article-cover"><img src="${esc(img)}" alt="${esc(title)}"></div>`:'';
 return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="description" content="${esc(desc)}"><title>${esc(title)} | Backcountry Pursuit</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="article.css"></head><body class="article-page"><header class="site-header"><div class="container nav-wrap"><a class="brand" href="index.html"><span class="brand-mark">BP</span><span><strong>BACKCOUNTRY</strong><small>PURSUIT</small></span></a><button class="menu-toggle" aria-label="Open menu">☰</button><nav class="main-nav"><a href="hunting.html">Hunting</a><a href="fishing.html">Fishing</a><a href="camping.html">Camping</a><a href="gear.html">Gear Reviews</a><a href="survival.html">Survival</a><a href="about.html">About</a><a href="guides.html">Field Guides</a></nav></div></header><section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="index.html">Home</a> / ${esc(cat)} / ${esc(title)}</div><p class="eyebrow">${esc(cat.toUpperCase())} FIELD GUIDE</p><h1>${esc(title)}</h1><p class="article-hero-note">${esc(desc)}</p></div></section>${cover}<section class="section article-section"><div class="container prose">${body}</div></section><footer class="site-footer"><div class="container"><div class="footer-v6"><div><a class="brand" href="index.html"><span class="brand-mark">BP</span><span><strong>BACKCOUNTRY</strong><small>PURSUIT</small></span></a><p>Western hunting, fishing, camping, survival, family outdoor stories, and gear guidance built around real days outside.</p></div><div class="footer-links"><h4>Explore</h4><a href="hunting.html">Hunting</a><a href="fishing.html">Fishing</a><a href="camping.html">Camping</a><a href="survival.html">Survival</a><a href="gear.html">Gear Reviews</a></div><div class="footer-links"><h4>Backcountry Pursuit</h4><a href="about.html">About</a><a href="guides.html">Field Guides</a><a href="contact.html">Contact</a><a href="privacy.html">Privacy</a></div></div><div class="footer-bottom">© ${new Date().getUTCFullYear()} Backcountry Pursuit. Built for the next ridge.</div></div></footer><script src="app.js"></script></body></html>\n`;
}
if(fs.existsSync(DIR)) for(const file of fs.readdirSync(DIR).filter(f=>f.endsWith('.md'))){ const {data,body}=parse(fs.readFileSync(path.join(DIR,file),'utf8')); const out=data.legacy_path||`${path.basename(file,'.md')}.html`; fs.writeFileSync(path.join(ROOT,out),render(data,body)); console.log(`Built ${out}`); }
