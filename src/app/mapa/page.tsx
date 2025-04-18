"use client"; 

import dynamic from 'next/dynamic'; 

// Carga el componente Mapa dinámicamente y deshabilita SSR
const Mapa = dynamic(() => import('./components/mapa'), { ssr: false });

function MapaDashboard() {
  return (
    <div style={{ height: '100vh' }}>

      <Mapa />
    </div>
  );
}

export default MapaDashboard;