// src/app/cotizacion/crear/pdf/subir/page.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfExtractorPage: React.FC = () => {
  const [extractedText, setExtractedText] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setExtractedText("");
    setParsedData(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(" ") + "\n\n";
        }

        setExtractedText(text);
        setParsedData(parsePdfText(text));
      } catch (err) {
        console.error(err);
        setExtractedText("Error procesando el PDF.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const parsePdfText = (text: string) => {
    const cleanedText = text.replace(/\s+/g, " ").trim();

    const match = (regex: RegExp): string => {
      const found = cleanedText.match(regex);
      return found ? found[1].trim() : "";
    };

    return {
      nombre_cliente: match(/Señor \(a\)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/),
      direccion_especifica_cliente: match(/Señor \(a\).*?\s{2,}(.*?)\s{2,}/),
      comuna_cliente: "Puerto Montt", // puede ajustarse si se encuentra de forma dinámica
      nombre_empresa: "Antilhue SPA",
      direccion_empresa: match(/Antilhue SPA\s+(.*?)\s+\bSantiago\b/i),
      region_empresa: "Región Metropolitana", // puede ajustarse si se encuentra de forma dinámica
      pais_empresa: "Chile",
      numero_telefono_empresa: match(/T\s([\d\s]+)/),
      n_referencia: match(/Nº Referencia:\s+(.*?)\s+Proyecto:/),
      id_proyecto: match(/Proyecto:\s+(.*?)\s+Asunto:/),
      asunto_cliente: match(/Asunto:\s+(.*?)\s+Estimado/i),
      descripcion_proyecto: match(/presente, se entrega (.*?)\./i),
      id_documento: match(/Oferta N°\s+(.*?)\s+Rev/i),
    };
  };

  return (
    <Container maxWidth={false} sx={{ py: 6, bgcolor: "white" }}>
      <Typography variant="h4" color="black" gutterBottom>
        Subir PDF y extraer texto
      </Typography>

      <Button variant="contained" component="label">
        Seleccionar PDF
        <input
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileChange}
        />
      </Button>

      {loading && (
        <Box mt={4} display="flex" alignItems="center">
          <CircularProgress size={24} />
          <Typography ml={2}>Procesando...</Typography>
        </Box>
      )}

      {!loading && extractedText && (
        <>
          <TextField
            label="Texto extraído"
            multiline
            fullWidth
            rows={10}
            margin="normal"
            value={extractedText}
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="Datos estructurados"
            multiline
            fullWidth
            rows={14}
            margin="normal"
            value={JSON.stringify(parsedData, null, 2)}
            InputProps={{ readOnly: true }}
          />
        </>
      )}
    </Container>
  );
};

export default PdfExtractorPage;
