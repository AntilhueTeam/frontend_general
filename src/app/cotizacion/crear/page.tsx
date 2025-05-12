"use client"
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

type FormData = {
  [key: string]: any;
  nombre_cliente: string;
  direccion_especifica_cliente: string;
  comuna_cliente: string;
  nombre_empresa: string;
  direccion_empresa: string;
  region_empresa: string;
  pais_empresa: string;
  fecha_firma: Date | null;
  numero_telefono_empresa: string,
  n_referencia: number,
  id_proyecto: string,
  asunto_cliente: string,
  descripcion_proyecto: string,
  id_documento: number,
  carta_oferta: string,
  oferta_economica: string,
  requiere_respuesta: boolean,
  aportes_cliente: string[],
  aportes_antilhue: string[],
  acuerdos: string[],
  anticipo: number,
  banco: string,
  cuenta: string,
  rut_banco: string,
  nombre_firma: string,
  rut_firma: string,
  imagenes: string[] // base64 strings
};

export default function SolicitudCotizacion() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [formData, setFormData] = useState<FormData>({

    nombre_cliente: '',
    direccion_especifica_cliente: '',
    comuna_cliente: '',
    nombre_empresa: '',
    direccion_empresa: '',
    region_empresa: '',
    pais_empresa: '',
    numero_telefono_empresa: '',
    n_referencia: 0,
    id_proyecto: '',
    asunto_cliente: '',
    descripcion_proyecto: '',
    id_documento: 0,
    carta_oferta: '',
    oferta_economica: '',
    requiere_respuesta: false,
    aportes_cliente: ['', '', ''],
    aportes_antilhue: ['', '', ''],
    acuerdo1: 'El presupuesto considera la perforación de un pozo Ø <variante_metro>, hasta alcanzar la profundidad de <n_profundidad> metros',
    anticipo: 0,
    acuerdos: [
      'Los servicios que prestará Antilhue SpA son netos, se debe agregar IVA.',
      'Todos los precios están presupuestados en pesos chilenos.',
      'Presupuesto valido por 30 días.',
      'Antilhue no cuenta con un estudio de suelos, proporcionado por el Mandante...',
      'La presente cotización no contempla Obras de Drenaje...',
      'Este Presupuesto debe ser aceptado mediante una Orden de Compra...',
      'Metros de perforación adicionales, serán realizados sólo con la aprobación del mandante...',
      'Antilhue No garantiza el caudal de agua ni la profundidad de la napa.',
      'El cliente debe definir la ubicación del pozo.'
    ],
    banco: 'Banco de Chile',
    cuenta: '1234567890',
    rut_banco: '12345678-9',
    nombre_firma: '',
    rut_firma: '',
    fecha_firma: null,
    imagenes: []
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    // Verificar si el target es un HTMLInputElement para acceder a 'checked'
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (index: number, key: string, value: string) => {
    setFormData((prevData) => {
      const newArray = [...prevData[key]];
      newArray[index] = value;
      return { ...prevData, [key]: newArray };
    });
  };

  const handleSubmit = () => {
    const updatedFormData = { ...formData };

    // Forzar incluir las imágenes cargadas (por si no están en el estado sincronizado)
    const imagenesBase64 = selectedImages.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagenesBase64).then((imagenes) => {
      updatedFormData.imagenes = imagenes;
      localStorage.setItem("cotizacionData", JSON.stringify(updatedFormData));
      router.push("/cotizacion/crear/pdf");
    });
  };
  localStorage.setItem("cotizacionData", JSON.stringify(formData));
  router.push("/cotizacion/crear/pdf");
};

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRemoveAporteC = (index: number) => {
    if (formData.aportes_cliente.length <= 1) {
      alert("Debe haber al menos un aporte.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      aportes_cliente: prevData.aportes_cliente.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAporteA = (index: number) => {
    if (formData.aportes_antilhue.length <= 1) {
      alert("Debe haber al menos un aporte.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      aportes_antilhue: prevData.aportes_antilhue.filter((_, i) => i !== index),
    }));
  };

  const handleAddAporteA = () => {
    setFormData((prevData) => ({
      ...prevData,
      aportes_antilhue: [...prevData.aportes_antilhue, ""], // Agrega un string vacío como nuevo aporte
    }));
  };

  const handleAddAporteC = () => {
    setFormData((prevData) => ({
      ...prevData,
      aportes_cliente: [...prevData.aportes_cliente, ""], // Agrega un string vacío como nuevo aporte
    }));
  };

  const renderTextWithInput = (text: string) => {
    return text.split('<').map((part, index) => {
      if (part.includes('>')) {
        const variable = part.split('>')[0];
        return (
          <span key={index}>
            <TextField
              value={formData[variable] || ''}
              name={variable}
              onChange={handleChange}
              size="small"
              sx={{
                backgroundColor: '#f1f8e9',
                marginLeft: 1,
                width: 'auto',
                fontWeight: 'bold',
              }}
            />
            {part.split('>')[1]}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>




        <Box sx={{ flex: 1, bgcolor: 'var(--color-bg-primary)', py: 8 }}>
          <Container maxWidth="lg">
            <Paper sx={{ p: 4, mb: 6, borderRadius: 4, boxShadow: 3 }}>
              <Box textAlign="center" mb={6}>
                <Typography variant="h3" sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#1a237e',
                  fontFamily: 'Roboto Condensed'
                }}>
                  Solicitud de Cotización
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Complete todos los campos requeridos (*) para generar su cotización
                </Typography>
              </Box>

              {/* ID Proyecto y N° Referencia */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                  fullWidth
                  label="Título de Cotización *"
                  name="id_proyecto"
                  value={formData.id_proyecto}
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  label="N° Referencia"
                  name="n_referencia"
                  type="number"
                  value={formData.n_referencia}
                  onChange={handleChange}
                  size="small"
                  sx={{ width: 140 }}
                />
              </Box>

              <Grid container spacing={6}>


                {/* Sección Datos del Cliente */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }} elevation={0}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      mb: 3,
                      color: '#1a237e'
                    }}>
                      📋 Datos del Cliente
                    </Typography>
                    <TextField
                      fullWidth
                      label="Nombre/RUT del cliente *"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 3 }}
                      name="nombre_cliente" value={formData.nombre_cliente} onChange={handleChange} margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Dirección específica *"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 3 }}
                      name="direccion_especifica_cliente" value={formData.direccion_especifica_cliente} onChange={handleChange} margin="normal"

                    />
                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                      <InputLabel>Comuna *</InputLabel>
                      <Select name="comuna_cliente" value={formData.comuna_cliente} onChange={handleSelectChange}>
                        <MenuItem value="">Seleccione una comuna</MenuItem>
                        <MenuItem value="comuna1">Comuna 1</MenuItem>
                        <MenuItem value="comuna2">Comuna 2</MenuItem>
                        <MenuItem value="comuna3">Comuna 3</MenuItem>
                        <MenuItem value="comuna4">Comuna 4</MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>

                {/* Sección Detalles del Proyecto */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }} elevation={0}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      mb: 3,
                      color: '#1a237e'
                    }}>
                      🚀 Detalles del Proyecto
                    </Typography>
                    <TextField
                      fullWidth
                      label="ID Proyecto *"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 3 }}
                      name="id_proyecto" value={formData.id_proyecto} onChange={handleChange} margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Asunto *"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 3 }}
                      name="asunto_cliente" value={formData.asunto_cliente} onChange={handleChange} margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Descripción del Proyecto"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={4}
                      name="descripcion_proyecto" value={formData.descripcion_proyecto} onChange={handleChange} margin="normal"
                    />
                  </Paper>
                </Grid>

                {/* Sección Aportes */}
                <Grid size={{ xs: 12 }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#e8f4f8' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          💼 Aportes del Cliente
                        </Typography>
                        {formData.aportes_cliente.map((aporte, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                              fullWidth
                              label={`Aporte Cliente ${i + 1}`}
                              variant="outlined"
                              size="small"
                              value={aporte}
                              onChange={(e) => handleArrayChange(i, 'aportes_cliente', e.target.value)}
                              margin="normal"
                              sx={{ flexGrow: 1 }}
                            />
                            {/* Botón para eliminar el aporte */}
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveAporteC(i)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                        {/* Botón para añadir un nuevo aporte */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddAporteC}
                          sx={{ mt: 2 }}
                        >
                          + Añadir Aporte
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#e8f4f8' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          🏗️ Aportes de Antilhue
                        </Typography>
                        {formData.aportes_antilhue.map((aporte, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                              key={i}
                              fullWidth
                              label={`Aporte Antilhue ${i + 1}`}
                              variant="outlined"
                              size="small"
                              sx={{ flexGrow: 1 }}
                              value={aporte}
                              onChange={(e) => handleArrayChange(i, 'aportes_antilhue', e.target.value)}
                              margin="normal"
                            />
                            {/* Botón para eliminar el aporte */}
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveAporteA(i)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>

                          </Box>
                        ))}

                        {/* Botón para añadir un nuevo aporte */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddAporteA}
                          sx={{ mt: 2 }}
                        >
                          + Añadir Aporte
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>



                {/* Sección Acuerdos */}
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 4, borderRadius: 3, bgcolor: '#fffde7' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                      📝 Acuerdos y Condiciones
                    </Typography>
                    <List dense sx={{ mb: 3 }}>
                      {formData.acuerdos.map((item, i) => (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemText
                            primary={`• ${renderTextWithInput(item)}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <TextField
                      fullWidth
                      label="Anticipo (%)"
                      variant="outlined"
                      size="small"
                      sx={{ maxWidth: 200 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      name="anticipo"
                      value={formData.anticipo}
                      onChange={handleChange}
                      type="number"
                      margin="normal"
                    />
                  </Paper>
                </Grid>

                {/* Sección Imágenes del Proyecto */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', mt: 3 }} elevation={0}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: '#1a237e'
                    }}>
                      📷 Imágenes de Referencia
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 2, color: '#8e8d8c' }}>
                      Selecciona hasta 10 imágenes referenciales del proyecto
                    </Typography>

                    <Button
                      variant="outlined"
                      component="label"
                      disabled={selectedImages.length >= 10}
                    >
                      Subir Imágenes
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            const nuevosArchivos = Array.from(files);
                            if (selectedImages.length + nuevosArchivos.length > 10) {
                              alert("Solo puedes subir hasta 10 imágenes.");
                              return;
                            }

                            // Convertir imágenes a base64 y guardar
                            Promise.all(
                              nuevosArchivos.map(file => {
                                return new Promise<string>((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result as string);
                                  reader.onerror = reject;
                                  reader.readAsDataURL(file);
                                });
                              })
                            ).then((base64s) => {
                              setFormData((prevData) => ({
                                ...prevData,
                                imagenes: [...(prevData.imagenes || []), ...base64s],
                              }));
                            });

                            setSelectedImages(prev => [...prev, ...nuevosArchivos]);
                          }
                        }}
                      />
                    </Button>

                    {selectedImages.length >= 10 && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        Has alcanzado el máximo de 10 imágenes.
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                        gap: 1.5,
                        maxHeight: 400,
                        overflowY: 'auto',
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: '#f0f2f5',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)'
                      }}
                    >
                      {Array.from({ length: 23 }, (_, i) => `img_${i + 1}.jpeg`).map((fileName) => {
                        const imgPath = `/assets/images/ref_images/${fileName}`;
                        const isSelected = formData.imagenes.includes(imgPath);

                        let hoverTimeout: ReturnType<typeof setTimeout>;

                        const toggleImage = () => {
                          setFormData(prev => {
                            const updated = isSelected
                              ? prev.imagenes.filter(img => img !== imgPath)
                              : prev.imagenes.length < 10
                                ? [...prev.imagenes, imgPath]
                                : prev.imagenes;

                            return { ...prev, imagenes: updated };
                          });
                        };

                        return (
                          <Box
                            key={fileName}
                            onClick={toggleImage}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              hoverTimeout = setTimeout(() => {
                                setHoveredImage(imgPath);
                                setPreviewPosition({ x: rect.right + 10, y: rect.top });
                              }, 500);
                            }}
                            onMouseLeave={() => {
                              clearTimeout(hoverTimeout);
                              setHoveredImage(null);
                            }}
                            sx={{
                              width: '100%',
                              aspectRatio: '1',
                              position: 'relative',
                              overflow: 'hidden',
                              borderRadius: 2,
                              border: isSelected ? '2px solid #1a237e' : '1px solid #ddd',
                              cursor: 'pointer',
                              boxShadow: isSelected ? 2 : 1,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                boxShadow: 3,
                                transform: 'scale(1.02)',
                              }
                            }}
                          >
                            <img
                              src={imgPath}
                              alt={fileName}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            {isSelected && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 6,
                                  left: 6,
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  backgroundColor: '#1a237e',
                                  color: 'white',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                ✓
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                      {hoveredImage && (
                        <Box
                          sx={{
                            position: 'fixed',
                            top: previewPosition.y,
                            left: previewPosition.x,
                            zIndex: 1300,
                            border: '3px solid #1a237e',
                            borderRadius: 3,
                            backgroundColor: 'white',
                            padding: 1,
                            boxShadow: 5,
                            width: 320,
                            height: 320,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src={hoveredImage}
                            alt="preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </Box>
                      )}
                    </Box>

                    {formData.imagenes.length >= 10 && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        Has alcanzado el máximo de 10 imágenes.
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Datos de la Empresa */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }} elevation={0}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                      🏢 Datos de la Empresa
                    </Typography>
                    <TextField
                      fullWidth
                      label="Nombre Empresa *"
                      size="small"
                      name="nombre_empresa"
                      value={formData.nombre_empresa}
                      onChange={handleChange}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Dirección Empresa *"
                      size="small"
                      name="direccion_empresa"
                      value={formData.direccion_empresa}
                      onChange={handleChange}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Región Empresa *"
                      size="small"
                      name="region_empresa"
                      value={formData.region_empresa}
                      onChange={handleChange}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="País Empresa *"
                      size="small"
                      name="pais_empresa"
                      value={formData.pais_empresa}
                      onChange={handleChange}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Teléfono Empresa *"
                      size="small"
                      name="numero_telefono_empresa"
                      value={formData.numero_telefono_empresa}
                      onChange={handleChange}
                    />
                  </Paper>
                </Grid>

                {/* Sección Firma */}
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 4, borderRadius: 3, bgcolor: '#f8f9fa' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                      ✍️ Anexo de Aceptación
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }} >
                        <DatePicker
                          label="Fecha de Firma *"

                          value={formData.fecha_firma}
                          onChange={(newValue) => {
                            setFormData({ ...formData, fecha_firma: newValue });
                          }}

                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              sx: { marginTop: 2, marginBottom: 1 } // Alineación vertical
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Nombre Completo *"
                          variant="outlined"
                          size="small"
                          name="nombre_firma"
                          value={formData.nombre_firma}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }} >
                        <TextField
                          fullWidth
                          label="RUT *"
                          variant="outlined"
                          size="small"
                          name="rut_firma"
                          value={formData.rut_firma}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, p: 3, bgcolor: '#e8eaf6', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Datos Bancarios
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Banco"
                            variant="filled"
                            size="small"
                            name="banco"
                            value={formData.banco}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Cuenta"
                            variant="filled"
                            size="small"
                            name="cuenta"
                            value={formData.cuenta}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} >
                          <TextField
                            fullWidth
                            label="RUT Banco"
                            variant="filled"
                            size="small"
                            name="rut_banco"
                            value={formData.rut_banco}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Requiere Respuesta */}
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }} elevation={0}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="requiere_respuesta"
                        checked={formData.requiere_respuesta}
                        onChange={handleChange}
                      />
                    }
                    label="Requiere Respuesta"
                  />
                </Paper>
              </Grid>


              <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#0d47a1' }
                  }}
                  onClick={handleSubmit}
                >
                  Enviar Solicitud
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>

        <Box sx={{ bgcolor: '#1a237e', color: 'white', py: 4, mt: 'auto' }}>
          <Container maxWidth="lg">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Pozos Antilhue
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              © {new Date().getFullYear()} Expertos en perforación de pozos de agua
            </Typography>
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}