import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const PatientDetailsPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatient();
  }, [id]);

  if (!patient) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{patient.name}</h1>
      <p>Edad: {patient.age}</p>
      <p>Comentarios: {patient.comments}</p>
    </div>
  );
};

export default PatientDetailsPage;