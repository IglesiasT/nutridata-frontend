import React, { useState } from 'react';
import { 
  Grid2 as Grid, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';
import PropTypes from 'prop-types';

const ProfileInfoForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Especialidad"
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            fullWidth
            label="Biografía"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2, 
            mt: 2 
          }}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Guardar Cambios
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

ProfileInfoForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ProfileInfoForm;