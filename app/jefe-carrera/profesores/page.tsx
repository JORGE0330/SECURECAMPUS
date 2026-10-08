"use client";

import { FormEvent, useEffect, useState } from "react";

type Profesor = {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
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

export default function ProfesoresJefeCarrera() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // =====================================================
  // CARGAR PROFESORES
  // =====================================================

  async function cargarProfesores() {
    const respuesta = await fetch("/api/profesores");
    const datos = await respuesta.json();

    if (respuesta.ok) {
      setProfesores(datos);
    }
  }

  // =====================================================
  // CARGA INICIAL
  // =====================================================

  useEffect(() => {
    let cancelado = false;

    fetch("/api/profesores")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        if (!cancelado) {
          setProfesores(datos);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // =====================================================
  // REGISTRAR PROFESOR
  // =====================================================

  async function registrarProfesor(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setMensaje("");

    const actorId = obtenerJefeCarreraId();

    const respuesta = await fetch("/api/profesores", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nombre,
        correo,
        password,
        actorId,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(datos.mensaje);
      return;
    }

    setNombre("");
    setCorreo("");
    setPassword("");

    setMensaje("Profesor registrado correctamente");

    setMostrarFormulario(false);

    await cargarProfesores();
  }

  // =====================================================
  // ACTIVAR / DESACTIVAR PROFESOR
  // =====================================================

  async function cambiarEstado(profesor: Profesor) {
    const actorId = obtenerJefeCarreraId();

    const respuesta = await fetch("/api/profesores", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        profesorId: profesor.id,
        activo: !profesor.activo,
        actorId,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje);
      return;
    }

    await cargarProfesores();
  }

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
            Profesores
          </h1>

          <p className="text-gray-600 mt-2">
            Consulta y administra los profesores registrados.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
          className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          + Registrar profesor
        </button>
      </header>

      {/* =================================================
          FORMULARIO
      ================================================= */}

      {mostrarFormulario && (
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Nuevo profesor
          </h2>

          <form
            onSubmit={registrarProfesor}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* NOMBRE */}

            <div>
              <label className="block mb-2 text-gray-700">
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(evento) =>
                  setNombre(evento.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
            </div>

            {/* CORREO */}

            <div>
              <label className="block mb-2 text-gray-700">
                Correo
              </label>

              <input
                type="email"
                value={correo}
                onChange={(evento) =>
                  setCorreo(evento.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
            </div>

            {/* CONTRASEÑA */}

            <div>
              <label className="block mb-2 text-gray-700">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(evento) =>
                  setPassword(evento.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
            </div>

            {/* BOTÓN */}

            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800"
              >
                Guardar profesor
              </button>
            </div>
          </form>

          {mensaje && (
            <p className="mt-4 text-blue-700">
              {mensaje}
            </p>
          )}
        </section>
      )}

      {/* =================================================
          TABLA DE PROFESORES
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Nombre
              </th>

              <th className="text-left p-4">
                Correo
              </th>

              <th className="text-left p-4">
                Estado
              </th>

              <th className="text-left p-4">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {profesores.map((profesor) => (
              <tr
                key={profesor.id}
                className="border-t border-gray-200"
              >
                <td className="p-4 font-medium text-gray-900">
                  {profesor.nombre}
                </td>

                <td className="p-4 text-gray-600">
                  {profesor.correo}
                </td>

                <td className="p-4">
                  {profesor.activo ? (
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
                  <button
                    type="button"
                    onClick={() =>
                      cambiarEstado(profesor)
                    }
                    className={
                      profesor.activo
                        ? "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        : "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    }
                  >
                    {profesor.activo
                      ? "Dar de baja"
                      : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}