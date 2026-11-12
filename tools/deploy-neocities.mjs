import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const site = 'vesaluna';
const manifestPath = 'neocities-sync.json';
const output = resolve(import.meta.dirname, '..', 'public-neocities');
const safePath = value => typeof value === 'string' && value.length > 0 &&
  !value.startsWith('/') && !value.includes('\\') && !value.split('/').some(part => !part || part === '.' || part === '..');

export function planSync(local, remote, previous) {
  if (previous && (previous.version !== 1 || previous.site !== site || !Array.isArray(previous.files) ||
    previous.files.some(file => !safePath(file)))) throw new Error('Invalid mirror manifest; no files were changed.');
  const hashes = new Map(remote.filter(file => !file.is_directory).map(file => [file.path, file.sha1_hash]));
  const names = new Set(local.map(file => file.path));
  return {
    changed: local.filter(file => hashes.get(file.path) !== file.sha1),
    removed: (previous?.files || []).filter(file => file !== 'index.html' && file !== manifestPath &&
      !names.has(file) && hashes.has(file))
  };
}

function localFiles(folder, prefix = '') {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const name = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${name}`);
    if (entry.isDirectory()) return localFiles(join(folder, entry.name), name + '/');
    if (!safePath(name) || name === manifestPath || ['CNAME', '.nojekyll'].includes(name)) throw new Error(`Unexpected file: ${name}`);
    const bytes = readFileSync(join(folder, entry.name));
    return [{ path: name, bytes, sha1: createHash('sha1').update(bytes).digest('hex') }];
  });
}

export async function deploy({ fetcher = fetch, files = localFiles(output), key = process.env.NEOCITIES_API_KEY,
  sleep = ms => new Promise(done => setTimeout(done, ms)), log = console.log } = {}) {
  if (!key) throw new Error('Add NEOCITIES_API_KEY to GitHub Actions repository secrets.');
  if (!['index.html', 'en/index.html', 'it/index.html'].every(path => files.some(file => file.path === path))) {
    throw new Error('Incomplete mirror build; refusing to deploy.');
  }
  const headers = { Authorization: `Bearer ${key.trim()}` };
  async function request(endpoint, body) {
    const response = await fetcher(`https://neocities.org/api/${endpoint}`, {
      method: body ? 'POST' : 'GET', headers, body, signal: AbortSignal.timeout(120000)
    });
    const data = await response.json();
    if (!response.ok || data.result !== 'success') throw new Error(`Neocities ${endpoint}: ${data.error_type || response.status}`);
    return data;
  }
  const { info } = await request('info');
  if (info?.sitename !== site) throw new Error(`API key must belong to ${site}; no files were changed.`);
  const { files: remote } = await request('list');
  let previous;
  if (remote.some(file => file.path === manifestPath && !file.is_directory)) {
    const response = await fetcher(`https://neocities.org/api/download?path=${manifestPath}`, {
      headers, signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) throw new Error('Cannot read mirror manifest; refusing to deploy.');
    previous = await response.json();
  }
  const plan = planSync(files, remote, previous);
  if (!plan.changed.length && !plan.removed.length) { log('Neocities is already up to date.'); return; }
  // Respect Neocities' requested minimum interval between recurring updates.
  const last = Date.parse(previous?.deployedAt || '');
  if (Number.isFinite(last)) {
    const wait = Math.min(600000, Math.max(0, 600000 - (Date.now() - last)));
    if (wait) { log(`Waiting ${Math.ceil(wait / 1000)} seconds before updating Neocities.`); await sleep(wait); }
  }
  async function upload(batch) {
    const form = new FormData();
    for (const file of batch) form.append(file.path, new Blob([file.bytes]), file.path.split('/').at(-1));
    await request('upload', form);
  }
  // Sequential batches avoid excessive API calls and stay below the request-size limit.
  let batch = [], size = 0;
  for (const file of plan.changed) {
    if (file.bytes.length > 40 * 1024 * 1024) throw new Error(`File too large: ${file.path}`);
    if (batch.length && (batch.length >= 40 || size + file.bytes.length > 40 * 1024 * 1024)) {
      await upload(batch); batch = []; size = 0;
    }
    batch.push(file); size += file.bytes.length;
  }
  if (batch.length) await upload(batch);
  // Verify all uploads before deleting anything or advancing the manifest.
  let listed = (await request('list')).files;
  let hashes = new Map(listed.filter(file => !file.is_directory).map(file => [file.path, file.sha1_hash]));
  if (files.some(file => hashes.get(file.path) !== file.sha1)) throw new Error('Remote hash verification failed; no old files were deleted.');
  if (plan.removed.length) {
    const body = new URLSearchParams();
    for (const name of plan.removed) body.append('filenames[]', name);
    await request('delete', body);
    listed = (await request('list')).files;
    if (listed.some(file => plan.removed.includes(file.path))) throw new Error('Old mirror files were not fully removed.');
  }
  const manifest = { version: 1, site, deployedAt: new Date().toISOString(), files: files.map(file => file.path) };
  await upload([{ path: manifestPath, bytes: Buffer.from(JSON.stringify(manifest)) }]);
  log(`Neocities synchronized: ${plan.changed.length} uploads, ${plan.removed.length} obsolete managed files removed.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  deploy().catch(error => { console.error(error.message); process.exitCode = 1; });
}
