"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';  // Importamos el hook de contexto
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import ContainerWrapper from '@/components/ContainerWrapper';
import { MenuPopper, NavMenu, NavMenuDrawer, NavPrimaryButton } from '@/components/navbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export default function NavbarContent10({ navItems, primaryBtn, navItemsUnlocked }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { isAuthenticated, loading, checkAuth } = useAuth();  // Usamos el contexto
  const [authChecked, setAuthChecked] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  useEffect(() => {
    if (loading && !authChecked) {
      checkAuth().finally(() => {
        setAuthChecked(true);
      });
    }
  }, [loading, checkAuth, authChecked]);

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '75%',
        px: { xs: 2, md: 3 },
        position: 'fixed',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        bgcolor: '#EDE8F5',
        boxShadow: 10,
        borderRadius: 4,
        p: 1,
      }}
    >
      {!downMD && navItems && isAuthenticated && (
        <Box sx={{ bgcolor: 'grey.200', borderRadius: 10 }}>
          <NavMenu {...{ navItems }} sx={{ color: 'black' }} />
        </Box>
      )}

      {!downSM && !isAuthenticated && navItemsUnlocked && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Box sx={{ flexGrow: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <NavMenu navItems={navItemsUnlocked} sx={{ color: 'black' }} />
          </Box>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <NavPrimaryButton {...primaryBtn} />
          </Stack>
        </Stack>
      )}

      {downMD && (
        <Box sx={{ flexGrow: 1 }}>
          <MenuPopper
            open={menuOpen}
            offset={downSM ? 12 : 16}
            toggleProps={{
              children: (
                <IconButton color="inherit" sx={{ minWidth: 40, width: 40, height: 40, p: 0 }} onClick={toggleMenu}>
                  <MenuIcon />
                </IconButton>
              ),
              color: 'inherit',
              sx: { minWidth: 40, width: 40, height: 40, p: 0 }
            }}
          >
            <ContainerWrapper>
              {navItems && (
                <Box sx={{ mx: -2 }}>
                  <NavMenuDrawer {...{ navItems }} sx={{ color: 'black' }} />
                </Box>
              )}
              {downSM && (
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'center',
                    gap: 1,
                    px: 5,
                    py: 2.5,
                    mx: -5,
                    bgcolor: 'grey.100',
                  }}
                >
                  {!isAuthenticated && (
                    <ButtonAnimationWrapper>
                      <NavPrimaryButton {...primaryBtn} />
                    </ButtonAnimationWrapper>
                  )}
                </Stack>
              )}
            </ContainerWrapper>
          </MenuPopper>
        </Box>
      )}
    </Stack>
  );
}

NavbarContent10.propTypes = {
  navItems: PropTypes.any,
  primaryBtn: PropTypes.any,
  navItemsUnlocked: PropTypes.any
};
