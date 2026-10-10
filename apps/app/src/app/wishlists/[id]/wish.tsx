import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { goBack } from '@/lib/navigation';
import { addWish, deleteWish, updateWish, type Wish, type WishDraft } from '@/lists/api';
import { normalizeLink } from '@/lists/link';
import { currencies, parsePrice, priceInput } from '@/lists/money';
import { useListMutation, useWishlist } from '@/lists/queries';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { TextField } from '@/ui/TextField';

// Adds a wish to a list, or edits one with `?wish=`. Only the name is required.
export default function WishForm() {
  const { id, wish: wishId } = useLocalSearchParams<{ id: string; wish?: string }>();
  const list = useWishlist(id);
  if (!list.data?.is_owner) return null;
  const wish = wishId ? list.data.wishes.find((candidate) => candidate.id === wishId) : undefined;
  if (wishId && !wish) return null;
  return <Form listId={id} wish={wish} />;
}

type Errors = Partial<Record<'name' | 'price' | 'link', boolean>>;

function Form({ listId, wish }: { listId: string; wish?: Wish }) {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const back = () => goBack({ pathname: '/wishlists/[id]', params: { id: listId } });

  const [name, setName] = useState(wish?.name ?? '');
  const [price, setPrice] = useState(priceInput(wish?.price_cents ?? null, i18n.language));
  const [currency, setCurrency] = useState(wish?.currency ?? 'EUR');
  const [link, setLink] = useState(wish?.url ?? '');
  const [details, setDetails] = useState(wish?.description ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = useListMutation(listId, (draft: WishDraft) =>
    wish ? updateWish(wish.id, draft) : addWish(listId, draft),
  );
  const remove = useListMutation(listId, deleteWish);

  // Errors are checked on submit, then each one clears as soon as its field changes.
  function submit() {
    const parsedPrice = parsePrice(price);
    const parsedLink = normalizeLink(link);
    const found: Errors = {
      name: name.trim() === '',
      price: 'error' in parsedPrice,
      link: 'error' in parsedLink,
    };
    setErrors(found);
    if (found.name || 'error' in parsedPrice || 'error' in parsedLink) return;
    save.mutate(
      [
        {
          name: name.trim(),
          price_cents: parsedPrice.cents,
          currency,
          url: parsedLink.url,
          description: details.trim() || null,
        },
      ],
      { onSuccess: back },
    );
  }

  const title = wish ? t('wishForm.editTitle') : t('wishForm.newTitle');

  return (
    <Screen title={title}>
      <Text variant="title">{title}</Text>

      <TextField
        label={t('wishForm.nameLabel')}
        placeholder={t('wishForm.namePlaceholder')}
        value={name}
        onChangeText={(value) => {
          setName(value);
          setErrors((current) => ({ ...current, name: false }));
        }}
        error={errors.name ? t('wishForm.errors.name') : null}
        maxLength={255}
        autoFocus={!wish}
        autoCapitalize="sentences"
        enterKeyHint="next"
      />

      <View style={styles.field}>
        <TextField
          label={t('wishForm.priceLabel')}
          placeholder={t('wishForm.pricePlaceholder')}
          value={price}
          onChangeText={(value) => {
            setPrice(value);
            setErrors((current) => ({ ...current, price: false }));
          }}
          error={errors.price ? t('wishForm.errors.price') : null}
          keyboardType="decimal-pad"
          inputMode="decimal"
        />
        <View role="radiogroup" aria-label={t('wishForm.currencyLabel')} style={styles.currencies}>
          {currencies.map((code) => {
            const selected = code === currency;
            return (
              <Pressable
                key={code}
                role="radio"
                aria-checked={selected}
                onPress={() => setCurrency(code)}
                style={({ pressed }) => [
                  styles.currency,
                  {
                    backgroundColor: selected ? colors.text : 'transparent',
                    borderColor: selected ? colors.text : colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.currencyLabel, { color: selected ? colors.background : colors.text }]}>
                  {code}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <TextField
        label={t('wishForm.linkLabel')}
        placeholder={t('wishForm.linkPlaceholder')}
        value={link}
        onChangeText={(value) => {
          setLink(value);
          setErrors((current) => ({ ...current, link: false }));
        }}
        error={errors.link ? t('wishForm.errors.link') : null}
        keyboardType="url"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        maxLength={2048}
      />

      <TextField
        label={t('wishForm.detailsLabel')}
        placeholder={t('wishForm.detailsPlaceholder')}
        value={details}
        onChangeText={setDetails}
        multiline
        maxLength={1000}
      />

      {save.isError ? (
        <Text role="alert" style={{ color: colors.danger }}>
          {t('common.genericError')}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button label={wish ? t('wishForm.save') : t('wishForm.add')} loading={save.isPending} onPress={submit} />
        <Button variant="secondary" label={t('wishForm.cancel')} disabled={save.isPending} onPress={back} />
        {wish ? (
          <Button
            variant="secondary"
            label={t('wishForm.delete')}
            disabled={save.isPending}
            onPress={() => setConfirmDelete(true)}
          />
        ) : null}
      </View>

      {wish ? (
        <Dialog
          visible={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          title={t('wishForm.deleteTitle')}
          body={t('wishForm.deleteBody')}
        >
          {remove.isError ? (
            <Text role="alert" style={{ color: colors.danger }}>
              {t('common.genericError')}
            </Text>
          ) : null}
          <Button
            variant="danger"
            label={t('wishForm.deleteConfirm')}
            loading={remove.isPending}
            onPress={() => remove.mutate([wish.id], { onSuccess: back })}
          />
          <Button
            variant="secondary"
            label={t('wishForm.cancel')}
            disabled={remove.isPending}
            onPress={() => setConfirmDelete(false)}
          />
        </Dialog>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.md },
  currencies: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  currency: {
    minWidth: minTouchTarget + 12,
    minHeight: minTouchTarget,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyLabel: { fontFamily: fonts.semiBold, fontSize: 15 },
  pressed: { opacity: 0.7 },
  actions: { gap: space.md },
});
