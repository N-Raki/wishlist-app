import { type Href, router } from 'expo-router';

/** Back where the user came from, or to `fallback` when the page was opened from a link. */
export function goBack(fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
