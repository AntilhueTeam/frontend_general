"use client";

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import {
  Notifications,
  AddBusiness,
  History,
  Map,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import Link from 'next/link';

const Navbar = () => {
  // Estado inicial basado en si estamos en el cliente y si existe la cookie
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Este efecto solo se ejecuta en el cliente
      const authToken = Cookies.get('authToken');
      setIsLoggedIn(!!authToken);
  }, []);

  const handleLogout = () => {
    // Cerrar sesión
    Cookies.remove('authToken');
    setIsLoggedIn(false);
    handleCloseMenu();

    // Redirigir a la página principal ("/")
    window.location.href = '/';
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenQuotesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElQuotes(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElUser(null);
    setAnchorElQuotes(null);
  };



  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElQuotes, setAnchorElQuotes] = useState<null | HTMLElement>(null);
  const [notifications] = useState(3);

  return (
    <AppBar position="static" sx={{ bgcolor: 'var(--color-bg-primary)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/dashboard" passHref legacyBehavior>
          <Box
            component="a"
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <Box
              component="video"
              src="/assets/images/logo_antilhue.mp4" // Asegúrate de que el archivo esté en /public o la ruta correcta
              autoPlay
              loop
              muted
              sx={{
                p: 1,
                height: 100,
                width: 'auto',
              }}
            />
          </Box>
        </Link>

        {/* Menú según autenticación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <>
              {/* Menú para usuarios autenticados */}
              <Button
                variant="text"
                color="inherit"
                startIcon={<AddBusiness />}
                onClick={handleOpenQuotesMenu}
                sx={{ textTransform: 'none' }}
              >
                Cotizaciones
              </Button>
              <Menu
                anchorEl={anchorElQuotes}
                open={Boolean(anchorElQuotes)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleCloseMenu} component={Link} href="/dashboard">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddBusiness fontSize="small" /> Ver Cotizaciones
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} component={Link} href="/cotizacion/crear">
                  <Box
                    
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <AddBusiness fontSize="small" /> Crear Nueva
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseMenu}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History fontSize="small" /> Historial
                  </Box>
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} component={Link} href="/mapa">
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Map fontSize="small" /> Mapa
                  </Box>
                </MenuItem>
              </Menu>

              <IconButton color="inherit">
                <Badge badgeContent={notifications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar sx={{ width: 40, height: 40 }} />
                </motion.div>
              </IconButton>

              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseMenu}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <MenuItem onClick={handleCloseMenu} component={Link} href="/perfil">
                  <Typography variant="body2">Ver Perfil</Typography>
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} component={Link} href="/perfil/modificar">

                  <Typography variant="body2">Modificar Perfil</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Typography variant="body2" color="error">
                    Cerrar Sesión
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            /* Menú para invitados */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                href="/login"
                sx={{ textTransform: 'none' }}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
                component={Link}
                href="/register"
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;