import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for authentication
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data.data;

            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set default authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, user };
        } catch (error) {
            // Handle different error formats
            let errorMessage = 'Login failed';
            
            // Check if server is not running or network error
            if (!error.response) {
                if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
                    errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
                } else if (error.message) {
                    errorMessage = `Network error: ${error.message}`;
                }
            } else if (error.response?.data) {
                // Backend returned an error response
                errorMessage = error.response.data.message || 
                              error.response.data.error || 
                              'Login failed';
                
                // Handle validation errors
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    errorMessage = error.response.data.errors
                        .map(err => err.msg || err.message || err)
                        .join(', ');
                }
            } else if (error.message) {
                // Other error
                errorMessage = error.message;
            }
            
            console.error('Login error:', error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password, preferences }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                preferences,
            });
            const { token, user } = response.data.data;

            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set default authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, user };
        } catch (error) {
            // Handle different error formats
            let errorMessage = 'Registration failed';
            
            // Check if server is not running or network error
            if (!error.response) {
                if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
                    errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
                } else if (error.message) {
                    errorMessage = `Network error: ${error.message}`;
                }
            } else if (error.response?.data) {
                // Backend returned an error response
                errorMessage = error.response.data.message || 
                              error.response.data.error || 
                              'Registration failed';
                
                // Handle validation errors
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    errorMessage = error.response.data.errors
                        .map(err => err.msg || err.message || err)
                        .join(', ');
                }
            } else if (error.message) {
                // Other error
                errorMessage = error.message;
            }
            
            console.error('Registration error:', error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');
            return response.data.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to get user info'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getMe.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

