"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Container,
  FormControl,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleLogin = () => {
    // Simular inicio de sesión exitoso
    Cookies.set('authToken', 'token_valido', { expires: 1 }); // Expira en 1 día
    setIsLoggedIn(true);
  };


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

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      Cookies.set('authToken', 'token_valido', { expires: 1 }); // Expira en 1 día

      // Aquí iría tu lógica real de autenticación
      console.log('Credenciales:', { email, password });
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta nuevamente.');
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
        <Typography color='black' variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <FormControl fullWidth>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            error={!!error && !isValidEmail(email)}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/forgot-password" variant="body2">
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>

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
            onClick={handleLogin}
            href="/dashboard"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Ingresar'
            )}

          </Button>
        </motion.div>

        <Typography color="black" variant="body2" align="center" sx={{ mt: 2 }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" fontWeight="bold">
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;