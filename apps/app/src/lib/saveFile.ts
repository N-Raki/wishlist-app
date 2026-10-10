import { File, Paths } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

/** Hands a file to the system share sheet, from which it can be saved or sent. */
export async function saveFile(name: string, content: string, mimeType: string) {
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(content);
  await shareAsync(file.uri, { mimeType, dialogTitle: name });
}
