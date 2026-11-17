// filepath: packages/content/scripts/export-json.ts
// Writes dist/seed.json so the Strapi seed script (plain Node, outside the workspace) can read it.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as seed from "../src/seed";

const out = join(dirname(fileURLToPath(import.meta.url)), "../dist/seed.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(seed, null, 2));
console.log(`wrote ${out}`);
