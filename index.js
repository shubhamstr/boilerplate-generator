#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

// Resolve current file and directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read CLI argument
const appName = process.argv[2]

// If no name provided → show usage and exit
if (!appName || appName.trim() === "") {
  console.error("❌ Please provide a project name")
  console.error("   Example: npx @shubhamstr/boilerplate-generator my-api")
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), appName)
const templateDir = path.join(__dirname, "template")

// Prevent overwrite
if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory "${appName}" already exists.`)
  process.exit(1)
}

console.log(`🚀 Creating Express app in "${appName}"...\n`)

// Create the project directory
fs.mkdirSync(targetDir, { recursive: true })

// Recursive folder copy function
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

// Copy boilerplate template → new project folder
copyDir(templateDir, targetDir)

// Update package.json → set correct project name
const pkgPath = path.join(targetDir, "package.json")
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
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
