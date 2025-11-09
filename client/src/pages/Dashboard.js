import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    LinearProgress,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    fetchRecommendations,
    enrollCourse,
    fetchCourses,
} from '../store/slices/courseSlice';
import { fetchProgress } from '../store/slices/userSlice';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { recommendations, loading: coursesLoading } = useSelector(
        (state) => state.courses
    );
    const { progress, loading: progressLoading } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(fetchRecommendations());
        dispatch(fetchProgress());
    }, [dispatch]);

    const handleEnroll = async (courseId) => {
        await dispatch(enrollCourse(courseId));
        dispatch(fetchRecommendations());
        dispatch(fetchProgress());
    };

    const handleViewCourse = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Welcome back, {user?.name}!
            </Typography>

            {/* User Progress Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Your Progress
                </Typography>
                {progressLoading ? (
                    <CircularProgress />
                ) : progress.length === 0 ? (
                    <Alert severity="info">You haven't enrolled in any courses yet.</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {progress.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.courseId}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {item.courseTitle}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {item.courseDescription}
                                        </Typography>
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Progress: {item.progress}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={item.progress}
                                                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                            />
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            onClick={() => handleViewCourse(item.courseId)}
                                        >
                                            Continue Learning
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Recommendations Section */}
            <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Recommended for You
                </Typography>
                {coursesLoading ? (
                    <CircularProgress />
                ) : recommendations.length === 0 ? (
                    <Alert severity="info">No recommendations available at the moment.</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {recommendations.map((course) => (
                            <Grid item xs={12} sm={6} md={4} key={course.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {course.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                            noWrap
                                        >
                                            {course.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {course.tags?.slice(0, 3).map((tag, index) => (
                                                <Chip key={index} label={tag} size="small" />
                                            ))}
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            onClick={() => handleViewCourse(course.id)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleEnroll(course.id)}
                                        >
                                            Enroll
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;

