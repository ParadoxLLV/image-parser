import { MAX_FILES_PLUS, MAX_FILES_PREMIUM, MAX_FILES_PRO } from './constants';

export const subscriptions = [
  {
    name: 'plus',
    priceId: 'price_1RoRifJLbKl4NwtOTzGQlCh2',
    features: {
      'Monthly Credits': 250,
      'File upload limit': MAX_FILES_PLUS,
      'Discounts on credits': false,
      'Disabled Ads': true,
    },
    description:
      'Experience the basic functionality of the app with the added bonus of extra monthly credits.',
  },
  {
    name: 'premium',
    priceId: 'price_1RoRvjJLbKl4NwtO4CsvyIwD',
    features: {
      'Monthly Credits': 500,
      'File upload limit': MAX_FILES_PREMIUM,
      'Discounts on credits': true,
      'Disabled Ads': true,
    },
    description:
      'everything in Plus with more monthly credits aswell as other features',
  },
  {
    name: 'pro',
    priceId: 'price_1RoRwCJLbKl4NwtO7sdI0fbH',
    features: {
      'Monthly Credits': 1000,
      'File upload limit': MAX_FILES_PRO,
      'Discounts on credits': true,
      'Disabled Ads': true,
    },
    description:
      'Everything in all the other plans with more credits and bigger upload limits.',
  },
];

export const credits = [
  {
    name: '250 Credits',
    price: 250,
    priceId: 'price_1RoS1MJLbKl4NwtO8xnPTP6J',
    description:
      '250 standalone credits for conversion and extraction purposes.',
    credits: 250,
  },
  {
    name: '500 Credits',
    credits: 500,
    description:
      '500 standalone credits for conversion and extraction purposes.',
    price: 400,
    priceId: 'price_1RoS1hJLbKl4NwtOZ5XjrA5f',
  },
  {
    name: '1000 Credits',
    credits: 1000,
    description:
      '1000 standalone credits for conversion and extraction purposes.',
    price: 700,
    priceId: 'price_1RoS22JLbKl4NwtOzaFYCb6l',
  },
];
