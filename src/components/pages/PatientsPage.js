import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid2 as Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '@mui/material/styles';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({
    name: '',
    surname: '',
    email: '', 
    age: '', 
    height: '',
    weight: ''
  });
  const navigate = useNavigate();
  const theme = useTheme();
  
  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const resetPatientForm = () => {
    setCurrentPatient({
      name: '', 
      surname: '', 
      email: '', 
      age: '', 
      height: '',
      weight: ''
    });
    setIsEditing(false);
  };
  
  const handleAddPatient = async () => {
    if (!currentPatient.name.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }
    
    try {
      const patientData = {
        ...currentPatient,
        age: currentPatient.age ? parseInt(currentPatient.age) : null,
        height: currentPatient.height ? parseFloat(currentPatient.height) : null,
        weight: currentPatient.weight ? parseFloat(currentPatient.weight) : null
      };
      
      if (isEditing) {
        await api.put(`/patients/${currentPatient.id}`, patientData);
      } else {
        await api.post("/patients", patientData);
      }
      
      setOpen(false);
      resetPatientForm();
      await fetchPatients();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} patient:`, error);
    }
  };
  
  const handleClickOpen = () => {
    resetPatientForm();
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    resetPatientForm();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Number input validation
    if (name === "age") {
      const parsed = parseInt(value);
      setCurrentPatient({
        ...currentPatient,
        [name]: isNaN(parsed) ? '' : parsed < 1 ? '1' : value
      });
    } else if (name === "height" || name === "weight") {
      const parsed = parseFloat(value);
      setCurrentPatient({
        ...currentPatient,
        [name]: isNaN(parsed) ? '' : parsed < 0 ? '0' : value
      });
    } else {
      setCurrentPatient({
        ...currentPatient,
        [name]: value
      });
    }
  };
  
  // Get initials for avatar
  const getInitials = (name, surname) => {
    const nameInitial = name ? name.charAt(0).toUpperCase() : '';
    const surnameInitial = surname ? surname.charAt(0).toUpperCase() : '';
    return nameInitial + surnameInitial;
  };
  
  const handleRowClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };
  
  const handleEditPatient = (patient, event) => {
    // Prevent row click
    event.stopPropagation();
    
    // Convert numeric values to string for form compatibility
    setCurrentPatient({
      ...patient,
      age: patient.age !== null ? patient.age.toString() : '',
      height: patient.height !== null ? patient.height.toString() : '',
      weight: patient.weight !== null ? patient.weight.toString() : ''
    });
    setIsEditing(true);
    setOpen(true);
  };
  
  const handleDeletePatient = async (patientId, event) => {
    // Prevent row click
    event.stopPropagation();
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await api.delete(`/patients/${patientId}`);
        await fetchPatients();
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Pacientes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total pacientes: {patients.length}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleClickOpen}
              >
                Nuevo paciente
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                size="small"
              >
                Exportar
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                size="small"
              >
                Filtrar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Altura</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow 
                  key={patient.id} 
                  hover 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.grey[700] 
                        : theme.palette.grey[100]
                    }
                  }}
                  onClick={() => handleRowClick(patient.id)}
                >
                  <TableCell>
                    <Avatar sx={{ bgcolor: '#8BC34A' }}>
                      {getInitials(patient.name, patient.surname)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {patient.name} {patient.surname || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {patient.age ? `${patient.age} años` : '-'}
                  </TableCell>
                  <TableCell>
                    {patient.email || '-'}
                  </TableCell>
                  <TableCell>
                    {patient.weight ? `${patient.weight} kg` : '-'}
                  </TableCell>
                  <TableCell>
                    {patient.height ? `${patient.height} cm` : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 1 
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                      <IconButton 
                        component={Link} 
                        to={`/patients/${patient.id}`}
                        size="small"
                        sx={{ color: 'primary.main' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: 'primary.main' }}
                        onClick={(e) => handleEditPatient(patient, e)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: 'primary.main' }}
                        onClick={(e) => handleDeletePatient(patient.id, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? 'Editar paciente' : 'Agregar nuevo paciente'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {isEditing 
              ? 'Por favor, actualice la información del paciente.' 
              : 'Por favor, ingrese la información del nuevo paciente.'}
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                name="name"
                label="Nombre"
                fullWidth
                variant="outlined"
                value={currentPatient.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="surname"
                label="Apellido"
                fullWidth
                variant="outlined"
                value={currentPatient.surname}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={currentPatient.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="age"
                label="Edad"
                type="number"
                fullWidth
                variant="outlined"
                value={currentPatient.age}
                onChange={handleChange}
                slotProps={{input: {min: 1}}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="height"
                label="Altura (cm)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentPatient.height}
                onChange={handleChange}
                slotProps={{input: {min: 0, step: 0.1}}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="weight"
                label="Peso (kg)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentPatient.weight}
                onChange={handleChange}
                slotProps={{input: {min: 0, step: 0.1}}}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleAddPatient} variant="contained">
            {isEditing ? 'Guardar cambios' : 'Agregar paciente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientsPage;