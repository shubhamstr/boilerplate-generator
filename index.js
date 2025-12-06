#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appName = process.argv[2]

if (!appName) {
  console.error("❌ Please provide a project name:")
  console.error("   npx boilerplate-generator my-api")
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), appName)
const templateDir = path.join(__dirname, "template")

if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory "${appName}" already exists.`)
  process.exit(1)
}

console.log(`🚀 Creating Express app in "${appName}"...`)

fs.mkdirSync(targetDir, { recursive: true })

// simple recursive copy
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

copyDir(templateDir, targetDir)

// Update package.json name
const pkgPath = path.join(targetDir, "package.json")
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
pkg.name = appName
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

console.log("📦 Installing dependencies (this may take a minute)...")

try {
  execSync("npm install", { stdio: "inherit", cwd: targetDir })
  console.log("✅ Installation complete!")
  console.log(`\nNext steps:`)
  console.log(`  cd ${appName}`)
  console.log(`  cp .env.example .env  # and fill values`)
  console.log(`  npm run dev`)
} catch (err) {
  console.error(
    "❌ Failed to install dependencies. Run `npm install` manually."
  )
}
