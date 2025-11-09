import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for courses
export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async ({ search, tags } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (tags) params.append('tags', tags);

            const response = await api.get(`/courses?${params.toString()}`);
            return response.data.data.courses;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch courses'
            );
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'courses/fetchCourseById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/${id}`);
            return response.data.data.course;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch course'
            );
        }
    }
);

export const fetchRecommendations = createAsyncThunk(
    'courses/fetchRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/courses/recommendations/list');
            return response.data.data.recommendations;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch recommendations'
            );
        }
    }
);

export const enrollCourse = createAsyncThunk(
    'courses/enrollCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            await api.post(`/courses/${courseId}/enroll`);
            return courseId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to enroll in course'
            );
        }
    }
);

export const updateCourseProgress = createAsyncThunk(
    'courses/updateProgress',
    async ({ courseId, progress }, { rejectWithValue }) => {
        try {
            await api.put(`/courses/${courseId}/progress`, { progress });
            return { courseId, progress };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update progress'
            );
        }
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        currentCourse: null,
        recommendations: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Courses
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Course By ID
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Recommendations
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.loading = false;
                state.recommendations = action.payload;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Enroll Course
            .addCase(enrollCourse.fulfilled, (state) => {
                // Course enrolled successfully
            })
            // Update Progress
            .addCase(updateCourseProgress.fulfilled, (state, action) => {
                if (state.currentCourse && state.currentCourse.id === action.payload.courseId) {
                    state.currentCourse.userProgress = {
                        ...state.currentCourse.userProgress,
                        progress: action.payload.progress,
                    };
                }
            });
    },
});

export const { clearCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;

