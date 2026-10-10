// French is the reference language: en.ts must provide the same keys.
// Typography: ’ for apostrophes, non-breaking spaces before : ; ! ? and units.
export const fr = {
  home: {
    tagline: 'Des listes de souhaits qui gardent la surprise.',
    intro: 'Créez votre liste, partagez le lien\u00A0: vos proches s’organisent sans rien vous dévoiler.',
    signIn: 'Se connecter',
    greeting: 'Bonjour',
    comingSoonTitle: 'Vos listes arrivent bientôt',
    comingSoonBody:
      'Cette version pose les fondations\u00A0: connexion, compte et confidentialité. Les listes et les souhaits suivent.',
    account: 'Mon compte',
    showcase: {
      vinyl: 'Platine vinyle',
      trip: 'Week-end à Lisbonne',
      claimed: '{{name}} s’en occupe',
      shared: 'Vous et {{name}}',
    },
  },
  footer: {
    privacy: 'Confidentialité',
    legalNotice: 'Mentions légales',
  },
  signIn: {
    title: 'Connexion',
    emailHeading: 'Recevez un code de connexion',
    emailBody:
      'Pas de mot de passe à retenir\u00A0: nous vous envoyons un code à 6\u00A0chiffres. Sans compte, il est créé au passage.',
    emailLabel: 'Adresse e-mail',
    sendCode: 'Recevoir un code',
    codeHeading: 'Saisissez le code',
    codeSent: 'Envoyé à {{email}}. Il expire dans 10\u00A0minutes.',
    codeLabel: 'Code à 6\u00A0chiffres',
    verify: 'Se connecter',
    changeEmail: 'Changer d’adresse',
    resend: 'Renvoyer le code',
    resent: 'Nouveau code envoyé.',
    privacyNotice: 'Vos données sont traitées comme l’explique notre',
    privacyLink: 'politique de confidentialité',
    errors: {
      invalidEmail: 'Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.',
      invalidCode: 'Ce code est incorrect ou a expiré.',
      tooManyRequests: 'Trop de tentatives. Patientez une minute avant de réessayer.',
    },
  },
  account: {
    title: 'Mon compte',
    signedInAs: 'Connecté avec',
    dataHeading: 'Vos données',
    dataBody:
      'Téléchargez une copie de tout ce que Wish Me conserve sur vous, dans un fichier réutilisable ailleurs (JSON).',
    export: 'Exporter mes données',
    exported: 'Votre fichier est prêt.',
    signOut: 'Se déconnecter',
    delete: 'Supprimer mon compte',
  },
  deleteAccount: {
    title: 'Supprimer le compte',
    heading: 'Supprimer votre compte\u00A0?',
    body: 'Votre compte et tout ce qui s’y rattache sont effacés immédiatement. Cette action est définitive.',
    exportFirst: 'Si vous voulez en garder une trace, exportez d’abord vos données depuis votre compte.',
    confirm: 'Supprimer définitivement',
    cancel: 'Annuler',
  },
  legal: {
    updatedOn: 'Mise à jour\u00A0: {{date}}',
  },
  notFound: {
    title: 'Page introuvable',
    body: 'Ce lien ne mène nulle part.',
    home: 'Retour à l’accueil',
  },
  common: {
    home: 'Accueil',
    genericError: 'Une erreur est survenue. Vérifiez votre connexion et réessayez.',
  },
};

type Translation<T> = {
  [K in keyof T]: T[K] extends string ? string : Translation<T[K]>;
};
export type Translations = Translation<typeof fr>;
