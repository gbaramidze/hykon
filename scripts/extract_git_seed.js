const fs = require('fs');
const { execSync } = require('child_process');

// Extract initial seedData from git commit 617f29e
const gitSeedContent = execSync('git show 617f29e:src/data/seedData.ts', { maxBuffer: 10 * 1024 * 1024 }).toString();

// Write to a temporary file
fs.writeFileSync('scripts/initial_seed_raw.ts', gitSeedContent);
console.log('Saved scripts/initial_seed_raw.ts, length:', gitSeedContent.length);
