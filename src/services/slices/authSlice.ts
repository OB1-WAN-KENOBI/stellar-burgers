import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserApi, loginUserApi, logoutApi, registerUserApi, updateUserApi, type TLoginData, type TRegisterData } from '@api';

type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const registerUser = createAsyncThunk('auth/register', async (data: TRegisterData) => {
  const res = await registerUserApi(data);
  localStorage.setItem('refreshToken', res.refreshToken);
  document.cookie = `accessToken=${res.accessToken}`;
  return res.user;
});

export const loginUser = createAsyncThunk('auth/login', async (data: TLoginData) => {
  const res = await loginUserApi(data);
  localStorage.setItem('refreshToken', res.refreshToken);
  document.cookie = `accessToken=${res.accessToken}`;
  return res.user;
});

export const updateUser = createAsyncThunk('auth/update', async (data: Partial<TRegisterData>) => {
  const res = await updateUserApi(data);
  return res.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; Max-Age=0';
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default authSlice.reducer;
