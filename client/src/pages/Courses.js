import React, { useEffect, useState } from 'react';
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
    TextField,
    Box,
    InputAdornment,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchCourses } from '../store/slices/courseSlice';

const Courses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courses, loading } = useSelector((state) => state.courses);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        dispatch(fetchCourses({ search: e.target.value }));
    };

    const handleViewCourse = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                All Courses
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 600 }}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : courses.length === 0 ? (
                <Alert severity="info">No courses found.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {course.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        {course.description?.substring(0, 150)}
                                        {course.description?.length > 150 ? '...' : ''}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {course.tags?.slice(0, 4).map((tag, index) => (
                                            <Chip key={index} label={tag} size="small" />
                                        ))}
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleViewCourse(course.id)}
                                    >
                                        View Course
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Courses;

