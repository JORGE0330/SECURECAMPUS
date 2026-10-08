"use client";

import { FormEvent, useEffect, useState } from "react";

type GrupoAsignado = {
  grupo: {
    id: number;
    nombre: string;
    materia: string;
  };
};

type Estudiante = {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
  gruposComoAlumno: GrupoAsignado[];
};

type Grupo = {
  id: number;
  nombre: string;
  materia: string;

  profesor: {
    id: number;
    nombre: string;
    correo: string;
    activo: boolean;
  };

  _count: {
    estudiantes: number;
  };
};

// =====================================================
// OBTENER ID DEL JEFE DE CARRERA CONECTADO
// =====================================================

function obtenerJefeCarreraId() {
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

export default function AlumnosJefeCarrera() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  const [estudianteId, setEstudianteId] = useState("");
  const [grupoId, setGrupoId] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR ESTUDIANTES
  // =====================================================

  async function cargarEstudiantes() {
    try {
      const respuesta = await fetch("/api/alumnos-jefe");
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje);
        return;
      }

      setEstudiantes(datos);
    } catch {
      setError("No se pudieron cargar los estudiantes");
    }
  }

  // =====================================================
  // CARGAR GRUPOS
  // =====================================================

  async function cargarGrupos() {
    try {
      const respuesta = await fetch("/api/grupos-jefe");
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje);
        return;
      }

      setGrupos(datos);
    } catch {
      setError("No se pudieron cargar los grupos");
    }
  }

  // =====================================================
  // CARGA INICIAL
  // =====================================================

  useEffect(() => {
    let cancelado = false;

    fetch("/api/alumnos-jefe")
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje);
        }

        return datos;
      })
      .then((datos) => {
        if (!cancelado) {
          setEstudiantes(datos);
        }
      })
      .catch((error) => {
        if (!cancelado) {
          setError(error.message);
        }
      });

    fetch("/api/grupos-jefe")
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje);
        }

        return datos;
      })
      .then((datos) => {
        if (!cancelado) {
          setGrupos(datos);
        }
      })
      .catch((error) => {
        if (!cancelado) {
          setError(error.message);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // =====================================================
  // ASIGNAR ESTUDIANTE A GRUPO
  // =====================================================

  async function asignarEstudiante(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    const actorId = obtenerJefeCarreraId();

    try {
      const respuesta = await fetch("/api/alumnos-jefe", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          estudianteId,
          grupoId,
          actorId,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje);
        return;
      }

      setMensaje("Estudiante asignado correctamente");

      setEstudianteId("");
      setGrupoId("");

      await cargarEstudiantes();
      await cargarGrupos();
    } catch {
      setError("No se pudo asignar el estudiante");
    }
  }

  return (
    <main className="p-10">
      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <header className="mb-8">
        <p className="text-gray-500">
          Portal del jefe de carrera
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Alumnos
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta estudiantes y asígnalos a grupos.
        </p>
      </header>

      {/* =================================================
          MENSAJES
      ================================================= */}

      {mensaje && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* =================================================
          FORMULARIO
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Asignar estudiante a un grupo
        </h2>

        <form
          onSubmit={asignarEstudiante}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end"
        >
          {/* ESTUDIANTE */}

          <div>
            <label className="block text-gray-700 mb-2">
              Estudiante
            </label>

            <select
              value={estudianteId}
              onChange={(evento) =>
                setEstudianteId(evento.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
              required
            >
              <option value="">
                Selecciona un estudiante
              </option>

              {estudiantes
                .filter((estudiante) => estudiante.activo)
                .map((estudiante) => (
                  <option
                    key={estudiante.id}
                    value={estudiante.id}
                  >
                    {estudiante.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* GRUPO */}

          <div>
            <label className="block text-gray-700 mb-2">
              Grupo
            </label>

            <select
              value={grupoId}
              onChange={(evento) =>
                setGrupoId(evento.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
              required
            >
              <option value="">
                Selecciona un grupo
              </option>

              {grupos.map((grupo) => (
                <option
                  key={grupo.id}
                  value={grupo.id}
                >
                  {grupo.nombre} - {grupo.materia}
                </option>
              ))}
            </select>
          </div>

          {/* BOTÓN */}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Asignar al grupo
            </button>
          </div>
        </form>
      </section>

      {/* =================================================
          LISTA DE ESTUDIANTES
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
                Estado
              </th>

              <th className="text-left p-4">
                Grupos
              </th>
            </tr>
          </thead>

          <tbody>
            {estudiantes.map((estudiante) => (
              <tr
                key={estudiante.id}
                className="border-t border-gray-200"
              >
                <td className="p-4 font-medium text-gray-900">
                  {estudiante.nombre}
                </td>

                <td className="p-4 text-gray-600">
                  {estudiante.correo}
                </td>

                <td className="p-4">
                  {estudiante.activo ? (
                    <span className="text-green-700 font-medium">
                      Activo
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {estudiante.gruposComoAlumno.length === 0 ? (
                    <span className="text-gray-500">
                      Sin grupos
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {estudiante.gruposComoAlumno.map(
                        (asignacion) => (
                          <span
                            key={asignacion.grupo.id}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {asignacion.grupo.nombre}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}