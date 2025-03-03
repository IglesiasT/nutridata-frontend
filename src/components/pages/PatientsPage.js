import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Button from '@mui/material/Button';


const PatientsPage = () => {
  const [patients, setPatients] = useState([]);

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

  const handleAddPatient = () => {
    console.log("Agregar nuevo paciente");
  };

  return (
    <div>
      <h1>Pacientes</h1>
      <Button 
        variant="contained" 
        color="primary" 
        style={{ float: 'right' }} 
        onClick={handleAddPatient}
      >
        Agregar nuevo paciente
      </Button>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsPage;
