"use client"
import dynamic from "next/dynamic";

// Este truco es necesario para evitar que el SSR rompa
const PDFApp = dynamic(() => import("./PDFApp"), { ssr: false });

export default function PDFPage() {
  return <PDFApp />;
}