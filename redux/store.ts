import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { loginSlice } from './slice/loginSlice';
import { userSlice } from './slice/userSlice';
import { postSlice } from './slice/postSlice';

export const store = configureStore({
  reducer: {
    [loginSlice.reducerPath]: loginSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [postSlice.reducerPath]: postSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({}).concat([
      loginSlice.middleware,
      userSlice.middleware,
      postSlice.middleware,
    ]),
});

setupListeners(store.dispatch);

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
