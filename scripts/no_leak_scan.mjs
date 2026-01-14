import fs from 'node:fs';
import path from 'node:path';

// Static CI scan: user-visible UI text should not contain internal names.
// This intentionally scans *client* surfaces only to avoid false positives in internal guardrails.

const FORBIDDEN = [
  'Neural',
  'IBA',
  'Anthropic',
  'OpenAI',
  'Grok',
  'Claude',
  'GPT',
  'DecisionObject',
  'Band 1',
  'Band 2',
  'Band 3',
  'Band 4',
  'Band 5',
];

const ROOT = process.cwd();

const TARGET_DIRS = [
  'src/app',
  'src/components',
].map((p) => path.join(ROOT, p));

const EXCLUDE_DIRS = new Set([
  path.join(ROOT, 'src', 'app', 'api'),
  path.join(ROOT, 'node_modules'),
  path.join(ROOT, '.next'),
]);

function isExcluded(filePath) {
  for (const ex of EXCLUDE_DIRS) {
    if (filePath.startsWith(ex)) return true;
  }
  return false;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (isExcluded(full)) continue;
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function isTextFile(f) {
  return f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.md');
}

let failures = 0;

for (const dir of TARGET_DIRS) {
  const files = walk(dir).filter(isTextFile);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    for (const term of FORBIDDEN) {
      // Ignore occurrences in comments that clearly indicate "internal".
      // This scan is conservative; keep it simple.
      if (content.includes(term)) {
        console.error(`❌ Forbidden term '${term}' found in ${path.relative(ROOT, file)}`);
        failures++;
        break;
      }
    }
  }
}

if (failures) {
  process.exit(1);
}

console.log('✅ No leakage terms found in user-facing paths');
