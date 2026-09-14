const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const failures = [];
const notes = [];

const expectedPages = [
  'index.html','hunting.html','fishing.html','camping.html','survival.html','gear.html','guides.html','about.html','contact.html','privacy.html'
];
const expectedSources = [
  'content/pages/home.yml','content/pages/hunting.yml','content/pages/fishing.yml','content/pages/camping.yml','content/pages/survival.yml','content/pages/gear.yml','content/pages/guides.yml','content/pages/about.yml','content/pages/contact.yml','content/pages/privacy.yml'
];

for (const file of [...expectedPages, ...expectedSources, '.pages.yml']) {
  if (!fs.existsSync(path.join(ROOT, file))) failures.push(`Missing required file: ${file}`);
}

const pagesConfig = fs.readFileSync(path.join(ROOT, '.pages.yml'), 'utf8');
for (const source of expectedSources) {
  if (!pagesConfig.includes(`path: ${source}`)) failures.push(`Pages CMS is missing editor for ${source}`);
}

const guideDir = path.join(ROOT, 'content', 'guides');
if (fs.existsSync(guideDir)) {
  for (const file of fs.readdirSync(guideDir).filter(f => f.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(guideDir, file), 'utf8');
    if (/Guide content coming soon\./i.test(text)) failures.push(`Placeholder guide content remains: content/guides/${file}`);
  }
}

function collectHtml(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(collectHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const htmlFiles = collectHtml(ROOT).filter(file => !file.includes(`${path.sep}.git${path.sep}`));
const attrRe = /(?:href|src)=["']([^"']+)["']/gi;
const cssUrlRe = /url\(["']?([^"')]+)["']?\)/gi;
const ignored = /^(?:https?:|mailto:|tel:|javascript:|data:|#)/i;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const refs = [];
  for (const re of [attrRe, cssUrlRe]) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(html))) refs.push(match[1]);
  }
  for (let ref of refs) {
    ref = ref.trim();
    if (!ref || ignored.test(ref)) continue;
    ref = ref.split('#')[0].split('?')[0];
    if (!ref) continue;
    let target;
    if (ref.startsWith('/')) target = path.join(ROOT, ref.slice(1));
    else target = path.resolve(path.dirname(file), ref);
    if (!fs.existsSync(target)) {
      failures.push(`Broken local reference in ${path.relative(ROOT, file)}: ${ref}`);
    }
  }
}

const articleBuilder = fs.readFileSync(path.join(ROOT, 'scripts', 'build-articles.js'), 'utf8');
if (!articleBuilder.includes('href="../${story.href}"')) {
  failures.push('Related-story links are not root-corrected in scripts/build-articles.js');
}

notes.push(`Checked ${htmlFiles.length} HTML files.`);
notes.push(`Verified ${expectedSources.length} structured page editors.`);
notes.push('Checked migrated guides for placeholder content.');

if (failures.length) {
  console.error('\nCMS TEST VERIFICATION FAILED\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nCMS TEST VERIFICATION PASSED\n');
for (const note of notes) console.log(`- ${note}`);
