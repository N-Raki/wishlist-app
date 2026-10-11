import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { goBack } from '@/lib/navigation';
import { addWish, deleteWish, updateWish, type Wish, type WishDraft } from '@/lists/api';
import { normalizeLink } from '@/lists/link';
import { currencies, parsePrice, priceInput } from '@/lists/money';
import { deletePhotos, type LocalPhoto, photoFromLink, photoUrl, pickPhoto, uploadPhoto } from '@/lists/photos';
import { useListMutation, useWishlist } from '@/lists/queries';
import { WishArt } from '@/lists/WishGrid';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { Screen } from '@/ui/Screen';
import { closeButton } from '@/ui/stackOptions';
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

/** No photo, the one already saved, or one just picked on the device. */
type PhotoState = null | { saved: string } | LocalPhoto;

function Form({ listId, wish }: { listId: string; wish?: Wish }) {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const back = () => goBack({ pathname: '/wishlists/[id]', params: { id: listId } });

  const [name, setName] = useState(wish?.name ?? '');
  const [price, setPrice] = useState(priceInput(wish?.price_cents ?? null, i18n.language));
  const [currency, setCurrency] = useState(wish?.currency ?? 'EUR');
  const [link, setLink] = useState(wish?.url ?? '');
  const [details, setDetails] = useState(wish?.description ?? '');
  const [photo, setPhoto] = useState<PhotoState>(wish?.photo_path ? { saved: wish.photo_path } : null);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [linkPhoto, setLinkPhoto] = useState<'idle' | 'searching' | 'none'>('idle');
  const triedLink = useRef(wish?.url ?? null);

  // Once a link is entered, its page's photo fills an empty photo, once per link: a photo the
  // user removed does not come back.
  async function findLinkPhoto() {
    const parsed = normalizeLink(link);
    if (photo !== null || 'error' in parsed || !parsed.url || parsed.url === triedLink.current) return;
    triedLink.current = parsed.url;
    setLinkPhoto('searching');
    const found = await photoFromLink(parsed.url);
    setPhoto((current) => current ?? found);
    setLinkPhoto(found ? 'idle' : 'none');
  }

  // A new photo is uploaded on save, then the one it replaces is removed.
  const save = useListMutation(listId, async (draft: Omit<WishDraft, 'photo_path'>) => {
    const photo_path = photo === null ? null : 'saved' in photo ? photo.saved : await uploadPhoto(photo);
    await (wish ? updateWish(wish.id, { ...draft, photo_path }) : addWish(listId, { ...draft, photo_path }));
    if (wish?.photo_path && wish.photo_path !== photo_path) await deletePhotos([wish.photo_path]);
  });
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
    <Screen
      title={title}
      action={
        <Button label={wish ? t('wishForm.save') : t('wishForm.add')} loading={save.isPending} onPress={submit} />
      }
    >
      <Stack.Screen options={{ headerLeft: closeButton(t('common.close'), back) }} />
      <Text variant="title">{title}</Text>

      <PhotoField
        photo={photo}
        name={name}
        onChange={setPhoto}
        disabled={save.isPending}
        status={
          linkPhoto === 'idle'
            ? null
            : t(linkPhoto === 'searching' ? 'wishForm.photoSearching' : 'wishForm.photoNotFound')
        }
      />

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

      <TextField
        label={t('wishForm.linkLabel')}
        placeholder={t('wishForm.linkPlaceholder')}
        value={link}
        onChangeText={(value) => {
          setLink(value);
          setErrors((current) => ({ ...current, link: false }));
        }}
        error={errors.link ? t('wishForm.errors.link') : null}
        optional
        keyboardType="url"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        maxLength={2048}
        onBlur={findLinkPhoto}
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
          optional
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
        label={t('wishForm.detailsLabel')}
        placeholder={t('wishForm.detailsPlaceholder')}
        value={details}
        onChangeText={setDetails}
        optional
        multiline
        maxLength={1000}
      />

      {save.isError ? (
        <Text role="alert" style={{ color: colors.danger }}>
          {t('common.genericError')}
        </Text>
      ) : null}

      {/* Out of the way at the end of the form, and confirmed before anything is lost. */}
      {wish ? (
        <Button
          variant="secondary"
          label={t('wishForm.delete')}
          disabled={save.isPending}
          onPress={() => setConfirmDelete(true)}
        />
      ) : null}

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
            onPress={() => remove.mutate([wish], { onSuccess: back })}
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

/** The wish's picture: a preview, and buttons to pick, change or remove it. */
function PhotoField({
  photo,
  name,
  onChange,
  disabled,
  status,
}: {
  photo: PhotoState;
  name: string;
  onChange: (photo: PhotoState) => void;
  disabled: boolean;
  /** What the search from the link is doing, if anything. */
  status: string | null;
}) {
  const { t } = useTranslation();
  const [picking, setPicking] = useState(false);

  async function pick() {
    setPicking(true);
    try {
      const picked = await pickPhoto();
      if (picked) onChange(picked);
    } finally {
      setPicking(false);
    }
  }

  const uri = photo === null ? null : 'saved' in photo ? photoUrl(photo.saved) : photo.uri;
  return (
    <View style={styles.photo}>
      <View style={styles.photoPreview}>
        <WishArt wish={{ name, photo_path: null }} photoUri={uri} position={0} size="thumb" />
      </View>
      <View style={styles.photoActions}>
        <Text variant="bodyStrong">
          {t('wishForm.photoLabel')}
          <Text tone="secondary"> ({t('common.optional')})</Text>
        </Text>
        <Button
          variant="secondary"
          size="compact"
          icon={uri ? undefined : 'plus'}
          label={uri ? t('wishForm.changePhoto') : t('wishForm.addPhoto')}
          loading={picking}
          disabled={disabled}
          onPress={pick}
        />
        {uri ? (
          <Button
            variant="secondary"
            size="compact"
            label={t('wishForm.removePhoto')}
            disabled={disabled || picking}
            onPress={() => onChange(null)}
          />
        ) : null}
        {status ? (
          <Text role="status" variant="caption" tone="secondary">
            {status}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photo: { flexDirection: 'row', gap: space.lg, alignItems: 'center' },
  photoPreview: { width: 104, aspectRatio: 4 / 5 },
  photoActions: { flex: 1, gap: space.sm, alignItems: 'flex-start' },
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
});
