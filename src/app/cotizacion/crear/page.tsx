"use client"
import React, { useEffect, useState } from 'react';
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
import EastIcon from '@mui/icons-material/East';

// Definición de la flecha y array inicial
interface Arrow {
    id: number;
    top: string;
    left: string;
    rotation: number;
    label: string;
    active: boolean;
    value: string;
}

const initialArrows: Arrow[] = [
    { id: 1, top: '77%', left: '48%', rotation: 180, label: 'Bomba 1 HP', active: false, value: '' },
    { id: 2, top: '72%', left: '49%', rotation: 180, label: '2', active: false, value: '' },
    { id: 3, top: '65%', left: '49%', rotation: 180, label: 'Cañería de acero ranurada', active: false, value: '' },
    { id: 4, top: '30%', left: '49%', rotation: 180, label: 'PVC 32 mm', active: false, value: '' },
    { id: 5, top: '21%', left: '53%', rotation: 180, label: 'Sello sanitario', active: false, value: '' },
    { id: 6, top: '19%', left: '52%', rotation: 180, label: 'Llave de paso', active: false, value: '' },
    { id: 7, top: '10%', left: '47%', rotation: 190, label: 'Llave de paso', active: false, value: '' },
];

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
    numero_revision: string;
    titulo_imagenes: string;
    descripcion_imagenes: string;
    valor_metro: number;
    valor_servicio: number;
    valor_bomba: number;
    variante_metro: number;
    n_profundidad: number;
    detalle_bomba: string;


    columna_input_cero: string;
    columna_input_uno: string;
    columna_input_dos: string;
    columna_input_tres: string;
    columna_input_cuatro: string;
    columna_input_cinco: string;
    flechas: { id: number; label: string; value: string }[];

};

const acuerdosTemplate = [
    'Los servicios que prestará Antilhue SpA son netos, se debe agregar IVA.',
    'Todos los precios están presupuestados en pesos chilenos.',
    'El presupuesto considera la perforación de un pozo Ø <variante_metro>, hasta alcanzar la profundidad de <n_profundidad> metros',
    'Presupuesto valido por 30 días.',
    'Antilhue no cuenta con un estudio de suelos, proporcionado por el Mandante, donde se indique las características del terreno, por lo que la empresa no responde por la calidad del suelo que impida la ejecución de los trabajos.',
    'La presente cotización no contempla Obras de Drenaje, que puedan ser necesarias para contener posibles afloramientos de agua, por la boca del pozo.',
    'Este Presupuesto debe ser aceptado mediante una Orden de Compra o correo electrónico y firma del anexo N°1 Aceptación de la Oferta.',
    'Metros de perforación adicionales, serán realizados sólo con la aprobación del mandante y con las mismas tarifas estimadas en la presente tabla de costo',
    'Antilhue No garantiza el caudal de agua ni la profundidad de la napa.',
    'El cliente debe definir la ubicación del pozo, para comenzar con la perforación respectiva.'
];

export default function SolicitudCotizacion() {
    const router = useRouter();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [formData, setFormData] = useState<FormData>({

        nombre_cliente: '',
        numero_revision: 'A',
        valor_metro: 180000,
        valor_servicio: 0,
        valor_bomba: 0,
        variante_metro: 0,
        detalle_bomba: 'Bomba 1.0 HP, PVC 32 mm para impulsión desde 30 metros, controlador digital de presión y materiales Incluye instalación y garantía de la bomba por 1 año.',
        n_profundidad: 0,
        flechas: [],
        columna_input_cero: '',
        columna_input_uno: '',
        columna_input_dos: '',
        columna_input_tres: '',
        columna_input_cuatro: '',
        columna_input_cinco: '',
        titulo_imagenes: '',
        descripcion_imagenes: '',
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
            'Los servicios que prestará Antilhue SpA son netos, se debe agregar IVA.',
            'Todos los precios están presupuestados en pesos chilenos.',
            'El presupuesto considera la perforación de un pozo Ø <variante_metro>, hasta alcanzar la profundidad de <n_profundidad> metros',
            'Presupuesto valido por 30 días.',
            'Antilhue no cuenta con un estudio de suelos, proporcionado por el Mandante, donde se indique las características del terreno, por lo que la empresa no responde por la calidad del suelo que impida la ejecución de los trabajos.',
            'La presente cotización no contempla Obras de Drenaje, que puedan ser necesarias para contener posibles afloramientos de agua, por la boca del pozo.',
            'Este Presupuesto debe ser aceptado mediante una Orden de Compra o correo electrónico y firma del anexo N°1 Aceptación de la Oferta.',
            'Metros de perforación adicionales, serán realizados sólo con la aprobación del mandante y con las mismas tarifas estimadas en la presente tabla de costo',
            'Antilhue No garantiza el caudal de agua ni la profundidad de la napa.',
            'El cliente debe definir la ubicación del pozo, para comenzar con la perforación respectiva.'
        ],
        anticipo: 0,
        banco: 'Banco de Chile',
        cuenta: '1234567890',
        rut_banco: '12345678-9',
        nombre_firma: '',
        rut_firma: '',
        fecha_firma: null,
        imagenes: []
    });

    // — estado y lógica de flechas —
    const [arrows, setArrows] = useState<Arrow[]>(initialArrows);

    function toggleArrow(id: number) {
        setArrows(a =>
            a.map(item =>
                item.id === id ? { ...item, active: !item.active } : item
            )
        );
    }

    function updateArrowValue(id: number, text: string) {
        setArrows(a =>
            a.map(item =>
                item.id === id ? { ...item, value: text } : item
            )
        );
    }
    //fin flechas

    const MAX_TOTAL_CARACTERES = 3100;
    const MAX_CARACTERES_APORTE = 300;

    const totalCaracteresAportesCliente = formData.aportes_cliente.reduce((acc, item) => acc + item.length, 0);
    const totalCaracteresAportesAntilhue = formData.aportes_antilhue.reduce((acc, item) => acc + item.length, 0);

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
        const updatedData = {
            ...formData,
            flechas: arrows.map(a => ({
                id: a.id,
                value: a.value // solo guardamos lo necesario
            }))
        };
        localStorage.setItem("cotizacionData", JSON.stringify(updatedData));
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


    function generarAcuerdos(template: string[], variante_metro: number, n_profundidad: number): string[] {
        return template.map(linea =>
            linea
                .replace(/<variante_metro>/g, `${variante_metro}"`)
                .replace(/<n_profundidad>/g, n_profundidad.toString())
        );
    }

    useEffect(() => {
        const acuerdosActualizados = generarAcuerdos(acuerdosTemplate, formData.variante_metro, formData.n_profundidad);
        setFormData(prev => ({
            ...prev,
            acuerdos: acuerdosActualizados
        }));
    }, [formData.variante_metro, formData.n_profundidad]);

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
                                    type="text"
                                    value={formData.n_referencia}
                                    onChange={handleChange}
                                    size="small"
                                    sx={{ width: 230 }}
                                />
                                <FormControl size="small" sx={{ width: 100 }}>
                                    <InputLabel>Rev.</InputLabel>
                                    <Select
                                        name="numero_revision"
                                        value={formData.numero_revision}
                                        onChange={handleSelectChange}
                                        label="Rev."
                                    >
                                        <MenuItem value="A">A</MenuItem>
                                        <MenuItem value="B">B</MenuItem>
                                        <MenuItem value="C">C</MenuItem>
                                        <MenuItem value="D">D</MenuItem>
                                    </Select>
                                </FormControl>
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
                                            label="Nombre del cliente *"
                                            variant="outlined"
                                            size="small"
                                            sx={{ mb: 3 }}
                                            name="nombre_cliente" value={formData.nombre_cliente} onChange={handleChange} margin="normal"
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
                                            label="Dirección específica (Calle y Número)*"
                                            variant="outlined"
                                            size="small"
                                            sx={{ mb: 3 }}
                                            name="direccion_especifica_cliente" value={formData.direccion_especifica_cliente} onChange={handleChange} margin="normal"

                                        />
                                        <TextField
                                            fullWidth
                                            label="Comuna *"
                                            variant="outlined"
                                            size="small"
                                            name="comuna_cliente"
                                            value={formData.comuna_cliente}
                                            onChange={handleChange}
                                            sx={{ mb: 3 }}
                                            margin="normal"
                                        />
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
                                                            inputProps={{ maxLength: MAX_CARACTERES_APORTE }}
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
                                                            inputProps={{ maxLength: MAX_CARACTERES_APORTE }}
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






                                {/* Sección Imágenes del Proyecto */}
                                <Grid size={{ xs: 12 }}>
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
                                        <TextField
                                            fullWidth
                                            label="Título de sección de imágenes"
                                            variant="outlined"
                                            size="small"
                                            name="titulo_imagenes"
                                            value={formData.titulo_imagenes}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Descripción de las imágenes"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={2}
                                            name="descripcion_imagenes"
                                            value={formData.descripcion_imagenes}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />
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

                                <Grid container spacing={4}>

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
                                                label="Ciudad Empresa *"
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

                                    {/* Propuesta Económica */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fff3e0' }} elevation={0}>
                                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#e65100' }}>
                                                💰 Propuesta Económica
                                            </Typography>

                                            <TextField
                                                fullWidth
                                                label="Valor por Metro (CLP)"
                                                type="number"
                                                size="small"
                                                name="valor_metro"
                                                value={formData.valor_metro}
                                                onChange={handleChange}
                                                sx={{ mb: 2 }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Detalle de la Bomba"
                                                type="text"
                                                size="small"
                                                name="detalle_bomba"
                                                value={formData.detalle_bomba}
                                                onChange={handleChange}
                                                multiline
                                                rows={2}
                                                sx={{ mb: 2 }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Valor de la Bomba (CLP)"
                                                type="number"
                                                size="small"
                                                name="valor_bomba"
                                                value={formData.valor_bomba}
                                                onChange={handleChange}
                                                sx={{ mb: 2 }}
                                            />

                                            <TextField
                                                fullWidth
                                                label='Diámetro Ø del Pozo (")'
                                                type="number"
                                                size="small"
                                                name="variante_metro"
                                                value={formData.variante_metro}
                                                onChange={handleChange}
                                                sx={{ mb: 2 }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Profundidad Estimada del Pozo (m)"
                                                type="number"
                                                size="small"
                                                name="n_profundidad"
                                                value={formData.n_profundidad}
                                                onChange={handleChange}
                                            />
                                        </Paper>
                                    </Grid>

                                </Grid>

                                {/* Sección Acuerdos */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 4, borderRadius: 3, bgcolor: '#fffde7' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                            📝 Acuerdos y Condiciones
                                        </Typography>

                                        <Grid container spacing={1} sx={{ mb: 2 }}>
                                            {formData.acuerdos.map((item, i) => (
                                                <Grid size={{ xs: 12 }} key={i}>
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            p: 1,
                                                            borderRadius: 2,
                                                            backgroundColor: '#f1f8e9',
                                                            borderColor: '#c5e1a5',
                                                        }}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            minRows={2}
                                                            variant="standard"
                                                            value={item}
                                                            onChange={(e) => {
                                                                const nuevosAcuerdos = [...formData.acuerdos];
                                                                nuevosAcuerdos[i] = e.target.value;
                                                                setFormData({ ...formData, acuerdos: nuevosAcuerdos });
                                                            }}
                                                            InputProps={{
                                                                disableUnderline: true,
                                                                sx: { fontSize: 13, px: 1 },
                                                            }}
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>


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

                            {/* Imagen del Pozo con Flechas */}
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f0f0f0', mb: 4, position: 'relative', height: 900 }} elevation={1}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                                    🧭 Anotaciones sobre la Figura del Pozo
                                </Typography>

                                {/* Imagen del pozo como fondo */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url("/assets/images/imagen_pozo_limpia.png")`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* Flechas predefinidas */}
                                    {arrows.map(({ id, top, left, rotation, active, value, label }) => (
                                        <React.Fragment key={id}>
                                            {/* Flecha tenúe sobre la imagen */}
                                            <EastIcon
                                                onClick={() => toggleArrow(id)}
                                                sx={{

                                                    position: 'absolute',
                                                    top,
                                                    left,
                                                    fontSize: 40, // ajusta para cambiar el "largo visual"
                                                    transform: `rotate(${rotation}deg) scaleX(1.3) scaleY(0.7)`, // puedes experimentar con estos valores
                                                    opacity: active ? 1 : 0.3,
                                                    color: '#000',
                                                    cursor: 'pointer',
                                                    transition: 'opacity 150ms'
                                                }}
                                            />

                                            {/* Input que aparece sólo si la flecha está activa */}
                                            {active && (
                                                <TextField
                                                    size="small"
                                                    placeholder={label}
                                                    value={value}
                                                    onChange={e => updateArrowValue(id, e.target.value)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: `calc(${top} + 28px)`,
                                                        left,
                                                        width: 100,
                                                        backgroundColor: 'white'
                                                    }}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}

                                    <TextField
                                        size="small"
                                        placeholder="Distancia(m)"
                                        name="columna_input_cero"
                                        value={formData.columna_input_cero}
                                        onChange={handleChange}
                                        sx={{
                                            position: 'absolute',
                                            top: '156px',
                                            left: '25%',
                                            width: 120,
                                            backgroundColor: 'white'
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        placeholder="Distancia(m)"
                                        name="columna_input_uno"
                                        value={formData.columna_input_uno}
                                        onChange={handleChange}
                                        sx={{
                                            position: 'absolute',
                                            top: '500px',
                                            left: '25%',
                                            width: 120,
                                            backgroundColor: 'white'
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        placeholder="Distancia(m)"
                                        name="columna_input_dos"
                                        value={formData.columna_input_dos}
                                        onChange={handleChange}
                                        sx={{
                                            position: 'absolute',
                                            top: '558px',
                                            left: '25%',
                                            width: 120,
                                            backgroundColor: 'white'
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        placeholder="Distancia(m)"
                                        name="columna_input_tres"
                                        value={formData.columna_input_tres}
                                        onChange={handleChange}
                                        sx={{
                                            position: 'absolute',
                                            top: '616px',
                                            left: '25%',
                                            width: 120,
                                            backgroundColor: 'white'
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        placeholder="Distancia(m)"
                                        name="columna_input_cuatro"
                                        value={formData.columna_input_cuatro}
                                        onChange={handleChange}
                                        sx={{
                                            position: 'absolute',
                                            top: '680px',
                                            left: '25%',
                                            width: 120,
                                            backgroundColor: 'white'
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        placeholder="Distancia(m)"
                                        name="columna_input_cinco"
                                        value={formData.columna_input_cinco}
                                        onChange={handleChange}
                                        sx={{
                                            position: 'absolute',
                                            top: '735px',
                                            left: '25%',
                                            width: 120,
                                            backgroundColor: 'white'
                                        }}
                                    />
                                </Box>
                            </Paper>


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