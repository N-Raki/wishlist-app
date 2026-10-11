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
  expect(say([{ name: null, is_me: false }])).toBe('Un proche s’en occupe');
});
