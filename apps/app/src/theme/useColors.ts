import { useColorScheme } from 'react-native';
import { type Colors, palette } from './palette';

export function useColors(): Colors {
  return palette[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
