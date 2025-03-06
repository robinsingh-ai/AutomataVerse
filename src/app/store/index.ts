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
  
  // Client-side - use persisted store using dynamic import
  // This import only happens in the browser
  const localForage = import('redux-persist/lib/storage').then(module => module.default);
  
  const persistConfig = {
    key: 'root',
    storage: {
      getItem: async (key: string) => {
        const storage = await localForage;
        return storage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        const storage = await localForage;
        return storage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        const storage = await localForage;
        return storage.removeItem(key);
      }
    },
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