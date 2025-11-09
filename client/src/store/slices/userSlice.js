import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for user operations
export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/profile');
            return response.data.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch profile'
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ name, preferences }, { rejectWithValue }) => {
        try {
            const response = await api.put('/users/profile', { name, preferences });
            return response.data.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile'
            );
        }
    }
);

export const fetchProgress = createAsyncThunk(
    'user/fetchProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/progress');
            return response.data.data.progress;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch progress'
            );
        }
    }
);

export const fetchNotifications = createAsyncThunk(
    'user/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/notifications');
            return response.data.data.notifications;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch notifications'
            );
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        progress: [],
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Progress
            .addCase(fetchProgress.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload;
            })
            .addCase(fetchProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

