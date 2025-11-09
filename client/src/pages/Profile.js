import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Tab,
    Tabs,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
    fetchProfile,
    updateProfile,
    fetchProgress,
    fetchNotifications,
} from '../store/slices/userSlice';
import api from '../services/api';

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, progress, notifications, loading } = useSelector(
        (state) => state.user
    );

    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        preferences: {
            interests: [],
            difficulty: 'beginner',
            language: 'en',
        },
    });
    const [newInterest, setNewInterest] = useState('');

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchProgress());
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                preferences: profile.preferences || {
                    interests: [],
                    difficulty: 'beginner',
                    language: 'en',
                },
            });
        }
    }, [profile]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (profile) {
            setFormData({
                name: profile.name || '',
                preferences: profile.preferences || {
                    interests: [],
                    difficulty: 'beginner',
                    language: 'en',
                },
            });
        }
        setNewInterest('');
    };

    const handleSave = async () => {
        await dispatch(updateProfile(formData));
        setIsEditing(false);
        dispatch(fetchProfile());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1];
            setFormData({
                ...formData,
                preferences: {
                    ...formData.preferences,
                    [prefKey]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.preferences.interests.includes(newInterest.trim())) {
            setFormData({
                ...formData,
                preferences: {
                    ...formData.preferences,
                    interests: [...formData.preferences.interests, newInterest.trim()],
                },
            });
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interest) => {
        setFormData({
            ...formData,
            preferences: {
                ...formData.preferences,
                interests: formData.preferences.interests.filter((i) => i !== interest),
            },
        });
    };

    const handleMarkNotificationRead = async (notificationId) => {
        try {
            await api.put(`/users/notifications/${notificationId}/read`);
            dispatch(fetchNotifications());
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    if (loading && !profile) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Profile
            </Typography>

            <Paper elevation={2}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Profile Information" />
                        <Tab label="Progress" />
                        <Tab label="Notifications" />
                    </Tabs>
                </Box>

                {/* Profile Information Tab */}
                {tabValue === 0 && (
                    <Box sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <Typography variant="h5">Profile Information</Typography>
                            {!isEditing ? (
                                <Button
                                    startIcon={<EditIcon />}
                                    variant="outlined"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                            ) : (
                                <Box>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        onClick={handleSave}
                                        sx={{ mr: 1 }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        startIcon={<CancelIcon />}
                                        variant="outlined"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={profile?.email || ''}
                                    disabled
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Difficulty Preference"
                                    name="preferences.difficulty"
                                    value={formData.preferences.difficulty}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    margin="normal"
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Language"
                                    name="preferences.language"
                                    value={formData.preferences.language}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    margin="normal"
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                    Interests
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {formData.preferences.interests.map((interest, index) => (
                                        <Chip
                                            key={index}
                                            label={interest}
                                            onDelete={
                                                isEditing ? () => handleRemoveInterest(interest) : undefined
                                            }
                                        />
                                    ))}
                                </Box>
                                {isEditing && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            size="small"
                                            placeholder="Add interest"
                                            value={newInterest}
                                            onChange={(e) => setNewInterest(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddInterest();
                                                }
                                            }}
                                        />
                                        <Button variant="outlined" onClick={handleAddInterest}>
                                            Add
                                        </Button>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Progress Tab */}
                {tabValue === 1 && (
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                            Your Learning Progress
                        </Typography>
                        {progress.length === 0 ? (
                            <Alert severity="info">
                                You haven't enrolled in any courses yet. Start learning to see your
                                progress here!
                            </Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {progress.map((item) => (
                                    <Grid item xs={12} md={6} key={item.courseId}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {item.courseTitle}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    {item.courseDescription?.substring(0, 100)}
                                                    {item.courseDescription?.length > 100 ? '...' : ''}
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
                                                <Typography variant="caption" color="text.secondary">
                                                    Last visited: {new Date(item.lastVisited).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                                    Modules: {item.totalModules}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}

                {/* Notifications Tab */}
                {tabValue === 2 && (
                    <Box sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <NotificationsIcon sx={{ mr: 1 }} />
                            <Typography variant="h5">Notifications</Typography>
                        </Box>
                        {notifications.length === 0 ? (
                            <Alert severity="info">You have no notifications.</Alert>
                        ) : (
                            <List>
                                {notifications.map((notification) => (
                                    <React.Fragment key={notification.id}>
                                        <ListItem
                                            sx={{
                                                backgroundColor:
                                                    notification.status === 'unread'
                                                        ? 'action.hover'
                                                        : 'transparent',
                                            }}
                                        >
                                            <ListItemText
                                                primary={notification.message}
                                                secondary={new Date(notification.createdAt).toLocaleString()}
                                            />
                                            <ListItemSecondaryAction>
                                                {notification.status === 'unread' && (
                                                    <Chip
                                                        label="New"
                                                        color="primary"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                )}
                                                {notification.status === 'unread' && (
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleMarkNotificationRead(notification.id)}
                                                    >
                                                        <Typography variant="caption">Mark as read</Typography>
                                                    </IconButton>
                                                )}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Profile;

