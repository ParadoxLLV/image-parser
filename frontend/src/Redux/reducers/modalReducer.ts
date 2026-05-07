import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  [modalName: string]: boolean;
};

const initialState: ModalState = {};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state, action: PayloadAction<string>) => {
      state[action.payload] = !(state[action.payload] ?? false);
    },
  },
});

export const { toggleModal } = modalSlice.actions;
export default modalSlice.reducer;
