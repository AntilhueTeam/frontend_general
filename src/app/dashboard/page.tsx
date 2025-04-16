"use client";

import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import { Search, Add, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid'; // Import Unstable_Grid2
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {es} from "date-fns/locale"



// Datos de ejemplo
const mockQuotes = [
  { id: 1, cliente: 'Empresa A', fecha: '2024-03-15', total: 2500, estado: 'pendiente' },
  { id: 2, cliente: 'Empresa B', fecha: '2024-03-14', total: 4200, estado: 'aprobado' },
  { id: 3, cliente: 'Empresa C', fecha: '2024-03-13', total: 1800, estado: 'rechazado' },
];

const DashboardCotizaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [quotes] = useState(mockQuotes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazado': return 'error';
      default: return 'default';
    }
  };

  const handleCrearCotizacion = () => {

      // Redirigir a la página principal ("/")
      window.location.href = '/cotizacion/crear';
    };

  const filteredQuotes = quotes.filter(quote => {
    const matchesClient = quote.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || quote.estado === selectedStatus;

    const quoteDate = new Date(quote.fecha);
    const matchesDate = (!startDate || quoteDate >= startDate) &&
      (!endDate || quoteDate <= endDate);

    return matchesClient && matchesStatus && matchesDate;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}> 
    {/*adapterLocale={es} */}
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Gestión de Cotizaciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            onClick={handleCrearCotizacion}
          >
            Nueva Cotización
          </Button>
        </Box>


        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Total Cotizaciones</Typography>
              <Typography variant="h4" color="primary">24</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Pendientes</Typography>
              <Typography variant="h4" color="warning.main">5</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Aprobadas</Typography>
              <Typography variant="h4" color="success.main">15</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Rechazadas</Typography>
              <Typography variant="h4" color="error.main">4</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Filtros */}



        {/* Tabla de cotizaciones */}
        <Paper sx={{ p: 2, borderRadius: 2 }}>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Buscar cliente"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  label="Fecha inicial"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  label="Fecha final"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>


          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    hover
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <TableCell>{quote.id}</TableCell>
                    <TableCell>{quote.cliente}</TableCell>
                    <TableCell>{quote.fecha}</TableCell>
                    <TableCell align="right">${quote.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={quote.estado}
                        color={getStatusColor(quote.estado)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>


                      <IconButton color="primary">
                        <Edit />
                      </IconButton>




                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                      <IconButton color="secondary">
                        <PictureAsPdf />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pie de página */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="white">
            Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider >
  );
};

export default DashboardCotizaciones;