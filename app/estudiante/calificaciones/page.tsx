"use client";

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

type Calificacion = {
  id: number;
  valor: number;
  creadoEn: string;
  grupo: {
    nombre: string;
    materia: string;
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

export default function CalificacionesEstudiante() {
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

  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    async function cargarCalificaciones() {
      try {
        setCargando(true);

        const respuesta = await fetch(
          `/api/calificaciones?estudianteId=${usuario?.id}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setError(datos.mensaje);
          return;
        }

        setCalificaciones(datos);
      } catch {
        setError("No se pudieron cargar las calificaciones");
      } finally {
        setCargando(false);
      }
    }

    cargarCalificaciones();
  }, [usuario]);

  const promedio =
    calificaciones.length > 0
      ? calificaciones.reduce(
          (total, calificacion) => total + calificacion.valor,
          0
        ) / calificaciones.length
      : 0;

  return (
    <main className="p-10">

      <header className="mb-8">
        <p className="text-gray-500">
          Portal del estudiante
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Mis calificaciones
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta tus resultados académicos.
        </p>
      </header>

      <section className="mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xs">

          <p className="text-gray-500 font-semibold">
            Promedio general
          </p>

          <p className="text-3xl font-bold text-blue-800 mt-2">
            {promedio.toFixed(1)}
          </p>

        </div>
      </section>

      {error && (
        <p className="text-red-600 mb-5">
          {error}
        </p>
      )}

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 text-black">
                Materia
              </th>

              <th className="text-left p-4 text-black">
                Grupo
              </th>

              <th className="text-left p-4 text-black">
                Calificación
              </th>
            </tr>
          </thead>

          <tbody>

            {calificaciones.map((calificacion) => (
              <tr
                key={calificacion.id}
                className="border-t border-gray-200"
              >
                <td className="p-4 text-gray-700">
                  {calificacion.grupo.materia}
                </td>

                <td className="p-4 text-gray-700">
                  {calificacion.grupo.nombre}
                </td>

                <td className="p-4 font-semibold text-gray-700">
                  {calificacion.valor}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

        {cargando && (
          <p className="p-6 text-gray-500">
            Cargando calificaciones...
          </p>
        )}

        {!cargando && calificaciones.length === 0 && !error && (
          <p className="p-6 text-gray-500">
            No hay calificaciones disponibles.
          </p>
        )}

      </section>

    </main>
  );
}