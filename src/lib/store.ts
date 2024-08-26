import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import filter from './features/filter';
import groupBy from './features/groupBy';

const filterPersistConfig = {
  key: 'filter',
  storage,
  whitelist: ['filters', 'fileName'],
};
const groupByPersistConfig = {
  key: 'groupBy',
  storage,
  whitelist: ['list', 'fileName'],
};

export const store = configureStore({
  reducer: {
    filter: persistReducer(
      filterPersistConfig,
      filter
    ),
    groupBy: persistReducer(
      groupByPersistConfig,
      groupBy
    ),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
