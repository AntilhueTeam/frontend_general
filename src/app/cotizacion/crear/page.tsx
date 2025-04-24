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
};



export default function SolicitudCotizacion() {
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
        acuerdos: [
            'IVA: Precios netos, más IVA.',
            'Validez: 30 días.',
            'No garantiza caudal de agua ni profundidad de napa.',
            'No incluye obras de drenaje.',
            'Sin devolución de anticipo si hay problemas de terreno.',
            'Saldo al término de la obra.'
        ],
        anticipo: 0,
        banco: 'Banco de Chile',
        cuenta: '1234567890',
        rut_banco: '12345678-9',
        nombre_firma: '',
        rut_firma: '',
        fecha_firma: null,
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
        localStorage.setItem('cotizacionData', JSON.stringify(formData));
        console.log('Datos guardados:', formData);
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

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                <Box sx={{ flex: 1, bgcolor: '#f5f5f5', py: 8 }}>
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
                                                        primary={`• ${item}`}
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