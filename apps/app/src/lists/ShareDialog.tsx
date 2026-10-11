import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { Text } from '@/ui/Text';
import type { WishlistView } from './api';
import { canCopy, canShare, copyLink, listUrl, shareLink } from './share';

/**
 * Sharing a list: the system share sheet with a ready-made message, or the link copied. For the
 * owner, this is where the surprise promise is said again, when it reassures (docs/design.md).
 */
export function ShareDialog({ list, visible, onClose }: { list: WishlistView; visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const colors = useColors();
  const [status, setStatus] = useState<'copied' | 'error' | null>(null);
  const url = listUrl(list.id);
  const message =
    list.is_owner || !list.owner_name
      ? t('share.messageMine', { name: list.name })
      : t('share.messageTheirs', { name: list.name, owner: list.owner_name });

  function close() {
    setStatus(null);
    onClose();
  }

  async function run(action: () => Promise<'shared' | 'copied' | 'dismissed' | undefined>) {
    try {
      const outcome = await action();
      if (outcome === 'copied') setStatus('copied');
      else if (outcome === 'shared') close();
    } catch {
      setStatus('error');
    }
  }

  return (
    <Dialog
      visible={visible}
      onClose={close}
      title={t('share.title', { name: list.name })}
      body={list.is_owner ? t('share.ownerPromise') : t('share.relativeBody')}
    >
      {status ? (
        <Text
          role={status === 'error' ? 'alert' : 'status'}
          style={status === 'error' ? { color: colors.danger } : undefined}
        >
          {status === 'error' ? t('common.genericError') : t('share.copied')}
        </Text>
      ) : null}
      {canShare ? (
        <Button icon="share" label={t('share.share')} onPress={() => run(() => shareLink(message, url))} />
      ) : null}
      {canCopy ? (
        <Button
          variant={canShare ? 'secondary' : 'primary'}
          icon="copy"
          label={t('share.copy')}
          onPress={() =>
            run(async () => {
              await copyLink(url);
              return 'copied';
            })
          }
        />
      ) : null}
      <Button variant="secondary" label={t('common.close')} onPress={close} />
    </Dialog>
  );
}
