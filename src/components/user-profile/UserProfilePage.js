import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid2 as Grid,
  Typography,
  Button,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ProfileInfoDisplay from './ProfileInfoDisplay';
import ProfileInfoForm from './ProfileInfoForm';

const UserProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState({
    name: 'Dr. Smith',
    email: 'drsmith@nutridata.com',
    phone: '+1 (555) 123-4567',
    role: 'Nutricionista',
    specialty: 'Nutrición Deportiva',
    bio: 'Especialista en nutrición con más de 10 años de experiencia trabajando con atletas profesionales.',
    avatar: null,
  });

  const [editMode, setEditMode] = useState(false);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setEditMode(false);
    // Aquí iría la lógica para guardar los cambios en la base de datos
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'flex-start',
        mb: 3
      }}>
        <Avatar
          sx={{ 
            width: { xs: 80, md: 100 }, 
            height: { xs: 80, md: 100 }, 
            mr: isMobile ? 0 : 3,
            mb: isMobile ? 2 : 0,
            bgcolor: theme.palette.primary.light
          }}
          src={user.avatar}
          alt={user.name}
        >
          {!user.avatar && user.name.charAt(0)}
        </Avatar>
        
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.role} - {user.specialty}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 4 }} />

      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6">Información Personal</Typography>
          <Button
            startIcon={<EditIcon />}
            color="success"
            variant="outlined"
            onClick={() => setEditMode(!editMode)}
            sx={{ textTransform: 'uppercase' }}
          >
            {editMode ? 'Cancelar' : 'Editar'}
          </Button>
        </Box>

        {editMode ? (
          <ProfileInfoForm 
            initialData={user} 
            onSave={handleUserUpdate} 
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <ProfileInfoDisplay user={user} />
        )}
      </Paper>
    </Box>
  );
};

export default UserProfilePage;