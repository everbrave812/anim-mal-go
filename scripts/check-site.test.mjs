import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

function check(html) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "blog-check-test-"))
  fs.writeFileSync(path.join(root, "index.html"), html)
  return spawnSync(process.execPath, ["scripts/check-site.mjs", root], { encoding: "utf8" })
}
test("accepts home, external links, rendered math and code examples", () => {
  const result = check(
    '<a href=".">Home</a><a href="https://example.com/">External</a><span class="katex">x</span><code>\\frac{x}{y}</code>',
  )
  assert.equal(result.status, 0, result.stderr)
})
test("blocks missing internal targets", () => {
  const result = check('<a href="missing">Missing</a>')
  assert.equal(result.status, 1)
  assert.match(result.stderr, /broken link/)
})
test("blocks KaTeX errors and unrendered formulas", () => {
  for (const html of [
    '<span class="katex-error" title="Invalid command">x</span>',
    "<p>\\frac{x}{y}</p>",
  ]) {
    const result = check(html)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /equation/)
  }
})
