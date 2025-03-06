'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Track if we're in the browser and if hydration has completed
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after initial render
  // This ensures we only perform client-side rendering after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Always render Provider
  return (
    <Provider store={store}>
      {isClient ? (
        // Only import and use PersistGate on client after hydration
        <PersistGateClient>{children}</PersistGateClient>
      ) : (
        // Use empty div during server render and initial client render
        // This prevents hydration mismatch with authentication-dependent UI
        <div style={{ visibility: 'hidden' }}>
          {/* Render a simplified version that won't cause hydration errors */}
          {children}
        </div>
      )}
    </Provider>
  );
}

// Separate component that only renders on client-side after hydration
function PersistGateClient({ children }: { children: React.ReactNode }) {
  // Dynamically import PersistGate to avoid SSR issues
  const { PersistGate } = require('redux-persist/integration/react');
  
  // Now it's safe to render the full UI with authentication state
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
} 