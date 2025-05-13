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
    numero_revision:string[];
    requiere_respuesta:boolean;
    titulo_imagenes:string;
    descripcion_imagenes:string;
    valor_metro:number;
    valor_servicio:number;
    valor_bomba:number;
    anticipo:number;

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
              fileName="carta-oferta.pdf"
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