import { saveFile } from '@/lib/saveFile';
import { supabase } from '@/lib/supabase';

/** GDPR access and portability: everything stored about the user, as a JSON file. */
export async function exportMyData() {
  const { data, error } = await supabase.rpc('export_my_data');
  if (error) throw error;
  const day = new Date().toISOString().slice(0, 10);
  await saveFile(`wishme-${day}.json`, JSON.stringify(data, null, 2), 'application/json');
}

/** GDPR erasure: deletes the account server-side, then forgets the session on this device. */
export async function deleteMyAccount() {
  const { error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
  });
  if (error) throw error;
  // The session no longer exists on the server: only clear it locally.
  await supabase.auth.signOut({ scope: 'local' });
}
