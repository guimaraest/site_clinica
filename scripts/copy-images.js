const fs = require("fs/promises");
const config = require("./config.js");

const path = require("path");

async function copyImages() {
  await fs.rm(config.OUTPUT_IMAGE_DIR, { recursive: true, force: true });
  await fs.cp(config.IMAGE_GENERATED_DIR, config.OUTPUT_IMAGE_DIR, { recursive: true });

  try {
    await fs.cp(
      path.join(config.SOURCE_ASSETS_DIR, "images", "logo-square.png"),
      path.join(config.OUTPUT_IMAGE_DIR, "logo-square.png"),
      { force: true }
    );
  } catch (e) {}

  try {
    await fs.cp(
      path.join(config.SOURCE_ASSETS_DIR, "images", "schema"),
      path.join(config.OUTPUT_IMAGE_DIR, "schema"),
      { recursive: true, force: true }
    );
  } catch (e) {}
}

module.exports = copyImages;
