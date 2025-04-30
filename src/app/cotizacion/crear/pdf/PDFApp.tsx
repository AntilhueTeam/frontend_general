"use client";
import { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MyPDF from "./mypdf";


// Definir tipo para el formulario
interface FormData {
    nombre_cliente: string;
    direccion_especifica_cliente: string;
    comuna_cliente: string;
    nombre_empresa: string;
    direccion_empresa: string;
    region_empresa: string;
    pais_empresa: string;
    numero_telefono_empresa: string;
    n_referencia: string;
    id_proyecto: string;
    asunto_cliente: string;
    descripcion_proyecto: string;
    id_documento: string;
    aportes_cliente: string[];
    aportes_antilhue: string[];
    imagenes: string[]; // base64 strings
  }

// function App() {
//     const [formData, setFormData] = useState<FormData>({
//         nombre_cliente: "",
//         direccion_especifica_cliente: "",
//         comuna_cliente: "",
//         nombre_empresa: "",
//         direccion_empresa: "",
//         region_empresa: "",
//         pais_empresa: "",
//         numero_telefono_empresa: "",
//         n_referencia: "",
//         id_proyecto: "",
//         asunto_cliente: "",
//         descripcion_proyecto: "",
//         id_documento: "",
//     });

function App() {
    const [formData, setFormData] = useState<FormData | null>(null);
  
    useEffect(() => {
      const stored = localStorage.getItem("cotizacionData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFormData(parsed);
        } catch (error) {
          console.error("Error parsing localStorage data", error);
        }
      }
    }, []);
  
    if (!formData) {
      return <p>No hay datos guardados. Por favor, complete el formulario primero.</p>;
    }

    return (
        <div className="App">

            {/* Formulario para datos dinámicos
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Nombre Cliente:
                    <input
                        type="text"
                        placeholder="Ingrese el nombre del cliente"
                        value={formData.nombre_cliente}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre_cliente: e.target.value })
                        }
                    />
                </label>

                <label>
                    Dirección Específica del Cliente:
                    <input
                        type="text"
                        placeholder="Ingrese la dirección específica del cliente"
                        value={formData.direccion_especifica_cliente}
                        onChange={(e) =>
                            setFormData({ ...formData, direccion_especifica_cliente: e.target.value })
                        }
                    />
                </label>

                <label>
                    Comuna del Cliente:
                    <input
                        type="text"
                        placeholder="Ingrese la comuna del cliente"
                        value={formData.comuna_cliente}
                        onChange={(e) =>
                            setFormData({ ...formData, comuna_cliente: e.target.value })
                        }
                    />
                </label>

                <label>
                    Nombre de la Empresa:
                    <input
                        type="text"
                        placeholder="Ingrese el nombre de la empresa"
                        value={formData.nombre_empresa}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre_empresa: e.target.value })
                        }
                    />
                </label>

                <label>
                    Dirección de la Empresa:
                    <input
                        type="text"
                        placeholder="Ingrese la dirección de la empresa"
                        value={formData.direccion_empresa}
                        onChange={(e) =>
                            setFormData({ ...formData, direccion_empresa: e.target.value })
                        }
                    />
                </label>

                <label>
                    Región de la Empresa:
                    <input
                        type="text"
                        placeholder="Ingrese la región de la empresa"
                        value={formData.region_empresa}
                        onChange={(e) =>
                            setFormData({ ...formData, region_empresa: e.target.value })
                        }
                    />
                </label>

                <label>
                    País de la Empresa:
                    <input
                        type="text"
                        placeholder="Ingrese el país de la empresa"
                        value={formData.pais_empresa}
                        onChange={(e) =>
                            setFormData({ ...formData, pais_empresa: e.target.value })
                        }
                    />
                </label>

                <label>
                    Teléfono de la Empresa:
                    <input
                        type="text"
                        placeholder="Ingrese el número de teléfono de la empresa"
                        value={formData.numero_telefono_empresa}
                        onChange={(e) =>
                            setFormData({ ...formData, numero_telefono_empresa: e.target.value })
                        }
                    />
                </label>

                <label>
                    Número de Referencia:
                    <input
                        type="text"
                        placeholder="Ingrese el número de referencia"
                        value={formData.n_referencia}
                        onChange={(e) =>
                            setFormData({ ...formData, n_referencia: e.target.value })
                        }
                    />
                </label>

                <label>
                    ID del Proyecto:
                    <input
                        type="text"
                        placeholder="Ingrese el ID del proyecto"
                        value={formData.id_proyecto}
                        onChange={(e) =>
                            setFormData({ ...formData, id_proyecto: e.target.value })
                        }
                    />
                </label>

                <label>
                    Asunto:
                    <input
                        type="text"
                        placeholder="Ingrese el asunto (ej. Entrega Carta Oferta)"
                        value={formData.asunto_cliente}
                        onChange={(e) =>
                            setFormData({ ...formData, asunto_cliente: e.target.value })
                        }
                    />
                </label>

                <label>
                    Descripción del Proyecto:
                    <textarea
                        placeholder="Ingrese la descripción del proyecto"
                        value={formData.descripcion_proyecto}
                        onChange={(e) =>
                            setFormData({ ...formData, descripcion_proyecto: e.target.value })
                        }
                    />
                </label>

                <label>
                    ID del Documento:
                    <input
                        type="text"
                        placeholder="Ingrese el ID del documento"
                        value={formData.id_documento}
                        onChange={(e) =>
                            setFormData({ ...formData, id_documento: e.target.value })
                        }
                    />
                </label>
            </div> */}

            {/* Vista previa del PDF */}
            <PDFViewer style={{ width: "100%", height: "600px" }}>
                <MyPDF data={formData} />
            </PDFViewer>

            <PDFDownloadLink
                document={<MyPDF data={formData} />}
                fileName="carta-oferta.pdf"
                style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                }}
            >
                {({ loading }) => (loading ? "Cargando..." : "Descargar PDF")}
            </PDFDownloadLink>
            </div>
        );
        }

        export default App;