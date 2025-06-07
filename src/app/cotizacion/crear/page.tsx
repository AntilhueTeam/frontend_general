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
import clienteService from '../../../services/cliente.service';

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

// ────────── 1) CONFIGURACIONES DE FLECHAS ──────────
// Para "acero" vamos a dibujar X flechas (aquí ej. 7):
const FLECHAS_ACERO: Omit<Arrow, "active" | "value">[] = [
    { id: 1, top: "77%", left: "48%", rotation: 180, label: "" },
    { id: 2, top: "72%", left: "49%", rotation: 180, label: "" },
    { id: 3, top: "65%", left: "49%", rotation: 180, label: "" },
    { id: 4, top: "55%", left: "48%", rotation: 180, label: "" },
    { id: 5, top: "35%", left: "49%", rotation: 180, label: "" },
    { id: 6, top: "21%", left: "53%", rotation: 180, label: "" },
    { id: 7, top: "19%", left: "52%", rotation: -190, label: "" },
    { id: 8, top: "10%", left: "47%", rotation: 190, label: "" },
];

// Para "pvc" vamos a dibujar Y flechas (ej. 11). Ajusta las posiciones y etiquetas según tu diseño:
const FLECHAS_PVC: Omit<Arrow, "active" | "value">[] = [
    { id: 1, top: "81%", left: "49.5%", rotation: 180, label: "" },
    { id: 2, top: "76%", left: "48%", rotation: 180, label: "" },
    { id: 3, top: "72%", left: "49%", rotation: 180, label: "" },
    { id: 4, top: "65%", left: "49%", rotation: 180, label: "" },
    { id: 5, top: "55%", left: "48%", rotation: 180, label: "" },
    { id: 6, top: "35%", left: "49%", rotation: 180, label: "" },
    { id: 7, top: "21.2%", left: "58.5%", rotation: 180, label: "" },
    { id: 8, top: "19%", left: "52%", rotation: -190, label: "" },
    { id: 9, top: "15%", left: "49%", rotation: -190, label: "" },
    { id: 10, top: "11%", left: "48%", rotation: -190, label: "" },
];

// Máximo de caracteres por aporte
const MAX_CARACTERES_APORTE = 300;

// Acuerdos
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

type FormData = {
    [key: string]: any;

    cliente: {
        nombre_cliente: string;
        direccion_cliente: string;
        comuna_cliente: string;
        telefono: string;
    };
    nombre_empresa: string;
    direccion_empresa: string;
    region_empresa: string;
    pais_empresa: string;
    fecha_firma: Date | null;
    numero_telefono_empresa: string;
    n_referencia: number;
    id_proyecto: string;
    asunto_cliente: string;
    descripcion_proyecto: string;
    id_documento: number;
    carta_oferta: string;
    oferta_economica: string;
    requiere_respuesta: boolean;
    aportes_cliente: string[];
    aportes_antilhue: string[];
    acuerdos: string[];
    anticipo: number;
    banco: string;
    cuenta: string;
    rut_banco: string;
    nombre_firma: string;
    rut_firma: string;
    imagenes: string[];
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
    tipo_cuenta: string;
    nombre_banco: string;
    numero_cuenta: string;

    descripcion_trabajo: {
        id: number;
        titulo: string;
        subpuntos: string[];
    }[];

    lineas_economicas: {
        id: number;
        descripcion: string;
        valor: number;
    }[];

    resumen_subpuntos: {
        descripcion: string;
        valor: number;
    }[];

    tipo_tuberia: 'acero' | 'pvc';
};

export default function SolicitudCotizacion() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<string>(''); // 'nuevo' o ID
    const [registrarNuevoCliente, setRegistrarNuevoCliente] = useState(false);

    // ────────── Estado “arrows” basado en tipo_tuberia ──────────
    // Inicialmente dejamos un array vacío; luego lo llenaremos
    // en el useEffect que observa `formData.tipo_tuberia`.
    const [arrows, setArrows] = useState<Arrow[]>([]);

    const router = useRouter();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [formData, setFormData] = useState<FormData>({
        cliente: {
            nombre_cliente: '',
            direccion_cliente: '',
            comuna_cliente: '',
            telefono: '',
        },
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
        imagenes: [],
        tipo_cuenta: '',
        nombre_banco: '',
        numero_cuenta: '',

        // ────────────── Descripción del Trabajo (inicial) ──────────────
        // Deja el campo `titulo` vacío; el label “Punto N:” ya lo mostrará.
        descripcion_trabajo: [
            {
                id: 1,
                titulo: "",                  // <-- vacío
                subpuntos: [""]              // o [] si deseas que no haya subpunto inicial
            },
            {
                id: 2,
                titulo: "",
                subpuntos: [""]
            },
            {
                id: 3,
                titulo: "",
                subpuntos: [""]
            },
            {
                id: 4,
                titulo: "",
                subpuntos: [""]
            }
        ],

        lineas_economicas: [],

        resumen_subpuntos: [],

        tipo_tuberia: 'acero',

    });

    // ########################################################################################################
    // useEffects
    // ########################################################################################################

    // Se obtienen todos los clientes
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await clienteService.getAll();
                const adaptados = response.data.map((c: any) => ({
                    id: c.ID,
                    nombre_cliente: c.nombre_cliente,
                    direccion_cliente: c.direccion_cliente,
                    comuna_cliente: c.comuna_cliente,
                    telefono: c.Telefono // Nota: 'Telefono' viene con mayúscula
                }));
                setClientes(adaptados);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            }
        };
        fetchClientes();
    }, []);

    useEffect(() => {
        const acuerdosActualizados = generarAcuerdos(acuerdosTemplate, formData.variante_metro, formData.n_profundidad);
        setFormData(prev => ({
            ...prev,
            acuerdos: acuerdosActualizados
        }));
    }, [formData.variante_metro, formData.n_profundidad]);

    // Cada vez que cambie `formData.tipo_tuberia` recreamos el state `arrows`
    useEffect(() => {
        if (formData.tipo_tuberia === "acero") {
            // Mapeamos cada configuración de acero a un objeto Arrow completo
            const nuevos = FLECHAS_ACERO.map(f => ({
                ...f,
                active: false, // inicialmente desactivada la caja de texto
                value: ""      // valor en blanco al inicio
            }));
            setArrows(nuevos);
        } else {
            // Mapeamos configuración PVC a Arrow completo
            const nuevos = FLECHAS_PVC.map(f => ({
                ...f,
                active: false,
                value: ""
            }));
            setArrows(nuevos);
        }
    }, [formData.tipo_tuberia]);

    // ########################################################################################################
    // FUNCIONES
    // ########################################################################################################
    const handleSubmit = async () => {
        // Si hay que registrar un nuevo cliente
        if (registrarNuevoCliente) {
            try {
                const nuevoCliente = {
                    nombre_cliente: formData.cliente.nombre_cliente,
                    direccion_cliente: formData.cliente.direccion_cliente,
                    comuna_cliente: formData.cliente.comuna_cliente,
                    telefono: formData.cliente.telefono,
                };
                console.log("NUEVO CLIENTE A CREAR",nuevoCliente);
                const response = await clienteService.create(nuevoCliente);
                setClienteSeleccionado(response.data.id);
            } catch (error) {
                console.error("Error al crear nuevo cliente:", error);
                alert("No se pudo registrar el cliente. Verifique los datos.");
                return; // Salir de la función si hay error
            }
        }

        // CREAR COTIZACION_CARPETA
        const cotizacionCarpetaPayload = {
            id_user: 1,
            id_cliente: clienteSeleccionado,
            // id_empresa: empresaSeleccionada,
            // id_banco: bancoSeleccionado,
            n_referencia: formData.n_referencia,
            estado: 'borrador',
            id_proyecto: formData.id_proyecto,
            longitud: formData.longitud,
            latitud: formData.latitud,
        };

        //.........llamada a servicio de cotizacion_carpeta

        // Ahora guardamos la info del formData + la info de flechas en localStorage
        const updatedData = {
            ...formData,
            id_cliente: clienteSeleccionado,
            flechas: arrows.map(a => ({
                id: a.id,
                value: a.value // solo guardamos lo necesario
            }))
        };

        // Se guarda el updatedData en el localStorage
        localStorage.setItem("cotizacionData", JSON.stringify(updatedData));
        router.push("/cotizacion/crear/pdf");
    };

    // Función que marca/desmarca la flecha (activar input debajo)
    function toggleArrow(id: number) {
        setArrows(prev =>
            prev.map(item =>
                item.id === id ? { ...item, active: !item.active } : item
            )
        );
    }

    // Función que actualiza el texto de la flecha con id dado
    function updateArrowValue(id: number, text: string) {
        setArrows(prev =>
            prev.map(item =>
                item.id === id ? { ...item, value: text } : item
            )
        );
    }

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

    //Funciones para “Descripción del Trabajo”
    const handleAddPunto = () => {
        setFormData(prev => {
            const nuevoId = prev.descripcion_trabajo.length > 0
                ? prev.descripcion_trabajo[prev.descripcion_trabajo.length - 1].id + 1
                : 1;
            const nuevoPunto = { id: nuevoId, titulo: "", subpuntos: [""] };
            return {
                ...prev,
                descripcion_trabajo: [...prev.descripcion_trabajo, nuevoPunto]
            };
        });
    };

    const handleRemovePunto = (index: number) => {
        setFormData(prev => {
            const copia = [...prev.descripcion_trabajo];
            copia.splice(index, 1);
            return { ...prev, descripcion_trabajo: copia };
        });
    };

    const handleChangeTituloPunto = (index: number, texto: string) => {
        setFormData(prev => {
            const copia = [...prev.descripcion_trabajo];
            copia[index] = { ...copia[index], titulo: texto };
            return { ...prev, descripcion_trabajo: copia };
        });
    };

    const handleAddSubpunto = (index: number) => {
        setFormData(prev => {
            const copia = [...prev.descripcion_trabajo];
            const punto = { ...copia[index] };
            punto.subpuntos = [...punto.subpuntos, ""];
            copia[index] = punto;
            return { ...prev, descripcion_trabajo: copia };
        });
    };

    const handleRemoveSubpunto = (puntoIndex: number, subIndex: number) => {
        setFormData(prev => {
            const copia = [...prev.descripcion_trabajo];
            const punto = { ...copia[puntoIndex] };
            punto.subpuntos = punto.subpuntos.filter((_, i) => i !== subIndex);
            copia[puntoIndex] = punto;
            return { ...prev, descripcion_trabajo: copia };
        });
    };

    const handleChangeSubpunto = (puntoIndex: number, subIndex: number, texto: string) => {
        setFormData(prev => {
            const copia = [...prev.descripcion_trabajo];
            const punto = { ...copia[puntoIndex] };
            punto.subpuntos = punto.subpuntos.map((sp, i) =>
                i === subIndex ? texto : sp
            );
            copia[puntoIndex] = punto;
            return { ...prev, descripcion_trabajo: copia };
        });
    };

    //funciones para propuesta economica
    // 1) Agrega un nuevo subpunto (con descripción vacía y valor 0)
    const handleAddResumenSubpunto = () => {
        setFormData(prev => ({
            ...prev,
            resumen_subpuntos: [
                ...prev.resumen_subpuntos,
                { descripcion: "", valor: 0 }
            ]
        }));
    };

    // 2) Elimina un subpunto por índice
    const handleRemoveResumenSubpunto = (index: number) => {
        setFormData(prev => {
            const copia = [...prev.resumen_subpuntos];
            copia.splice(index, 1);
            return { ...prev, resumen_subpuntos: copia };
        });
    };

    // 3) Cambia solo el texto (descripcion) de un subpunto
    const handleChangeResumenSubpuntoDescripcion = (index: number, texto: string) => {
        setFormData(prev => {
            const copia = [...prev.resumen_subpuntos];
            copia[index] = { ...copia[index], descripcion: texto };
            return { ...prev, resumen_subpuntos: copia };
        });
    };

    // 4) Cambia solo el valor (valor) de un subpunto
    const handleChangeResumenSubpuntoValor = (index: number, nuevoValor: string) => {
        const numerico = Number(nuevoValor);
        setFormData(prev => {
            const copia = [...prev.resumen_subpuntos];
            copia[index] = { ...copia[index], valor: numerico };
            return { ...prev, resumen_subpuntos: copia };
        });
    };

    //cambio de tuberias imagen pvc o acero
    const handlePipeTypeChange = (value: 'acero' | 'pvc') => {
        setFormData(prev => ({
            ...prev,
            tipo_tuberia: value
        }));
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
                                    label="N° Referencia"
                                    name="n_referencia"
                                    type="text"
                                    value={formData.n_referencia}
                                    onChange={handleChange}
                                    size="small"
                                    sx={{ width: 400 }}
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


                                {/* 
                                #####################################################################################################
                                Sección Datos del Cliente 
                                #####################################################################################################
                                */}
                                
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f0f0f0' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            👤 Datos del Cliente
                                        </Typography>

                                        {/* Select + Botón de registrar nuevo cliente */}
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Selecciona Cliente</InputLabel>
                                                <Select
                                                    value={clienteSeleccionado}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setClienteSeleccionado(val);
                                                        const cliente = clientes.find((c) => c.id === parseInt(val));
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            cliente,
                                                        }));
                                                        setRegistrarNuevoCliente(false);
                                                    }}
                                                    label="Selecciona Cliente"
                                                >
                                                    <MenuItem value="">-- Selecciona una opción --</MenuItem>
                                                    {clientes.map((c) => (
                                                        <MenuItem key={c.id} value={c.id}>
                                                            {c.nombre_cliente}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={registrarNuevoCliente}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            setRegistrarNuevoCliente(checked);
                                                            if (checked) {
                                                                setClienteSeleccionado('');
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    cliente: {
                                                                        nombre_cliente: '',
                                                                        direccion_cliente: '',
                                                                        comuna_cliente: '',
                                                                        telefono: '',
                                                                    },
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="Registrar nuevo cliente"
                                                sx={{ whiteSpace: 'nowrap' }}
                                            />
                                        </Box>

                                        {/* Inputs en 2 columnas */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Nombre del Cliente"
                                                value={formData.cliente?.nombre_cliente || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        cliente: { ...prev.cliente, nombre_cliente: e.target.value },
                                                    }))
                                                }
                                                InputProps={{
                                                    readOnly: !registrarNuevoCliente,
                                                }}
                                                sx={{ flex: '1 1 45%' }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Dirección"
                                                value={formData.cliente?.direccion_cliente || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        cliente: { ...prev.cliente, direccion_cliente: e.target.value },
                                                    }))
                                                }
                                                InputProps={{
                                                    readOnly: !registrarNuevoCliente,
                                                }}
                                                sx={{ flex: '1 1 45%' }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Comuna"
                                                value={formData.cliente?.comuna_cliente || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        cliente: { ...prev.cliente, comuna_cliente: e.target.value },
                                                    }))
                                                }
                                                InputProps={{
                                                    readOnly: !registrarNuevoCliente,
                                                }}
                                                sx={{ flex: '1 1 45%' }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Teléfono"
                                                value={formData.cliente?.telefono || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        cliente: { ...prev.cliente, telefono: e.target.value },
                                                    }))
                                                }
                                                InputProps={{
                                                    readOnly: !registrarNuevoCliente,
                                                }}
                                                sx={{ flex: '1 1 45%' }}
                                            />
                                        </Box>
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



                                </Grid>




                                {/* ────────────────────────────────────────────── */}
                                {/* BLOQUE: Descripción del Trabajo (dinámico) */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }} elevation={0}>
                                        <Box mb={2}>
                                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                                📝 Descripción del Trabajo
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Agrega tantos puntos y subpuntos como necesites
                                            </Typography>
                                        </Box>

                                        {/* Si no hay puntos aún: invitación a “Añadir Punto” */}
                                        {formData.descripcion_trabajo.length === 0 && (
                                            <Box mb={2}>
                                                <Typography variant="body2" color="textSecondary">
                                                    No hay puntos definidos. Pulsa “+ Añadir Punto” para empezar.
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* 1) Renderizamos cada punto y sus subpuntos habituales */}
                                        {formData.descripcion_trabajo.map((punto, idxPunto) => (
                                            <Box
                                                key={punto.id}
                                                mb={3}
                                                sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}
                                            >
                                                {/* Título editable del punto */}
                                                <Box display="flex" alignItems="center" mb={1}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label={`Punto ${idxPunto + 1}:`}
                                                        placeholder="Escribe aquí la descripción del punto"
                                                        value={punto.titulo}
                                                        onChange={(e) =>
                                                            handleChangeTituloPunto(idxPunto, e.target.value)
                                                        }
                                                    />
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleRemovePunto(idxPunto)}
                                                        sx={{ ml: 1 }}
                                                        size="large"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>

                                                {/* Subpuntos dentro de cada punto */}
                                                <Box ml={2}>
                                                    {punto.subpuntos.map((sub, idxSub) => (
                                                        <Box
                                                            key={idxSub}
                                                            display="flex"
                                                            alignItems="center"
                                                            mb={1}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Subpunto ${idxPunto + 1}.${idxSub + 1}:`}
                                                                placeholder="Escribe aquí la descripción del subpunto"
                                                                value={sub}
                                                                onChange={(e) =>
                                                                    handleChangeSubpunto(idxPunto, idxSub, e.target.value)
                                                                }
                                                            />
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveSubpunto(idxPunto, idxSub)}
                                                                sx={{ ml: 1 }}
                                                                size="large"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    ))}

                                                    {/* Botón para añadir nuevo subpunto en este punto */}
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleAddSubpunto(idxPunto)}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        + Añadir Subpunto
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ))}

                                        {/* Botón para añadir un NUEVO punto completo */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddPunto}
                                            sx={{ mb: 3 }}
                                        >
                                            + Añadir Punto
                                        </Button>

                                        {/* ─────────── 2) BLOQUE “Resumen oferta económica” ─────────── */}
                                        {(() => {
                                            // Calculamos el índice donde empezará este punto:
                                            const resumenIndex = formData.descripcion_trabajo.length; // 0-based
                                            const numeroPuntoGeneral = resumenIndex + 1; // número humano (1-based)

                                            return (
                                                <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
                                                    {/* 2.1) Título general NO editable */}
                                                    <Box mb={2}>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{ fontWeight: 600, color: '#1a237e' }}
                                                        >
                                                            💰 Propuesta Económica
                                                        </Typography>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
                                                            {`Punto ${numeroPuntoGeneral}: Resumen oferta económica`}
                                                        </Typography>
                                                    </Box>



                                                    {/* 2.2) Subpuntos ligados a los campos de Propuesta Económica */}
                                                    <Box ml={2}>
                                                        {/* Subpunto “Valor por Metro (CLP)” */}
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Subpunto ${numeroPuntoGeneral}.1: Valor por Metro (CLP)`}
                                                                type="number"
                                                                name="valor_metro"
                                                                value={formData.valor_metro}
                                                                onChange={handleChange}
                                                            />
                                                        </Box>

                                                        {/* Subpunto “Detalle de la Bomba” */}
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Subpunto ${numeroPuntoGeneral}.2: Detalle de la Bomba`}
                                                                multiline
                                                                rows={2}
                                                                name="detalle_bomba"
                                                                value={formData.detalle_bomba}
                                                                onChange={handleChange}
                                                            />
                                                        </Box>

                                                        {/* Subpunto “Valor de la Bomba (CLP)” */}
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Subpunto ${numeroPuntoGeneral}.3: Valor de la Bomba (CLP)`}
                                                                type="number"
                                                                name="valor_bomba"
                                                                value={formData.valor_bomba}
                                                                onChange={handleChange}
                                                            />
                                                        </Box>

                                                        {/* Subpunto “Diámetro Ø del Pozo (")” */}
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Subpunto ${numeroPuntoGeneral}.4: Diámetro Ø del Pozo (")`}
                                                                type="number"
                                                                name="variante_metro"
                                                                value={formData.variante_metro}
                                                                onChange={handleChange}
                                                            />
                                                        </Box>

                                                        {/* Subpunto “Profundidad Estimada del Pozo (m)” */}
                                                        <Box display="flex" alignItems="center" mb={2}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Subpunto ${numeroPuntoGeneral}.5: Profundidad Estimada del Pozo (m)`}
                                                                type="number"
                                                                name="n_profundidad"
                                                                value={formData.n_profundidad}
                                                                onChange={handleChange}
                                                            />
                                                        </Box>

                                                        {/* 2.3) Renderizamos cada subpunto adicional con descripción + valor */}
                                                        {formData.resumen_subpuntos.map((item, idx) => (
                                                            <Box
                                                                key={idx}
                                                                display="flex"
                                                                alignItems="center"
                                                                mb={1}
                                                            >
                                                                {/* Campo para la descripción del subpunto */}
                                                                <TextField
                                                                    sx={{ flex: 7, mr: 1 }}
                                                                    size="small"
                                                                    label={`Subpunto ${numeroPuntoGeneral}.${idx + 6}: Descripción`}
                                                                    placeholder="Texto adicional..."
                                                                    value={item.descripcion}
                                                                    onChange={(e) =>
                                                                        handleChangeResumenSubpuntoDescripcion(idx, e.target.value)
                                                                    }
                                                                />

                                                                {/* Campo para el valor asociado a este subpunto */}
                                                                <TextField
                                                                    sx={{ flex: 4, mr: 1 }}
                                                                    size="small"
                                                                    label={`Subpunto ${numeroPuntoGeneral}.${idx + 6}: Valor (CLP)`}
                                                                    type="number"
                                                                    // Si item.valor es 0, mostramos cadena vacía, de lo contrario mostramos el número
                                                                    value={item.valor === 0 ? '' : item.valor}
                                                                    onChange={(e) =>
                                                                        handleChangeResumenSubpuntoValor(idx, e.target.value)
                                                                    }
                                                                />


                                                                {/* Botón para borrar este subpunto extra */}
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleRemoveResumenSubpunto(idx)}
                                                                    size="large"
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        ))}

                                                        {/* 2.4) Botón para añadir un nuevo subpunto (descripción + valor) */}
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleAddResumenSubpunto}
                                                        >
                                                            + Añadir Subpunto
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            );
                                        })()}
                                        {/* ────────────────────────────────────────────────────────────────────── */}
                                    </Paper>
                                </Grid>
                                {/* ────────────────────────────────────────────── */}


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
                            </Grid>

                            {/* Requiere Respuesta */}
                            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
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

                            {/* ──────────────────────────────────────────────────────────────────── */}
                            {/* NUEVO BLOQUE: Datos Bancarios */}
                            <Grid size={{ xs: 12 }} sx={{ mt: 2, mb: 2 }}>
                                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }} elevation={0}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                                        🏦 Datos Bancarios
                                    </Typography>

                                    <Grid container spacing={4}>
                                        {/* Tipo de Cuenta */}
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Tipo de Cuenta</InputLabel>
                                                <Select
                                                    label="Tipo de Cuenta"
                                                    name="tipo_cuenta"
                                                    value={formData.tipo_cuenta}
                                                    onChange={(e) => {
                                                        // Reutilizamos handleChange para Select
                                                        const ev = e as unknown as React.ChangeEvent<HTMLInputElement>;
                                                        handleChange(ev);
                                                    }}
                                                >
                                                    <MenuItem value="Corriente">Corriente</MenuItem>
                                                    <MenuItem value="Ahorro">Ahorro</MenuItem>
                                                    <MenuItem value="Vista">Vista</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Nombre del Banco */}
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="Nombre del Banco"
                                                size="small"
                                                name="nombre_banco"
                                                value={formData.nombre_banco}
                                                onChange={handleChange}
                                            />
                                        </Grid>

                                        {/* Número de Cuenta */}
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="Número de Cuenta"
                                                size="small"
                                                name="numero_cuenta"
                                                value={formData.numero_cuenta}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            {/* ──────────────────────────────────────────────────────────────────── */}




                            {/* Imagen del Pozo con Flechas */}
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f0f0f0', mb: 4, position: 'relative', height: 900 }} elevation={1}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                                    🧭 Anotaciones sobre la Figura del Pozo
                                </Typography>

                                {/*Cambio de pozo ya sea PVC o acero */}
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <Button
                                        variant={formData.tipo_tuberia === 'acero' ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => handlePipeTypeChange('acero')}
                                    >
                                        Cañería de Acero
                                    </Button>
                                    <Button
                                        variant={formData.tipo_tuberia === 'pvc' ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => handlePipeTypeChange('pvc')}
                                    >
                                        Cañería de PVC
                                    </Button>
                                </Box>

                                {/* Imagen del pozo como fondo */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: formData.tipo_tuberia === 'acero' ? `url("/assets/images/imagen_pozo_limpia.png")` : `url("/assets/images/imagen_pozo_limpia_pvc.png")`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* Imagen con flechas predefinidas */}
                                    {arrows.map(({ id, top, left, rotation, active, value, label }) => {
                                        // Calculamos un top alternativo para los casos especiales:
                                        let inputTop;
                                        if (formData.tipo_tuberia === "acero" && id === 7) {
                                            // En acero, para la flecha id=7, subimos el input 10px
                                            inputTop = `calc(${top} - 10px)`;
                                        } else if (formData.tipo_tuberia === "pvc" && id === 8) {
                                            // En pvc, para la flecha id=8, subimos el input 10px
                                            inputTop = `calc(${top} - 8px)`;
                                        } else if (formData.tipo_tuberia === "pvc" && id === 10) {
                                            // En pvc, para la flecha id=8, subimos el input 10px
                                            inputTop = `calc(${top} - 10px)`;
                                        } else if (formData.tipo_tuberia === "pvc" && id === 9) {
                                            // En pvc, para la flecha id=8, subimos el input 10px
                                            inputTop = `calc(${top} - 10px)`;
                                        } else {
                                            // Para todos los demás casos, mantenemos el desplazamiento base:
                                            inputTop = `calc(${top} + 5px)`;
                                        }

                                        return (
                                            <React.Fragment key={id}>
                                                {/* Flecha tenúe sobre la imagen */}
                                                <EastIcon
                                                    onClick={() => toggleArrow(id)}
                                                    sx={{
                                                        position: "absolute",
                                                        top,
                                                        left,
                                                        fontSize: 40,
                                                        transform: `rotate(${rotation}deg) scaleX(1.3) scaleY(0.7)`,
                                                        opacity: active ? 1 : 0.3,
                                                        color: "#000",
                                                        cursor: "pointer",
                                                        transition: "opacity 150ms",
                                                    }}
                                                />

                                                {/* Input que aparece sólo si la flecha está activa */}
                                                {active && (
                                                    <TextField
                                                        size="small"
                                                        placeholder={label}
                                                        value={value}
                                                        onChange={(e) => updateArrowValue(id, e.target.value)}
                                                        sx={{
                                                            position: "absolute",
                                                            top: inputTop,
                                                            left: `calc(${left} + 45px)`,
                                                            width: 100,

                                                            // Reducir la altura total del TextField (contenedor)
                                                            "& .MuiInputBase-root": {
                                                                height: 30,
                                                            },
                                                            // Reducir el padding interno de la etiqueta/texto
                                                            "& .MuiInputBase-input": {
                                                                padding: "4px 8px",
                                                                fontSize: 12,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}


                                    {formData.n_profundidad - 12 >= 0 && (
                                        <>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '156px',
                                                    left: '25%',
                                                    width: 85,
                                                    height: 30,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    padding: '4px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 14,
                                                }}
                                            >
                                                0.00 m
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '510px',
                                                    left: '25%',
                                                    width: 85,
                                                    height: 30,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    padding: '4px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {formData.n_profundidad - 12}.00 m
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '568px',
                                                    left: '25%',
                                                    width: 85,
                                                    height: 30,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    padding: '4px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {formData.n_profundidad - 9}.00 m
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '626px',
                                                    left: '25%',
                                                    width: 85,
                                                    height: 30,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    padding: '4px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {formData.n_profundidad - 6}.00 m
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '690px',
                                                    left: '25%',
                                                    width: 85,
                                                    height: 30,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    padding: '4px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {formData.n_profundidad - 3}.00 m
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '745px',
                                                    left: '25%',
                                                    width: 85,
                                                    height: 30,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    padding: '4px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {formData.n_profundidad}.00 m
                                            </Box>
                                        </>
                                    )}
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