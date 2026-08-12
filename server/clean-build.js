const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Starting clean production build...");

const nodeModulesPath = path.join(__dirname, "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  console.log("🧹 Clearing node_modules cache for zero-error installation...");
  try {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  } catch (e) {
    console.warn("Notice during cache clean:", e.message);
  }
}

console.log("📦 Installing clean dependencies...");
execSync("npm install --no-audit", { stdio: "inherit" });
console.log("✅ Clean build complete!");
