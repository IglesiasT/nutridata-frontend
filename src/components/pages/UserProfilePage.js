import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const UserProfilePage = () => {
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
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
    // Aquí iría la lógica para guardar los cambios en la base de datos
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Perfil de Usuario
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2 }}
                src={user.avatar}
                alt={user.name}
              >
                {!user.avatar && user.name.charAt(0)}
              </Avatar>
              <IconButton
                sx={{ position: 'relative', top: -30, right: -40, backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.role}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {user.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Información Personal</Typography>
              <Button
                startIcon={<EditIcon />}
                color="primary"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancelar' : 'Editar'}
              </Button>
            </Box>

            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Especialidad"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Biografía"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Guardar Cambios
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Nombre</Typography>
                    <Typography variant="body1" gutterBottom>{user.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography variant="body1" gutterBottom>{user.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Teléfono</Typography>
                    <Typography variant="body1" gutterBottom>{user.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Especialidad</Typography>
                    <Typography variant="body1" gutterBottom>{user.specialty}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Biografía</Typography>
                    <Typography variant="body1" paragraph>{user.bio}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfilePage;