const fs = require("fs/promises");
const path = require("path");
const esbuild = require("esbuild");
const sharp = require("sharp");

const WEBP_QUALITY = 80;
const root = __dirname;
const sourceAssets = path.join(root, "src", "assets");
const outputAssets = path.join(root, "_site", "assets");
const globalStyles = ["base.css", "components.css", "header.css", "footer.css"];
const imageExtensions = new Set([
  ".avif",
  ".bmp",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp"
]);

async function filesIn(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }

  return files;
}

async function copySourceAssets() {
  await fs.rm(outputAssets, { recursive: true, force: true });
  await fs.cp(sourceAssets, outputAssets, { recursive: true });
}

async function minifyCss(sourceFile, outputFile) {
  const result = await esbuild.transform(await fs.readFile(sourceFile, "utf8"), {
    loader: "css",
    minify: true,
    sourcefile: sourceFile
  });
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, result.code);
}

async function minifyStyles() {
  const globalCss = (await Promise.all(globalStyles.map(file =>
    fs.readFile(path.join(sourceAssets, "css", file), "utf8")
  ))).join("\n");
  const globalResult = await esbuild.transform(globalCss, { loader: "css", minify: true });
  await fs.writeFile(path.join(outputAssets, "css", "global.css"), globalResult.code);

  for (const file of globalStyles) {
    await fs.rm(path.join(outputAssets, "css", file));
  }

  const cssFiles = (await filesIn(path.join(sourceAssets, "css", "page")))
    .filter(file => path.extname(file) === ".css");
  await Promise.all(cssFiles.map(file => {
    const relativeFile = path.relative(path.join(sourceAssets, "css"), file);
    return minifyCss(file, path.join(outputAssets, "css", relativeFile));
  }));
}

async function minifyScripts() {
  const result = await esbuild.transform(
    await fs.readFile(path.join(sourceAssets, "main.js"), "utf8"),
    { loader: "js", minify: true }
  );
  await fs.writeFile(path.join(outputAssets, "main.js"), result.code);
}

async function optimizeImages() {
  const images = (await filesIn(path.join(outputAssets, "images")))
    .filter(file => imageExtensions.has(path.extname(file).toLowerCase()));

  await Promise.all(images.map(async sourceFile => {
    const extension = path.extname(sourceFile);
    const outputFile = `${sourceFile.slice(0, -extension.length)}.webp`;
    const temporaryFile = `${outputFile}.tmp`;

    await sharp(sourceFile)
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(temporaryFile);
    await fs.rename(temporaryFile, outputFile);
    if (sourceFile !== outputFile) await fs.rm(sourceFile);
  }));
}

async function buildAssets() {
  await copySourceAssets();
  await Promise.all([minifyStyles(), minifyScripts(), optimizeImages()]);
}

module.exports = buildAssets;
