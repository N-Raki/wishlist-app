import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { isValidEmail, type SignInError, sendCode, verifyCode } from '@/auth/signIn';
import { space } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { TextField } from '@/ui/TextField';
import { TextLink } from '@/ui/TextLink';

// Two steps on one screen: e-mail, then the code. Once verified, the session changes and the
// root layout's guards take the user home.
export default function SignIn() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<SignInError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const errorMessage = error && (error === 'unknown' ? t('common.genericError') : t(`signIn.errors.${error}`));

  async function run(action: () => Promise<SignInError | null>, onSuccess?: () => void) {
    setBusy(true);
    setNotice(null);
    const result = await action();
    setBusy(false);
    setError(result);
    if (!result) onSuccess?.();
  }

  function submitEmail() {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) return setError('invalidEmail');
    run(
      () => sendCode(trimmed),
      () => setStep('code'),
    );
  }

  if (step === 'email') {
    return (
      <Screen title={t('signIn.title')}>
        <View style={{ gap: space.sm }}>
          <Text variant="title">{t('signIn.emailHeading')}</Text>
          <Text tone="secondary">{t('signIn.emailBody')}</Text>
        </View>
        <TextField
          label={t('signIn.emailLabel')}
          value={email}
          onChangeText={setEmail}
          error={errorMessage}
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          enterKeyHint="send"
          onSubmitEditing={submitEmail}
        />
        <Button label={t('signIn.sendCode')} loading={busy} onPress={submitEmail} />
        <Text variant="caption" tone="secondary">
          {t('signIn.privacyNotice')} <TextLink href="/privacy">{t('signIn.privacyLink')}</TextLink>.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen title={t('signIn.title')}>
      <View style={{ gap: space.sm }}>
        <Text variant="title">{t('signIn.codeHeading')}</Text>
        <Text tone="secondary">{t('signIn.codeSent', { email: email.trim() })}</Text>
      </View>
      <TextField
        label={t('signIn.codeLabel')}
        value={code}
        onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
        error={errorMessage}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        enterKeyHint="go"
        onSubmitEditing={() => run(() => verifyCode(email.trim(), code))}
      />
      <Button label={t('signIn.verify')} loading={busy} onPress={() => run(() => verifyCode(email.trim(), code))} />
      <View style={{ gap: space.md }}>
        <Button
          variant="secondary"
          label={t('signIn.resend')}
          disabled={busy}
          onPress={() =>
            run(
              () => sendCode(email.trim()),
              () => setNotice(t('signIn.resent')),
            )
          }
        />
        <Button
          variant="secondary"
          label={t('signIn.changeEmail')}
          disabled={busy}
          onPress={() => {
            setStep('email');
            setCode('');
            setError(null);
          }}
        />
      </View>
      {notice ? (
        <Text role="status" tone="secondary">
          {notice}
        </Text>
      ) : null}
    </Screen>
  );
}
