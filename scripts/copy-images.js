const fs = require("fs/promises");
const config = require("./config.js");

async function copyImages() {
  await fs.rm(config.OUTPUT_IMAGE_DIR, { recursive: true, force: true });
  await fs.cp(config.IMAGE_GENERATED_DIR, config.OUTPUT_IMAGE_DIR, { recursive: true });
}

module.exports = copyImages;
