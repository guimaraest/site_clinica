const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "_site");
const issues = [];

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

function localTargetExists(value) {
  const withoutPrefix = value.replace(/^\/site_clinica\//, "/");
  const relative = withoutPrefix.replace(/^\//, "").split(/[?#]/)[0];
  const target = path.join(outputDir, relative || "index.html");
  return fs.existsSync(target) || fs.existsSync(path.join(target, "index.html"));
}

if (!fs.existsSync(outputDir)) {
  console.error("Build output not found. Run npm run build first.");
  process.exit(1);
}

for (const file of filesIn(outputDir)) {
  if (path.extname(file) !== ".html" && path.basename(file) !== "robots.txt" && path.basename(file) !== "sitemap.xml") continue;

  const contents = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(outputDir, file);

  for (const match of contents.matchAll(/<(?:a|link)\b[^>]+(?:href)="([^"]+)"/gi)) {
    const target = match[1];
    if (target.startsWith("/") && !target.startsWith("//") && !localTargetExists(target)) {
      issues.push(`${relativeFile}: missing local target ${target}`);
    }
  }

  for (const match of contents.matchAll(/<iframe\b([^>]*)>/gi)) {
    if (!/\btitle="[^"]+"/i.test(match[1])) issues.push(`${relativeFile}: iframe is missing a title`);
  }

  const stylesheetReferences = [...contents.matchAll(/<link\b[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/gi)]
    .filter((match) => !/\bonload=/i.test(match[0]))
    .map((match) => match[1]);
  for (const href of new Set(stylesheetReferences)) {
    if (stylesheetReferences.filter((reference) => reference === href).length > 1) {
      issues.push(`${relativeFile}: duplicate stylesheet reference ${href}`);
    }
  }
}

if (issues.length) {
  console.error(`Build validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Build validation passed.");
