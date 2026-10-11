import i18n from '@/i18n';
import { describeReservation, reservationState } from './reservations';

const t = i18n.getFixedT('fr');
const lea: { name: string | null; is_me: boolean } = { name: 'Léa', is_me: false };
const hugo = { name: 'Hugo', is_me: false };
const me = { name: 'Raki', is_me: true };

it('tells free wishes, wishes others offer, and wishes the user offers apart', () => {
  expect(reservationState(undefined)).toEqual({ kind: 'free' });
  expect(reservationState([lea])).toEqual({ kind: 'others', others: ['Léa'] });
  expect(reservationState([lea, me])).toEqual({ kind: 'mine', others: ['Léa'] });
});

it('says who offers a wish with the words of the design', () => {
  const say = (reservations: (typeof lea)[], form: 'short' | 'long' = 'long') =>
    describeReservation(reservationState(reservations), t, form);
  expect(say([])).toBeNull();
  expect(say([lea])).toBe('Léa s’en occupe');
  expect(say([lea, hugo])).toBe('Léa et Hugo s’en occupent');
  expect(say([me])).toBe('Vous l’offrez');
  expect(say([me, hugo], 'short')).toBe('Vous et Hugo');
  expect(say([me, hugo])).toBe('Vous l’offrez avec Hugo');
  expect(say([lea, hugo, { name: 'Zoé', is_me: false }, { name: null, is_me: false }])).toBe(
    'Léa, Hugo et 2 autres s’en occupent',
  );
});

it('counts the relatives who have no display name instead of naming them', () => {
  const someone = { name: null, is_me: false };
  const say = (reservations: (typeof lea)[], form: 'short' | 'long' = 'long') =>
    describeReservation(reservationState(reservations), t, form);
  expect(say([someone])).toBe('Un proche s’en occupe');
  expect(say([someone, someone])).toBe('2\u00A0proches s’en occupent');
  expect(say([lea, someone])).toBe('Léa et un autre proche s’en occupent');
  expect(say([me, someone])).toBe('Vous l’offrez avec un autre proche');
  expect(say([me, someone], 'short')).toBe('Vous et un autre proche');
  expect(say([me, lea, someone, someone])).toBe('Vous l’offrez avec Léa et 2\u00A0autres proches');
});
