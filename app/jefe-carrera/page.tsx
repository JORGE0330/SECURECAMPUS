"use client";

import Link from "next/link";
import {
  useMemo,
  useSyncExternalStore,
} from "react";

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

export default function PaginaJefeCarrera() {
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
          Portal del jefe de carrera
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido,{" "}
          {usuario
            ? usuario.nombre
            : "Jefe de Carrera"}
        </h1>

        <p className="text-gray-600 mt-2">
          Administra profesores, grupos y alumnos.
        </p>

      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Link
          href="/jefe-carrera/perfil"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Mi perfil
          </h2>

          <p className="text-gray-500">
            Consulta tu información personal.
          </p>
        </Link>

        <Link
          href="/jefe-carrera/profesores"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Profesores
          </h2>

          <p className="text-gray-500">
            Consulta, registra y administra profesores.
          </p>
        </Link>

        <Link
          href="/jefe-carrera/grupos"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Grupos
          </h2>

          <p className="text-gray-500">
            Consulta y crea grupos académicos.
          </p>
        </Link>

        <Link
          href="/jefe-carrera/alumnos"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Alumnos
          </h2>

          <p className="text-gray-500">
            Consulta alumnos y asígnalos a grupos.
          </p>
        </Link>

      </section>

    </main>
  );
}