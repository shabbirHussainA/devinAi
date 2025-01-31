
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../apis/authApi';
import {isTokenValid} from '../utils/tokenValidity'
// Async Thunks
export const signup = createAsyncThunk('user/register', async({email,password}) => {
  const response = await authApi.signup(email,password);
  console.log(response)
  return response.data; // Assuming the response contains a success message or token
});

export const login = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
    try {
      const response = await authApi.login(email, password);
      console.log('API Response:', response.data); // Log to confirm structure
      // localStorage.setItem('user',response.data.user._id)
      // localStorage.setItem('token', response.data.token); // Ensure the token exists
      return response.data;
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message); // Reject with meaningful error
    }
  });
  const token = localStorage.getItem('token');
  const tokenData = isTokenValid(token);
  const  initialState ={
    user: tokenData.user,
    token: token||'',
    isLoggedIn: tokenData.valid,
    loading: false,
    error: null,
  }
// Slice
const authSlice = createSlice({
  name: 'auth',
 initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state,action){
        state.isLoggedIn= false,
        state.user = null,
        state.token = "",
        localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {

        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
    
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state,action) => {
        state.loading = true;
        state.error =null;
      })
      .addCase(login.fulfilled, (state,action)=>{
        state.isLoggedIn= true;
        state.loading = false;
        state.token = action.payload?.token;
        state.user = action.payload?.user;
        localStorage.setItem('token', action.payload?.token);
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
