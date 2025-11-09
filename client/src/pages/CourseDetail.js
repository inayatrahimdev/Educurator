import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    fetchCourseById,
    enrollCourse,
    updateCourseProgress,
    clearCurrentCourse,
} from '../store/slices/courseSlice';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse, loading } = useSelector((state) => state.courses);

    const [selectedModule, setSelectedModule] = useState(null);

    useEffect(() => {
        dispatch(fetchCourseById(id));

        return () => {
            dispatch(clearCurrentCourse());
        };
    }, [id, dispatch]);

    const handleEnroll = async () => {
        await dispatch(enrollCourse(id));
        dispatch(fetchCourseById(id));
    };

    const handleModuleComplete = async () => {
        if (!currentCourse?.modules || !selectedModule) return;

        const moduleIndex = currentCourse.modules.findIndex(
            (m) => m.id === selectedModule.id
        );
        const totalModules = currentCourse.modules.length;
        const progress = Math.round(((moduleIndex + 1) / totalModules) * 100);

        await dispatch(updateCourseProgress({ courseId: id, progress }));
        dispatch(fetchCourseById(id));
    };

    const isEnrolled = currentCourse?.userProgress !== undefined;

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!currentCourse) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">Course not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {currentCourse.title}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {currentCourse.tags?.map((tag, index) => (
                        <Chip key={index} label={tag} />
                    ))}
                </Box>

                <Typography variant="body1" paragraph>
                    {currentCourse.description}
                </Typography>

                {isEnrolled && currentCourse.userProgress && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Your Progress: {currentCourse.userProgress.progress}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={currentCourse.userProgress.progress}
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                    </Box>
                )}

                {!isEnrolled && (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleEnroll}
                        sx={{ mb: 3 }}
                    >
                        Enroll in Course
                    </Button>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Course Modules
                </Typography>

                {currentCourse.modules && currentCourse.modules.length > 0 ? (
                    <Box>
                        {currentCourse.modules.map((module, index) => (
                            <Accordion
                                key={module.id}
                                expanded={selectedModule?.id === module.id}
                                onChange={() => setSelectedModule(module)}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        Module {index + 1}: {module.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" paragraph>
                                        {module.content}
                                    </Typography>
                                    {isEnrolled && selectedModule?.id === module.id && (
                                        <Button
                                            variant="outlined"
                                            onClick={handleModuleComplete}
                                            sx={{ mt: 2 }}
                                        >
                                            Mark as Complete
                                        </Button>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Alert severity="info">No modules available for this course.</Alert>
                )}
            </Paper>
        </Container>
    );
};

export default CourseDetail;

