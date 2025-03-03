import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Añadido useNavigate
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
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTheme } from '@mui/material/styles';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ 
    name: '',
    surname: '',
    email: '', 
    phone: '', 
    age: '', 
    comments: '' 
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
  
  const handleAddPatient = async () => {
    if (!newPatient.name.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }
    
    try {
      const response = await api.post("/patients", newPatient);
      setPatients([...patients, response.data]);
      setOpen(false);
      setNewPatient({ name: '', surname: '', email: '', phone: '', age: '', comments: '' });
      await fetchPatients();
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: name === "age" ? Math.max(1, Number(value)) : value
    });
  };
  
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Function to get random status for demo purposes. It should be fetched from the API
  const getRandomStatus = () => {
    const statuses = ['Activo', 'Inactivo'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };
  
  const handleRowClick = (patientId) => {
    navigate(`/patients/${patientId}`);
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
              <Typography variant="body2" color="text.secondary">
                Activos: {patients.filter(p => p.status !== 'Inactivo').length}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                size="small"
              >
                Filtrar
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                size="small"
              >
                Importar
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                size="small"
              >
                Exportar
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleClickOpen}
              >
                Nuevo paciente
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            {/* Modify TableHead for dark mode */}
            <TableHead 
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[800] 
                  : '#f5f5f5' 
              }}
            >
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => {
                // For demo purposes, add some extra fields if they don't exist
                const status = patient.status || getRandomStatus();
                const statusColor = status === 'Activo' ? 'success' : 'error';
                
                return (
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
                        {getInitials(patient.name)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{patient.name}</Typography>
                      {patient.age && (
                        <Typography variant="body2" color="text.secondary">
                          {patient.age} años
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{patient.phone || '+56 9 1234 5678'}</TableCell>
                    <TableCell>{patient.email || `${patient.name.toLowerCase().replace(' ', '.')}@email.com`}</TableCell>
                    <TableCell>
                      <Chip
                        label={status}
                        size="small"
                        color={statusColor}
                      />
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
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'primary.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Agregar nuevo paciente</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Por favor, ingrese la información del nuevo paciente.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Nombre"
                fullWidth
                variant="outlined"
                value={newPatient.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="surname"
                label="Apellido"
                fullWidth
                variant="outlined"
                value={newPatient.surname}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={newPatient.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Teléfono"
                fullWidth
                variant="outlined"
                value={newPatient.phone}
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
                value={newPatient.age}
                onChange={handleChange}
                slotProps={{input: {min: 1}}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="comments"
                label="Comentarios"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                value={newPatient.comments}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleAddPatient} variant="contained">
            Agregar paciente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientsPage;