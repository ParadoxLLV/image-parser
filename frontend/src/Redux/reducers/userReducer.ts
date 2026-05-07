import FingerprintJS from '@fingerprintjs/fingerprintjs';
// reducers/userReducer.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/utils/axiosInterceptor';
import type { AuthUser } from '../../lib/types';
import type { UserSchema } from '../../helpers/Schemas/userSchema';

interface AuthUserState {
  user: AuthUser | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  fingerprint: string | null;
}

const initialState: AuthUserState = {
  user: null,
  isGuest: true,
  loading: false,
  error: null,
  fingerprint: null,
};

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      const response = await axiosInstance.post(
        '/auth/instantiateUser',
        {},
        {
          headers: {
            fingerprint: visitorId,
          },
        },
      );
      return { userData: response.data, fingerprint: visitorId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to get user',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: AuthUserState };
      const fingerprint = state.user.fingerprint;
      await axiosInstance.post('/auth/logout');
      const response = await axiosInstance.post(
        '/auth/instantiateUser',
        {},
        {
          headers: {
            fingerprint: fingerprint ?? '',
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error ?? 'Logout failed');
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSchema>) => {
      state.user = action.payload as UserSchema;
      state.error = null;
    },
    setFingerprint: (state, action: PayloadAction<string>) => {
      state.fingerprint = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.userData;
        state.loading = false;
        state.error = null;
        state.isGuest = action.payload.userData.isGuest ? true : false;
        state.fingerprint = action.payload.fingerprint;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = action.payload.userData;
        state.loading = false;
        state.error = null;
        state.isGuest = action.payload.userData.isGuest ? true : false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload as string;
        state.isGuest = false;
        state.loading = false;
      });
  },
});

export const { setUser, setFingerprint } = userSlice.actions;
export default userSlice.reducer;
