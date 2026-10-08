"use client";

import { useEffect, useState } from "react";

type Profesor = {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
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

export default function GruposJefeCarrera() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  const [nombre, setNombre] = useState("");
  const [materia, setMateria] = useState("");
  const [profesorId, setProfesorId] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

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

    fetch("/api/profesores")
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron cargar los profesores"
          );
        }

        return datos;
      })
      .then((datos) => {
        if (!cancelado) {
          setProfesores(datos);
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
  // CREAR GRUPO
  // =====================================================

  async function crearGrupo(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    const actorId = obtenerJefeCarreraId();

    try {
      const respuesta = await fetch("/api/grupos-jefe", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nombre,
          materia,
          profesorId,
          actorId,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje);
        return;
      }

      setNombre("");
      setMateria("");
      setProfesorId("");

      setMostrarFormulario(false);

      setMensaje("Grupo creado correctamente");

      await cargarGrupos();
    } catch {
      setError("No se pudo crear el grupo");
    }
  }

  const profesoresActivos = profesores.filter(
    (profesor) => profesor.activo
  );

  return (
    <main className="p-10">
      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-gray-500">
            Portal del jefe de carrera
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Grupos
          </h1>

          <p className="text-gray-600 mt-2">
            Consulta los grupos y asigna profesores.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
          className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          + Crear grupo
        </button>
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

      {mostrarFormulario && (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Crear nuevo grupo
          </h2>

          <form
            onSubmit={crearGrupo}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* NOMBRE */}

            <div>
              <label className="block text-gray-700 mb-2">
                Nombre del grupo
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(evento) =>
                  setNombre(evento.target.value)
                }
                placeholder="Ej. DS-02"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
            </div>

            {/* MATERIA */}

            <div>
              <label className="block text-gray-700 mb-2">
                Materia
              </label>

              <input
                type="text"
                value={materia}
                onChange={(evento) =>
                  setMateria(evento.target.value)
                }
                placeholder="Ej. Desarrollo Seguro"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
            </div>

            {/* PROFESOR */}

            <div>
              <label className="block text-gray-700 mb-2">
                Profesor
              </label>

              <select
                value={profesorId}
                onChange={(evento) =>
                  setProfesorId(evento.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                required
              >
                <option value="">
                  Selecciona un profesor
                </option>

                {profesoresActivos.map((profesor) => (
                  <option
                    key={profesor.id}
                    value={profesor.id}
                  >
                    {profesor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* BOTONES */}

            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800"
              >
                Crear grupo
              </button>

              <button
                type="button"
                onClick={() =>
                  setMostrarFormulario(false)
                }
                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          GRUPOS
      ================================================= */}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {grupos.map((grupo) => (
          <article
            key={grupo.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <p className="text-blue-700 font-semibold">
              {grupo.nombre}
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-2">
              {grupo.materia}
            </h2>

            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Profesor asignado
              </p>

              <p className="font-medium text-gray-900">
                {grupo.profesor.nombre}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Estudiantes inscritos
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {grupo._count.estudiantes}
              </p>
            </div>
          </article>
        ))}
      </section>

      {grupos.length === 0 && (
        <p className="text-gray-500">
          No hay grupos registrados.
        </p>
      )}
    </main>
  );
}