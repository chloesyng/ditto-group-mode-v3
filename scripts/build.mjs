import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "dist");
const runtimeFiles = ["index.html", "styles.css", "script.js"];
const assetReferencePattern = /assets\/[A-Za-z0-9._/-]+/g;

const referencedAssets = new Set();

for (const relativePath of runtimeFiles) {
  const source = await readFile(path.join(projectRoot, relativePath), "utf8");

  for (const match of source.matchAll(assetReferencePattern)) {
    referencedAssets.add(match[0].replace(/[).,;]+$/, ""));
  }
}

const missingAssets = [...referencedAssets].filter(
  (relativePath) => !existsSync(path.join(projectRoot, relativePath)),
);

if (missingAssets.length > 0) {
  throw new Error(`Missing local assets:\n${missingAssets.join("\n")}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const relativePath of runtimeFiles) {
  await cp(path.join(projectRoot, relativePath), path.join(outputDir, relativePath));
}

await cp(path.join(projectRoot, "assets"), path.join(outputDir, "assets"), {
  recursive: true,
  filter: (source) => path.basename(source) !== ".DS_Store",
});

console.log(`Built ${runtimeFiles.length} runtime files and ${referencedAssets.size} assets into dist/.`);
