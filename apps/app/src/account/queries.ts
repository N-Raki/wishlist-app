import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/auth/SessionProvider';
import { fetchDisplayName, saveDisplayName } from './profile';

function useKey() {
  return ['displayName', useSession().session?.user.id ?? 'anonymous'] as const;
}

export function useDisplayName() {
  const { session } = useSession();
  return useQuery({ queryKey: useKey(), queryFn: fetchDisplayName, enabled: session !== null });
}

/**
 * A signed-in user without a display name must choose one before anything else
 * (docs/spec.md). `unknown` while the profile loads, so nothing jumps in the meantime.
 */
export function useNameRequirement(): 'none' | 'unknown' | 'required' {
  const { session } = useSession();
  const name = useDisplayName();
  if (!session) return 'none';
  if (name.isPending) return 'unknown';
  return name.data === null ? 'required' : 'none';
}

export function useSaveDisplayName() {
  const queryClient = useQueryClient();
  const key = useKey();
  return useMutation({
    mutationFn: saveDisplayName,
    onSuccess: (_, name) => {
      queryClient.setQueryData(key, name);
      // Lists and wishes show this name: refetch them with it.
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== 'displayName' });
    },
  });
}
