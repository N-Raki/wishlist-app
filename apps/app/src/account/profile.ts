import { supabase } from '@/lib/supabase';

/** Room for a first name and an initial, or a nickname; the database checks the same bounds. */
export const displayNameMaxLength = 30;

/** A first name to start from, when Google gave one; the user still confirms it. */
export function suggestedName(metadata: Record<string, unknown> | undefined): string {
  const fullName = metadata?.full_name ?? metadata?.name;
  if (typeof fullName !== 'string') return '';
  return (fullName.trim().split(/\s+/)[0] ?? '').slice(0, displayNameMaxLength);
}

/** The signed-in user's display name, null until they choose one. */
export async function fetchDisplayName(): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('display_name').single();
  if (error) throw error;
  return data.display_name;
}

export async function saveDisplayName(name: string) {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Not signed in');
  const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', data.session.user.id);
  if (error) throw error;
}
