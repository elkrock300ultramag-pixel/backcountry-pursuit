const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
function parseSimpleYaml(file){const out={};for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/)){const m=line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);if(!m)continue;let v=m[2].trim();if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1).replace(/\\"/g,'"');out[m[1]]=v;}return out;}
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const img=s=>esc((s||'').replace(/^\.\//,'').replace(/^\//,''));
const d=parseSimpleYaml(path.join(ROOT,'content/pages/home.yml'));
const p=path.join(ROOT,'index.html');
const html=fs.readFileSync(p,'utf8');
const headerEnd=html.indexOf('</header>');
const cmsStart=html.indexOf('<!-- CMS-HOME-FEATURED-START -->');
const cmsEndMarker='<!-- CMS-HOME-FEATURED-END -->';
const cmsEnd=html.indexOf(cmsEndMarker,cmsStart);
const footerStart=html.indexOf('<footer class="site-footer">');
if(headerEnd<0||cmsStart<0||cmsEnd<0||footerStart<0)throw new Error('index.html expected header, CMS featured markers, and footer');
const cmsBlock=html.slice(cmsStart,cmsEnd+cmsEndMarker.length);
const header=html.slice(0,headerEnd+9);
const footer=html.slice(footerStart);
const gearCards=[1,2,3].map(i=>`<article class="gear-card"><div class="gear-icon">${esc(d[`gear${i}_icon`])}</div><span class="tag">${esc(d[`gear${i}_tag`])}</span><h3>${esc(d[`gear${i}_title`])}</h3><p>${esc(d[`gear${i}_text`])}</p><div class="rating">${esc(d[`gear${i}_rating`])} <span>${esc(d[`gear${i}_rating_text`])}</span></div><a class="btn btn-small" href="${esc(d[`gear${i}_url`])}">${esc(d[`gear${i}_button`])}</a></article>`).join('');
const categories=[1,2,3,4].map(i=>`<a class="category-card" href="${esc(d[`category${i}_url`])}"><span>${esc(d[`category${i}_number`])}</span><h3>${esc(d[`category${i}_title`])}</h3><p>${esc(d[`category${i}_text`])}</p></a>`).join('');
const latest=[1,2,3].map(i=>`<article class="story-card"><div class="story-thumb">${esc(d[`latest${i}_thumb`])}</div><div class="story-body"><span class="tag">${esc(d[`latest${i}_tag`])}</span><h3>${esc(d[`latest${i}_title`])}</h3><p>${esc(d[`latest${i}_text`])}</p><a class="text-link" href="${esc(d[`latest${i}_url`])}">${esc(d[`latest${i}_link`])}</a></div></article>`).join('');
const startCards=[1,2,3].map(i=>`<article class="article-feature"><img loading="lazy" src="${img(d[`start${i}_image`])}" alt="${esc(d[`start${i}_title`])}"><div class="story-body"><span class="tag">${esc(d[`start${i}_tag`])}</span><h3>${esc(d[`start${i}_title`])}</h3><p>${esc(d[`start${i}_text`])}</p><a class="text-link" href="${esc(d[`start${i}_url`])}">${esc(d[`start${i}_link`])}</a></div></article>`).join('');
const gallery=[1,2,3,4,5].map(i=>`<figure><img loading="lazy" src="${img(d[`gallery${i}_image`])}" alt="${esc(d[`gallery${i}_caption`])}"><figcaption>${esc(d[`gallery${i}_caption`])}</figcaption></figure>`).join('');
const main=`<main>
<section class="hero hero-photo"><div class="hero-overlay"></div><div class="container hero-content"><p class="eyebrow">${esc(d.hero_eyebrow)}</p><h1>${d.hero_title||''}</h1><p class="hero-copy">${esc(d.hero_text)}</p><div class="hero-actions"><a class="btn btn-primary" href="${esc(d.hero_button1_url)}">${esc(d.hero_button1_label)}</a><a class="btn btn-ghost" href="${esc(d.hero_button2_url)}">${esc(d.hero_button2_label)}</a></div></div></section>
<section class="editorial-band"><div class="container"><strong>${esc(d.editorial_title)}</strong><span>${esc(d.editorial_text)}</span></div></section>
<section class="section intro-strip"><div class="container stats-grid"><div><strong>${esc(d.stat1_title)}</strong><span>${esc(d.stat1_text)}</span></div><div><strong>${esc(d.stat2_title)}</strong><span>${esc(d.stat2_text)}</span></div><div><strong>${esc(d.stat3_title)}</strong><span>${esc(d.stat3_text)}</span></div></div></section>
${cmsBlock}
<section class="section"><div class="container"><div class="featured-story"><div class="featured-story-image" style="background-image:url('${img(d.fieldcraft_image)}')"></div><div class="featured-story-copy"><p class="eyebrow">${esc(d.fieldcraft_eyebrow)}</p><h2>${esc(d.fieldcraft_title)}</h2><p>${esc(d.fieldcraft_text)}</p><a class="btn btn-small" href="${esc(d.fieldcraft_url)}">${esc(d.fieldcraft_button)}</a></div></div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.guides_eyebrow)}</p><h2>${esc(d.guides_title)}</h2></div><a class="text-link" href="${esc(d.guides_link_url||'guides.html')}">${esc(d.guides_link_label||'Browse all field guides →')}</a></div><div class="v7-feature-grid"><a class="v7-feature-card" href="${esc(d.guide1_url)}" style="background-image:url('${img(d.guide1_image)}')"><div><span class="tag">${esc(d.guide1_tag)}</span><h3>${esc(d.guide1_title)}</h3></div></a><div class="v7-side-stack"><a class="v7-feature-card" href="${esc(d.guide2_url)}" style="background-image:url('${img(d.guide2_image)}')"><div><span class="tag">${esc(d.guide2_tag)}</span><h3>${esc(d.guide2_title)}</h3></div></a><a class="v7-feature-card" href="${esc(d.guide3_url)}" style="background-image:url('${img(d.guide3_image)}')"><div><span class="tag">${esc(d.guide3_tag)}</span><h3>${esc(d.guide3_title)}</h3></div></a></div></div></div></section>
<section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.gear_eyebrow)}</p><h2>${esc(d.gear_title)}</h2></div><a class="text-link" href="${esc(d.gear_link_url)}">${esc(d.gear_link_label)}</a></div><div class="gear-grid">${gearCards}</div><p class="affiliate-note">${esc(d.affiliate_text)}</p></div></section>
<section class="section"><div class="container category-grid">${categories}</div></section>
<section class="section"><div class="container"><div class="home-section-label"><p class="eyebrow">${esc(d.latest_eyebrow)}</p></div><div class="latest-grid">${latest}</div></div></section>
<section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.start_eyebrow)}</p><h2>${esc(d.start_title)}</h2></div><a class="text-link" href="${esc(d.start_link_url)}">${esc(d.start_link_label)}</a></div><div class="article-feature-grid">${startCards}</div></div></section>
<section class="section"><div class="container"><div class="family-strip"><figure><img loading="lazy" src="${img(d.family_image)}" alt="${esc(d.family_title)}"></figure><div class="family-copy"><p class="eyebrow">${esc(d.family_eyebrow)}</p><h2>${esc(d.family_title)}</h2><p>${esc(d.family_text)}</p><a class="btn btn-small" href="${esc(d.family_url)}">${esc(d.family_button)}</a></div></div></div></section>
<section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">${esc(d.gallery_eyebrow)}</p><h2>${esc(d.gallery_title)}</h2></div></div><div class="field-gallery">${gallery}</div></div></section>
<section class="newsletter"><div class="container newsletter-inner"><div><p class="eyebrow">${esc(d.newsletter_eyebrow)}</p><h2>${esc(d.newsletter_title)}</h2><p>${esc(d.newsletter_text)}</p></div><form class="newsletter-form" onsubmit="event.preventDefault(); alert('Thanks for joining the Pursuit Dispatch!');"><input type="email" placeholder="Email address" required><button class="btn btn-primary" type="submit">${esc(d.newsletter_button)}</button></form></div></section>
</main>`;
fs.writeFileSync(p,`${header}\n${main}\n${footer}`);
console.log('Built index.html from CMS content.');
