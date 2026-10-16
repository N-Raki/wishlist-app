import { LegalDocumentScreen } from '@/legal/LegalDocumentScreen';
import { termsEn } from '@/legal/terms.en';
import { termsFr } from '@/legal/terms.fr';

export default function Terms() {
  return <LegalDocumentScreen documents={{ fr: termsFr, en: termsEn }} />;
}
