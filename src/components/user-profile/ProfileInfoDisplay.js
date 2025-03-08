import React from 'react';
import { Grid2 as Grid, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

const InfoItem = ({ label, value }) => (
  <Box sx={{ mb: 2, width: '100%' }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
      {value}
    </Typography>
  </Box>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const ProfileInfoDisplay = ({ user }) => {
  return (
    <Grid container spacing={3} sx={{ width: '100%' }}>
      <Grid xs={12} md={6}>
        <InfoItem label="Email" value={user.email} />
      </Grid>
      <Grid xs={12} md={6}>
        <InfoItem label="Teléfono" value={user.phone} />
      </Grid>
      <Grid xs={12} md={6}>
        <InfoItem label="Especialidad" value={user.specialty} />
      </Grid>
      <Grid xs={12}>
        <InfoItem label="Biografía" value={user.bio} />
      </Grid>
    </Grid>
  );
};

ProfileInfoDisplay.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired
};

export default ProfileInfoDisplay;