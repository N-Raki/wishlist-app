import { LegalDocumentScreen } from '@/legal/LegalDocumentScreen';
import { privacyEn } from '@/legal/privacy.en';
import { privacyFr } from '@/legal/privacy.fr';

export default function Privacy() {
  return <LegalDocumentScreen documents={{ fr: privacyFr, en: privacyEn }} />;
}
