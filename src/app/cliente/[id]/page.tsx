'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import clienteService from '../../../services/cliente.service'; // Ajusta si usas otra ruta
import { Box, Typography, Paper, CircularProgress, Container } from '@mui/material';

interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo?: string;
}

export default function ClienteDetalle() {
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCliente = async () => {
    try {
      const response = await clienteService.getById(id as string);
      const c = response.data;

      // Adaptar los campos del backend a los del frontend
      const adaptado: Cliente = {
        id: c.ID,
        nombre: c.nombre_cliente,
        direccion: c.direccion_cliente,
        telefono: c.Telefono,
        correo: c.Correo, // opcional, si viene
      };

      setCliente(adaptado);
      console.log("Cliente adaptado", adaptado);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchCliente();
  }
}, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cliente) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Cliente no encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Detalle del Cliente
        </Typography>
        <Typography variant="body1"><strong>ID:</strong> {cliente.id}</Typography>
        <Typography variant="body1"><strong>Nombre:</strong> {cliente.nombre}</Typography>
        <Typography variant="body1"><strong>Dirección:</strong> {cliente.direccion}</Typography>
        <Typography variant="body1"><strong>Teléfono:</strong> {cliente.telefono}</Typography>
        {cliente.correo && (
          <Typography variant="body1"><strong>Correo:</strong> {cliente.correo}</Typography>
        )}
      </Paper>
    </Container>
  );
}
