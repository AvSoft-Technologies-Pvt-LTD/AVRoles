import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Replace with your actual resource endpoint
const baseUrl = 'https://6801242781c7e9fbcc41aacf.mockapi.io/api/AV1/users';

const initialState = {
  userType: '',
  registrationData: {},
  isOTPSent: false,
  otp: '',
  isVerified: false,
  isLoggedIn: false,
  loading: false,
  error: null,
  token: null,
  user: null,
  isAuthenticated: false
};

// ✅ REGISTER
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    const data = await response.json();

    // Save registration data in localStorage
    localStorage.setItem('user', JSON.stringify(data));

    return data;

  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// ✅ LOGIN
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // Check if the stored user matches the provided login credentials (phone and password)
      if (storedUser.phone === loginData.phone && storedUser.password === loginData.password) {
        const mockToken = `mock-token-${storedUser.id}`; // Simulated token
        localStorage.setItem('token', mockToken);
        return { user: storedUser, token: mockToken };
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      // If no user found in localStorage, fetch users from the API
      const response = await fetch(baseUrl);
      const users = await response.json();
      const user = users.find((u) => u.phone === loginData.phone && u.password === loginData.password);

      if (!user) throw new Error('Invalid credentials');

      const mockToken = `mock-token-${user.id}`; // Simulated token
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token: mockToken };
    }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// ✅ Fake OTP verification
export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otp, { getState, rejectWithValue }) => {
  try {
    const expectedOTP = getState().auth.otp;
    if (otp === expectedOTP) {
      return true;
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    saveRegistrationData: (state, action) => {
      state.registrationData = action.payload;
    },
    sendOTP: (state) => {
      state.isOTPSent = true;
      state.otp = '123456'; // 🔐 Mock OTP
    },
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isOTPSent = true;
        state.registrationData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user; // Save the user to the state
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.isVerified = true;
        state.isLoggedIn = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUserType,
  saveRegistrationData,
  sendOTP,
  setOTP,
  logout,
  setUser
} = authSlice.actions;

export default authSlice.reducer;
