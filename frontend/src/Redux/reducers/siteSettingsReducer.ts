import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SiteSettingsState = {
  enabledBreadcrumb: boolean;
};

const initialState: SiteSettingsState = {
  enabledBreadcrumb:
    localStorage.getItem('enabledBreadcrumb') === 'false' ? false : true,
};

export const SiteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    setBreadcrumb: (state, action: PayloadAction<boolean>) => {
      state.enabledBreadcrumb = action.payload;
      localStorage.setItem('enabledBreadcrumb', String(action.payload));
    },
  },
});

export const { setBreadcrumb } = SiteSettingsSlice.actions;
export default SiteSettingsSlice.reducer;
