import type { TFunction } from 'i18next';
import type { Wish } from './api';

type Reservation = NonNullable<Wish['reservations']>[number];

/**
 * Who is on a wish, from the point of view of a signed-in relative (the only one who gets
 * reservations at all): nobody yet, others, or the user, possibly with others (a shared gift).
 */
export type ReservationState =
  | { kind: 'free' }
  | { kind: 'others'; others: (string | null)[] }
  | { kind: 'mine'; others: (string | null)[] };

export function reservationState(reservations: Reservation[] = []): ReservationState {
  const others = reservations.filter((r) => !r.is_me).map((r) => r.name);
  if (reservations.some((r) => r.is_me)) return { kind: 'mine', others };
  return others.length > 0 ? { kind: 'others', others } : { kind: 'free' };
}

/**
 * "Léa", "Léa et Hugo", "Léa, Hugo et 2 autres". People without a display name are counted,
 * not named: "Un proche", "2 proches", "Léa et un autre proche". `afterYou` when the names
 * follow "Vous", so the unnamed are "un autre proche".
 */
export function joinNames(names: (string | null)[], t: TFunction, afterYou = false): string {
  const named = names.filter((name): name is string => name !== null);
  const unnamed = names.length - named.length;
  if (named.length + Math.min(unnamed, 1) > 3) {
    return t('reservation.namesAndMore', { names: named.slice(0, 2).join(', '), count: names.length - 2 });
  }
  const shown = [...named];
  if (unnamed > 0) {
    const others = named.length > 0 || afterYou;
    shown.push(t(others ? 'reservation.otherRelatives' : 'reservation.relatives', { count: unnamed }));
  }
  if (shown.length === 1) return shown[0] ?? '';
  return t('reservation.namesAnd', { names: shown.slice(0, -1).join(', '), last: shown.at(-1) });
}

/**
 * The one sentence that says who offers a wish (docs/design.md, "vocabulaire de réservation").
 * `short` fits on a tile; null when nobody is on it.
 */
export function describeReservation(state: ReservationState, t: TFunction, form: 'short' | 'long'): string | null {
  switch (state.kind) {
    case 'free':
      return null;
    case 'others':
      return t('reservation.others', { names: joinNames(state.others, t), count: state.others.length });
    case 'mine':
      if (state.others.length === 0) return t('reservation.mine');
      return t(form === 'short' ? 'reservation.mineWithShort' : 'reservation.mineWith', {
        names: joinNames(state.others, t, true),
      });
  }
}
