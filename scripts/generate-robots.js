const fs = require("fs/promises");
const path = require("path");
const config = require("./config.js");

async function generateRobots() {
  const clinic = JSON.parse(await fs.readFile(
    path.join(config.ROOT_DIR, "src", "_data", "clinic.json"),
    config.UTF8
  ));
  const contents = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${clinic.url}/sitemap.xml`,
    ""
  ].join(config.NEWLINE);

  await fs.writeFile(path.join(config.OUTPUT_SITE_DIR, "robots.txt"), contents, config.UTF8);
}

module.exports = generateRobots;