const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const imagesDir = path.join(root, 'src', 'assets', 'images');
const svgsDir = path.join(root, 'src', 'assets', 'svgs');
const includesImagesDir = path.join(root, 'src', '_includes', 'images');
const includesIconsDir = path.join(root, 'src', '_includes', 'icons');

const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp'];

/* FIXED DIMENSIONS */
const IMAGE_WIDTH = 3000;
const IMAGE_HEIGHT = 3000;
const SVG_WIDTH = 100;
const SVG_HEIGHT = 100;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function uniquePath(dir, base) {
  // If a file with this base already exists, do not generate a new one — signal caller to skip.
  const candidatePath = path.join(dir, base + '.liquid');
  if (fs.existsSync(candidatePath)) return null;
  return candidatePath;
}

ensureDir(includesImagesDir);
ensureDir(includesIconsDir);

/* IMAGE INCLUDES */
if (fs.existsSync(imagesDir)) {
  const files = fs
    .readdirSync(imagesDir)
    .filter(f => imageExts.includes(path.extname(f).toLowerCase()));

  for (const file of files) {
    const base = path.parse(file).name;
    const slug = slugify(base);
    const outPath = uniquePath(includesImagesDir, slug);
    if (!outPath) {
      console.log('Skip image include (already exists):', path.join(includesImagesDir, slug + '.liquid'));
      continue;
    }
    const rel = `/assets/images/${file}`.replace(/\\/g, '/');
    const altDefault = base.replace(/[-_]/g, ' ');

    const content = `<!-- Auto-generated include for ${file} -->
<img
  src="{{ '${rel}' | url }}"
  alt="{{ include.alt | default: '${altDefault}' }}"
  class="image-include {{ include.class }}"
  width="${IMAGE_WIDTH}"
  height="${IMAGE_HEIGHT}"
  loading="{{ include.loading | default: 'lazy' }}"
  decoding="{{ include.decoding | default: 'async' }}"
/>
`;

    fs.writeFileSync(outPath, content, 'utf8');
    console.log('Wrote image include:', outPath);
  }
} else {
  console.warn('Images directory not found:', imagesDir);
}

/* SVG INCLUDES */
if (fs.existsSync(svgsDir)) {
  const files = fs
    .readdirSync(svgsDir)
    .filter(f => path.extname(f).toLowerCase() === '.svg');

  for (const file of files) {
    const filePath = path.join(svgsDir, file);
    let svgRaw = fs.readFileSync(filePath, 'utf8');

    /* Ensure svg gets class + width/height */
    svgRaw = svgRaw.replace(
      /<svg\b([^>]*)>/,
      `<svg$1 class="svg-include" width="${SVG_WIDTH}" height="${SVG_HEIGHT}">`
    );

    const base = path.parse(file).name;
    const slug = slugify(base);
    const outPath = uniquePath(includesIconsDir, slug);
    if (!outPath) {
      console.log('Skip svg include (already exists):', path.join(includesIconsDir, slug + '.liquid'));
      continue;
    }

    const content = `<!-- Auto-generated include (inline SVG) for ${file} -->
<span class="svg-include-span {{ include.class }}" aria-hidden="{{ include.aria_hidden | default: 'true' }}">
{% raw %}
${svgRaw}
{% endraw %}
</span>
`;

    fs.writeFileSync(outPath, content, 'utf8');
    console.log('Wrote svg include:', outPath);
  }
} else {
  console.warn('SVGs directory not found:', svgsDir);
}

console.log('Done. Regenerate includes after asset changes.');
