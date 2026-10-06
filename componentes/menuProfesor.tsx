"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const opciones = [
  {
    nombre: "Inicio",
    ruta: "/profesor",
  },
  {
    nombre: "Mi perfil",
    ruta: "/profesor/perfil",
  },
  {
    nombre: "Mis grupos",
    ruta: "/profesor/grupos",
  },
  {
    nombre: "Calificaciones",
    ruta: "/profesor/calificaciones",
  },
];

export default function MenuProfesor() {
  const rutaActual = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        SecureCampus
      </h1>

      <p className="text-sm text-gray-400 mb-6">
        Portal del profesor
      </p>

      <nav className="space-y-3">
        {opciones.map((opcion) => {
          const seleccionada = rutaActual === opcion.ruta;

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
    </aside>
  );
}