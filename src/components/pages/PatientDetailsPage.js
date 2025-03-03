import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HeightIcon from '@mui/icons-material/Height';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('1');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/patients/${id}`);
        setPatient(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setError("No se pudo cargar los datos del paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleGoBack = () => {
    navigate('/patients');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    // Implement edit functionality or navigate to edit page
    console.log("Edit patient:", patient.id);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await api.delete(`/patients/${id}`);
        navigate('/patients');
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const calculateBMI = () => {
    if (patient.weight && patient.height) {
      const heightInMeters = patient.height / 100;
      const bmi = patient.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Bajo peso', color: '#FFC107' };
    if (bmi < 25) return { label: 'Peso normal', color: '#4CAF50' };
    if (bmi < 30) return { label: 'Sobrepeso', color: '#FF9800' };
    return { label: 'Obesidad', color: '#F44336' };
  };

  // Get initials for avatar
  const getInitials = (name, surname) => {
    const nameInitial = name ? name.charAt(0).toUpperCase() : '';
    const surnameInitial = surname ? surname.charAt(0).toUpperCase() : '';
    return nameInitial + surnameInitial;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Volver a la lista de pacientes
          </Button>
        </Box>
      </Container>
    );
  }

  if (!patient) return null;

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={handleGoBack} 
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Detalles del paciente
        </Typography>
      </Box>

      {/* Patient card header */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar 
                sx={{ width: 80, height: 80, bgcolor: '#8BC34A', fontSize: '2rem' }}
              >
                {getInitials(patient.name, patient.surname)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" component="h2">
                {patient.name} {patient.surname || ''}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                ID: {patient.id}
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                <IconButton 
                  color="error" 
                  onClick={handleDelete}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Patient details tabs */}
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="patient tabs"
              sx={{ px: 2 }}
            >
              <Tab label="Información Personal" value="1" />
              <Tab label="Historial" value="2" />
              <Tab label="Notas" value="3" />
            </Tabs>
          </Box>

          <TabPanel value="1">
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Datos Personales
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <CakeIcon color="action" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Edad
                          </Typography>
                          <Typography variant="body1">
                            {patient.age ? `${patient.age} años` : 'No especificado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {patient.email || 'No especificado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Add more personal information fields as needed */}
                  </Grid>
                </Paper>
              </Grid>

              {/* Anthropometric Data */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Datos Antropométricos
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <MonitorWeightIcon color="action" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Peso
                          </Typography>
                          <Typography variant="body1">
                            {patient.weight ? `${patient.weight} kg` : 'No especificado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <HeightIcon color="action" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Altura
                          </Typography>
                          <Typography variant="body1">
                            {patient.height ? `${patient.height} cm` : 'No especificado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {bmi && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            IMC
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="h6" sx={{ mr: 1 }}>
                              {bmi}
                            </Typography>
                            <Chip 
                              label={bmiCategory?.label} 
                              size="small"
                              sx={{ 
                                backgroundColor: bmiCategory?.color, 
                                color: 'white' 
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              {/* Comments */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Comentarios
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {patient.comments || 'Sin comentarios'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Historial de consultas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No hay consultas registradas para este paciente.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<MedicalInformationIcon />}
                sx={{ mt: 2 }}
              >
                Registrar consulta
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value="3">
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Notas y observaciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No hay notas registradas para este paciente.
              </Typography>
            </Box>
          </TabPanel>
        </TabContext>

        {/* Bottom actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            startIcon={<MedicalInformationIcon />}
          >
            Registrar consulta
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
          >
            Exportar datos
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientDetailsPage;