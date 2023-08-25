import { configureStore } from '@reduxjs/toolkit';
import { userTokenSlice } from './token';

export interface storeInterface {
    userToken: string;
}

export const store = configureStore({
    reducer: {
        userToken: userTokenSlice.reducer,
    },
});
