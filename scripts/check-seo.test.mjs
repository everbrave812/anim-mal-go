import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

const script = path.resolve("scripts/check-seo.mjs")

function check({ alt = "chart", sitemap = true, homepage = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seo-check-test-"))
  const publicDir = path.join(root, "public")
  const contentDir = path.join(root, "content")
  fs.mkdirSync(publicDir)
  fs.mkdirSync(contentDir)
  fs.writeFileSync(
    path.join(publicDir, "index.html"),
    `<html><head><title>Useful title</title><meta name="description" content="Useful description"><link rel="canonical" href="https://example.com/index"><script type="application/ld+json">{}</script></head><body><article><img alt="${alt}"></article></body></html>`,
  )
  fs.writeFileSync(
    path.join(publicDir, "sitemap.xml"),
    sitemap && homepage
      ? "<urlset><url><loc>https://example.com/</loc></url></urlset>"
      : "<urlset></urlset>",
  )
  fs.writeFileSync(
    path.join(contentDir, "post.md"),
    "---\npublish: true\ndescription: Useful\n---\n",
  )
  fs.writeFileSync(path.join(root, "config.yaml"), "configuration:\n  baseUrl: example.com\n")
  fs.writeFileSync(
    path.join(root, "baseline.json"),
    JSON.stringify({
      maxMissingExplicitDescriptions: 0,
      maxGenericDescriptions: 0,
      maxMissingImageAlt: 0,
      maxMissingStructuredData: 0,
    }),
  )
  const result = spawnSync(process.execPath, [script, publicDir], {
    encoding: "utf8",
    env: {
      ...process.env,
      SEO_BASELINE: path.join(root, "baseline.json"),
      SEO_CONFIG: path.join(root, "config.yaml"),
      SEO_CONTENT: contentDir,
    },
  })
  fs.rmSync(root, { recursive: true, force: true })
  return result
}

test("accepts a complete page and treats /index as the homepage", () => {
  const result = check()
  assert.equal(result.status, 0, result.stderr)
})

test("blocks newly missing image alt text", () => {
  const result = check({ alt: "" })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /missingImageAlt increased/)
})

test("requires the homepage in the sitemap", () => {
  const result = check({ homepage: false })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /homepage is missing/)
})
