import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useNameRequirement } from '@/account/queries';
import { useDisplayNameForm } from '@/account/useDisplayNameForm';
import { useSession } from '@/auth/SessionProvider';
import { isValidEmail, type SignInError, sendCode, signInWithPassword, verifyCode } from '@/auth/signIn';
import { goBack } from '@/lib/navigation';
import { pendingReservation } from '@/lists/pendingReservation';
import { useWishlist } from '@/lists/queries';
import { space } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { closeButton } from '@/ui/stackOptions';
import { Text } from '@/ui/Text';
import { TextField } from '@/ui/TextField';
import { TextLink } from '@/ui/TextLink';

// Steps on one screen: e-mail, then the code (or a password, for accounts that chose one),
// then a display name on the first sign-in.
// Once signed in and named, the root layout's guards close this sheet, back to the page that
// opened it.
// Opened from a wish to reserve (`list` and `wish`), it names that wish, and the wish page
// reserves it as soon as the user is signed in.
export default function SignIn() {
  const { session } = useSession();
  // The sheet stays open on the name step until a name is chosen: it cannot be skipped.
  if (session) return <NameStep />;
  return <CodeSteps />;
}

function NameStep() {
  const { t } = useTranslation();
  const requirement = useNameRequirement();
  const form = useDisplayNameForm('');
  if (requirement !== 'required') return null;
  return (
    <Screen
      title={t('signIn.title')}
      action={<Button label={t('profile.continue')} loading={form.busy} onPress={form.submit} />}
    >
      <Stack.Screen options={{ headerLeft: () => null, gestureEnabled: false }} />
      <View style={{ gap: space.sm }}>
        <Text variant="title">{t('profile.nameHeading')}</Text>
        <Text tone="secondary">{t('profile.nameBody')}</Text>
      </View>
      {form.field}
    </Screen>
  );
}

function CodeSteps() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ list?: string; wish?: string }>();
  const list = useWishlist(params.list ?? '', { enabled: Boolean(params.list) });
  const wishName = list.data?.wishes.find((wish) => wish.id === params.wish)?.name;
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [password, setPassword] = useState('');
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

  function signInWith(attempt: () => Promise<SignInError | null>) {
    // Set before signing in: the sheet may close as soon as the session exists.
    pendingReservation.set(wishName ? (params.wish ?? null) : null);
    run(async () => {
      const result = await attempt();
      if (result) pendingReservation.set(null);
      return result;
    });
  }

  const submitCode = () => signInWith(() => verifyCode(email.trim(), code));

  function submitPassword() {
    if (!isValidEmail(email.trim())) return setError('invalidEmail');
    signInWith(() => signInWithPassword(email.trim(), password));
  }

  function goTo(next: typeof step) {
    setStep(next);
    setError(null);
    setNotice(null);
  }

  const header = (
    <Stack.Screen
      options={{ headerLeft: router.canGoBack() ? closeButton(t('common.close'), () => goBack()) : undefined }}
    />
  );

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
        {header}
        <View style={{ gap: space.sm }}>
          <Text variant="title">
            {wishName ? t('reservation.signInHeading', { name: wishName }) : t('signIn.emailHeading')}
          </Text>
          <Text tone="secondary">{wishName ? t('reservation.signInBody') : t('signIn.emailBody')}</Text>
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
        <Button variant="secondary" label={t('signIn.usePassword')} disabled={busy} onPress={() => goTo('password')} />
        <Text variant="caption" tone="secondary">
          {t('signIn.privacyNotice')} <TextLink href="/privacy">{t('signIn.privacyLink')}</TextLink>.
        </Text>
      </Screen>
    );
  }

  if (step === 'password') {
    return (
      <Screen title={t('signIn.title')}>
        {header}
        <Text variant="title">
          {wishName ? t('reservation.signInHeading', { name: wishName }) : t('signIn.passwordHeading')}
        </Text>
        <TextField
          label={t('signIn.emailLabel')}
          value={email}
          onChangeText={setEmail}
          error={error === 'invalidEmail' ? errorMessage : null}
          autoComplete="email"
          textContentType="username"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          enterKeyHint="next"
        />
        <TextField
          label={t('signIn.passwordLabel')}
          value={password}
          onChangeText={setPassword}
          error={error && error !== 'invalidEmail' ? errorMessage : null}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={Boolean(email)}
          enterKeyHint="go"
          onSubmitEditing={submitPassword}
        />
        <Button label={t('signIn.verify')} loading={busy} onPress={submitPassword} />
        <Button variant="secondary" label={t('signIn.useCode')} disabled={busy} onPress={() => goTo('email')} />
      </Screen>
    );
  }

  return (
    <Screen title={t('signIn.title')}>
      {header}
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
        onSubmitEditing={submitCode}
      />
      <Button label={t('signIn.verify')} loading={busy} onPress={submitCode} />
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
            goTo('email');
            setCode('');
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
