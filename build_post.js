const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const Critters = require("critters");
const { minify } = require("html-minifier-terser");
const config = require("./config.js");

async function htmlFiles() {
  const entries = await fs.readdir(config.OUTPUT_SITE_DIR, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(config.OUTPUT_SITE_DIR, entry.name);
    if (entry.isDirectory()) files.push(...await findHtml(file));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

async function findHtml(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findHtml(file));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

async function fingerprintAssets(files) {
  const replacements = [];
  for (const file of files) {
    const contents = await fs.readFile(file);
    const hash = crypto.createHash(config.HASH_ALGORITHM).update(contents).digest("hex").slice(0, config.HASH_LENGTH);
    const extension = path.extname(file);
    const fingerprinted = `${file.slice(0, -extension.length)}.${hash}${extension}`;
    await fs.rename(file, fingerprinted);
    replacements.push([`${config.ASSET_URL_PATH}${path.relative(config.OUTPUT_ASSETS_DIR, file)}`, `${config.ASSET_URL_PATH}${path.relative(config.OUTPUT_ASSETS_DIR, fingerprinted)}`]);
  }
  return replacements;
}

async function findFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findFiles(file));
    if (entry.isFile()) files.push(file);
  }
  return files;
}

async function processHtml(replacements) {
  const critters = new Critters(config.CRITTERS_OPTIONS);

  for (const file of await htmlFiles()) {
    let contents = await fs.readFile(file, "utf8");
    for (const [oldReference, newReference] of replacements) {
      contents = contents.split(oldReference).join(newReference);
      if (config.PATH_PREFIX !== config.DEVELOPMENT_PATH_PREFIX) {
        const prefixedOldReference = `${config.PATH_PREFIX}${oldReference.slice(config.DEVELOPMENT_PATH_PREFIX.length)}`;
        const prefixedNewReference = `${config.PATH_PREFIX}${newReference.slice(config.DEVELOPMENT_PATH_PREFIX.length)}`;
        contents = contents.split(prefixedOldReference).join(prefixedNewReference);
      }
    }
    contents = await critters.process(contents);
    if (config.PATH_PREFIX !== "/") {
      contents = contents.replace(/(href|src)="\/assets\//g, `$1="${config.PATH_PREFIX}assets/`);
    }
    contents = await minify(contents, config.HTML_MINIFY_OPTIONS);
    await fs.writeFile(file, contents, config.UTF8);
  }
}

async function buildPost() {
  const targets = (await findFiles(config.OUTPUT_ASSETS_DIR)).filter(file =>
    config.CSS_JS_EXTENSIONS.includes(path.extname(file))
  );
  const replacements = await fingerprintAssets(targets);
  await processHtml(replacements);
}

module.exports = buildPost;
