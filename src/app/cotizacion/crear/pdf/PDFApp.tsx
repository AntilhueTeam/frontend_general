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
    acuerdos: string[];
    aportes_cliente: string[];
    aportes_antilhue: string[];
    imagenes: string[]; // base64 strings
    numero_revision: string;
    requiere_respuesta: boolean;
    titulo_imagenes: string;
    descripcion_imagenes: string;
    valor_metro: number;
    valor_servicio: number;
    valor_bomba: number;
    anticipo: number;
    variante_metro: number;
    n_profundidad: number;
    detalle_bomba: string;

    tipo_cuenta: string;
    nombre_banco: string;
    numero_cuenta: string;

    columna_input_cero: string;
    columna_input_uno: string;
    columna_input_dos: string;
    columna_input_tres: string;
    columna_input_cuatro: string;
    columna_input_cinco: string;

    flechas?: {
      id: number;
      value: string;
    }[];
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
    const fileNameBase = `${formData.n_referencia} ${formData.nombre_cliente} ${formData.comuna_cliente} Rev ${formData.numero_revision} ${fechaFormateada}`;

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