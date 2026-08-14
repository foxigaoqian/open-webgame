import { isHttpUrl, loadConfig, parseArgs, printResult } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const errors = [];
const warnings = [];

const sources = Array.isArray(config.sources) ? config.sources : [];
const claims = Array.isArray(config.claims) ? config.claims : [];
const sourceIds = new Set();

if (sources.length === 0) errors.push('At least one research source is required.');
for (const source of sources) {
  if (!source?.id) {
    errors.push('Every source requires a stable id.');
    continue;
  }
  if (sourceIds.has(source.id)) errors.push(`Duplicate source id: ${source.id}.`);
  sourceIds.add(source.id);
  if (!isHttpUrl(source.url || '')) errors.push(`Source ${source.id} must use an http(s) URL.`);
}

if (config.status?.research === 'resolved' && claims.length === 0) {
  errors.push('Resolved research requires at least one tracked factual claim.');
}

const claimIds = new Set();
for (const claim of claims) {
  if (!claim?.id) {
    errors.push('Every claim requires a stable id.');
    continue;
  }
  if (claimIds.has(claim.id)) errors.push(`Duplicate claim id: ${claim.id}.`);
  claimIds.add(claim.id);
  if (!String(claim.text || '').trim()) errors.push(`Claim ${claim.id} has no text.`);
  if (!Array.isArray(claim.sourceIds) || claim.sourceIds.length === 0) {
    errors.push(`Claim ${claim.id} has no sourceIds.`);
  } else {
    for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Claim ${claim.id} references unknown source ${sourceId}.`);
    }
  }
  if (!['verified', 'pending', 'rejected'].includes(claim.status)) {
    errors.push(`Claim ${claim.id} has invalid status ${claim.status}.`);
  }
  if (config.status?.deploymentReady === true && claim.status !== 'verified') {
    errors.push(`Deployment-ready content cannot rely on non-verified claim ${claim.id}.`);
  }
}

const official = sources.some((source) => ['official-site', 'itch', 'steam', 'developer', 'devlog'].includes(source.type));
if (!official) warnings.push('No first-party/official research source is recorded.');

const ok = printResult(`Content provenance audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);
