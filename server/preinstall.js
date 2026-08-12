const fs = require("fs");
const path = require("path");

console.log("🔧 Pre-install environment check...");

const expressPath = path.join(__dirname, "node_modules", "express");
if (fs.existsSync(expressPath)) {
  const routerPath = path.join(expressPath, "lib", "router");
  if (!fs.existsSync(routerPath)) {
    console.log("⚠️ Corrupted express directory found in cache. Deleting node_modules for fresh install...");
    try {
      fs.rmSync(path.join(__dirname, "node_modules"), { recursive: true, force: true });
    } catch (e) {
      console.warn("Clean notice:", e.message);
    }
  }
}
