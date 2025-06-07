

import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import React from "react";


// Definir tipos para las props

interface MyPDFProps {
  data: {
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
};



// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },


  //lista
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    fontSize: 12,
    lineHeight: 1.5,
  },

  //tablas
  table: {
    Display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 12,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 4,
  },
  headerRow: {
    backgroundColor: "#ccc",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  alignRight: {
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    margin: 10,
  },


  //escritura
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 10,
  },
  address: {
    fontSize: 10,
    color: "#555",
  },
  reference: {
    fontSize: 10,
    color: "#555",
    marginTop: 5,
  },
});

function getEspesorPorDiametro(variante: string | number): string {
  const valor = String(variante);
  switch (valor) {
    case '5':
      return '6,5';
    case '6':
      return '6,3';
    case '8':
      return '8,18';
    default:
      return 'N/A'; // o podrías retornar un valor por defecto
  }
}



const MyPDF: React.FC<MyPDFProps> = ({ data }) => {
  const espesor = getEspesorPorDiametro(data.variante_metro);
  const valorMetro = Number(data.valor_metro);
  const profundidad = Number(data.n_profundidad);
  const valorBomba = Number(data.valor_bomba);

  const valorMetroProfundidad = valorMetro * profundidad;
  const totalPozo = valorMetro * profundidad + valorBomba;

  // ─────────── Sumar cada valor de data.resumen_subpuntos ───────────
  const sumaResumenExtras = data.resumen_subpuntos.reduce(
    (acum, item) => acum + item.valor,
    0
  );

  // ──────── Total general: pozo + extras ────────
  const totalGeneral = totalPozo + sumaResumenExtras;

  const baseIndex = data.descripcion_trabajo.length + 1;



  return (

    <Document>


      {/* 
    ##########################################################################################    
    CARTA OFERTA
    ##########################################################################################   
    */}

      <Page size="A3" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          {/* Logo en la esquina superior izquierda */}
          <Image src="/assets/images/logo.png" style={styles.logo} />
          {/* Datos de referencia en la esquina superior derecha */}
          <View style={{ textAlign: "right" }}>


            <Text style={styles.address}>
              {data.nombre_empresa} {"\n"}
              {data.direccion_empresa} {"\n"}
              {data.region_empresa} {" "}
              {data.pais_empresa} {"\n"}
              T: {data.numero_telefono_empresa} {"\n"}
            </Text>
          </View>
        </View>

        {/* Contenido principal */}
        <View>
          {/*Fecha */}
          <Text style={styles.reference}>
            {`${data.region_empresa}, ${new Date().getDate()} de ${[
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ][new Date().getMonth()]} del ${new Date().getFullYear()}`}
          </Text>
          {/* Saludo */}
          <Text style={styles.subtitle}>{"\n"}Señor(a):</Text>
          <Text style={styles.subtitle}>{data.cliente.nombre_cliente}</Text>

          {/* Dirección */}
          <Text style={styles.content}>
            {`${data.cliente.direccion_cliente}, ${data.cliente.comuna_cliente}`}
          </Text>

          {/*N° Referencia mas el numero_revision */}
          <Text style={[styles.content, { marginTop: 20 }]}>
            <Text style={{ fontWeight: "bold" }}>Nº Referencia:</Text>{" "}
            {`${data.n_referencia} Rev. ${data.numero_revision}`}
          </Text>


          {/* Proyecto */}
          <Text style={[styles.content, { marginTop: 20 }]}>
            <Text style={{ fontWeight: "bold" }}>Proyecto:</Text>{" "}
            {data.id_proyecto}{" "}
            {data.cliente.nombre_cliente}{"\n"}
            {data.cliente.direccion_cliente}
          </Text>

          {/* Asunto */}
          <Text style={[styles.content, { marginTop: 10 }]}>
            Asunto: {data.asunto_cliente}
          </Text>


          {/* carta */}
          <Text style={[styles.content, { marginTop: 10 }]}>
            Estimado(a) Sr(a) {data.cliente.nombre_cliente}{"\n\n\n"}

            Junto con saludar y por medio de la presente, se entrega carta oferta económica, considerando
            pozo profundo de {data.n_profundidad} m, con entubación simultánea en acero de {data.variante_metro} pulgadas de diámetro, con
            bomba sumergible, según solicitado.{"\n\n"}

            Ante cualquier consulta agradeceremos comunicarse con Oscar Salas Gac, Gerente de
            operaciones al teléfono +569 7517 1782 o al correo electrónico oscar.salas@antilhueing.cl{"\n\n\n\n"}
            Sin otro particular, saluda atentamente,{"\n\n"}

            <Text style={[styles.title, { marginTop: 10, color: "blue" }]}>
              ANTILHUE SpA{"\n"}
              76.876.217-1{"\n\n"}
            </Text>

            OS/SL{"\n\n\n"}

            cc.: Susana Loyola/ Oscar Salas G.{"\n"}
            {`Adj: ${data.n_referencia} Carta Oferta Rev. ${data.numero_revision}\n`}
            {`${data.n_referencia} Oferta Económica Rev. ${data.numero_revision}\n`}
            {`Requiere Respuesta: ${data.requiere_respuesta ? "Sí" : "No"}\n`}
            
          </Text>


          {/* Descripción */}
          <Text style={[styles.content, { marginTop: 20 }]}>
            {data.asunto_cliente ? (
              <>
                <Text style={{ fontWeight: "bold" }}>Descripción:</Text> {data.asunto_cliente}
              </>
            ) : (
              ' ' // o puedes usar: <Text> </Text>
            )}
          </Text>


        </View>

        {/* Texto inferior izquierdo */}
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: 50,
            fontSize: 10,
            color: "#444",
          }}
        >
          {data.n_referencia} – Envío Carta Oferta
        </Text>
      </Page>


      {/* 
    ##########################################################################################    
    APORTES CLIENTE & ANTILHUE
    ##########################################################################################   
    */}

      <Page size="A3" style={styles.page}>
        <View style={styles.header}>
          <Image src="/assets/images/logo.png" style={styles.logo} />
        </View>

        <View>
          <Text style={{ fontWeight: "bold" }}>Aportes del Cliente: {"\n\n"}</Text>
          <View style={styles.listContainer}>
            {data.aportes_cliente.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                {`${index + 1}. ${item} \n\n`}
              </Text>
            ))}
          </View>

          <Text style={{ fontWeight: "bold" }}>Aportes Antilhue: {"\n\n"}</Text>
          <View style={styles.listContainer}>
            {data.aportes_antilhue.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                {`${index + 1}. ${item} \n\n`}
              </Text>
            ))}
          </View>
        </View>

        {/* Texto inferior izquierdo */}
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: 50,
            fontSize: 10,
            color: "#444",
          }}
        >
          {data.n_referencia} – Envío Carta Oferta
        </Text>
      </Page>

      {/* 
    ##########################################################################################    
    IMÁGENES DEL PROYECTO (REFERENCIALES)
    ##########################################################################################   
    */}

      {data.imagenes?.length > 0 && (
        <Page size="A3" style={styles.page}>
          {/* Header con logo */}
          <View style={styles.header}>
            <Image src="/assets/images/logo.png" style={styles.logo} />
          </View>

          <Text style={[styles.title, { marginBottom: 20 }]}>{data.titulo_imagenes}</Text>

          {/* Contenedor de las imágenes */}
          <View style={{ flexDirection: "column", flexWrap: "wrap", height: "75%" }}>
            {(() => {
              const total = data.imagenes.length;
              const columns = Math.ceil(Math.sqrt(total));
              const rows = Math.ceil(total / columns);
              const imageWidth = `${100 / columns}%`;
              const imageHeight = `${100 / rows}%`;

              return data.imagenes.map((src, index) => (
                <View
                  key={index}
                  style={{
                    width: imageWidth,
                    height: imageHeight,
                    padding: 5
                  }}
                >
                  <Image
                    src={src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </View>
              ));
            })()}
          </View>

          {/* Texto centrado debajo de las imágenes */}
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 11, textAlign: "center" }}>
              {data.descripcion_imagenes}
            </Text>
          </View>

          {/* Texto inferior izquierdo */}
          <Text
            style={{
              position: "absolute",
              bottom: 30,
              left: 50,
              fontSize: 10,
              color: "#444",
            }}
          >
            {data.n_referencia} – Envío Carta Oferta
          </Text>
        </Page>
      )}



{/* ##########################################################################################    
                                PROPUESTA ECONÓMICA
########################################################################################## */}
      <Page size="A3" style={styles.page}>
        <View style={styles.section}>

          <View style={styles.header}>
            {/* Logo en la esquina superior izquierda */}
            <Image src="/assets/images/logo.png" style={styles.logo} />
          </View>

          {/* Título principal */}
          <Text style={styles.title}>
            {`Propuesta Económica para Sr(a) ${data.cliente.nombre_cliente}, ${data.cliente.direccion_cliente}, ${data.cliente.comuna_cliente}, ${data.descripcion_proyecto}.\nRev. ${data.numero_revision} ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </Text>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/*               SECCIÓN: Descripción del Trabajo                     */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <View>
            {/* Título grande de sección */}
            <Text style={[styles.bold, { fontSize: 14, marginBottom: 8 }]}>
              Descripción del Trabajo
            </Text>
          </View>

          {/* Encabezado de tabla */}
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.cell, styles.bold]}>Descripción del Trabajo</Text>
          </View>

          {/* Filas dinámicas: cada punto y sus subpuntos */}
          {data.descripcion_trabajo.map((punto, idxPunto) => (
            <React.Fragment key={punto.id}>
              {/* 1) Fila del “punto principal” */}
              <View style={styles.tableRow}>
                <Text style={styles.cell}>
                  {`${idxPunto + 1}.0 ${punto.titulo}`}
                </Text>
              </View>

              {/* 2) Filas de cada subpunto, con sangría */}
              {punto.subpuntos.map((subTexto, idxSub) => (
                <View key={idxSub} style={styles.tableRow}>
                  <Text
                    style={[
                      styles.cell,
                      { paddingLeft: 20 } // <-- Sangría inline para subpuntos
                    ]}
                  >
                    {`${idxPunto + 1}.${idxSub + 1} ${subTexto}`}
                  </Text>
                </View>
              ))}
            </React.Fragment>
          ))}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/*                 SECCIÓN: Total del Pago                            */}
          {/* ─────────────────────────────────────────────────────────────────── */}

  
          {/* Encabezado de la sección “Total del Pago”, ahora como “X.0 Total del Pago” */}
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.cell, styles.bold]}>
              {`${baseIndex}.0 Total del Pago`}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "orange" }]}>
              {`${baseIndex}.1 Valor por Metro ${data.variante_metro}”`}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.alignRight,
                { fontWeight: "bold", backgroundColor: "orange" },
              ]}
            >
              {data.valor_metro}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "orange" }]}>
              {`${baseIndex}.2 Valor del Servicio de Perforación, en Pozo Profundo de ${data.n_profundidad} Metros`}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.alignRight,
                { fontWeight: "bold", backgroundColor: "orange" },
              ]}
            >
              {valorMetroProfundidad}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "orange" }]}>
              {`${baseIndex}.3 ${data.detalle_bomba}`}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.alignRight,
                { fontWeight: "bold", backgroundColor: "orange" },
              ]}
            >
              {valorBomba}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "orange" }]}>
              {`${baseIndex}.4 Diámetro Ø del Pozo:`}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.alignRight,
                { fontWeight: "bold", backgroundColor: "orange" },
              ]}
            >
              {data.variante_metro}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "orange" }]}>
              {`${baseIndex}.5 Profundidad Estimada del Pozo: ${data.n_profundidad} m`}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.alignRight,
                { fontWeight: "bold", backgroundColor: "orange" },
              ]}
            >
              {data.n_profundidad}
            </Text>
          </View>

          {data.resumen_subpuntos.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "#ffe0b2" }]}>
                {`${baseIndex}.${5 + idx + 1} ${item.descripcion}`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.alignRight,
                  { fontWeight: "bold", backgroundColor: "#ffe0b2" },
                ]}
              >
                {item.valor}
              </Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.cell, styles.bold]}>Total General</Text>
            <Text style={[styles.cell, styles.alignRight, styles.bold]}>
              {totalGeneral}
            </Text>
          </View>



          {/* --- ACUERDOS Y CONDICIONES --- */}
          <View style={[styles.tableRow, styles.headerRow, { marginTop: 5}]}>
            <Text style={[styles.cell, styles.bold]}>Acuerdos y Condiciones</Text>
          </View>
          {data.acuerdos.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{item}</Text>
            </View>
          ))}
          </View>

          {/* Footer con tres textos distribuidos */}
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: 50,
            fontSize: 10,
            color: "#444",
          }}
        >
          {data.direccion_empresa},${data.cliente.comuna_cliente}
        </Text>

        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            fontSize: 10,
            color: "#444",
            textAlign: "center",
            transform: "translateX(-50%)",
          }}
        >
          {data.nombre_empresa}
        </Text>

        <Text
          style={{
            position: "absolute",
            bottom: 30,
            right: 50,
            fontSize: 10,
            color: "#444",
          }}
        >
          Santiago, Chile
        </Text>
      </Page>



      {/* 
    ##########################################################################################    
    ACEPTACIÓN DE LA OFERTA
    ##########################################################################################   
    */}

      <Page size="A3" style={styles.page}>
        {/* Encabezado con logo */}
        <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 20 }}>
          <Image src="/assets/images/logo.png" style={{ width: 100, height: 50 }} />
        </View>

        {/* Línea horizontal */}
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#000",
            marginBottom: 40,
          }}
        />

        {/* Título */}
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 30 }}>
          Anexo 1 — Aceptación de la Oferta
        </Text>

        {/* Párrafo legal */}
        <Text style={{ fontSize: 12, lineHeight: 1.8, marginBottom: 15 }}>
          Por medio del presente documento, Sr(a) {data.cliente.nombre_cliente}, cliente adjudica a Antilhue SpA,
          en adelante “Antilhue”, los servicios a ejecutarse en la forma, plazo, términos y condiciones estipuladas
          en la presente Oferta Nº{data.n_referencia} Rev. {data.numero_revision}, presentada por Antilhue con fecha, {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}.
        </Text>

        {/* Párrafo modificado para usar datos del formulario */}
        <Text style={{ fontSize: 12, lineHeight: 1.8, marginBottom: 40 }}>
          {`El depósito realizarlo a la cuenta ${data.tipo_cuenta}, del ${data.nombre_banco} número ${data.numero_cuenta}, a nombre de Antilhue SpA, RUT: 76.876.217-1. Enviar comprobante al correo: susana.loyola@antilhueing.cl`}
        </Text>

        {/* Campos estáticos */}
        <View style={{ marginTop: 30, gap: 20 }}>
          
          {["Nombre Cliente", "R.U.T:", "Fecha:"].map((label, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 12 }}>{label}</Text>
              <Text
                style={{
                  fontSize: 12,
                  borderBottomWidth: 1,
                  width: "60%",
                  textAlign: "left",
                  paddingBottom: 4, // opcional para separación
                }}
              >

              </Text>
            </View>
          )
          
          )}
          

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 40,
            }}
          >
            <Text style={{ fontSize: 12 }}>Firma Cliente</Text>
            <Text
              style={{
                fontSize: 12,
                borderBottomWidth: 1,
                width: "60%",
                textAlign: "left",
                paddingBottom: 4, // opcional para separación
              }}
            >
              {/* sin texto aquí */}
            </Text>
          </View>
        </View>

        {/* Texto inferior izquierdo */}
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: 50,
            fontSize: 10,
            color: "#444",
          }}
        >
          {data.n_referencia} – Envío Carta Oferta
        </Text>
      </Page>


      {/* 
    ##########################################################################################    
    FIGURA POZO
    ##########################################################################################   
    */}

    <Page size="A3" style={styles.page}>
      <View style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Imagen de fondo */}
        <Image
          src={
            data.tipo_tuberia === "pvc"
              ? "/assets/images/imagen_pozo_limpia_pvc.png"
              : "/assets/images/imagen_pozo_limpia.png"
          }
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />

        {/* Datos */}
        <Text style={{
          fontWeight: "bold", 
          position: "absolute", 
          top: 55, 
          left: 270, 
          fontSize: 12,
          textAlign: "center",
        }}>{data.n_referencia} Rev. {data.numero_revision} {new Date().getDate()} de {[
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ][new Date().getMonth()]} del {new Date().getFullYear()} {data.descripcion_proyecto}{"\n"}
        {data.cliente.nombre_cliente}, {data.cliente.direccion_cliente}, {data.cliente.comuna_cliente}  
        </Text>

        {/* Datos estáticos */}
        <Text style={{ position: "absolute", top: 200, left: 40, fontSize: 12 }}>0.00 m</Text>
        {data.n_profundidad - 12 > 0 && (
          <>
            <Text style={{ position: "absolute", top: 674, left: 40, fontSize: 12 }}>
              {data.n_profundidad - 12}.00 m
            </Text>
            <Text style={{ position: "absolute", top: 747, left: 40, fontSize: 12 }}>
              {data.n_profundidad - 9}.00 m
            </Text>
            <Text style={{ position: "absolute", top: 822, left: 40, fontSize: 12 }}>
              {data.n_profundidad - 6}.00 m
            </Text>
            <Text style={{ position: "absolute", top: 904, left: 40, fontSize: 12 }}>
              {data.n_profundidad - 3}.00 m
            </Text>
            <Text style={{ position: "absolute", top: 975, left: 40, fontSize: 12 }}>
              {data.n_profundidad}.00 m
            </Text>
          </>
        )}

        {/* Flechas específicas para cada tipo de tubería */}
        {data.tipo_tuberia === 'acero' ? (
          <>
            {/* Flecha 1 - Acero */}
            <View style={{ position: "absolute", top: 844, left: 340, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 1)?.value}
              </Text>
            </View>

            {/* Flecha 2 - Acero */}
            <View style={{ position: "absolute", top: 800, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 2)?.value}
              </Text>
            </View>

            {/* Flecha 3 - Acero */}
            <View style={{ position: "absolute", top: 725, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 3)?.value}
              </Text>
            </View>

            {/* Flecha 4 - Acero */}
            <View style={{ position: "absolute", top: 600, left: 336, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 4)?.value}
              </Text>
            </View>

            {/* Flecha 5 - Acero */}
            <View style={{ position: "absolute", top: 380, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 5)?.value}
              </Text>
            </View>

            {/* Flecha 6 - Acero */}
            <View style={{ position: "absolute", top: 245, left: 406, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 6)?.value}
              </Text>
            </View>

            {/* Flecha 7 - Acero (Ajustada) */}
            <View style={{ position: "absolute", top: 226, left: 394, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 7)?.value}
              </Text>
            </View>

            {/* Flecha 8 - Acero (Ajustada) */}
            <View style={{ position: "absolute", top: 116, left: 324, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 8)?.value}
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Flecha 1 - PVC */}
            <View style={{ position: "absolute", top: 888, left: 357, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 1)?.value}
              </Text>
            </View>

            {/* Flecha 2 - PVC */}
            <View style={{ position: "absolute", top: 846, left: 342, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 2)?.value}
              </Text>
            </View>

            {/* Flecha 3 - PVC */}
            <View style={{ position: "absolute", top: 800, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 3)?.value}
              </Text>
            </View>

            {/* Flecha 4 - PVC */}
            <View style={{ position: "absolute", top: 724, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 4)?.value}
              </Text>
            </View>

            {/* Flecha 5 - PVC */}
            <View style={{ position: "absolute", top: 600, left: 338, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 5)?.value}
              </Text>
            </View>

            {/* Flecha 6 - PVC */}
            <View style={{ position: "absolute", top: 400, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 6)?.value}
              </Text>
            </View>

            {/* Flecha 7 - PVC */}
            <View style={{ position: "absolute", top: 245, left: 485, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 7)?.value}
              </Text>
            </View>

            {/* Flecha 8 - PVC */}
            <View style={{ position: "absolute", top: 228, left: 392, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 8)?.value}
              </Text>
            </View>

            {/* Flecha 9 - PVC */}
            <View style={{ position: "absolute", top: 180, left: 352, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 9)?.value}
              </Text>
            </View>

            {/* Flecha 10 - PVC */}
            <View style={{ position: "absolute", top: 140, left: 332, flexDirection: "row", alignItems: "center" }}>
              <Image src="/assets/images/flecha.png" style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 12 }}>
                {data.flechas?.find(f => f.id === 10)?.value}
              </Text>
            </View>
          </>
        )}
      </View>
    </Page>
    </Document>
  )
};

export default MyPDF;
