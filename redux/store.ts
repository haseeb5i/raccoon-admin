import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { loginSlice } from './slice/loginSlice';
import { userSlice } from './slice/userSlice';
import { taskSlice } from './slice/taskSlice';
import { activitySlice } from './slice/activitySlice';
import { clanSlice } from './slice/clanSlice';
import { gameSlice } from './slice/gameSlice';
import { avatarSlice } from './slice/avatarSlice';

export const store = configureStore({
  reducer: {
    [loginSlice.reducerPath]: loginSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [clanSlice.reducerPath]: clanSlice.reducer,
    [taskSlice.reducerPath]: taskSlice.reducer,
    [gameSlice.reducerPath]: gameSlice.reducer,
    [avatarSlice.reducerPath]: avatarSlice.reducer,
    [activitySlice.reducerPath]: activitySlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({}).concat([
      loginSlice.middleware,
      userSlice.middleware,
      taskSlice.middleware,
      activitySlice.middleware,
      clanSlice.middleware,
      gameSlice.middleware,
      avatarSlice.middleware,
    ]),
});

setupListeners(store.dispatch);

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
