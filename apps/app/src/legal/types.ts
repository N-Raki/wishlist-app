export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDocument = {
  title: string;
  updatedOn: string;
  sections: LegalSection[];
};
