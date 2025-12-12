#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

// Resolve CLI location
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// CLI argument
const appName = process.argv[2]

if (!appName || appName.trim() === "") {
  console.error("❌ Please provide a project name.")
  console.error("Example: npx @shubhamstr/boilerplate-generator my-api")
  process.exit(1)
}
console.log(appName)

const targetDir = path.resolve(process.cwd(), appName)
console.log(targetDir)

// ------------------
// TEMPLATE RESOLUTION
// ------------------

// 1️⃣ Template inside the published package (bundled)
let templateDir = path.join(__dirname, "express-api-template");
console.log(templateDir)

// 2️⃣ NPX sometimes places package 1 folder higher
if (!fs.existsSync(templateDir)) {
  templateDir = path.join(__dirname, "..", "express-api-template");
}
console.log(templateDir)

// 3️⃣ Template inside this package's internal node_modules
//    (THIS matches your real path!)
if (!fs.existsSync(templateDir)) {
  templateDir = path.join(
    __dirname,
    "node_modules",
    "@shubhamstr",
    "express-api-template"
  );
}

console.log(`✔ Using template from: ${templateDir}`)
console.log(`🚀 Creating project "${appName}"...\n`)

// ------------------
// Create project directory
// ------------------
if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory "${appName}" already exists.`)
  process.exit(1)
}

fs.mkdirSync(targetDir, { recursive: true })

// ------------------
// Files/folders to ignore
// ------------------
const IGNORE = new Set([
  "node_modules",
  ".git",
  "dist",
  "bin",
  "package-lock.json",
])

// ------------------
// COPY FUNCTION
// ------------------
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORE.has(entry.name)) continue

    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// COPY TEMPLATE
copyDir(templateDir, targetDir)

// UPDATE PACKAGE.JSON NAME
const pkgPath = path.join(targetDir, "package.json")
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  pkg.name = appName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

console.log("📦 Installing dependencies...\n")

try {
  execSync("npm install", { stdio: "inherit", cwd: targetDir })

  console.log("\n✅ Installation complete!")
  console.log("\nNext steps:")
  console.log(`  cd ${appName}`)
  console.log(`  cp .env.example .env`)
  console.log(`  npm run dev`)
} catch {
  console.error(
    "\n❌ Failed to install dependencies. Run `npm install` manually."
  )
}
