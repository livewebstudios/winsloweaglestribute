/**
 * scripts/build-indexes.js
 * Runs in GitHub Actions after Decap CMS pushes new/edited .md files.
 * Reads frontmatter from each collection folder and outputs index.json.
 * Renderers fetch index.json — no client-side YAML parsing needed.
 */

const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');

const COLLECTIONS = [
  { dir: '_tour',         out: '_tour/index.json'         },
  { dir: '_media',        out: '_media/index.json'        },
  { dir: '_testimonials', out: '_testimonials/index.json' },
];

function buildIndex({ dir, out }) {
  if (!fs.existsSync(dir)) {
    fs.writeFileSync(out, JSON.stringify([], null, 2));
    console.log(`  [skip] ${dir} does not exist — wrote empty index`);
    return;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const items = files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    return { ...data, _slug: file.replace(/\.md$/, '') };
  });

  fs.writeFileSync(out, JSON.stringify(items, null, 2));
  console.log(`  [ok] ${out} — ${items.length} item(s)`);
}

console.log('Building CMS indexes...');
COLLECTIONS.forEach(buildIndex);
console.log('Done.');
