"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Calificacion = {
  id: number;
  valor: number;
};

type Estudiante = {
  id: number;
  nombre: string;
  correo: string;
  calificacion: Calificacion | null;
};

type Grupo = {
  id: number;
  nombre: string;
  materia: string;
  estudiantes: Estudiante[];
};

// =====================================================
// OBTENER ID DEL PROFESOR CONECTADO
// =====================================================

function obtenerProfesorId() {
  if (typeof window === "undefined") {
    return null;
  }

  const usuarioGuardado = localStorage.getItem("usuario");

  if (!usuarioGuardado) {
    return null;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado);
    return usuario.id ?? null;
  } catch {
    return null;
  }
}

export default function DetalleGrupo() {
  const parametros = useParams();

  const grupoId = Array.isArray(parametros.id)
    ? parametros.id[0]
    : parametros.id;

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR GRUPO Y ESTUDIANTES
  // =====================================================

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/alumnos-grupo?grupoId=${grupoId}`)
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje);
        }

        return datos;
      })
      .then((datos) => {
        if (!cancelado) {
          setGrupo(datos);
        }
      })
      .catch((error) => {
        if (!cancelado) {
          setError(
            error.message ||
              "No se pudo cargar el grupo"
          );
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [grupoId]);

  // =====================================================
  // GUARDAR O MODIFICAR CALIFICACIÓN
  // =====================================================

  async function guardarCalificacion(
    estudiante: Estudiante,
    nuevoValor: number
  ) {
    try {
      const tieneCalificacion =
        estudiante.calificacion !== null;

      const actorId = obtenerProfesorId();

      // Si ya tiene calificación -> PUT
      // Si no tiene -> POST

      const respuesta = await fetch(
        "/api/calificaciones/modificar",
        {
          method: tieneCalificacion
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            tieneCalificacion
              ? {
                  calificacionId:
                    estudiante.calificacion!.id,

                  valor: nuevoValor,

                  actorId,
                }
              : {
                  grupoId: Number(grupoId),

                  estudianteId:
                    estudiante.id,

                  valor: nuevoValor,

                  actorId,
                }
          ),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(datos.mensaje);
        return;
      }

      // =====================================================
      // ACTUALIZAR INFORMACIÓN EN PANTALLA
      // =====================================================

      setGrupo((grupoActual) => {
        if (!grupoActual) {
          return grupoActual;
        }

        return {
          ...grupoActual,

          estudiantes:
            grupoActual.estudiantes.map(
              (alumno) => {
                if (
                  alumno.id ===
                  estudiante.id
                ) {
                  return {
                    ...alumno,

                    calificacion: {
                      id:
                        datos.calificacion
                          .id,

                      valor:
                        nuevoValor,
                    },
                  };
                }

                return alumno;
              }
            ),
        };
      });

      alert(
        tieneCalificacion
          ? "Calificación actualizada correctamente"
          : "Calificación registrada correctamente"
      );
    } catch {
      alert(
        "No se pudo guardar la calificación"
      );
    }
  }

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <main className="p-10">
        <p className="text-gray-500">
          Cargando grupo...
        </p>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="p-10">
        <p className="text-red-600">
          {error}
        </p>
      </main>
    );
  }

  // =====================================================
  // GRUPO NO ENCONTRADO
  // =====================================================

  if (!grupo) {
    return (
      <main className="p-10">
        <p className="text-gray-500">
          No se encontró el grupo.
        </p>
      </main>
    );
  }

  return (
    <main className="p-10">
      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <header className="mb-8">
        <p className="text-blue-700 font-semibold">
          {grupo.nombre}
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          {grupo.materia}
        </h1>

        <p className="text-gray-600 mt-2">
          Captura y modifica las calificaciones
          de los alumnos.
        </p>
      </header>

      {/* =================================================
          TABLA DE ESTUDIANTES
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Alumno
              </th>

              <th className="text-left p-4">
                Correo
              </th>

              <th className="text-left p-4">
                Calificación
              </th>

              <th className="text-left p-4">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {grupo.estudiantes.map(
              (estudiante) => (
                <FilaEstudiante
                  key={estudiante.id}
                  estudiante={estudiante}
                  guardarCalificacion={
                    guardarCalificacion
                  }
                />
              )
            )}
          </tbody>
        </table>

        {grupo.estudiantes.length === 0 && (
          <p className="p-6 text-gray-500">
            No hay estudiantes inscritos
            en este grupo.
          </p>
        )}
      </section>
    </main>
  );
}

// =====================================================
// FILA DE ESTUDIANTE
// =====================================================

function FilaEstudiante({
  estudiante,
  guardarCalificacion,
}: {
  estudiante: Estudiante;

  guardarCalificacion: (
    estudiante: Estudiante,
    valor: number
  ) => void;
}) {
  const [valor, setValor] = useState(
    estudiante.calificacion?.valor ?? 0
  );

  return (
    <tr className="border-t border-gray-200">
      <td className="p-4 font-medium text-gray-900">
        {estudiante.nombre}
      </td>

      <td className="p-4 text-gray-600">
        {estudiante.correo}
      </td>

      <td className="p-4">
        <input
          type="number"
          min="0"
          max="100"
          value={valor}
          onChange={(evento) =>
            setValor(
              Number(evento.target.value)
            )
          }
          className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
        />
      </td>

      <td className="p-4">
        <button
          type="button"
          onClick={() =>
            guardarCalificacion(
              estudiante,
              valor
            )
          }
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {estudiante.calificacion
            ? "Actualizar"
            : "Guardar"}
        </button>
      </td>
    </tr>
  );
}