import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

export const userTokenSlice = createSlice({
    name: 'userToken',
    initialState,
    reducers: {
        ADD_USER_TOKEN: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { ADD_USER_TOKEN } = userTokenSlice.actions;
