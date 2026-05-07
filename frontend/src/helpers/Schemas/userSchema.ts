import type { providerType, roleType, subscriptionType } from '../../lib/types';

export type UserSchema = {
  isGuest: false;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  authProvider: providerType;
  credits: number;
  picture: string;
  role: roleType;
  subscription: subscriptionType;
  stripeCustomerId: string;
};
