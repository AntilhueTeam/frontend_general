

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
    aportes_cliente: string[];
    aportes_antilhue: string[];
    imagenes: string[]; // base64 strings
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

// const aportesCliente = [
//   "Aporte 1: Descripción del primer aporte.",
//   "Aporte 2: Descripción del segundo aporte.",
//   "Aporte 3: Descripción del tercer aporte.",
// ];

{/*pagina 1 */ }
const MyPDF: React.FC<MyPDFProps> = ({ data }) => (

  <Document>
    <Page size="A3" style={styles.page}>
      {/* Header con logo */}
      <View style={styles.header}>
        {/* Logo en la esquina superior izquierda */}
        <Image src="/assets/images/logo.png" style={styles.logo} />
        {/* Datos de referencia en la esquina superior derecha */}
        <View style={{ textAlign: "right" }}>


          <Text style={styles.address}>
            Antilhue SPA {"\n"}
            Las Flores,{"\n"}
            Frutillar Alto{"\n"}
            Reg. de Los Lagos,{"\n"}
            Chile.{"\n"}
            T: 975171782{"\n"}
          </Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View>
        {/*Fecha */}
        <Text style={styles.reference}>Frutillar, 25 de Marzo del 2025</Text>
        {/* Saludo */}
        <Text style={styles.subtitle}>{"\n"}Señor(a):</Text>
        <Text style={styles.subtitle}>{data.nombre_cliente}</Text>

        {/* Dirección */}
        <Text style={styles.content}>
          Calbuco, Comité Puweichafe
        </Text>

        {/* Referencia */}
        <Text style={[styles.content, { marginTop: 20 }]}>
          <Text style={{ fontWeight: "bold" }}>Nº Referencia:</Text> 25.850.01 Rev. B
        </Text>


        {/* Proyecto */}
        <Text style={[styles.content, { marginTop: 20 }]}>
          <Text style={{ fontWeight: "bold" }}>Proyecto:</Text> Perforación y habilitación pozo profundo, Carelin Escobar,{"\n"}
          Calbuco, Comité Puweichafe.
        </Text>

        {/* Asunto */}
        <Text style={[styles.content, { marginTop: 10 }]}>
          Asunto: Entrega Carta Oferta
        </Text>


        {/* carta */}
        <Text style={[styles.content, { marginTop: 10 }]}>
          Estimado(a) Sr(a) {data.nombre_cliente}{"\n\n\n"}

          Junto con saludar y por medio de la presente, se entrega carta oferta económica, considerando
          pozo profundo de 48 m, con entubación simultánea en acero de 6 pulgadas de diámetro, con
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
          Adj: 25.850.01 Carta Oferta Rev. B{"\n"}
          25.850.01 Oferta Económica Rev. B{"\n"}
          Requiere Respuesta: Si {"\n"}
        </Text>

        {/* Descripción */}
        <Text style={[styles.content, { marginTop: 20 }]}>
          <Text style={{ fontWeight: "bold" }}>Descripción:</Text> {data.asunto_cliente}
        </Text>
      </View>
    </Page>

    {/*pagina 2*/}
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
    </Page>

    {data.imagenes?.length > 0 && (
    <Page size="A3" style={styles.page}>
      <Text style={styles.title}> Imágenes del Proyecto</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {data.imagenes.map((src, index) => (
          <Image
            key={index}
            src={src}
            style={{ width: 200, height: 150, margin: 5 }}
          />
        ))}
      </View>
    </Page>
  )}

    <Page size="A3" style={styles.page}>
      <View style={styles.section}>

        <View style={styles.header}>
          {/* Logo en la esquina superior izquierda */}
          <Image src="/assets/images/logo.png" style={styles.logo} />
        </View>

        {/* Título principal */}
        <Text style={styles.title}>
          Propuesta Económica para Sr(a) Carelin Escobar, Calbuco, Comité Puweichafe. Servicio de perforación y habilitación de pozo profundo 6" Rev. B  marzo 25 de 2025.
        </Text>

        {/* Encabezado tabla */}
        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={[styles.cell, styles.bold]}>Descripción del Trabajo</Text>
        </View>

        {/* Filas de contenido */}
        {[
          ["1.0 Movilización y desmovilización", ""],
          ["1.1 Traslado de Equipos y materiales, Instalación y Desinstalación.", ""],
          ["2.0 Perforación", ""],
          ["2.1 Perforación Pozo Profundo mediante roto percusión, con entubación simultánea en acero de 6 pulgadas de diámetro.", ""],
          ["3.0 Instalación de cañería de acero", ""],
          ["3.1 Instalación de cañería de acero al carbono, A53 de 6 pulgadas de diámetro, 6,3 mm espesor.", ""],
          ["4.0 Instalación sello", ""],
          ["4.1 Sello Sanitario (Dado de Hormigón)", ""],

        ].map(([desc, price], index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{desc}</Text>
            <Text style={[styles.cell, styles.alignRight]}>{price}</Text>
          </View>
        ))}

        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={[styles.cell, styles.bold]}>Total del Pago</Text>
        </View>

        {[
          ["5.1 Valor por Metro 6 ”", "$185.000"],
          ["5.2 Valor del Servicio de Perforación, en Pozo Profundo de 48 Metros", "$8.880.000"],
          ["6.0 Bomba 2.0 HP...", "$990.000"],
          ["7.0 Total pozo profundo de 48 m...", "$9.870.000"]
        ].map(([desc, price], index) => (
          <View key={index} style={styles.tableRow}>
            style={}
            <Text style={[styles.cell, { fontWeight: "bold", backgroundColor:"orange"}]} >{desc}</Text>
            <Text style={[styles.cell, styles.alignRight,{ fontWeight: "bold", backgroundColor:"orange"}]}>{price}</Text>
          </View>
        ))}

      </View>
    </Page>

    <Page size="A3" style={styles.page}>
      <View style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Imagen de fondo */}
        <Image
          src="/assets/images/imagen_final.png" 
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />

        {/* Texto 1 */}
        <Text
          style={{
            position: "absolute",
            // Ajustar estos valores para cambiar posicion
            top: 150, 
            left: 30, 
            fontSize: 12,
            fontWeight: "bold",
            color: "black",
          }}
        >
          HOLAholaHOLA
        </Text>

        {/* Texto 2 */}
        <Text
          style={{
            position: "absolute",
            // Ajustar estos valores para cambiar posicion
            top: 975, 
            left: 30, 
            fontSize: 12,
            color: "red",
          }}
        >
          un ejemplo 1
        </Text>

        {/* Texto 2 */}
        <Text
          style={{
            position: "absolute",
            // Ajustar estos valores para cambiar posicion
            top: 1050, 
            left: 30, 
            fontSize: 12,
            color: "blue",
          }}
        >
          un ejemplo 2
        </Text>

        {/* Texto 2 */}
        <Text
          style={{
            position: "absolute",
            // Ajustar estos valores para cambiar posicion
            top: 875, 
            left: 30, 
            fontSize: 12,
            color: "blue",
          }}
        >
          un ejemplo 3
        </Text>

        
      </View>
    </Page>
  </Document>
);

export default MyPDF;
