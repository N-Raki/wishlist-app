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

/** "Léa", "Léa et Hugo", "Léa, Hugo et Zoé", "Léa, Hugo et 2 autres". */
export function joinNames(names: (string | null)[], t: TFunction): string {
  const shown = names.map((name) => name ?? t('reservation.someone'));
  if (shown.length > 3) {
    return t('reservation.namesAndMore', { names: shown.slice(0, 2).join(', '), count: shown.length - 2 });
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
        names: joinNames(state.others, t),
      });
  }
}
