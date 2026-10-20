import { readFileSync, writeFileSync } from 'node:fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node scripts/decode-unicode-escapes.mjs <file>');
  process.exitCode = 1;
} else {
  const source = readFileSync(filePath, 'utf8');
  const decoded = source.replace(/\\u([0-9a-fA-F]{4})/g, (_, codePoint) =>
    String.fromCharCode(Number.parseInt(codePoint, 16))
  );

  if (decoded !== source) {
    writeFileSync(filePath, decoded);
  }
}
