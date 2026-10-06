"use client";

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

export default function PerfilProfesor() {
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
        <p className="text-gray-500">
          No se encontró información del usuario.
        </p>
      </main>
    );
  }

  return (
    <main className="p-10">

      <header className="mb-8">

        <p className="text-gray-500">
          Portal del profesor
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Mi perfil
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta la información de tu cuenta.
        </p>

      </header>


      <section className="max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm p-8">

        <div className="mb-6">

          <p className="text-sm text-gray-500">
            Nombre
          </p>

          <p className="text-lg font-semibold text-gray-900">
            {usuario.nombre}
          </p>

        </div>


        <div className="mb-6">

          <p className="text-sm text-gray-500">
            Correo electrónico
          </p>

          <p className="text-lg text-gray-900">
            {usuario.correo}
          </p>

        </div>


        <div className="mb-6">

          <p className="text-sm text-gray-500">
            Rol
          </p>

          <span className="inline-block mt-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            Profesor
          </span>

        </div>


        <div>

          <p className="text-sm text-gray-500">
            Estado
          </p>

          <span className="inline-block mt-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Activo
          </span>

        </div>

      </section>

    </main>
  );
}