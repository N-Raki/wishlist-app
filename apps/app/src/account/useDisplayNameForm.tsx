import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@/ui/TextField';
import { displayNameMaxLength } from './profile';
import { useSaveDisplayName } from './queries';

/** The display name field and its submit, shared by the first sign-in and the account page. */
export function useDisplayNameForm(initialName: string, onSaved?: () => void) {
  const { t } = useTranslation();
  const save = useSaveDisplayName();
  const [name, setName] = useState(initialName);
  const [missing, setMissing] = useState(false);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return setMissing(true);
    save.mutate(trimmed, { onSuccess: () => onSaved?.() });
  }

  const field = (
    <TextField
      label={t('profile.nameLabel')}
      value={name}
      onChangeText={(value) => {
        setName(value);
        setMissing(false);
      }}
      error={missing ? t('profile.nameRequired') : save.isError ? t('common.genericError') : null}
      maxLength={displayNameMaxLength}
      autoComplete="nickname"
      textContentType="nickname"
      autoCapitalize="words"
      autoFocus
      enterKeyHint="done"
      onSubmitEditing={submit}
    />
  );

  return { field, submit, busy: save.isPending };
}
