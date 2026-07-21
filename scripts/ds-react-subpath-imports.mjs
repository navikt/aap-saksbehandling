/**
 * Codemod: rewrite `import { X } from '@navikt/ds-react'` to subpath imports.
 *
 * Before:
 *   import { VStack, Button, BodyShort } from '@navikt/ds-react';
 *
 * After:
 *   import { Button } from '@navikt/ds-react/Button';
 *   import { BodyShort } from '@navikt/ds-react/Typography';
 *   import { VStack } from '@navikt/ds-react/Stack';
 *
 * Run: node scripts/ds-react-subpath-imports.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── 1. Build component → subpath map ──────────────────────────────────────────

const pkgPath = join(ROOT, 'node_modules/@navikt/ds-react/package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const exports_ = pkg.exports ?? {};

/** @type {Map<string, string>} component name → '@navikt/ds-react/Subpath' */
const componentToSubpath = new Map();

for (const [subpath, entry] of Object.entries(exports_)) {
  if (['.', './PREVIEW', './types/theme', './locales', './package.json'].includes(subpath)) continue;
  if (subpath.startsWith('./PREVIEW/')) continue;

  const esmRel = entry?.import?.default;
  if (!esmRel) continue;

  const esmBase = join(ROOT, 'node_modules/@navikt/ds-react', esmRel.replace(/^\.\//, ''));
  const candidates = [esmBase, esmBase.replace(/\.js$/, '.d.ts')];

  for (const filePath of candidates) {
    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch { continue; }

    for (const match of content.matchAll(/export(?:\s+type)? \{([^}]+)\}/g)) {
      for (const token of match[1].split(',')) {
        let name = token.trim().replace(/^type\s+/, '');
        if (name.includes(' as ')) name = name.split(' as ').at(-1).trim();
        if (name && /^[A-Z]/.test(name)) {
          componentToSubpath.set(name, `@navikt/ds-react${subpath.slice(1)}`);
        }
        // Also map hooks and other camelCase exports (e.g. useDatepicker, useMonthpicker)
        if (name && /^[a-z]/.test(name)) {
          componentToSubpath.set(name, `@navikt/ds-react${subpath.slice(1)}`);
        }
      }
    }
  }
}

function walk(dir, result = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, result);
    else if (/\.(tsx?|jsx?)$/.test(entry)) result.push(full);
  }
  return result;
}

const files = walk(ROOT).filter(f => !f.includes('/node_modules/') && !f.includes('/.next/'));

// ── 3. Process each file ──────────────────────────────────────────────────────

const BARREL = `'@navikt/ds-react'`;
const BARREL_DQ = `"@navikt/ds-react"`;

let changed = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');

  // Skip files that re-export the whole library — don't touch those
  if (original.includes(`export * from ${BARREL}`) || original.includes(`export * from ${BARREL_DQ}`)) {
    continue;
  }

  // Only process files that import from the ds-react barrel
  if (!original.includes(BARREL) && !original.includes(BARREL_DQ)) continue;

  // Match both single-line and multi-line import statements
  // Captures the full import block including braces
  const importRe = /import\s+(type\s+)?\{([^}]+)\}\s+from\s+['"]@navikt\/ds-react['"]\s*;?/gms;

  let result = original;
  let match;
  const replacements = [];

  while ((match = importRe.exec(original)) !== null) {
    const [fullMatch, typeKeyword, specifiersRaw] = match;
    const isTypeImport = Boolean(typeKeyword);

    // Parse specifiers: each can be:
    //   X
    //   X as Y
    //   type X
    //   type X as Y
    const specifiers = specifiersRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    /** @type {Map<string, string[]>} subpath → list of specifier strings */
    const bySubpath = new Map();
    const unknown = [];

    for (const spec of specifiers) {
      // Extract the "original" name (before any alias)
      const isTypeSpec = spec.startsWith('type ');
      const withoutType = isTypeSpec ? spec.slice(5).trim() : spec;
      const originalName = withoutType.includes(' as ')
        ? withoutType.split(' as ')[0].trim()
        : withoutType.trim();

      const subpath = componentToSubpath.get(originalName);
      if (!subpath) {
        unknown.push(spec);
        continue;
      }

      if (!bySubpath.has(subpath)) bySubpath.set(subpath, []);
      // Preserve `type` prefix if the whole import was `import type` or the specifier had `type`
      const prefix = isTypeImport || isTypeSpec ? 'type ' : '';
      bySubpath.get(subpath).push(prefix + withoutType);
    }

    // Build replacement lines
    const lines = [];
    for (const [subpath, specs] of [...bySubpath.entries()].sort()) {
      lines.push(`import { ${specs.join(', ')} } from '${subpath}';`);
    }
    if (unknown.length > 0) {
      // Keep any unknowns as a barrel import (shouldn't happen but be safe)
      lines.push(`import { ${unknown.join(', ')} } from '@navikt/ds-react';`);
    }

    replacements.push({ original: fullMatch, replacement: lines.join('\n') });
  }

  if (replacements.length === 0) continue;

  for (const { original: orig, replacement } of replacements) {
    result = result.replace(orig, replacement);
  }

  if (result !== original) {
    changed++;
    const rel = path.relative(ROOT, file);
    if (DRY_RUN) {
      console.log(`[dry-run] would rewrite: ${rel}`);
    } else {
      writeFileSync(file, result, 'utf8');
      console.log(`rewritten: ${rel}`);
    }
  }
}

console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}${changed} files ${DRY_RUN ? 'would be' : 'were'} changed.`);
