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
import { useRouter } from 'next/navigation';

const MENU_WIDTH = 200;

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quotesMenuPos, setQuotesMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [userMenuPos, setUserMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [notifications] = useState(3);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

  const handleLogout = () => {
    Cookies.remove('authToken');
    setIsLoggedIn(false);
    closeUserMenu();
    router.push('/');
  };

  // abre menú de cotizaciones (igual podrías anclarlo con anchorReference si lo necesitas)
  const openQuotesMenu = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setQuotesMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left, // déjalo abierto hacia la derecha (o ajusta rect.right - MENU_WIDTH si quieres misma lógica)
    });
  };
  const closeQuotesMenu = () => setQuotesMenuPos(null);

  // abre menú de usuario, siempre alineado a la derecha y no desbordar
  const openUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setUserMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.right - MENU_WIDTH, // alineo el borde derecho del menú al borde derecho del avatar
    });
  };
  const closeUserMenu = () => setUserMenuPos(null);

  const navigate = (path: string) => {
    closeUserMenu();
    closeQuotesMenu();
    router.push(path);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'var(--color-bg-primary)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/dashboard" passHref legacyBehavior>
          <Box component="a" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
            <Box
              component="video"
              src="/assets/images/logo_antilhue.mp4"
              autoPlay
              loop
              muted
              sx={{ p: 1, height: 100, width: 'auto' }}
            />
          </Box>
        </Link>

        {/* Zona de botones */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <>
              {/* Botón Cotizaciones */}
              <Button
                variant="text"
                color="inherit"
                startIcon={<AddBusiness />}
                onClick={openQuotesMenu}
                sx={{ textTransform: 'none' }}
              >
                Cotizaciones
              </Button>
              <Menu
                open={Boolean(quotesMenuPos)}
                onClose={closeQuotesMenu}
                anchorReference="anchorPosition"
                anchorPosition={quotesMenuPos || undefined}
                PaperProps={{
                  sx: {
                    mt: 1,
                    width: MENU_WIDTH,
                    maxWidth: MENU_WIDTH,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    overflowX: 'hidden',
                  },
                }}
              >
                <MenuItem onClick={() => navigate('/dashboard')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddBusiness fontSize="small" /> Ver Cotizaciones
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => navigate('/cotizacion/crear')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddBusiness fontSize="small" /> Crear Nueva
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={closeQuotesMenu}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History fontSize="small" /> Historial
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => navigate('/mapa')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Map fontSize="small" /> Mapa
                  </Box>
                </MenuItem>
              </Menu>

              {/* Notificaciones */}
              <IconButton color="inherit">
                <Badge badgeContent={notifications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* Avatar / menú usuario */}
              <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar sx={{ width: 40, height: 40 }} />
                </motion.div>
              </IconButton>
              <Menu
                open={Boolean(userMenuPos)}
                onClose={closeUserMenu}
                anchorReference="anchorPosition"
                anchorPosition={userMenuPos || undefined}
                PaperProps={{
                  sx: {
                    mt: 1,
                    width: MENU_WIDTH,
                    maxWidth: MENU_WIDTH,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    overflowX: 'hidden',
                  },
                }}
              >
                <MenuItem onClick={() => navigate('/perfil')}>
                  <Typography variant="body2">Ver Perfil</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/perfil/modificar')}>
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
            /* Invitado */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="inherit" href="/login" sx={{ textTransform: 'none' }}>
                Iniciar Sesión
              </Button>
              <Button variant="contained" color="primary" component={Link} href="/register" sx={{ textTransform: 'none' }}>
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
