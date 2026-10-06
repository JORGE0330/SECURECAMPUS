"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
};

type Grupo = {
  id: number;
  nombre: string;
  materia: string;
  _count: {
    estudiantes: number;
  };
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

export default function GruposProfesor() {
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

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario) {
      return;
    }

    async function cargarGrupos() {
      try {
        setCargando(true);

        const respuesta = await fetch(
          `/api/grupos?profesorId=${usuario?.id}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setError(datos.mensaje);
          return;
        }

        setGrupos(datos);
      } catch {
        setError("No se pudieron cargar los grupos");
      } finally {
        setCargando(false);
      }
    }

    cargarGrupos();
  }, [usuario]);

  return (
    <main className="p-10">
      <header className="mb-8">
        <p className="text-gray-500">
          Portal del profesor
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Mis grupos
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta los grupos que tienes asignados.
        </p>
      </header>

      {error && (
        <p className="text-red-600 mb-6">
          {error}
        </p>
      )}

      {cargando && (
        <p className="text-gray-500">
          Cargando grupos...
        </p>
      )}

      {!cargando && grupos.length === 0 && !error && (
        <p className="text-gray-500">
          No tienes grupos asignados.
        </p>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {grupos.map((grupo) => (
          <Link
            key={grupo.id}
            href={`/profesor/grupos/${grupo.id}`}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-blue-700 font-semibold">
              {grupo.nombre}
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-2">
              {grupo.materia}
            </h2>

            <p className="text-gray-500 mt-4">
              Estudiantes inscritos:
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {grupo._count.estudiantes}
            </p>

            <p className="text-blue-700 mt-5 font-medium">
              Ver estudiantes →
            </p>
          </Link>
        ))}

      </section>
    </main>
  );
}