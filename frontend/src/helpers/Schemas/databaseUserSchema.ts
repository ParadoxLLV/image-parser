import type { providerType, roleType, subscriptionType } from '../../lib/types';

export type databaseUser = {
  id: number;
  username: string;
  email: string;
  oauth_provider: providerType;
  created_at: Date;
  subscription: subscriptionType;
  credits: number;
  role: roleType;
  picture: string;
  userHistory: {
    id: number;
    original_image_url: string;
    modified_image_url: string;
    created_at: Date;
    user_id: number;
    original_type: string;
    modified_type: string;
  };
};
