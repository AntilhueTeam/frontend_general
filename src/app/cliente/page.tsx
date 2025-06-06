'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clienteService from '../../services/cliente.service'; // ajusta la ruta si es necesario
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Typography, Button, Container
} from '@mui/material';

interface Cliente {
  id: number;
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
}

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const router = useRouter();

  useEffect(() => {
  const fetchClientes = async () => {
    try {
      const response = await clienteService.getAll();
      const adaptados = response.data.map((c: any) => ({
        id: c.ID,
        nombre: c.nombre_cliente,
        direccion: c.direccion_cliente,
        telefono: c.Telefono,
      }));
      setClientes(adaptados);
      console.log("CLIENTES OBTENIDOS", adaptados);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  fetchClientes();
}, []);

  const verDetalle = (id: number) => {
    router.push(`/cliente/${id}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Lista de Clientes
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => verDetalle(cliente.id)}
                  >
                    Ver Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
