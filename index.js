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

// ✅ Correct path to template folder inside node_modules
const templateDir = path.resolve(
  __dirname,
  "..", // go one level up from dist/bin if needed
  "node_modules",
  "@shubhamstr",
  "express-api-template"
)

// Fallback if executed globally
const fallbackTemplate = path.resolve(
  process.cwd(),
  "node_modules",
  "@shubhamstr",
  "express-api-template"
)

// Choose available template path
const finalTemplateDir = fs.existsSync(templateDir)
  ? templateDir
  : fallbackTemplate

if (!fs.existsSync(finalTemplateDir)) {
  console.error("❌ Template folder not found inside package:")
  console.error(finalTemplateDir)
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

// Recursively copy template
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
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

// Copy template → new project
copyDir(finalTemplateDir, targetDir)

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
