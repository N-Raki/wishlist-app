import { useTranslation } from 'react-i18next';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { TextLink } from '@/ui/TextLink';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <Screen title={t('notFound.title')}>
      <Text variant="title">{t('notFound.title')}</Text>
      <Text tone="secondary">{t('notFound.body')}</Text>
      <TextLink href="/">{t('notFound.home')}</TextLink>
    </Screen>
  );
}
