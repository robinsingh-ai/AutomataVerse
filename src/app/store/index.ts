import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistReducer, 
  persistStore,
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import authReducer from './authSlice';

// Create the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here as needed
});

// Helper function to create the store based on environment
const createStore = () => {
  // Server-side or initial client render - use normal store
  if (typeof window === 'undefined') {
    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });
  }
  
  // Client-side - use persisted store
  const storage = require('redux-persist/lib/storage').default;
  
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // Only persist auth state
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

// Initialize store
export const store = createStore();

// Initialize persistor only on client-side
export const persistor = typeof window !== 'undefined' ? persistStore(store) : undefined;

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 