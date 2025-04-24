"use client";

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import { Search, Add, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Mapa from '../mapa/components/mapa';
import Link from 'next/link';

// Datos de ejemplo mejorados
const mockQuotes = [
  { id: 1, cliente: 'Empresa A', fecha: '2024-03-15', total: 2500, estado: 'pendiente', responsable: 'Susana', actualizado: '2024-03-10' },
  { id: 2, cliente: 'Empresa B', fecha: '2024-03-14', total: 4200, estado: 'aprobado', responsable: 'Susana', actualizado: '2024-03-14' },
  { id: 3, cliente: 'Empresa C', fecha: '2024-03-13', total: 1800, estado: 'rechazado', responsable: 'Oscar', actualizado: '2024-02-28' },
  { id: 4, cliente: 'Empresa D', fecha: '2024-03-20', total: 3500, estado: 'pendiente', responsable: 'Susana', actualizado: '2024-03-10' },
  { id: 5, cliente: 'Empresa E', fecha: '2024-03-25', total: 5100, estado: 'aprobado', responsable: 'Oscar', actualizado: '2024-03-18' },
];

const DashboardCotizaciones = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [quotes] = useState(mockQuotes);

  // Métricas dinámicas
  const metrics = useMemo(() => ({
    total: quotes.length,
    pendientes: quotes.filter(q => q.estado === 'pendiente').length,
    aprobadas: quotes.filter(q => q.estado === 'aprobado').length,
    rechazadas: quotes.filter(q => q.estado === 'rechazado').length,
  }), [quotes]);

  // Datos para gráficos
  const chartData = [
    { name: 'Pendientes', value: metrics.pendientes, color: theme.palette.warning.main },
    { name: 'Aprobadas', value: metrics.aprobadas, color: theme.palette.success.main },
    { name: 'Rechazadas', value: metrics.rechazadas, color: theme.palette.error.main },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazado': return 'error';
      default: return 'default';
    }
  };

  const handleCrearCotizacion = () => {
    window.location.href = '/cotizacion/crear';
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesClient = quote.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || quote.estado === selectedStatus;
    const quoteDate = new Date(quote.fecha);
    const matchesDate = (!startDate || quoteDate >= startDate) && (!endDate || quoteDate <= endDate);
    return matchesClient && matchesStatus && matchesDate;
  });

  // Cotizaciones próximas (15 días)
  const quotesNext15Days = useMemo(() => {
    const today = new Date();
    const limitDate = new Date();
    limitDate.setDate(today.getDate() + 15);
    return quotes.filter(quote => {
      const quoteDate = new Date(quote.fecha);
      return quoteDate > today && quoteDate <= limitDate;
    });
  }, [quotes]);

  // Actualizaciones pendientes (sin cambios en 7 días)
  const outdatedQuotes = useMemo(() => {
    const today = new Date();
    return quotes.filter(quote => {
      const lastUpdate = new Date(quote.actualizado);
      const diffTime = Math.abs(today.getTime() - lastUpdate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 7;
    });
  }, [quotes]);

  // Generar color del avatar basado en el nombre
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3, backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Gestión de Cotizaciones
          </Typography>

          <Box display="flex" gap={2} component={Link} href="/cotizacion/subir">
          <Button 
            variant="contained"
            startIcon={<Add />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCrearCotizacion}
            
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Nueva Cotización
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Cargar Cotización
          </Button>
          </Box>

        </Box>

        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Cotizaciones', value: metrics.total, color: 'primary' },
            { label: 'Pendientes', value: metrics.pendientes, color: 'warning' },
            { label: 'Aprobadas', value: metrics.aprobadas, color: 'success' },
            { label: 'Rechazadas', value: metrics.rechazadas, color: 'error' },
          ].map((metric, index) => (
            <Grid size={{xs:12,sm:6,md:3}} key={index}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'white', //'var(--color-bg-secondary)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <Typography variant="subtitle1" color="primary">{metric.label}</Typography>
                <Typography variant="h3" color={`${metric.color}.main`} fontWeight="bold">
                  {metric.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{xs:12,md:8}}>
            <Paper sx={{ 
              p: 2, 
              height: 350, 
              borderRadius: 3,
              boxShadow: 3
            }}>
              <Typography variant="h6" mb={2} color="primary">Distribución de Estados</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      boxShadow: theme.shadows[3]
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid size={{xs:12,md:4}}>
            <Paper sx={{ 
              p: 2, 
              height: 350, 
              borderRadius: 3,
              boxShadow: 3
            }}>
              <Typography variant="h6" mb={3} color="primary">Progreso de Aprobaciones</Typography>
              {chartData.map((item, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1 
                  }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {((item.value / metrics.total) * 100 || 0).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(item.value / metrics.total) * 100} 
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: item.color
                      }
                    }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Paper sx={{ 
          p: 2, 
          borderRadius: 3, 
          mb: 4,
          boxShadow: 3
        }}>
          <Grid container spacing={3}>
            <Grid size={{xs:12,sm:6,md:3}}>
              <TextField
                fullWidth
                label="Buscar cliente"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Estado"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="aprobado">Aprobado</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <DatePicker
                label="Fecha inicial"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: { 
                    fullWidth: true,
                    helperText: 'Seleccione fecha inicial' 
                  }
                }}
              />
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <DatePicker
                label="Fecha final"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: { 
                    fullWidth: true,
                    helperText: 'Seleccione fecha final' 
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Sección de cotizaciones próximas */}
        <Paper sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 3,
          boxShadow: 3
        }}>
          <Typography variant="h6" mb={2} color="primary">Próximas Cotizaciones (15 días)</Typography>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Responsable</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotesNext15Days.map((quote) => (
                  <TableRow 
                    key={quote.id} 
                    hover
                    component={motion.tr}
                    whileHover={{ scale: 0.99 }}
                  >
                    <TableCell>{quote.cliente}</TableCell>
                    <TableCell>
                      {format(new Date(quote.fecha), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: stringToColor(quote.responsable)
                          }}
                        >
                          {quote.responsable.charAt(0)}
                        </Avatar>
                        {quote.responsable}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={quote.estado.charAt(0).toUpperCase() + quote.estado.slice(1)} 
                        color={getStatusColor(quote.estado)} 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Tabla principal */}
        <Paper sx={{ 
          p: 2, 
          borderRadius: 3,
          boxShadow: 3
        }}>
          <Typography variant="h6" mb={2} color="primary">Listado de Cotizaciones</Typography>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Responsable</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow 
                    key={quote.id} 
                    hover
                    component={motion.tr}
                    whileHover={{ scale: 0.99 }}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{quote.cliente}</TableCell>
                    <TableCell>
                      {format(new Date(quote.fecha), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: stringToColor(quote.responsable)
                          }}
                        >
                          {quote.responsable.charAt(0)}
                        </Avatar>
                        {quote.responsable}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      ${quote.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={quote.estado.charAt(0).toUpperCase() + quote.estado.slice(1)} 
                        color={getStatusColor(quote.estado)} 
                        sx={{ 
                          fontWeight: 'bold', 
                          minWidth: 100,
                          fontSize: '0.875rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                      <IconButton color="success">
                        <PictureAsPdf />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Actualizaciones pendientes */}
        <Paper sx={{ 
          p: 2, 
          mt: 4, 
          borderRadius: 3,
          boxShadow: 3
        }}>
          <Typography variant="h6" mb={2} color="primary">Actualizaciones Pendientes</Typography>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Última actualización</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Días sin actualizar</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Responsable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outdatedQuotes.map((quote) => {
                  const lastUpdate = new Date(quote.actualizado);
                  const today = new Date();
                  const diffDays = Math.ceil(
                    Math.abs(today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24) )
                    return (
                      <TableRow 
                        key={quote.id}
                        hover
                        component={motion.tr}
                        whileHover={{ scale: 0.99 }}
                      >
                        <TableCell>{quote.cliente}</TableCell>
                        <TableCell>
                          {format(new Date(quote.actualizado), 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell sx={{ 
                          color: diffDays > 14 ? 'error.main' : 'warning.main',
                          fontWeight: 'bold'
                        }}>
                          {diffDays} días
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                bgcolor: stringToColor(quote.responsable)
                              }}
                            >
                              {quote.responsable.charAt(0)}
                            </Avatar>
                            {quote.responsable}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {outdatedQuotes.length === 0 && (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                color: 'text.secondary'
              }}>
                <Typography variant="body1">
                  ¡Todo actualizado! No hay registros pendientes
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </LocalizationProvider>
    );
  };
  
  export default DashboardCotizaciones;