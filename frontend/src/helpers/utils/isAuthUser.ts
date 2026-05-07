import type { AuthUser } from '../../lib/types';
export const isAuthUser = (user: AuthUser | null) => {
  return user !== null && !user.isGuest;
};
