import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { type PasswordResult, passwordMinLength, savePassword } from '@/account/password';
import { useSession } from '@/auth/SessionProvider';
import { goBack } from '@/lib/navigation';
import { space } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { closeButton } from '@/ui/stackOptions';
import { Text } from '@/ui/Text';
import { TextField } from '@/ui/TextField';

type Problem = Exclude<PasswordResult, 'saved' | 'needsCode'> | 'tooShort';

// Sets or changes the optional password, from the account page. Signing in with a code by
// e-mail keeps working either way; it is also how to get in after forgetting the password.
export default function Password() {
  const { t } = useTranslation();
  const { session } = useSession();
  const [password, setPassword] = useState('');
  // Set when the server asks to confirm with a code first (an account not signed in recently).
  const [code, setCode] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (password.length < passwordMinLength) return setProblem('tooShort');
    setBusy(true);
    const result = await savePassword(password, code ?? undefined);
    setBusy(false);
    if (result === 'saved') return goBack('/account');
    if (result === 'needsCode') {
      setCode('');
      setProblem(null);
      return;
    }
    setProblem(result);
  }

  const message = problem && (problem === 'unknown' ? t('common.genericError') : t(`password.errors.${problem}`));

  return (
    <Screen title={t('password.title')} action={<Button label={t('password.save')} loading={busy} onPress={submit} />}>
      <Stack.Screen options={closeButton(t('common.close'), () => goBack('/account'))} />
      <View style={{ gap: space.sm }}>
        <Text variant="title">{t('password.title')}</Text>
        <Text tone="secondary">{t('password.body', { count: passwordMinLength })}</Text>
      </View>
      <Text variant="bodyStrong">{t('password.account', { email: session?.user.email })}</Text>
      <TextField
        label={t('password.label')}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setProblem(null);
        }}
        error={code === null ? message : null}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        enterKeyHint="done"
        onSubmitEditing={submit}
      />
      {code !== null ? (
        <>
          <Text role="status" tone="secondary">
            {t('password.codeBody', { email: session?.user.email })}
          </Text>
          <TextField
            label={t('signIn.codeLabel')}
            value={code}
            onChangeText={(value) => {
              setCode(value.replace(/\D/g, ''));
              setProblem(null);
            }}
            error={message}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            enterKeyHint="done"
            onSubmitEditing={submit}
          />
        </>
      ) : null}
    </Screen>
  );
}
