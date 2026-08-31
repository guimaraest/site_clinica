const fs = require("fs/promises");
const path = require("path");
const esbuild = require("esbuild");
const config = require("./config.js");

async function filesIn(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(file));
    if (entry.isFile()) files.push(file);
  }

  return files;
}

async function minifyCss(sourceFile, outputFile) {
  const result = await esbuild.transform(await fs.readFile(sourceFile, config.UTF8), {
    loader: config.CSS_LOADER,
    minify: config.MINIFY,
    sourcefile: sourceFile,
    minify: true
  });
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, result.code);
}

async function minifyStyles() {
  const globalCss = (await Promise.all(config.GLOBAL_CSS_FILES.map(file =>
    fs.readFile(path.join(config.SOURCE_CSS_DIR, file), config.UTF8)
  ))).join(config.NEWLINE);
  const globalResult = await esbuild.transform(globalCss, { loader: config.CSS_LOADER, minify: config.MINIFY });
  await fs.mkdir(config.OUTPUT_CSS_DIR, { recursive: true });
  await fs.writeFile(path.join(config.OUTPUT_CSS_DIR, config.GLOBAL_CSS_FILE), globalResult.code);
  await Promise.all(config.GLOBAL_CSS_FILES.map(file =>
    fs.rm(path.join(config.OUTPUT_CSS_DIR, file), { force: true })
  ));

  const pageCss = (await filesIn(config.SOURCE_PAGE_CSS_DIR))
    .filter(file => path.extname(file) === config.CSS_EXTENSION);
  await Promise.all(pageCss.map(file => {
    const relativeFile = path.relative(config.SOURCE_CSS_DIR, file);
    return minifyCss(file, path.join(config.OUTPUT_CSS_DIR, relativeFile));
  }));
}

async function minifyScripts() {
  const result = await esbuild.transform(
    await fs.readFile(config.SOURCE_JS_FILE, config.UTF8),
    { loader: config.JS_LOADER, minify: config.MINIFY }
  );
  await fs.writeFile(config.OUTPUT_JS_FILE, result.code);
}

async function buildPre() {
  await fs.rm(config.OUTPUT_ASSETS_DIR, { recursive: true, force: true });
  await fs.cp(config.SOURCE_ASSETS_DIR, config.OUTPUT_ASSETS_DIR, { recursive: true });
  await Promise.all([minifyStyles(), minifyScripts()]);
}

module.exports = buildPre;
