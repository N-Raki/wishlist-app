import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { space } from '@/theme/tokens';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import type { LegalDocument } from './types';

export function LegalDocumentScreen({ documents }: { documents: Record<'fr' | 'en', LegalDocument> }) {
  const { t, i18n } = useTranslation();
  const document = documents[i18n.language === 'en' ? 'en' : 'fr'];

  return (
    <Screen title={document.title}>
      <View style={{ gap: space.sm }}>
        <Text variant="title">{document.title}</Text>
        <Text variant="caption" tone="secondary">
          {t('legal.updatedOn', { date: document.updatedOn })}
        </Text>
      </View>
      {document.sections.map((section) => (
        <View key={section.heading} style={{ gap: space.md }}>
          <Text variant="heading">{section.heading}</Text>
          {section.paragraphs.map((paragraph) => (
            <Text key={paragraph}>{paragraph}</Text>
          ))}
        </View>
      ))}
    </Screen>
  );
}
