import { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/withTypes';
import { firebaseAuth, googleProvider } from '@/services/firebase';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { subscribeToTopic } from '../channels/channelsSlice';


interface EmailLoginPayload {
  email: string;
  password: string;
};

export const emailLogin = createAppAsyncThunk(
  'auth/emailLogin',
  async ({ email, password }: EmailLoginPayload, thunkApi) => {
    const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const token = await response.user.getIdToken();

    await thunkApi.dispatch(subscribeToTopic('all')).unwrap();

    return thunkApi
      .dispatch(userSignedIn({
        userId: response.user.uid,
        username: response.user.email,
        token
      }));
  }
);

export const emailSignUp = createAppAsyncThunk(
  'auth/emailSignUp',
  async ({ email, password }: EmailLoginPayload, thunkApi) => {
    const response = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const token = await response.user.getIdToken();

    await thunkApi.dispatch(subscribeToTopic('all')).unwrap();

    return thunkApi
      .dispatch(userSignedIn({
        userId: response.user.uid,
        username: response.user.email,
        token
      }));
  }
);

export const googleSignIn = createAppAsyncThunk(
  'auth/googleSignIn',
  async (_, thunkApi) => {
    const response = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    console.log(response);
    const token = await response.user.getIdToken();

    await thunkApi.dispatch(subscribeToTopic('all')).unwrap();

    return thunkApi
      .dispatch(userSignedIn({
        userId: response.user.uid,
        username: response.user.email,
        token
      }));
  }
);

export const phoneSignIn = createAppAsyncThunk(
  'auth/phoneSignIn',
  async (phoneNumber: string) => {
    
  }
);

export const logout = createAppAsyncThunk(
  'auth/logout',
  async () => {
    await signOut(firebaseAuth);
  }
);

interface AuthState {
  currentUserId: string | null
  token: string | null
  error: string | null
  status: 'idle' | 'pending' | 'failed' | 'succeeded';

  // This will be either their email or phone number.
  currentUsername: string | null;
};

const getInitialState = () => {
  let initialState: AuthState;
  if (firebaseAuth.currentUser) {
    const user = firebaseAuth.currentUser;
    initialState = {
      currentUserId: user.uid,
      currentUsername: user.displayName ?? user.phoneNumber ?? user.email,
      token: null,
      status: 'idle',
      error: null,
    }
  } else {
    initialState = {
      currentUserId: null,
      token: null,
      error: null,
      status: 'idle',
      currentUsername: null,
    }
  }

  return initialState;
}

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userSignedIn: (state, action) => {
      state.currentUserId = action.payload.userId;
      state.token = action.payload.token;
      state.currentUsername = action.payload.username;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(emailLogin.fulfilled, (state, action) => {
        // state.currentUserId = action.payload.userId;
        // state.token = action.payload.token;
        // state.currentUsername = action.payload.username;
      })
      .addCase(emailSignUp.fulfilled, (state, action) => {
        // state.currentUserId = action.payload.userId;
        // state.token = action.payload.token;
        // state.currentUsername = action.payload.username;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        // state.currentUserId = action.payload.userId;
        // state.token = action.payload.token;
        // state.currentUsername = action.payload.username;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.currentUserId = null;
        state.token = null;
        state.currentUsername = null;
      })
  }
})

export const { userSignedIn } = authSlice.actions;

export const selectCurrentUserId = (state: RootState) => state.auth.currentUserId;
export const selectCurrentUsername = (state: RootState) => state.auth.currentUsername;

export const selectToken = (state: RootState) => state.auth.token;

export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer