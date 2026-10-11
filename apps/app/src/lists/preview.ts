import { en } from '@/i18n/en';
import { fr } from '@/i18n/fr';

// The card messaging apps draw for a shared list link (title, owner, photo): docs/spec.md,
// "Aperçu riche du lien". Built on the server for their crawlers, which do not run the app.

export type PreviewList = {
  name: string;
  owner_name: string | null;
  wishes: { photo_path: string | null }[];
};

/** Crawlers of messaging apps and social networks that draw link previews. */
const previewBots =
  /facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|skypeuripreview|applebot|pinterest|redditbot|mastodon|signal|iframely|embedly|google-pagerenderer|vkshare|snapchat|bluesky|cardyb/i;

export function isPreviewBot(userAgent: string | null) {
  return previewBots.test(userAgent ?? '');
}

function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ''));
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/**
 * A minimal page with the Open Graph tags of a list. `photoUrl` turns a stored photo path into
 * its public address; the first wish with a photo, newest first, illustrates the card.
 */
export function previewPage({
  list,
  url,
  language,
  photoUrl,
}: {
  list: PreviewList;
  url: string;
  language: 'fr' | 'en';
  photoUrl: (path: string) => string;
}) {
  const strings = (language === 'en' ? en : fr).preview;
  const count = list.wishes.length;
  const values = { name: list.name, owner: list.owner_name ?? '', count };
  const title = list.owner_name ? fill(strings.title, values) : list.name;
  const description = list.owner_name
    ? // French says "0 idée", English "0 ideas": the language's own plural rules decide.
      fill(
        new Intl.PluralRules(language).select(count) === 'one' ? strings.description_one : strings.description_other,
        values,
      )
    : strings.descriptionAnonymous;
  const photo = list.wishes.find((wish) => wish.photo_path)?.photo_path;
  const meta: [string, string][] = [
    ['og:type', 'website'],
    ['og:site_name', 'Wish Me'],
    ['og:locale', language === 'en' ? 'en_GB' : 'fr_FR'],
    ['og:url', url],
    ['og:title', title],
    ['og:description', description],
    ['twitter:card', photo ? 'summary_large_image' : 'summary'],
    ['twitter:title', title],
    ['twitter:description', description],
    ...(photo
      ? ([
          ['og:image', photoUrl(photo)],
          ['og:image:alt', list.name],
          ['twitter:image', photoUrl(photo)],
        ] as [string, string][])
      : []),
  ];
  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${meta
  // Open Graph uses `property`, Twitter cards `name`.
  .map(
    ([key, content]) =>
      `<meta ${key.startsWith('twitter:') ? 'name' : 'property'}="${key}" content="${escapeHtml(content)}">`,
  )
  .join('\n')}
</head>
<body><p><a href="${escapeHtml(url)}">${escapeHtml(strings.open)}</a></p></body>
</html>`;
}
