import fs from "node:fs"
import path from "node:path"
import { fromHtml } from "hast-util-from-html"
import { parse } from "yaml"

const root = path.resolve(process.argv[2] || "public")
const baselinePath = process.env.SEO_BASELINE || "scripts/seo-baseline.json"
const configPath = process.env.SEO_CONFIG || "quartz.config.yaml"
const contentPath = process.env.SEO_CONTENT || "content/Blog"
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"))
const config = parse(fs.readFileSync(configPath, "utf8"))
const site = new URL(`https://${config.configuration.baseUrl}/`)
const errors = []
const warnings = []

function nodes(tree) {
  const result = []
  function walk(node, inArticle = false) {
    const article = inArticle || node.tagName === "article"
    result.push({ node, inArticle: article })
    for (const child of node.children || []) walk(child, article)
  }
  walk(tree)
  return result
}

function text(node) {
  return node.type === "text" ? node.value : (node.children || []).map(text).join("")
}

function normalizeUrl(value) {
  const url = new URL(value, site)
  url.hash = ""
  url.pathname = url.pathname.replace(/\/index$/, "") || "/"
  return url.href.replace(/\/$/, "")
}

const pages = []
for (const file of fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".html"))) {
  const tree = fromHtml(fs.readFileSync(path.join(root, file), "utf8"))
  const all = nodes(tree)
  const find = (tag, predicate = () => true) =>
    all.find(({ node }) => node.tagName === tag && predicate(node.properties || {}))?.node
  const title = text(find("title") || {}).trim()
  const description = find("meta", (p) => p.name === "description")?.properties?.content?.trim()
  const robots = find("meta", (p) => p.name === "robots")?.properties?.content || ""
  const canonical = find("link", (p) => (p.rel || []).includes("canonical"))?.properties?.href
  const indexable = !String(robots).includes("noindex") && Boolean(canonical)
  const articleImages = all.filter(({ node, inArticle }) => node.tagName === "img" && inArticle)
  const missingImageAlt = articleImages.filter(
    ({ node }) => !String(node.properties?.alt || "").trim(),
  ).length
  const structuredData = all.filter(
    ({ node }) => node.tagName === "script" && node.properties?.type === "application/ld+json",
  ).length
  pages.push({ file, title, description, canonical, indexable, missingImageAlt, structuredData })
}

const indexable = pages.filter((page) => page.indexable)
for (const page of indexable) {
  if (!page.title) errors.push(`${page.file}: missing title`)
  if (!page.description || page.description === "설명 없음")
    warnings.push(`${page.file}: missing useful meta description`)
}

for (const key of ["title", "canonical"]) {
  const seen = new Map()
  for (const page of indexable) {
    const value = page[key]
    if (!value) {
      errors.push(`${page.file}: missing ${key}`)
      continue
    }
    const normalized = key === "canonical" ? normalizeUrl(value) : value
    if (seen.has(normalized))
      errors.push(`${page.file}: duplicate ${key} with ${seen.get(normalized)}`)
    else seen.set(normalized, page.file)
  }
}

const sitemapPath = path.join(root, "sitemap.xml")
if (!fs.existsSync(sitemapPath)) errors.push("missing sitemap.xml")
const sitemapUrls = fs.existsSync(sitemapPath)
  ? [...fs.readFileSync(sitemapPath, "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
      normalizeUrl(match[1]),
    )
  : []
const canonicalUrls = new Set(indexable.map((page) => normalizeUrl(page.canonical)))
for (const url of sitemapUrls)
  if (!canonicalUrls.has(url)) errors.push(`sitemap URL has no page: ${url}`)
if (!sitemapUrls.includes(normalizeUrl(site))) errors.push("homepage is missing from sitemap.xml")

const markdownFiles = fs
  .readdirSync(contentPath, { recursive: true })
  .filter((file) => file.endsWith(".md"))
let missingExplicitDescriptions = 0
for (const file of markdownFiles) {
  const source = fs.readFileSync(path.join(contentPath, file), "utf8")
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatter) continue
  const data = parse(frontmatter[1]) || {}
  if (data.publish === true && !String(data.description || "").trim()) missingExplicitDescriptions++
}

const metrics = {
  missingExplicitDescriptions,
  genericDescriptions: indexable.filter(
    (page) => !page.description || page.description === "설명 없음",
  ).length,
  missingImageAlt: indexable.reduce((sum, page) => sum + page.missingImageAlt, 0),
  missingStructuredData: indexable.filter((page) => page.structuredData === 0).length,
}
for (const [name, value] of Object.entries(metrics)) {
  const maximum = baseline[`max${name[0].toUpperCase()}${name.slice(1)}`]
  if (maximum !== undefined && value > maximum)
    errors.push(`${name} increased: ${value} (allowed ${maximum})`)
}

console.log(
  `SEO audit: ${indexable.length} indexable pages, ${sitemapUrls.length} sitemap URLs, ` +
    `${metrics.missingExplicitDescriptions} published notes without explicit descriptions, ` +
    `${metrics.genericDescriptions} generic descriptions, ${metrics.missingImageAlt} images without alt text, ` +
    `${metrics.missingStructuredData} pages without structured data`,
)
for (const warning of warnings) console.warn(`SEO warning: ${warning}`)
if (errors.length) {
  console.error(errors.map((error) => `SEO error: ${error}`).join("\n"))
  process.exitCode = 1
} else console.log("SEO checks passed; tracked SEO debt did not increase")
