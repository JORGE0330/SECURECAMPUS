"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
};

function suscribirse(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function obtenerUsuarioGuardado() {
  return localStorage.getItem("usuario");
}

function obtenerUsuarioServidor() {
  return null;
}

export default function PaginaProfesor() {
  const usuarioGuardado = useSyncExternalStore(
    suscribirse,
    obtenerUsuarioGuardado,
    obtenerUsuarioServidor
  );

  const usuario = useMemo<Usuario | null>(() => {
    if (!usuarioGuardado) {
      return null;
    }

    return JSON.parse(usuarioGuardado);
  }, [usuarioGuardado]);

  return (
    <main className="p-10">
      <header className="mb-10">
        <p className="text-gray-500">
          Portal del profesor
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          Bienvenido, {usuario ? usuario.nombre : "Profesor"}
        </h2>

        <p className="text-gray-600 mt-2">
          Consulta tus grupos y administra las calificaciones de tus estudiantes.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          href="/profesor/perfil"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-blue-800">
            Mi perfil
          </h3>

          <p className="text-gray-500">
            Consulta tu información personal.
          </p>
        </Link>

        <Link
          href="/profesor/grupos"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-blue-800">
            Mis grupos
          </h3>

          <p className="text-gray-500">
            Consulta tus grupos asignados y sus estudiantes.
          </p>
        </Link>

        <Link
          href="/profesor/calificaciones"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-blue-800">
            Calificaciones
          </h3>

          <p className="text-gray-500">
            Captura y consulta calificaciones.
          </p>
        </Link>

      </section>
    </main>
  );
}