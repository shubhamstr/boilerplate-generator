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

const targetDir = path.resolve(process.cwd(), appName)

// ------------------
// TEMPLATE RESOLUTION
// ------------------

// 1️⃣ Local install (preferred)
let templateDir = path.resolve(
  process.cwd(),
  "node_modules",
  "@shubhamstr",
  "express-api-template"
)

// 2️⃣ Global install (fallback)
if (!fs.existsSync(templateDir)) {
  templateDir = path.resolve(
    __dirname,
    "../../node_modules/@shubhamstr/express-api-template"
  )
}

// 3️⃣ Final check
if (!fs.existsSync(templateDir)) {
  console.error(`❌ Template not found.`)
  console.error(`Looked in: ${templateDir}`)
  process.exit(1)
}

console.log(`✔ Using template from: ${templateDir}`)
console.log(`🚀 Creating project "${appName}"\n`)

if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory "${appName}" already exists.`)
  process.exit(1)
}

fs.mkdirSync(targetDir, { recursive: true })

// Files/folders to ignore
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

// UPDATE PACKAGE.JSON
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
