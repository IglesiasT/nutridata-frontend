import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RefreshIcon from '@mui/icons-material/Refresh';

const DashboardPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    recentPatients: [],
    ageGroups: {
      under18: 0,
      between18And40: 0,
      between41And65: 0,
      over65: 0
    },
    bmiGroups: {
      underweight: 0,
      normal: 0,
      overweight: 0,
      obese: 0
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch patients data
        const patientsResponse = await api.get('/patients');
        const patients = patientsResponse.data;
        
        // Calculate statistics
        const stats = calculateStats(patients);
        setPatientStats(stats);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("No se pudieron cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateStats = (patients) => {
    // Calculate age groups
    const ageGroups = {
      under18: 0,
      between18And40: 0,
      between41And65: 0,
      over65: 0
    };

    // Calculate BMI groups
    const bmiGroups = {
      underweight: 0,
      normal: 0,
      overweight: 0,
      obese: 0
    };

    // Process each patient
    patients.forEach(patient => {
      // Age groups
      if (patient.age) {
        if (patient.age < 18) ageGroups.under18++;
        else if (patient.age <= 40) ageGroups.between18And40++;
        else if (patient.age <= 65) ageGroups.between41And65++;
        else ageGroups.over65++;
      }

      // BMI calculation and groups
      if (patient.weight && patient.height) {
        const heightInMeters = patient.height / 100;
        const bmi = patient.weight / (heightInMeters * heightInMeters);
        
        if (bmi < 18.5) bmiGroups.underweight++;
        else if (bmi < 25) bmiGroups.normal++;
        else if (bmi < 30) bmiGroups.overweight++;
        else bmiGroups.obese++;
      }
    });

    // Get most recent patients (last 5)
    const recentPatients = [...patients]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

    return {
      totalPatients: patients.length,
      recentPatients,
      ageGroups,
      bmiGroups
    };
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Bajo peso', color: '#FFC107' };
    if (bmi < 25) return { label: 'Peso normal', color: '#4CAF50' };
    if (bmi < 30) return { label: 'Sobrepeso', color: '#FF9800' };
    return { label: 'Obesidad', color: '#F44336' };
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const patientsResponse = await api.get('/patients');
      const stats = calculateStats(patientsResponse.data);
      setPatientStats(stats);
      setError(null);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      setError("No se pudieron actualizar los datos del dashboard");
    } finally {
      setLoading(false);
    }
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
            startIcon={<RefreshIcon />}
            onClick={refreshData}
          >
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  // Prepare data for charts
  const ageGroupsData = [
    { name: 'Menores de 18', value: patientStats.ageGroups.under18, color: '#4CAF50' },
    { name: '18-40 años', value: patientStats.ageGroups.between18And40, color: '#2196F3' },
    { name: '41-65 años', value: patientStats.ageGroups.between41And65, color: '#FF9800' },
    { name: 'Mayores de 65', value: patientStats.ageGroups.over65, color: '#F44336' }
  ];

  const bmiGroupsData = [
    { name: 'Bajo peso', value: patientStats.bmiGroups.underweight, color: '#FFC107' },
    { name: 'Peso normal', value: patientStats.bmiGroups.normal, color: '#4CAF50' },
    { name: 'Sobrepeso', value: patientStats.bmiGroups.overweight, color: '#FF9800' },
    { name: 'Obesidad', value: patientStats.bmiGroups.obese, color: '#F44336' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshData}
        >
          Actualizar
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Patients */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleAltIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Pacientes
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {patientStats.totalPatients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pacientes registrados
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button 
                component={RouterLink}
                to="/patients"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Ver todos los pacientes
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Age Distribution */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DateRangeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Distribución por Edad
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4CAF50', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    &lt;18
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.ageGroups.under18}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2196F3', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    18-40
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.ageGroups.between18And40}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF9800', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    41-65
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.ageGroups.between41And65}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F44336', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    &gt;65
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.ageGroups.over65}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* BMI Distribution */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenterIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Distribución IMC
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFC107', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Bajo peso
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.bmiGroups.underweight}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4CAF50', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Normal
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.bmiGroups.normal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF9800', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Sobrepeso
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.bmiGroups.overweight}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F44336', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Obesidad
                  </Typography>
                </Box>
                <Typography variant="body1">{patientStats.bmiGroups.obese}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoreTimeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Acciones Rápidas
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                component={RouterLink}
                to="/patients" 
                startIcon={<PersonAddIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Nuevo Paciente
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<MedicalInformationIcon />}
                fullWidth
              >
                Registrar Consulta
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Patients Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f5f5f5' }}>
          <Typography variant="h5" component="h2">
            Pacientes Recientes
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Altura</TableCell>
                <TableCell>IMC</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientStats.recentPatients.map((patient) => {
                const bmi = calculateBMI(patient.weight, patient.height);
                const bmiCategory = getBMICategory(bmi);
                
                return (
                  <TableRow key={patient.id} hover>
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
                    <TableCell>
                      {bmi ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {bmi}
                          </Typography>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              bgcolor: bmiCategory?.color || '#ccc'
                            }} 
                          />
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        component={RouterLink}
                        to={`/patients/${patient.id}`}
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {patientStats.recentPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay pacientes registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {patientStats.recentPatients.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
            <Button 
              component={RouterLink}
              to="/patients"
              variant="text"
            >
              Ver todos los pacientes
            </Button>
          </Box>
        )}
      </Paper>

      {/* Add more dashboard components as needed */}
    </Container>
  );
};

export default DashboardPage;