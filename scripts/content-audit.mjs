import { isHttpUrl, loadConfig, parseArgs, printResult } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const errors = [];
const warnings = [];

const sources = Array.isArray(config.sources) ? config.sources : [];
const claims = Array.isArray(config.claims) ? config.claims : [];
const sourceIds = new Set();
const sourceMap = new Map();

if (sources.length === 0) errors.push('At least one research source is required.');
for (const source of sources) {
  if (!source?.id) {
    errors.push('Every source requires a stable id.');
    continue;
  }
  if (sourceIds.has(source.id)) errors.push(`Duplicate source id: ${source.id}.`);
  sourceIds.add(source.id);
  sourceMap.set(source.id, source);
  if (!isHttpUrl(source.url || '')) errors.push(`Source ${source.id} must use an http(s) URL.`);
  if (source.retrievedAt) {
    const parsed = Date.parse(source.retrievedAt);
    if (!Number.isFinite(parsed)) errors.push(`Source ${source.id} has invalid retrievedAt: ${source.retrievedAt}.`);
    else if (parsed > Date.now() + 24 * 60 * 60 * 1000) errors.push(`Source ${source.id} retrievedAt is in the future.`);
  }
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
  if (!['stable', 'volatile'].includes(claim.volatility)) {
    errors.push(`Claim ${claim.id} must declare volatility as stable or volatile.`);
  }
  if (config.status?.research === 'resolved' && claim.status !== 'verified') {
    errors.push(`Resolved research cannot ship non-verified claim ${claim.id}.`);
  }

  if (claim.volatility === 'volatile') {
    const maxAgeDays = Number(claim.maxAgeDays);
    if (!Number.isInteger(maxAgeDays) || maxAgeDays < 1) {
      errors.push(`Volatile claim ${claim.id} requires a positive integer maxAgeDays.`);
      continue;
    }
    const timestamps = (claim.sourceIds || [])
      .map((sourceId) => sourceMap.get(sourceId)?.retrievedAt)
      .filter(Boolean)
      .map((value) => Date.parse(value))
      .filter(Number.isFinite);
    if (timestamps.length === 0) {
      errors.push(`Volatile claim ${claim.id} requires at least one referenced source with retrievedAt.`);
      continue;
    }
    const newest = Math.max(...timestamps);
    const ageDays = (Date.now() - newest) / (24 * 60 * 60 * 1000);
    if (ageDays > maxAgeDays) {
      errors.push(`Volatile claim ${claim.id} is stale (${ageDays.toFixed(1)} days old; max ${maxAgeDays}). Refresh its source before release.`);
    } else if (ageDays > maxAgeDays * 0.8) {
      warnings.push(`Volatile claim ${claim.id} is nearing its freshness limit (${ageDays.toFixed(1)}/${maxAgeDays} days).`);
    }
  } else if (claim.maxAgeDays != null) {
    warnings.push(`Stable claim ${claim.id} defines maxAgeDays; remove it unless the fact is actually volatile.`);
  }
}

const official = sources.some((source) => ['official-site', 'itch', 'steam', 'developer', 'devlog'].includes(source.type));
if (!official) warnings.push('No first-party/official research source is recorded.');

const ok = printResult(`Content provenance audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);
