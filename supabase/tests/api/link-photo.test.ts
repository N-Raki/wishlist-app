// Finding a product's photo from its link (functions/link-photo). The function fetches
// addresses chosen by users, so most of these tests check what it refuses to reach.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findImageUrl, isPrivateAddress, parseWebUrl } from '../../functions/link-photo/lib.ts';
import { anonymousClient, signedInUser } from './helpers.ts';

test('reads the picture a page offers for sharing', () => {
  const page = `<html><head>
    <meta name="twitter:image" content="https://cdn.shop.fr/twitter.jpg">
    <meta content="/images/casque.jpg?w=800&amp;h=1000" property="og:image" />
  </head></html>`;
  assert.equal(findImageUrl(page, 'https://shop.fr/p/casque'), 'https://shop.fr/images/casque.jpg?w=800&h=1000');
  assert.equal(
    findImageUrl('<meta name="twitter:image" content=\'https://a.fr/t.png\'>', 'https://a.fr'),
    'https://a.fr/t.png',
  );
  assert.equal(findImageUrl('<title>Rien</title>', 'https://a.fr'), null);
});

test('only reaches public web servers', () => {
  assert.ok(parseWebUrl('https://www.fnac.com/a123'));
  for (const address of [
    'ftp://shop.fr/file',
    'javascript:alert(1)',
    'http://localhost/admin',
    'http://127.0.0.1/',
    'http://10.0.0.8/',
    'http://169.254.169.254/latest/meta-data',
    'http://[::1]/',
    'http://[fd00::1]/',
    'https://shop.fr:8443/',
    'https://user:secret@shop.fr/',
    'http://intranet/',
    'http://printer.local/',
  ]) {
    assert.equal(parseWebUrl(address), null, address);
  }
});

test('tells private addresses from public ones', () => {
  for (const address of [
    '10.1.2.3',
    '172.20.0.1',
    '192.168.1.1',
    '100.64.0.1',
    '0.0.0.0',
    '::1',
    'fe80::1',
    '::ffff:127.0.0.1',
  ])
    assert.equal(isPrivateAddress(address), true, address);
  for (const address of ['93.184.216.34', '2a00:1450:4007:80e::200e'])
    assert.equal(isPrivateAddress(address), false, address);
});

test('only signed-in users may use it, with a web address', async () => {
  const anonymous = await anonymousClient().functions.invoke('link-photo', { body: { url: 'https://shop.fr' } });
  assert.equal(anonymous.response?.status, 401);

  const lea = await signedInUser('Léa');
  for (const url of ['http://127.0.0.1:54321/rest/v1/', 'http://kong:8000/', 'not a link']) {
    const { response } = await lea.client.functions.invoke('link-photo', { body: { url } });
    assert.equal(response?.status, 400, url);
  }
});
