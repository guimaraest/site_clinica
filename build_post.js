const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const Critters = require("critters");
const { minify } = require("html-minifier-terser");

const root = __dirname;
const siteDir = path.join(root, "_site");
const assetDir = path.join(siteDir, "assets");
const pathPrefix = process.env.NODE_ENV === "production" ? "/site_clinica/" : "/";

async function htmlFiles() {
  const entries = await fs.readdir(siteDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(siteDir, entry.name);
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
    const hash = crypto.createHash("sha256").update(contents).digest("hex").slice(0, 8);
    const extension = path.extname(file);
    const fingerprinted = `${file.slice(0, -extension.length)}.${hash}${extension}`;
    await fs.rename(file, fingerprinted);
    replacements.push([`/assets/${path.relative(assetDir, file)}`, `/assets/${path.relative(assetDir, fingerprinted)}`]);
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
  const critters = new Critters({
    path: siteDir,
    publicPath: "/",
    inlineFonts: false,
    preload: "swap",
    pruneSource: false
  });

  for (const file of await htmlFiles()) {
    let contents = await fs.readFile(file, "utf8");
    for (const [oldReference, newReference] of replacements) {
      contents = contents.split(oldReference).join(newReference);
    }
    const criticalInput = pathPrefix === "/"
      ? contents
      : contents.split(pathPrefix).join("/");
    contents = await critters.process(criticalInput);
    if (pathPrefix !== "/") {
      contents = contents.replace(/(href|src)="\/assets\//g, `$1="${pathPrefix}assets/`);
    }
    contents = await minify(contents, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    });
    await fs.writeFile(file, contents);
  }
}

async function buildPost() {
  const targets = (await findFiles(assetDir)).filter(file =>
    [".css", ".js"].includes(path.extname(file))
  );
  const replacements = await fingerprintAssets(targets);
  await processHtml(replacements);
}

module.exports = buildPost;
