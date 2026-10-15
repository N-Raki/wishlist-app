import { supabase } from '@/lib/supabase';
import { completeRedirect, redirectParams } from './oauthRedirect';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { exchangeCodeForSession: jest.fn() } },
}));

const auth = jest.mocked(supabase.auth);

test.each([
  ['wishme://auth/callback?code=abc-123', { code: 'abc-123', error: undefined }],
  ['exp://192.168.1.10:8081/--/auth/callback?code=abc', { code: 'abc', error: undefined }],
  [
    'wishme://auth/callback#error=access_denied&error_description=The+user+denied',
    { code: undefined, error: 'access_denied' },
  ],
  ['wishme://auth/callback', { code: undefined, error: undefined }],
])('reads %s', (url, expected) => {
  expect(redirectParams(url)).toEqual(expected);
});

test('says nothing when the user backed out at Google', async () => {
  await expect(completeRedirect({ error: 'access_denied' })).resolves.toBe('cancelled');
});

test('reports any other refusal', async () => {
  await expect(completeRedirect({ error: 'server_error' })).resolves.toBe('providerFailed');
  await expect(completeRedirect({})).resolves.toBe('providerFailed');
});

test('exchanges each code once, even when the redirect arrives twice', async () => {
  auth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: null } as never);
  const results = await Promise.all([completeRedirect({ code: 'once' }), completeRedirect({ code: 'once' })]);
  expect(results).toEqual([null, null]);
  expect(auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
});
