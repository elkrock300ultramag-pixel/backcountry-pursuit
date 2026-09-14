const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
function parseSimpleYaml(file){
  const out={};
  for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/)){
    const m=line.match(/^([A-Za-z0-9_]+):\s*(.*)$/); if(!m) continue;
    let v=m[2].trim();
    if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1).replace(/\\"/g,'"');
    out[m[1]]=v;
  }
  return out;
}
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const img=s=>esc((s||'').replace(/^\.\//,''));
function shell(file,key,body){
  const p=path.join(ROOT,file); let html=fs.readFileSync(p,'utf8');
  const headerEnd=html.indexOf('</header>');
  const cmsStart=html.indexOf(`<!-- CMS-${key}-START -->`);
  if(headerEnd<0||cmsStart<0) throw new Error(`${file}: expected header/CMS markers not found`);
  html=html.slice(0,headerEnd+9)+'\n'+body+'\n'+html.slice(cmsStart);
  fs.writeFileSync(p,html); console.log(`Built ${file}`);
}
function buildHunting(){
  const d=parseSimpleYaml(path.join(ROOT,'content/pages/hunting.yml'));
  const body=`<section class="photo-banner hunting-photo-banner"><div class="container"><p class="eyebrow">${esc(d.hero_eyebrow)}</p><h1>${d.hero_title||''}</h1><p>${esc(d.hero_text)}</p></div></section>
<section class="section section-dark"><div class="container"><div class="elk-hub-grid"><div class="elk-panel"><p class="eyebrow">${esc(d.hub_eyebrow)}</p><h3>${esc(d.hub_title)}</h3><p>${esc(d.hub_text)}</p><div class="topic-links"><a href="${esc(d.hub_link1_url)}">${esc(d.hub_link1_label)}</a><a href="${esc(d.hub_link2_url)}">${esc(d.hub_link2_label)}</a><a href="${esc(d.hub_link3_url)}">${esc(d.hub_link3_label)}</a><a href="${esc(d.hub_link4_url)}">${esc(d.hub_link4_label)}</a></div></div><div class="elk-panel"><p class="eyebrow">${esc(d.pack_eyebrow)}</p><h3>${esc(d.pack_title)}</h3><p>${esc(d.pack_text)}</p><a class="btn btn-small" href="${esc(d.pack_button_url)}">${esc(d.pack_button_label)}</a></div></div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.field_eyebrow)}</p><h2>${esc(d.field_title)}</h2></div></div><div class="latest-grid">
${[1,2,3].map(i=>`<article class="story-card"><div class="story-thumb">${esc(d[`field${i}_thumb`])}</div><div class="story-body"><span class="tag">${esc(d[`field${i}_tag`])}</span><h3>${esc(d[`field${i}_title`])}</h3><p>${esc(d[`field${i}_text`])}</p><a class="text-link" href="${esc(d[`field${i}_link_url`])}">${esc(d[`field${i}_link_label`])}</a></div></article>`).join('\n')}
</div></div></section>
<section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.gallery_eyebrow)}</p><h2>${esc(d.gallery_title)}</h2></div></div><div class="mini-gallery">${[1,2,3,4].map(i=>`<figure><img loading="lazy" src="${img(d[`gallery${i}_image`])}" alt="${esc(d[`gallery${i}_caption`])}"><figcaption>${esc(d[`gallery${i}_caption`])}</figcaption></figure>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.after_eyebrow)}</p><h2>${esc(d.after_title)}</h2></div></div><div class="article-index">${[1,2].map(i=>`<article><span class="tag">${esc(d[`after${i}_tag`])}</span><h3>${esc(d[`after${i}_title`])}</h3><p>${esc(d[`after${i}_text`])}</p><a class="text-link" href="${esc(d[`after${i}_link_url`])}">${esc(d[`after${i}_link_label`])}</a></article>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.biggame_eyebrow)}</p><h2>${esc(d.biggame_title)}</h2></div></div><div class="article-feature-grid">${[1,2,3].map(i=>`<article class="article-feature"><img loading="lazy" src="${img(d[`big${i}_image`])}" alt="${esc(d[`big${i}_title`])}"><div class="story-body"><span class="tag">${esc(d[`big${i}_tag`])}</span><h3>${esc(d[`big${i}_title`])}</h3><p>${esc(d[`big${i}_text`])}</p><a class="text-link" href="${esc(d[`big${i}_link_url`])}">${esc(d[`big${i}_link_label`])}</a></div></article>`).join('')}</div></div></section>`;
  shell('hunting.html','HUNTING',body);
}
function buildFishing(){
  const d=parseSimpleYaml(path.join(ROOT,'content/pages/fishing.yml'));
  const body=`<section class="photo-banner fishing-photo-banner"><div class="container"><p class="eyebrow">${esc(d.hero_eyebrow)}</p><h1>${d.hero_title||''}</h1><p>${esc(d.hero_text)}</p></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.section_eyebrow)}</p><h2>${esc(d.section_title)}</h2></div></div><div class="photo-story-grid">${[1,2,3].map(i=>`<article class="photo-story"><img loading="lazy" src="${img(d[`card${i}_image`])}" alt="${esc(d[`card${i}_title`])}"><div class="story-body"><span class="tag">${esc(d[`card${i}_tag`])}</span><h3>${esc(d[`card${i}_title`])}</h3><p>${esc(d[`card${i}_text`])}</p>${d[`card${i}_link_url`]?`<a class="text-link" href="${esc(d[`card${i}_link_url`])}">${esc(d[`card${i}_link_label`])}</a>`:''}</div></article>`).join('')}</div></div></section>
<section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.gallery_eyebrow)}</p><h2>${esc(d.gallery_title)}</h2></div></div><div class="mini-gallery">${[1,2,3,4].map(i=>`<figure><img loading="lazy" src="${img(d[`gallery${i}_image`])}" alt="${esc(d[`gallery${i}_caption`])}"><figcaption>${esc(d[`gallery${i}_caption`])}</figcaption></figure>`).join('')}</div></div></section>
<section class="section"><div class="container content-grid"><div class="article-list">${[1,2,3].map(i=>`<article class="article-card"><span class="tag">${esc(d[`article${i}_tag`])}</span><h2>${esc(d[`article${i}_title`])}</h2><p>${esc(d[`article${i}_text`])}</p>${d[`article${i}_link_url`]?`<a class="text-link" href="${esc(d[`article${i}_link_url`])}">${esc(d[`article${i}_link_label`])}</a>`:''}</article>`).join('')}</div><aside><div class="sidebar-box"><h3>${esc(d.sidebar1_title)}</h3><p>${esc(d.sidebar1_text)}</p></div><div class="sidebar-box"><h3>${esc(d.sidebar2_title)}</h3><p>${esc(d.sidebar2_text)}</p></div></aside></div></section>`;
  shell('fishing.html','FISHING',body);
}
buildHunting(); buildFishing();
