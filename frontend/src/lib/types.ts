import type { SessionUser } from '../helpers/Schemas/sessionSchema';
import type { UserSchema } from '../helpers/Schemas/userSchema';
import { convertableExtensions } from './constants';

// account related

export type AuthUser = UserSchema | SessionUser;

export type roleType = 'member' | 'admin';
export type providerType = 'email' | 'google' | 'github';
export type subscriptionType = 'free' | 'plus' | 'premium' | 'pro';
export type creditType = '250 Credits' | '500 Credits' | '1000 Credits';

// file processing related

export type ActionTypes = {
  action: 'convert' | 'extract' | '';
  operation: string;
  confirmed: boolean;
};

export type fileUploadTypes = {
  originalImageUrl: string;
  modifiedImageUrl: string;
  originalType: typeof convertableExtensions;
  modifiedType: typeof convertableExtensions;
};

export type cartTypes = {
  name: string;
  description?: string;
  price: number;
  picture: string;
  priceId: string;
};

export type checkoutInfoType = {
  amount: number;
  email: string;
};

export type lineItemType = {
  name: string;
  price: number;
  description: string;
  image: string;
  currency: string;
};

export type actionType = 'login' | 'register';
