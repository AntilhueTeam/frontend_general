import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Chip, 
  Divider, 
  Button, 
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Work,
  SafetyDivider,
  Engineering,
  CalendarToday,
  LocationOn,
  LocalFireDepartment,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const PerfilOperadorPerforacion = () => {
  // Datos de ejemplo
  const operador = {
    nombre: "Oscar Salas",
    puesto: "Gerente de operaciones",
    experiencia: "12 años",
    ubicacion: "Yacimiento Petrolífero Norte",
    equipo: "Perforadora XDR-2000",
    certificaciones: [
      { nombre: "H2S Alive", vigencia: "2025" },
      { nombre: "Primeros Auxilios", vigencia: "2024" },
      { nombre: "Trabajo en Alturas", vigencia: "2024" }
    ],
    turnoActual: "Turno Noche (20:00 - 06:00)",
    proximoDescanso: "15 días",
    alertas: ["Presión de lodo alta", "Temperatura motor +90°C"],
    metricas: {
      profundidadActual: 2350,
      profundidadObjetivo: 3500,
      diasOperacion: 28,
      seguridad: 97.4
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: 'var(--color-bg-primary)', 
      minHeight: '100vh', 
      p: 3,
      fontFamily: 'Roboto, sans-serif'
    }}>
      {/* Encabezado */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: '#2d2d2d', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          backgroundColor: '#ff9800',
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)'
        }
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {operador.nombre}
            </Typography>
            <Typography variant="h6" sx={{ color: '#ff9800' }}>
              {operador.puesto}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Chip 
                icon={<LocationOn />} 
                label={operador.ubicacion} 
                sx={{ backgroundColor: '#424242', color: 'white' }} 
              />
              <Chip 
                icon={<Work />} 
                label={operador.equipo} 
                sx={{ backgroundColor: '#424242', color: 'white' }} 
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Sección principal */}
      <Grid container spacing={3}>
        {/* Columna izquierda */}
        <Grid size={{xs:12, md:4}}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              <SafetyDivider sx={{ verticalAlign: 'middle', mr: 1 }} />
              Certificaciones
            </Typography>
            <List dense>
              {operador.certificaciones.map((cert, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={cert.nombre} 
                    secondary={`Vigente hasta ${cert.vigencia}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
              Turno Actual
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalFireDepartment color="warning" />
              <Box>
                <Typography>{operador.turnoActual}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Próximo descanso en: {operador.proximoDescanso}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Columna derecha */}
        <Grid size={{xs:12, md:8}}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              Progreso de Perforación Actual
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{xs:12, md:6}}>
                <Box sx={{ mb: 2 }}>
                  <Typography>Profundidad alcanzada</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(operador.metricas.profundidadActual / operador.metricas.profundidadObjetivo) * 100}
                    sx={{ 
                      height: 20,
                      borderRadius: 1,
                      backgroundColor: '#424242',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ff9800'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">
                      {operador.metricas.profundidadActual}m
                    </Typography>
                    <Typography variant="body2">
                      Objetivo: {operador.metricas.profundidadObjetivo}m
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{xs:12, md:6}}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {operador.metricas.diasOperacion}
                  </Typography>
                  <Typography variant="body2">Días de operación</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="h4" sx={{ color: '#4caf50' }}>
                    {operador.metricas.seguridad}%
                  </Typography>
                  <Typography variant="body2">Índice de seguridad</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
              <Warning sx={{ verticalAlign: 'middle', mr: 1 }} />
              Alertas Activas
            </Typography>
            <List>
              {operador.alertas.map((alerta, index) => (
                <ListItem key={index} sx={{ color: '#d32f2f' }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Warning color="error" />
                  </ListItemIcon>
                  <ListItemText primary={alerta} />
                </ListItem>
              ))}
            </List>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 2,
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' }
              }}
            >
              Protocolo de Emergencia
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Barra de estado inferior */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: '#2d2d2d', 
        color: 'white', 
        p: 1,
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <Typography>Estado del Equipo: <span style={{ color: '#4caf50' }}>Operativo</span></Typography>
        <Typography>Temperatura Ambiental: 42°C</Typography>
        <Typography>Presión del Sistema: 3200 psi</Typography>
      </Box>
    </Box>
  );
};

export default PerfilOperadorPerforacion;