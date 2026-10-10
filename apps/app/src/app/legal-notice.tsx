import { LegalDocumentScreen } from '@/legal/LegalDocumentScreen';
import { legalNoticeEn } from '@/legal/legalNotice.en';
import { legalNoticeFr } from '@/legal/legalNotice.fr';

export default function LegalNotice() {
  return <LegalDocumentScreen documents={{ fr: legalNoticeFr, en: legalNoticeEn }} />;
}
