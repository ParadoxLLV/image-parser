import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/userReducer'
import siteSettingsReducer from './reducers/siteSettingsReducer'
import modalReducer from './reducers/modalReducer'

const store = configureStore({
    reducer: {
        modal: modalReducer,
        user: userReducer,
        siteSettings: siteSettingsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;