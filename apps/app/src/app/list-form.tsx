import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { goBack } from '@/lib/navigation';
import { createList, renameList } from '@/lists/api';
import { useListMutation, useWishlist } from '@/lists/queries';
import { space } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { TextField } from '@/ui/TextField';

// Creates a list (a name is all it takes, docs/spec.md), or renames one with `?id=`.
// A new list opens right away, ready for its first wish.
export default function ListForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id ? <RenameList id={id} /> : <NewList />;
}

function NewList() {
  const { t } = useTranslation();
  const create = useListMutation(undefined, createList);
  return (
    <NameForm
      title={t('listForm.createTitle')}
      submitLabel={t('listForm.create')}
      initialName=""
      busy={create.isPending}
      failed={create.isError}
      onSubmit={(name) =>
        create.mutate([name], { onSuccess: (id) => router.replace({ pathname: '/wishlists/[id]', params: { id } }) })
      }
    />
  );
}

function RenameList({ id }: { id: string }) {
  const { t } = useTranslation();
  const list = useWishlist(id);
  const rename = useListMutation(id, renameList);
  if (!list.data) return null;
  return (
    <NameForm
      title={t('listForm.renameTitle')}
      submitLabel={t('listForm.save')}
      initialName={list.data.name}
      busy={rename.isPending}
      failed={rename.isError}
      onSubmit={(name) => rename.mutate([id, name], { onSuccess: () => goBack() })}
    />
  );
}

type NameFormProps = {
  title: string;
  submitLabel: string;
  initialName: string;
  busy: boolean;
  failed: boolean;
  onSubmit: (name: string) => void;
};

function NameForm({ title, submitLabel, initialName, busy, failed, onSubmit }: NameFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [missing, setMissing] = useState(false);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return setMissing(true);
    onSubmit(trimmed);
  }

  return (
    <Screen title={title}>
      <Text variant="title">{title}</Text>
      <TextField
        label={t('listForm.nameLabel')}
        placeholder={t('listForm.namePlaceholder')}
        value={name}
        onChangeText={(value) => {
          setName(value);
          setMissing(false);
        }}
        error={missing ? t('listForm.nameRequired') : failed ? t('common.genericError') : null}
        maxLength={50}
        autoFocus
        autoCapitalize="sentences"
        enterKeyHint="done"
        onSubmitEditing={submit}
      />
      <View style={{ gap: space.md }}>
        <Button label={submitLabel} loading={busy} onPress={submit} />
        <Button variant="secondary" label={t('listForm.cancel')} disabled={busy} onPress={() => goBack()} />
      </View>
    </Screen>
  );
}
