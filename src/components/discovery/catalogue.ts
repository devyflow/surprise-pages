export type Occasion = 'Birthday' | 'Love' | 'Friendship' | 'Thank you' | 'Just because';
export type GiftStyle = 'Personalised' | 'Handmade' | 'Cute' | 'Useful';

export interface GiftProduct {
  id: string;
  name: string;
  seller: string;
  location: string;
  price: number;
  priceLabel: string;
  image: string;
  occasions: Occasion[];
  styles: GiftStyle[];
  dispatchDays: number;
  blurb: string;
  trust: {
    status: 'Tested' | 'Verification pending';
    testedOn?: string;
    checks: string[];
    note: string;
  };
}

/**
 * Demonstration catalogue for the discovery experience. These are deliberately
 * labelled as samples in the UI; real sellers only replace them after consent
 * and verification.
 */
export const giftProducts: GiftProduct[] = [
  {
    id: 'memory-letter-box',
    name: 'Tiny memory letter box',
    seller: 'Paper Moon Studio',
    location: 'Jaipur',
    price: 649,
    priceLabel: '₹649',
    image: '/illustrations/letter.png',
    occasions: ['Birthday', 'Love', 'Friendship'],
    styles: ['Personalised', 'Handmade'],
    dispatchDays: 3,
    blurb: 'A hand-finished box of miniature notes, made from your shared memories.',
    trust: {
      status: 'Tested',
      testedOn: 'Sample · Oct 2026',
      checks: ['Identity checked', 'Test order received', 'Photos matched', 'Packaging checked'],
      note: 'Sample profile: the real passport will include dated evidence and testing notes.',
    },
  },
  {
    id: 'crochet-heart',
    name: 'Pocket crochet heart',
    seller: 'Mitti & Thread',
    location: 'Lucknow',
    price: 399,
    priceLabel: '₹399',
    image: '/illustrations/ribbonheart.png',
    occasions: ['Love', 'Friendship', 'Just because'],
    styles: ['Cute', 'Handmade'],
    dispatchDays: 4,
    blurb: 'A tiny handmade heart that can carry a name, date or six-word message.',
    trust: {
      status: 'Tested',
      testedOn: 'Sample · Oct 2026',
      checks: ['Identity checked', 'Test order received', 'Communication checked'],
      note: 'Sample profile: testing evidence is not yet connected to a real seller.',
    },
  },
  {
    id: 'illustrated-envelope',
    name: 'Illustrated secret envelope',
    seller: 'Little Odd Things',
    location: 'Pune',
    price: 899,
    priceLabel: '₹899',
    image: '/illustrations/envelope.webp',
    occasions: ['Birthday', 'Thank you', 'Just because'],
    styles: ['Personalised', 'Cute'],
    dispatchDays: 5,
    blurb: 'Your story turned into a small illustrated keepsake and sealed letter.',
    trust: {
      status: 'Verification pending',
      checks: ['Seller application received', 'Identity review started'],
      note: 'This sample shows how an untested seller remains clearly distinguishable.',
    },
  },
  {
    id: 'comfort-pocket-kit',
    name: 'Bad-day comfort pocket',
    seller: 'Soft Corner Co.',
    location: 'Bengaluru',
    price: 1199,
    priceLabel: '₹1,199',
    image: '/illustrations/hugheart.webp',
    occasions: ['Friendship', 'Thank you', 'Just because'],
    styles: ['Cute', 'Useful'],
    dispatchDays: 2,
    blurb: 'A compact comfort kit with small prompts, a keepsake and a personal note.',
    trust: {
      status: 'Tested',
      testedOn: 'Sample · Oct 2026',
      checks: ['Identity checked', 'Test order received', 'Dispatch checked', 'Packaging checked'],
      note: 'Sample profile: real complaint history and last-tested date will be public.',
    },
  },
  {
    id: 'mini-celebration-crown',
    name: 'Mini celebration crown',
    seller: 'Sunday Confetti',
    location: 'Delhi',
    price: 299,
    priceLabel: '₹299',
    image: '/illustrations/crown1.webp',
    occasions: ['Birthday', 'Friendship'],
    styles: ['Cute', 'Handmade'],
    dispatchDays: 2,
    blurb: 'A playful desk-sized crown with a custom title for your favourite person.',
    trust: {
      status: 'Verification pending',
      checks: ['Seller application received'],
      note: 'This seller would not receive a tested badge until a complete test order is reviewed.',
    },
  },
  {
    id: 'slow-evening-kit',
    name: 'Slow-evening care kit',
    seller: 'Pause Please',
    location: 'Mumbai',
    price: 1499,
    priceLabel: '₹1,499',
    image: '/illustrations/lying.webp',
    occasions: ['Thank you', 'Just because', 'Love'],
    styles: ['Useful', 'Personalised'],
    dispatchDays: 4,
    blurb: 'A quiet little reset with a personalised card and reusable comfort pieces.',
    trust: {
      status: 'Tested',
      testedOn: 'Sample · Oct 2026',
      checks: ['Identity checked', 'Test order received', 'Photos matched', 'Communication checked'],
      note: 'Sample profile: category safety checks will be added before a live catalogue launch.',
    },
  },
];

export const occasions: Array<'All' | Occasion> = [
  'All',
  'Birthday',
  'Love',
  'Friendship',
  'Thank you',
  'Just because',
];

export const styles: Array<'All' | GiftStyle> = ['All', 'Personalised', 'Handmade', 'Cute', 'Useful'];
