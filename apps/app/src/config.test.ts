import { resolveConfig } from './config';

test('runs against the local stack by default', () => {
  expect(resolveConfig(undefined)).toMatchObject({ environment: 'local', supabaseUrl: 'http://127.0.0.1:54321' });
});

test('refuses an unknown environment rather than guessing', () => {
  expect(() => resolveConfig('staging')).toThrow('Unknown EXPO_PUBLIC_APP_ENV "staging"');
});
