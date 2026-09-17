const fs = require("fs");
const { spawnSync } = require("child_process");
const config = require("./config.js");

const commands = ["npm run build", "node scripts/validate-build.js"];
const log = [`site-clinica test run: ${new Date().toISOString()}`, ""];

for (const command of commands) {
  const result = spawnSync(command, {
    cwd: config.ROOT_DIR,
    encoding: config.UTF8,
    shell: true
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  log.push(`$ ${command}`, output, "");
  process.stdout.write(output);

  if (result.error || result.status !== 0) {
    log.push(`Command failed with exit code ${result.status ?? "unknown"}.`);
    fs.writeFileSync(config.TEST_LOG_FILE, log.join("\n"), config.UTF8);
    process.exit(result.status || 1);
  }
}

log.push("Test passed.");
fs.writeFileSync(config.TEST_LOG_FILE, log.join("\n"), config.UTF8);