"use client"
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Divider
} from '@mui/material';
import {
  Engineering,
  Work,
  SafetyDivider,
  CalendarToday,
  LocalFireDepartment,
  AddCircle,
  Delete,
  Save,
  Cancel
} from '@mui/icons-material';

const EditarPerfilOperador = () => {
  const [operador, setOperador] = useState({
    nombre: "Oscar Salas",
    puesto: "Operador Senior de Perforación",
    experiencia: "12",
    ubicacion: "Yacimiento Petrolífero Norte",
    equipo: "XDR-2000",
    certificaciones: [
      { nombre: "H2S Alive", vigencia: "2025" },
      { nombre: "Primeros Auxilios", vigencia: "2024" }
    ],
    turno: "Noche",
    contactoEmergencia: "+54 9 11 5555-5555"
  });

  const [newCertificacion, setNewCertificacion] = useState({
    nombre: "",
    vigencia: ""
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setOperador(prev => ({ ...prev, [name]: value }));
  };

  const addCertificacion = () => {
    if (newCertificacion.nombre && newCertificacion.vigencia) {
      setOperador(prev => ({
        ...prev,
        certificaciones: [...prev.certificaciones, newCertificacion]
      }));
      setNewCertificacion({ nombre: "", vigencia: "" });
    }
  };

  const removeCertificacion = (index: number) => {
    setOperador(prev => ({
      ...prev,
      certificaciones: prev.certificaciones.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box sx={{ 
      backgroundColor: 'white', 
      minHeight: '100vh', 
      p: 3,
      color: '#ffffff'
    }}>
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: '#2d2d2d',
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ 
            width: 100, 
            height: 100, 
            border: '3px solid #ff9800',
            backgroundColor: '#424242'
          }}>
            <Engineering sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h4" color='white' sx={{ fontWeight: 'bold' }}>
            Editar Perfil Operativo
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Columna Izquierda - Información Personal */}
        <Grid size={{xs:12, md:6}}>
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#2d2d2d' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              Datos Personales
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  name="nombre"
                  value={operador.nombre}
                  onChange={handleChange}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              
              <Grid size={{xs:12, md:6}}>
                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: '#ffffff' }}>Puesto</InputLabel>
                  <Select
                    name="puesto"
                    value={operador.puesto}
                    onChange={handleChange}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="Operador Senior de Perforación">Operador Senior</MenuItem>
                    <MenuItem value="Operador Junior de Perforación">Operador Junior</MenuItem>
                    <MenuItem value="Supervisor de Perforación">Supervisor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Años de Experiencia"
                  name="experiencia"
                  type="number"
                  value={operador.experiencia}
                  onChange={handleChange}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Contacto de Emergencia"
                  name="contactoEmergencia"
                  value={operador.contactoEmergencia}
                  onChange={handleChange}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, backgroundColor: '#2d2d2d' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              <SafetyDivider sx={{ mr: 1, verticalAlign: 'middle' }} />
              Certificaciones
            </Typography>
            
            <List dense>
              {operador.certificaciones.map((cert, index) => (
                <ListItem key={index} secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeCertificacion(index)}
                    sx={{ color: '#ff6666' }}
                  >
                    <Delete />
                  </IconButton>
                }>
                  <ListItemText
                    primary={cert.nombre}
                    secondary={`Vigencia: ${cert.vigencia}`}
                    sx={{ color: '#ffffff' }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, backgroundColor: '#ff9800' }} />

            <Grid container spacing={2} alignItems="center">
              <Grid size={{xs:5}}>
                <TextField
                  fullWidth
                  label="Nueva Certificación"
                  value={newCertificacion.nombre}
                  onChange={(e) => setNewCertificacion(prev => ({ ...prev, nombre: e.target.value }))}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid size={{xs:5}}>
                <TextField
                  fullWidth
                  label="Año de Vigencia"
                  type="number"
                  value={newCertificacion.vigencia}
                  onChange={(e) => setNewCertificacion(prev => ({ ...prev, vigencia: e.target.value }))}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid size={{xs:2}}>
                <IconButton 
                  onClick={addCertificacion} 
                  sx={{ color: '#4caf50' }}
                >
                  <AddCircle fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Columna Derecha - Configuración Operativa */}
        <Grid size={{xs:12, md:6}}>
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#2d2d2d' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
              Configuración de Turnos
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{xs:12, md:6}}>
                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: '#ffffff' }}>Turno Asignado</InputLabel>
                  <Select
                    name="turno"
                    value={operador.turno}
                    onChange={handleChange}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="Mañana">Mañana (06:00 - 14:00)</MenuItem>
                    <MenuItem value="Tarde">Tarde (14:00 - 22:00)</MenuItem>
                    <MenuItem value="Noche">Noche (22:00 - 06:00)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Ubicación Actual"
                  name="ubicacion"
                  value={operador.ubicacion}
                  onChange={handleChange}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Equipo Asignado"
                  name="equipo"
                  value={operador.equipo}
                  onChange={handleChange}
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, backgroundColor: '#2d2d2d' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              <LocalFireDepartment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Configuración de Equipo
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Modelo de Perforadora"
                  value="XDR-2000"
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                  disabled
                />
              </Grid>
              
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Profundidad Objetivo (m)"
                  type="number"
                  value="3500"
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Límite de Presión (psi)"
                  type="number"
                  value="5000"
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Acciones */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: '#2d2d2d', 
        p: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2
      }}>
        <Button 
          variant="contained" 
          startIcon={<Cancel />}
          sx={{ 
            bgcolor: '#666666',
            '&:hover': { bgcolor: '#808080' }
          }}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Save />}
          sx={{ 
            bgcolor: '#ff9800',
            '&:hover': { bgcolor: '#ffab40' }
          }}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};

export default EditarPerfilOperador;