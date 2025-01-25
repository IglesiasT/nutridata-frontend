import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

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

  return (
    <div>
      <h1>Pacientes</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsPage;
