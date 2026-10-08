"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BotonCerrarSesion from "./BotonCerrarSesion";
const opciones = [
  {
    nombre: "Inicio",
    ruta: "/jefe-carrera",
  },
  {
    nombre: "Mi perfil",
    ruta: "/jefe-carrera/perfil",
  },
  {
    nombre: "Profesores",
    ruta: "/jefe-carrera/profesores",
  },
  {
    nombre: "Grupos",
    ruta: "/jefe-carrera/grupos",
  },
  {
    nombre: "Alumnos",
    ruta: "/jefe-carrera/alumnos",
  },
];

export default function MenuJefeCarrera() {
  const rutaActual = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 flex flex-col">

      <h1 className="text-2xl font-bold mb-4">
        SecureCampus
      </h1>

      <p className="text-sm text-gray-400 mb-8">
        Jefe de carrera
      </p>

      <nav className="space-y-3">

        {opciones.map((opcion) => {
          const seleccionada =
            rutaActual === opcion.ruta;

          return (
            <Link
              key={opcion.ruta}
              href={opcion.ruta}
              className={`block rounded-lg px-4 py-3 transition ${
                seleccionada
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              {opcion.nombre}
            </Link>
          );
        })}

      </nav>
      <div className="mt-auto">
        <BotonCerrarSesion />
      </div>
    </aside>
  );
}