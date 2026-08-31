const fs = require("fs/promises");
const path = require("path");
const esbuild = require("esbuild");

const root = __dirname;
const sourceAssets = path.join(root, "src", "assets");
const outputAssets = path.join(root, "_site", "assets");
const globalStyles = ["base.css", "components.css", "header.css", "footer.css"];

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
  await fs.mkdir(path.join(outputAssets, "css"), { recursive: true });
  await fs.writeFile(path.join(outputAssets, "css", "global.css"), globalResult.code);
  await Promise.all(globalStyles.map(file =>
    fs.rm(path.join(outputAssets, "css", file), { force: true })
  ));

  const pageCss = (await filesIn(path.join(sourceAssets, "css", "page")))
    .filter(file => path.extname(file) === ".css");
  await Promise.all(pageCss.map(file => {
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

async function buildPre() {
  await fs.rm(outputAssets, { recursive: true, force: true });
  await fs.cp(sourceAssets, outputAssets, { recursive: true });
  await Promise.all([minifyStyles(), minifyScripts()]);
}

module.exports = buildPre;
