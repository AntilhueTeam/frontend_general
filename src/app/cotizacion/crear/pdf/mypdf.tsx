

import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

// Definir tipos para las props

interface MyPDFProps {
  data: {
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
    numero_revision: string[];
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
          <Text style={styles.subtitle}>{data.nombre_cliente}</Text>

          {/* Dirección */}
          <Text style={styles.content}>
            {`${data.direccion_especifica_cliente}, ${data.comuna_cliente}`}
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
            {data.nombre_cliente}{"\n"}
            {data.direccion_especifica_cliente}
          </Text>

          {/* Asunto */}
          <Text style={[styles.content, { marginTop: 10 }]}>
            Asunto: {data.asunto_cliente}
          </Text>


          {/* carta */}
          <Text style={[styles.content, { marginTop: 10 }]}>
            Estimado(a) Sr(a) {data.nombre_cliente}{"\n\n\n"}

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
            {`${data.n_referencia} - ${data.asunto_cliente}\n`}
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

      {/* 
    ##########################################################################################    
    PROPUESTA ECONÓMICA
    ##########################################################################################   
    */}

      <Page size="A3" style={styles.page}>
        <View style={styles.section}>

          <View style={styles.header}>
            {/* Logo en la esquina superior izquierda */}
            <Image src="/assets/images/logo.png" style={styles.logo} />
          </View>

          {/* Título principal */}
          <Text style={styles.title}>
            {`Propuesta Económica para Sr(a) ${data.nombre_cliente}, ${data.direccion_especifica_cliente}, ${data.comuna_cliente}, ${data.descripcion_proyecto}.\nRev. ${data.numero_revision} ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </Text>

          {/* Encabezado de Acuerdos */}
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.cell, styles.bold]}>Acuerdos y Condiciones</Text>
          </View>

          {/* Filas dinámicas desde data.acuerdos */}
          {data.acuerdos.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{item}</Text>
            </View>
          ))}

          {/* Encabezado tabla */}
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.cell, styles.bold]}>Descripción del Trabajo</Text>
          </View>


          {/* Filas de contenido */}
          {[
            ["1.0 Movilización y desmovilización", ""],
            ["1.1 Traslado de Equipos y materiales, Instalación y Desinstalación.", ""],
            ["2.0 Perforación", ""],
            [`2.1 Perforación Pozo Profundo mediante roto percusión, con entubación simultánea en acero de ${data.variante_metro} pulgadas de diámetro.`, ""],
            ["3.0 Instalación de cañería de acero", ""],
            [`3.1 Instalación de cañería de acero al carbono, A53 de ${data.variante_metro} pulgadas de diámetro, ${espesor} mm espesor.`, ""],
            ["4.0 Instalación sello", ""],
            ["4.1 Sello Sanitario (Dado de Hormigón)", ""],

          ].map(([desc, price], index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{desc}</Text>

            </View>
          ))}

          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.cell, styles.bold]}>Total del Pago</Text>
          </View>

          {[
            [`5.1 Valor por Metro ${data.variante_metro}”`, data.valor_metro],
            [`5.2 Valor del Servicio de Perforación, en Pozo Profundo de ${data.n_profundidad} Metros`, valorMetroProfundidad],
            [`6.0 ${data.detalle_bomba}`, valorBomba],
            [
              `7.0 Total pozo profundo de ${data.n_profundidad} metros`,
              totalPozo
            ]
          ].map(([desc, price], index) => (
            <View key={index} style={styles.tableRow}>
              style={ }
              <Text style={[styles.cell, { fontWeight: "bold", backgroundColor: "orange" }]} >{desc}</Text>
              <Text style={[styles.cell, styles.alignRight, { fontWeight: "bold", backgroundColor: "orange" }]}>{price}</Text>
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
          {data.direccion_empresa},${data.comuna_cliente}
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
          Por medio del presente documento, Sr(a) {data.nombre_cliente}, cliente adjudica a Antilhue SpA,
          en adelante “Antilhue”, los servicios a ejecutarse en la forma, plazo, términos y condiciones estipuladas
          en la presente Oferta Nº{data.n_referencia} Rev. {data.numero_revision}, presentada por Antilhue con fecha, {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}.
        </Text>

        <Text style={{ fontSize: 12, lineHeight: 1.8, marginBottom: 40 }}>
          El depósito se realizará a la cuenta corriente del Banco de Crédito e Inversiones BCI número
          635 660 44, a nombre de Antilhue SpA, RUT: 76.876.217-1. Enviar comprobante al correo:
          susana.loyola@antilhueing.cl
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
          ))}

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
            src="/assets/images/imagen_pozo_limpia.png"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />

          {/* Inputs estáticos a la izquierda */}
          <Text style={{ position: "absolute", top: 200, left: 40, fontSize: 12 }}>{data.columna_input_cero}</Text>
          <Text style={{ position: "absolute", top: 677, left: 40, fontSize: 12 }}>{data.columna_input_uno}</Text>
          <Text style={{ position: "absolute", top: 750, left: 40, fontSize: 12 }}>{data.columna_input_dos}</Text>
          <Text style={{ position: "absolute", top: 825, left: 40, fontSize: 12 }}>{data.columna_input_tres}</Text>
          <Text style={{ position: "absolute", top: 907, left: 40, fontSize: 12 }}>{data.columna_input_cuatro}</Text>
          <Text style={{ position: "absolute", top: 978, left: 40, fontSize: 12 }}>{data.columna_input_cinco}</Text>

          {/*Inputs de las 7 flechas */}

          {/* Flecha 1 */}
          <View
            style={{
              position: "absolute",
              top: 844,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 340,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 1)?.value}
            </Text>
          </View>

          {/* Flecha 2 */}
          <View
            style={{
              position: "absolute",
              top: 800,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 352,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 2)?.value}
            </Text>
          </View>

          {/* Flecha 3 */}
          <View
            style={{
              position: "absolute",
              top: 725,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 352,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 3)?.value}
            </Text>
          </View>

          {/* Flecha 4 */}
          <View
            style={{
              position: "absolute",
              top: 380,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 352,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 4)?.value}
            </Text>
          </View>

          {/* Flecha 5 */}
          <View
            style={{
              position: "absolute",
              top: 246,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 407,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 5)?.value}
            </Text>
          </View>

          {/* Flecha 6 */}
          <View
            style={{
              position: "absolute",
              top: 228,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 395,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 6)?.value}
            </Text>
          </View>

          {/* Flecha 7 */}
          <View
            style={{
              position: "absolute",
              top: 120,     // <-- Cambia esta posición para mover flecha y texto juntos
              left: 324,    // <-- También puedes mover horizontalmente desde aquí
              flexDirection: "row", // texto a la derecha de la flecha
              alignItems: "center"
            }}
          >
            <Image
              src="/assets/images/flecha.png"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 12 }}>
              {data.flechas?.find(f => f.id === 7)?.value}
            </Text>
          </View>


        </View>
      </Page>
    </Document>
  )
};

export default MyPDF;
