"use client";

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

export default function PerfilEstudiante() {
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

  if (!usuario) {
    return (
      <main className="p-10">
        <p className="text-gray-600">
          No se encontró información del usuario.
        </p>
      </main>
    );
  }

  return (
    <main className="p-10">

      <header className="mb-8">
        <p className="text-gray-500">
          Portal del estudiante
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Mi perfil
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta tu información personal.
        </p>
      </header>

      <section className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">

        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-bold">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            {usuario.nombre}
          </h2>

          <p className="text-gray-500">
            Estudiante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Nombre
            </p>

            <p className="font-medium text-gray-900">
              {usuario.nombre}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Correo
            </p>

            <p className="font-medium text-gray-900">
              {usuario.correo}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Rol
            </p>

            <p className="font-medium text-gray-900">
              {usuario.rol}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Estado
            </p>

            <p className="font-medium text-green-600">
              Activo
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}