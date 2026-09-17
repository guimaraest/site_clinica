const fs = require("fs/promises");
const config = require("./config.js");

async function copyImages() {
  // #region agent log
  await fs.appendFile("/home/thiago/Files/Projects/Clinica/site_clinica/.cursor/debug-3e885f.log", JSON.stringify({ sessionId: "3e885f", runId: "pre-fix", hypothesisId: "D", location: "copy-images.js:copyImages:entry", message: "copyImages start", data: { from: config.IMAGE_GENERATED_DIR, to: config.OUTPUT_IMAGE_DIR }, timestamp: Date.now() }) + "\n").catch(() => {});
  // #endregion
  await fs.rm(config.OUTPUT_IMAGE_DIR, { recursive: true, force: true });
  await fs.cp(config.IMAGE_GENERATED_DIR, config.OUTPUT_IMAGE_DIR, { recursive: true });
  const cacheCount = (await fs.readdir(config.IMAGE_GENERATED_DIR).catch(() => [])).length;
  const outputCount = (await fs.readdir(config.OUTPUT_IMAGE_DIR).catch(() => [])).length;
  // #region agent log
  await fs.appendFile("/home/thiago/Files/Projects/Clinica/site_clinica/.cursor/debug-3e885f.log", JSON.stringify({ sessionId: "3e885f", runId: "pre-fix", hypothesisId: "D", location: "copy-images.js:copyImages:done", message: "copyImages done", data: { cacheCount, outputCount }, timestamp: Date.now() }) + "\n").catch(() => {});
  // #endregion
}

module.exports = copyImages;
