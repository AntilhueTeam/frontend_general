"use client";
import { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MyPDF from "./mypdf";

// Definir tipo para el formulario
interface FormData {
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
}

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

    // ─────────────────────────────────────────────────────────────────
    // 1) Calcular fecha actual en formato DDMMMYY:
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // "30"
    const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const month = monthNames[today.getMonth()];           // "Jun"
    const year = String(today.getFullYear()).slice(2);     // "23"
    const fechaFormateada = `${day}${month}${year}`;       // "30Jun23"

    // 2) Construir la base del nombre de archivo:
    //    "<n_referencia> <nombre_cliente> <comuna_cliente> Rev <numero_revision> <fechaFormateada>"
    const fileNameBase = `${formData.n_referencia} ${formData.cliente.nombre_cliente} ${formData.cliente.comuna_cliente} Rev ${formData.numero_revision} ${fechaFormateada}`;

    // 3) Agregar la extensión ".pdf"
    const fileName = `${fileNameBase}.pdf`;
    // ─────────────────────────────────────────────────────────────────

    return (
        <div className="App">
          {/* Vista previa del PDF */}
          <PDFViewer style={{ width: "100%", height: "calc(100vh - 200px)" }}>
            <MyPDF data={formData} />
          </PDFViewer>
      
          {/* Contenedor de acciones debajo del visor */}
          <div style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>
            <PDFDownloadLink
              document={<MyPDF data={formData} />}
              fileName={fileName}
              style={{
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
      
            {/* Aquí puedes agregar más botones */}
            <button
              style={{
                marginLeft: "15px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => alert("Otra acción")}
            >
              Otra acción
            </button>
          </div>
        </div>
      );
        }

        export default App;