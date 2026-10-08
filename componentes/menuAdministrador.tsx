"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BotonCerrarSesion from "./BotonCerrarSesion";

const opciones = [
  {
    nombre: "Inicio",
    ruta: "/administrador",
  },
  {
    nombre: "Mi perfil",
    ruta: "/administrador/perfil",
  },
  {
    nombre: "Usuarios",
    ruta: "/administrador/usuarios",
  },
  {
    nombre: "Roles y permisos",
    ruta: "/administrador/roles",
  },
  {
    nombre: "Auditoría",
    ruta: "/administrador/auditoria",
  },
];

export default function MenuAdministrador() {
  const rutaActual = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 flex flex-col">

      <h1 className="text-2xl font-bold mb-4">
        SecureCampus
      </h1>

      <p className="text-sm text-gray-400 mb-8">
        Administrador
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

      <div className="mt-auto pt-6">
        <BotonCerrarSesion />
      </div>

    </aside>
  );
}