"use client";

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Container,
  Alert
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import NextLink from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isValidEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    try {
      setLoading(true);
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Error al enviar el email. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <NextLink href="/login" passHref legacyBehavior>
          <Link sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center' }}>
            <ArrowBack sx={{ mr: 1 }} />
            Volver al Login
          </Link>
        </NextLink>

        <Typography color="black" variant="h4" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Alert severity="success" sx={{ width: '100%' }}>
            ¡Email enviado! Revisa tu bandeja de entrada para continuar
          </Alert>
        ) : (
          <>
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Email sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
              error={!!error}
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%' }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Enviar Instrucciones'
                )}
              </Button>
            </motion.div>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;