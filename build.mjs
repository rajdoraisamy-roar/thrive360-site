// Build script: renders src/index.njk + content/site.json -> dist/
// Design lives in src/. Content lives in content/. They never mix.
import fs from "node:fs";
import path from "node:path";
import nunjucks from "nunjucks";

const ROOT = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const DIST = path.join(ROOT, "dist");

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// 1. Load content
const content = readJSON(path.join(ROOT, "content", "site.json"));

// 2. Render template
const env = nunjucks.configure(path.join(ROOT, "src"), { autoescape: true, noCache: true });
const html = env.render("index.njk", content);

// 3. Reset + write dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), html, "utf8");

// 4. Copy stylesheet
fs.copyFileSync(path.join(ROOT, "src", "style.css"), path.join(DIST, "style.css"));

// 5. Copy assets + CNAME + any static pages
const assetsSrc = path.join(ROOT, "assets");
const assetsDst = path.join(DIST, "assets");
if (fs.existsSync(assetsSrc)) {
  fs.mkdirSync(assetsDst, { recursive: true });
  for (const f of fs.readdirSync(assetsSrc)) {
    fs.copyFileSync(path.join(assetsSrc, f), path.join(assetsDst, f));
  }
}

const cname = path.join(ROOT, "CNAME");
if (fs.existsSync(cname)) fs.copyFileSync(cname, path.join(DIST, "CNAME"));

// Any standalone .html files in src/ are copied through untouched
for (const f of fs.readdirSync(path.join(ROOT, "src"))) {
  if (f.endsWith(".html")) {
    fs.copyFileSync(path.join(ROOT, "src", f), path.join(DIST, f));
  }
}

const bytes = fs.statSync(path.join(DIST, "index.html")).size;
console.log(`Built dist/index.html — ${bytes.toLocaleString()} bytes`);
