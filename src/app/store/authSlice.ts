import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Google Sign-in thunk
export const signInWithGoogle = createAsyncThunk(
  'auth/googleSignIn',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      const response = await axios.post('/api/auth/google', { idToken });

      if (response.data.success) {
        return response.data.user;
      } else {
        return rejectWithValue('Failed to authenticate with Google');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ((error as any).code === 'auth/popup-closed-by-user') {
          return rejectWithValue('Sign-in cancelled by user.');
        }
        return rejectWithValue(error.message);
      }
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Failed to authenticate with Google');
      }
      return rejectWithValue('Failed to sign in with Google');
    }
  }
);

// Email/Password Sign-in thunk
export const signInWithEmailPassword = createAsyncThunk(
  'auth/emailPasswordSignIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await axios.post('/api/auth/login', { idToken });

      if (response.data.success) {
        return response.data.user;
      } else {
        return rejectWithValue('Failed to authenticate with email/password');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

// Email/Password Sign-up thunk
export const signUpWithEmailPassword = createAsyncThunk(
  'auth/emailPasswordSignUp',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Return user info directly from Firebase (no backend API needed for now)
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific Firebase error codes
        const firebaseError = error as any;
        if (firebaseError.code === 'auth/email-already-in-use') {
          return rejectWithValue('An account with this email already exists.');
        } else if (firebaseError.code === 'auth/weak-password') {
          return rejectWithValue('Password should be at least 6 characters.');
        } else if (firebaseError.code === 'auth/invalid-email') {
          return rejectWithValue('Please enter a valid email address.');
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Signup failed');
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
    // Google sign-in cases
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
      state.error = action.payload as string;
    });

    // Email/Password sign-in cases
    builder.addCase(signInWithEmailPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(signInWithEmailPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.message = null;
    });
    builder.addCase(signInWithEmailPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Email/Password sign-up cases
    builder.addCase(signUpWithEmailPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(signUpWithEmailPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.message = 'Account created successfully!';
    });
    builder.addCase(signUpWithEmailPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
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