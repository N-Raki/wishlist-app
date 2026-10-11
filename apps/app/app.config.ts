import type { ConfigContext, ExpoConfig } from 'expo/config';
import expoPackage from 'expo/package.json';

// Expo Go only opens updates published for its own runtime, "exposdk:<SDK>". The installed apps
// keep the fingerprint runtime of app.json, so an update never reaches a build it doesn't fit.
// EXPO_GO=1 is set by the workflows that publish previews for Expo Go (preview.yml, deploy.yml).
export default ({ config }: ConfigContext): ExpoConfig => {
  const sdk = `${expoPackage.version.split('.')[0]}.0.0`;
  return {
    ...(config as ExpoConfig),
    ...(process.env.EXPO_GO === '1' ? { runtimeVersion: `exposdk:${sdk}` } : {}),
  };
};
