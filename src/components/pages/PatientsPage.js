import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', condition: '' });

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

    if (newPatient.age < 0) {
      alert("La edad no puede ser negativa");
      return;
    }

    try {
      const response = await api.post("/patients", newPatient);
      setPatients([...patients, response.data]);
      setOpen(false);
      setNewPatient({ name: '', age: '', condition: '' });
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

  return (
    <div>
      <h1>Pacientes</h1>
      <Button 
        variant="contained" 
        color="primary" 
        style={{ float: 'right' }} 
        onClick={handleClickOpen}
      >
        Agregar nuevo paciente
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar nuevo paciente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingrese la información del nuevo paciente.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            value={newPatient.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Edad"
            type="number"
            fullWidth
            value={newPatient.age}
            onChange={handleChange}
            slotProps={{ input: { min: 1 } }} 
          />
          <TextField
            margin="dense"
            name="comments"
            label="Comentarios"
            type="text"
            fullWidth
            value={newPatient.comments}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddPatient} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsPage;
