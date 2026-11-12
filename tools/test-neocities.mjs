import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { deploy, planSync } from './deploy-neocities.mjs';

const hash = bytes => createHash('sha1').update(bytes).digest('hex');
const files = ['index.html', 'en/index.html', 'it/index.html'].map(path => {
  const bytes = Buffer.from(`new ${path}`);
  return { path, bytes, sha1: hash(bytes) };
});
const previous = { version: 1, site: 'vesaluna', deployedAt: '2000-01-01', files: ['index.html', 'old/index.html'] };
const remote = [{ path: 'old/index.html', sha1_hash: 'old' }, { path: 'unrelated.png', sha1_hash: 'keep' }];
assert.deepEqual(planSync(files, remote, previous).removed, ['old/index.html']);
assert.deepEqual(planSync(files, remote).removed, []);
assert.throws(() => planSync(files, remote, { ...previous, files: ['../escape'] }));

function mock({ wrongSite = false, failedUpload = false, corrupt = false } = {}) {
  const stored = new Map(remote.map(file => [file.path, file.sha1_hash]));
  stored.set('neocities-sync.json', 'manifest');
  const operations = [];
  return { stored, operations, fetcher: async (url, options = {}) => {
    const endpoint = new URL(url).pathname.split('/').at(-1);
    operations.push(endpoint);
    const reply = data => Response.json({ result: 'success', ...data });
    if (endpoint === 'info') return reply({ info: { sitename: wrongSite ? 'other-site' : 'vesaluna' } });
    if (endpoint === 'list') return reply({ files: [...stored].map(([path, sha1_hash]) => ({ path, sha1_hash, is_directory: false })) });
    if (endpoint === 'download') return Response.json(previous);
    if (endpoint === 'upload') {
      if (failedUpload) return Response.json({ result: 'error', error_type: 'upload_failed' }, { status: 400 });
      for (const [path, blob] of options.body.entries()) {
        stored.set(path, corrupt ? 'wrong-hash' : hash(Buffer.from(await blob.arrayBuffer())));
      }
      return reply({});
    }
    if (endpoint === 'delete') {
      for (const path of options.body.getAll('filenames[]')) stored.delete(path);
      return reply({});
    }
    throw new Error(`Unexpected endpoint: ${endpoint}`);
  } };
}

const success = mock();
await deploy({ files, key: 'test-only', fetcher: success.fetcher, log: () => {} });
assert(!success.stored.has('old/index.html'));
assert(success.stored.has('unrelated.png'));
assert(success.operations.indexOf('delete') > success.operations.indexOf('upload'));
for (const options of [{ failedUpload: true }, { corrupt: true }, { wrongSite: true }]) {
  const api = mock(options);
  await assert.rejects(deploy({ files, key: 'test-only', fetcher: api.fetcher, log: () => {} }));
  assert(!api.operations.includes('delete'));
}
console.log('Verified Neocities synchronization, unrelated-file preservation and failure protection (mock API; no remote writes).');
