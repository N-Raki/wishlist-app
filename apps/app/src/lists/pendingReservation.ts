// A visitor who taps "Reserve" signs in first (docs/spec.md, "Consulter et réserver"). The wish
// waits here meanwhile, in memory only: the wish page reserves it once the user is signed in,
// or says it is already taken.
let pending: string | null = null;

export const pendingReservation = {
  set(wishId: string | null) {
    pending = wishId;
  },
  /** True once for the wish that was waiting, which is then forgotten. */
  take(wishId: string): boolean {
    if (pending !== wishId) return false;
    pending = null;
    return true;
  },
};
