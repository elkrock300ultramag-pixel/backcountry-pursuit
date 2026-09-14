const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'guides');
fs.mkdirSync(OUT, { recursive: true });

const files = [
  'september-elk-tactics.html','find-elk-after-pressure.html','elk-calling-plan.html','elk-hunting-gear-checklist.html','elk-packout-planning.html','mule-deer-glassing-system.html','mule-deer-glassing-basics.html','bowhunting-elk-setup.html',
  'best-elk-hunting-packs.html','backcountry-boot-guide.html','western-hunting-optics.html','gear-review-method.html',
  'backcountry-elk-camp.html','cold-weather-sleep-system.html','camp-food-basics.html','backcountry-emergency-kit.html','backcountry-navigation-basics.html','backcountry-shelter-guide.html','backcountry-water-plan.html','fire-starting-wet-weather.html',
  'reading-mountain-streams.html','simple-trout-kit.html','getting-kids-into-fishing.html'
];

const categoryBySlug = {
  'september-elk-tactics':'Hunting','find-elk-after-pressure':'Hunting','elk-calling-plan':'Hunting','elk-hunting-gear-checklist':'Hunting','elk-packout-planning':'Hunting','mule-deer-glassing-system':'Hunting','mule-deer-glassing-basics':'Hunting','bowhunting-elk-setup':'Hunting',
  'best-elk-hunting-packs':'Gear','backcountry-boot-guide':'Gear','western-hunting-optics':'Gear','gear-review-method':'Gear',
  'backcountry-elk-camp':'Camping','cold-weather-sleep-system':'Camping','camp-food-basics':'Camping','backcountry-emergency-kit':'Survival','backcountry-navigation-basics':'Survival','backcountry-shelter-guide':'Survival','backcountry-water-plan':'Survival','fire-starting-wet-weather':'Survival',
  'reading-mountain-streams':'Fishing','simple-trout-kit':'Fishing','getting-kids-into-fishing':'Family Outdoors'
};

function stripTags(s='') { return s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/\s+/g,' ').trim(); }
function yamlQuote(s='') { return JSON.stringify(String(s)); }

for (const file of files) {
  const sourcePath = path.join(ROOT, file);
  if (!fs.existsSync(sourcePath)) continue;
  const slug = path.basename(file, '.html');
  const outPath = path.join(OUT, `${slug}.md`);
  if (fs.existsSync(outPath)) continue;

  const html = fs.readFileSync(sourcePath, 'utf8');
  const title = stripTags((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1]) || slug.replace(/-/g,' ');
  const metaDescription = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [,''])[1];
  const heroParagraph = stripTags((html.match(/<section[^>]*class=["'][^"']*page-hero[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i) || [,''])[1]);
  const description = metaDescription || heroParagraph || `Backcountry Pursuit field guide: ${title}.`;

  let prose = (html.match(/<div[^>]*class=["'][^"']*container\s+prose[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/section>/i) || [,''])[1];
  if (!prose) prose = (html.match(/<section[^>]*class=["'][^"']*section[^"']*["'][^>]*>[\s\S]*?<div[^>]*class=["'][^"']*prose[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/section>/i) || [,''])[1];
  prose = prose || '<p>Guide content coming soon.</p>';
  prose = prose.replace(/<div[^>]*class=["'][^"']*article-cta[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');

  let image = '';
  const imageMatch = prose.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (imageMatch) {
    image = imageMatch[1].replace(/^\.\.\//, '/').replace(/^assets\/images\//, '/').replace(/^assets\//, '/');
  }

  const frontmatter = [
    '---',
    `title: ${yamlQuote(title)}`,
    `category: ${yamlQuote(categoryBySlug[slug] || 'Hunting')}`,
    `image: ${yamlQuote(image)}`,
    `description: ${yamlQuote(description)}`,
    `legacy_path: ${yamlQuote(file)}`,
    '---',
    prose.trim(),
    ''
  ].join('\n');

  fs.writeFileSync(outPath, frontmatter);
  console.log(`Migrated ${file} -> content/guides/${slug}.md`);
}
