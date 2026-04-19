export const COLORS = {
  primary: '#1F1FFF',
  accent: '#FFD700',
  dark: '#0F0F1F',
  surface: '#1A1A2E',
  text: '#F5F5F5',
  textMuted: '#A0A0A0',
  success: '#00D084',
  error: '#FF4444',
};

export const CATEGORIES = [
  'Music',
  'Food',
  'Nightlife',
  'Comedy',
  'Sports',
];

export const CITIES = [
  'Johannesburg',
  'Cape Town',
  'Durban',
];

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    benefits: [
      'Event discovery',
      'Save events',
    ],
  },
  pro: {
    name: 'Pro',
    price: 49,
    benefits: [
      'All Free benefits',
      'Exclusive discounts',
      'Early-bird access',
      'Lower service fees',
    ],
  },
  premium: {
    name: 'Premium',
    price: 99,
    benefits: [
      'All Pro benefits',
      'Members-only events',
      'Priority support',
      'Ticket transfer access',
    ],
  },
};

export const UNSPLASH_COLLECTIONS = {
  Music: 'music festival',
  Food: 'food festival market',
  Nightlife: 'nightlife party',
  Comedy: 'comedy show',
  Sports: 'sports event stadium',
};

export const formatCurrency = (amount: number) => {
  return `R${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
