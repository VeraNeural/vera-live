import { execSync } from 'node:child_process';
import fs from 'node:fs';

// Prompt/version change guard.
// Fails CI on PRs that modify prompt/policy files unless the PR has label: prompt-reviewed.

const PROMPT_PATHS = [
  /^src\/lib\/vera\/promptComposer\.ts$/,
  /^src\/lib\/vera\/.*Prompt\.ts$/,
  /^src\/lib\/vera\/ibaPolicy\.ts$/,
  /^src\/lib\/vera\/modelSelection\.ts$/,
  /^src\/lib\/vera\/adaptiveCodes\.ts$/,
  /^src\/lib\/vera\/noDrift\.ts$/,
];

function getChangedFiles() {
  // In PRs, compare against the merge base.
  // For pushes, compare against previous commit.
  const isPR = process.env.GITHUB_EVENT_NAME === 'pull_request' || process.env.GITHUB_EVENT_NAME === 'pull_request_target';

  let diffRange = 'HEAD~1..HEAD';
  if (isPR) {
    const base = process.env.GITHUB_BASE_REF;
    if (base) {
      try {
        execSync(`git fetch origin ${base} --depth=1`, { stdio: 'ignore' });
      } catch {
        // ignore
      }
      diffRange = `origin/${base}...HEAD`;
    }
  }

  const out = execSync(`git diff --name-only ${diffRange}`, { encoding: 'utf8' });
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

function isPromptChange(file) {
  return PROMPT_PATHS.some((re) => re.test(file));
}

function prHasLabel(label) {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) return false;
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const labels = (event.pull_request?.labels ?? []).map((l) => l.name);
  return labels.includes(label);
}

const changed = getChangedFiles();
const promptChanged = changed.filter(isPromptChange);

if (promptChanged.length === 0) {
  console.log('✅ No prompt/policy changes detected');
  process.exit(0);
}

console.log('⚠️ Prompt/policy files changed:');
for (const f of promptChanged) console.log(`- ${f}`);

const isPR = process.env.GITHUB_EVENT_NAME === 'pull_request' || process.env.GITHUB_EVENT_NAME === 'pull_request_target';

if (isPR) {
  if (prHasLabel('prompt-reviewed')) {
    console.log("✅ 'prompt-reviewed' label present");
    process.exit(0);
  }

  console.error("❌ Missing required PR label: 'prompt-reviewed'");
  process.exit(1);
}

// For direct pushes, force a failure so prompt changes can't silently land.
console.error('❌ Prompt/policy changes are not allowed via direct push. Use a PR with prompt-reviewed label.');
process.exit(1);
