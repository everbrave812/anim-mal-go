import fs from "node:fs"
import path from "node:path"
import { fromHtml } from "hast-util-from-html"
import { parse } from "yaml"

const root = path.resolve(process.argv[2] || "public")
const config = parse(fs.readFileSync("quartz.config.yaml", "utf8"))
const site = new URL(`https://${config.configuration.baseUrl}/`)
const errors = new Set()
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".html"))
if (!files.length) throw new Error("No built HTML found; build Quartz first")
for (const file of files) {
  const page = new URL(file, site)
  const tree = fromHtml(fs.readFileSync(path.join(root, file), "utf8"))
  function walk(node, ignored = false) {
    const p = node.properties || {}
    const classes = p.className || []
    if (classes.includes("katex-error"))
      errors.add(`${file}: invalid equation: ${p.title || "KaTeX error"}`)
    if (node.tagName === "a" && p.href) {
      const target = new URL(p.href, page)
      if (target.origin === site.origin && target.pathname.startsWith(site.pathname)) {
        const relative = decodeURIComponent(target.pathname.slice(site.pathname.length))
        const candidates = [relative, `${relative}.html`, path.join(relative, "index.html")]
        if (
          !candidates.some((f) => {
            const destination = path.resolve(root, f)
            return (
              destination.startsWith(root + path.sep) &&
              fs.existsSync(destination) &&
              fs.statSync(destination).isFile()
            )
          })
        )
          errors.add(`${file}: broken link: ${p.href}`)
      }
    }
    const skip =
      ignored ||
      ["pre", "code", "script", "style", "math"].includes(node.tagName) ||
      classes.includes("katex")
    if (
      !skip &&
      node.type === "text" &&
      /\\(?:frac|boxed|text|begin|sqrt)\s*\{|\$\$/.test(node.value)
    ) {
      errors.add(`${file}: unrendered equation: ${node.value.trim().slice(0, 100)}`)
    }
    for (const child of node.children || []) walk(child, skip)
  }
  walk(tree)
}
if (errors.size) {
  console.error([...errors].join("\n"))
  process.exitCode = 1
} else
  console.log(
    `Site checks passed: ${files.length} HTML files; no broken internal links or detected math errors`,
  )
