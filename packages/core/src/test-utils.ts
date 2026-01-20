import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load a JSON fixture file
 */
export function loadFixture(filePath: string): unknown {
  const absolutePath = path.join(__dirname, "schemas/fixtures", filePath);
  const content = readFileSync(absolutePath, "utf8");
  return JSON.parse(content);
}

/**
 * Load a hash fixture file (base64-encoded compact config)
 */
export function loadHashFixture(filePath: string): string {
  const absolutePath = path.join(__dirname, "schemas/fixtures", filePath);
  return readFileSync(absolutePath, "utf8").trim();
}
