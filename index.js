#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

// Resolve current file and directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// CLI argument
const appName = process.argv[2]

// Validate project name
if (!appName || appName.trim() === "") {
  console.error("❌ Please provide a project name")
  console.error("   Example: npx @shubhamstr/boilerplate-generator my-api")
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), appName)

// EXACT package root → dist/bin → dist → package root
const packageRoot = path.resolve(__dirname, "../../..")

// Ensure this is not executed incorrectly
if (!fs.existsSync(packageRoot)) {
  console.error("❌ Could not resolve package root.")
  process.exit(1)
}

console.log(`🚀 Creating Express project: "${appName}"\n`)

// Prevent overwrite
if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory "${appName}" already exists.`)
  process.exit(1)
}

// Create destination directory
fs.mkdirSync(targetDir, { recursive: true })

// ❌ Things we should NOT copy from the npm package
const IGNORE = new Set([
  "node_modules",
  "dist",
  "bin",
  ".git",
  ".gitignore",
  "package-lock.json",
  "boilerplate-generator.js",
  "boilerplate-generator.ts",
])

// Recursively copy template (package root → new project)
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

// Copy the project template
copyDir(packageRoot, targetDir)

// Update package.json project name
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
  console.log(`  cp .env.example .env   # update environment variables`)
  console.log(`  npm run dev`)
} catch (err) {
  console.error(
    "\n❌ Failed to install dependencies. Run `npm install` manually."
  )
}
