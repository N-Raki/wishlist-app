import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/auth/SessionProvider';
import * as api from './api';

// Keys include the user, so signing out or switching accounts never shows someone else's cache.
function useKeys() {
  const userId = useSession().session?.user.id ?? 'anonymous';
  return {
    myLists: ['myLists', userId] as const,
    wishlist: (id: string) => ['wishlist', userId, id] as const,
  };
}

export function useMyLists() {
  return useQuery({ queryKey: useKeys().myLists, queryFn: api.fetchMyLists });
}

export function useWishlist(id: string) {
  return useQuery({ queryKey: useKeys().wishlist(id), queryFn: () => api.fetchWishlist(id) });
}

/**
 * Runs a change, then refreshes what it affects: the list itself and the counts on "My lists".
 * The refresh is not awaited: the screen that made the change closes at once, and the page
 * behind it updates as soon as the new data arrives.
 */
export function useListMutation<Args extends unknown[], Result>(
  wishlistId: string | undefined,
  run: (...args: Args) => Promise<Result>,
) {
  const queryClient = useQueryClient();
  const keys = useKeys();
  return useMutation({
    mutationFn: (args: Args) => run(...args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.myLists });
      if (wishlistId) queryClient.invalidateQueries({ queryKey: keys.wishlist(wishlistId) });
    },
  });
}
