import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import axios, { AxiosError } from 'axios';

export interface AuthState {
  user: {
    uid?: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  } | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

// Google Sign-in thunk
export const signInWithGoogle = createAsyncThunk(
  'auth/googleSignIn',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      // Add some custom parameters to help with login flow
      provider.setCustomParameters({
        prompt: 'select_account'  // Force account selection even when one account is available
      });
      
      // First, sign in with Google using Firebase client SDK to get the ID token
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Verify the token on the server side
      const response = await axios.post('/api/auth/google', { idToken });
      
      if (response.data.success) {
        // Return the user data from the server response
        return response.data.user;
      } else {
        return rejectWithValue('Failed to authenticate with Google');
      }
    } catch (error: unknown) {
      // Handle Firebase client errors
      if (error instanceof Error) {
        const firebaseError = error as Error & { code?: string };
        
        // Special handling for popup closed by user error
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          return rejectWithValue('auth/popup-closed-by-user: Sign-in cancelled by user.');
        }
        
        return rejectWithValue(firebaseError.message || 'Failed to sign in with Google');
      }
      
      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{error: string}>;
        return rejectWithValue(axiosError.response?.data?.error || 'Failed to authenticate with Google');
      }
      
      return rejectWithValue('Failed to sign in with Google');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // First, call the server-side logout API
      await axios.post('/api/auth/logout');
      
      // Then, sign out from Firebase client
      await signOut(auth);
      
      return null;
    } catch (error: unknown) {
      // Handle Firebase client errors
      if (error instanceof Error) {
        return rejectWithValue((error as Error).message);
      }
      
      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{error: string}>;
        return rejectWithValue(axiosError.response?.data?.error || 'Failed to logout');
      }
      
      return rejectWithValue('Failed to logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Google Sign-in cases
    builder.addCase(signInWithGoogle.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.message = null;
    });
    builder.addCase(signInWithGoogle.rejected, (state, action) => {
      state.loading = false;
      
      // Check if the payload has both error and message properties
      if (action.payload && typeof action.payload === 'object' && 'error' in action.payload && 'message' in action.payload) {
        const payload = action.payload as { error: string; message: string };
        state.error = payload.error;
        state.message = payload.message;
      } else {
        state.error = action.payload as string;
      }
    });
    
    // Logout cases
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUser, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer; 