'use client';

import { Box, Typography, Button, Grid, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePresentation() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #0a1929 0%, var(--color-bg-secondary) 100%)',
        color: '#fff',
        minHeight: '100vh',
        px: { xs: 2, md: 4 },
        py: 8,
        overflow: 'hidden',
      }}
    >
      {/* Encabezado */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00b4d8 30%, #0077cc 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
            }}
          >
            Soluciones en Pozos Profundos
          </Typography>
          <Typography
            variant="h5"
            maxWidth="600px"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              color: theme.palette.grey[300],
              mb: 4,
            }}
          >
            Tecnología de punta para perforación de suelos en diámetros desde 4″ hasta 10″
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: '#0077cc',
              fontSize: '1.1rem',
              padding: '12px 32px',
              '&:hover': {
                bgcolor: '#00b4d8',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            href="/galeria"
          >
            Ver Galería
          </Button>
        </motion.div>

        {/* Servicios */}
        <Grid container spacing={4} sx={{ mt: 8 }}>
          {[
            {
              title: 'Perforación de Pozos Profundos',
              desc: 'Desde 4” a 10” de diámetro',
              img: '/assets/images/perforacion.jpg',
            },
            {
              title: 'Instalación de Bombas Sumergibles',
              desc: 'Monofásica y Trifásica',
              img: '/assets/images/bombeo.jpeg',
            },
            {
              title: 'Pruebas de Bombeo y Mantención',
              desc: 'Según requerimiento DGA',
              img: '/images/pruebas.jpeg',
            },
          ].map((service, idx) => (
            <Grid size={{xs:12, md:4}} key={idx}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -10 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 180, 216, 0.1)',
                      borderColor: '#00b4d8',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', width: 200, height: 200, mx: 'auto' }}>
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#00b4d8' }}
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.grey[300] }}>
                    {service.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Cita inspiradora */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Box sx={{ mt: 12, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 300,
                fontStyle: 'italic',
                position: 'relative',
                '&:before, &:after': {
                  content: '"\\201C"',
                  fontSize: '4rem',
                  position: 'absolute',
                  color: '#00b4d850',
                },
                '&:before': { left: '-50px', top: '-20px' },
                '&:after': { right: '-50px', bottom: '-20px' },
              }}
            >
              Cada gota de agua es vida que florece
            </Typography>
            <Button
              variant="outlined"
              color="info"
              href="#contacto"
              size="large"
              sx={{
                mt: 4,
                borderWidth: '2px',
                '&:hover': { borderWidth: '2px', bgcolor: '#00b4d810' },
              }}
            >
              Contáctanos
            </Button>
          </Box>
        </motion.div>

        {/* Contadores */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 8 }}>
          {[
            { number: '5+', label: 'Años en el mercado' },
            { number: '200+', label: 'Proyectos realizados' },
          ].map((item, idx) => (
            <Grid  key={idx}>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, type: 'spring' }}
              >
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(0, 180, 216, 0.1)',
                    borderRadius: '16px',
                    minWidth: '200px',
                    textAlign: 'center',
                    border: '1px solid #00b4d8',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{ fontWeight: 700, color: '#00b4d8', mb: 1 }}
                  >
                    {item.number}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.grey[300] }}>
                    {item.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}