"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type UsuarioLocal = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  avatar?: string | null;
};

type Avatar = {
  id: string;
  icono: string;
  nombre: string;
};

const avatares: Avatar[] = [
  {
    id: "avatar1",
    icono: "👤",
    nombre: "Clásico",
  },
  {
    id: "avatar2",
    icono: "🧑‍💼",
    nombre: "Profesional",
  },
  {
    id: "avatar3",
    icono: "🛡️",
    nombre: "Seguridad",
  },
  {
    id: "avatar4",
    icono: "💻",
    nombre: "Tecnología",
  },
  {
    id: "avatar5",
    icono: "⭐",
    nombre: "Destacado",
  },
];

// =====================================================
// LOCAL STORAGE
// =====================================================

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

export default function PerfilAdministrador() {
  const usuarioGuardado = useSyncExternalStore(
    suscribirse,
    obtenerUsuarioGuardado,
    obtenerUsuarioServidor
  );

  const usuario = useMemo<UsuarioLocal | null>(() => {
    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch {
      return null;
    }
  }, [usuarioGuardado]);

  const [avatar, setAvatar] = useState("avatar1");
  const [mostrarAvatares, setMostrarAvatares] =
    useState(false);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // OBTENER AVATAR ACTUAL DE LA BASE DE DATOS
  // =====================================================

  useEffect(() => {
    if (!usuario?.id) {
      return;
    }

    let cancelado = false;

    fetch(
      `/api/administrador/perfil?usuarioId=${usuario.id}`
    )
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje);
        }

        return datos;
      })
      .then((datos) => {
        if (!cancelado) {
          setAvatar(datos.avatar ?? "avatar1");
        }
      })
      .catch((error) => {
        if (!cancelado) {
          setError(
            error.message ||
              "No se pudo cargar el perfil"
          );
        }
      });

    return () => {
      cancelado = true;
    };
  }, [usuario?.id]);

  // =====================================================
  // CAMBIAR AVATAR
  // =====================================================

  async function cambiarAvatar(
    nuevoAvatar: string
  ) {
    if (!usuario) {
      return;
    }

    setGuardando(true);
    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        "/api/administrador/perfil",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            usuarioId: usuario.id,
            avatar: nuevoAvatar,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje);
        return;
      }

      setAvatar(nuevoAvatar);
      setMostrarAvatares(false);

      setMensaje(
        "Avatar actualizado correctamente"
      );

      // También actualizamos la copia local
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          ...usuario,
          avatar: nuevoAvatar,
        })
      );
    } catch {
      setError(
        "No se pudo actualizar el avatar"
      );
    } finally {
      setGuardando(false);
    }
  }

  // =====================================================
  // AVATAR SELECCIONADO
  // =====================================================

  const avatarActual =
    avatares.find(
      (opcion) => opcion.id === avatar
    ) ?? avatares[0];

  // =====================================================
  // SIN USUARIO
  // =====================================================

  if (!usuario) {
    return (
      <main className="p-10">
        <p className="text-red-600">
          No se encontró información del usuario.
        </p>
      </main>
    );
  }

  return (
    <main className="p-10 w-full max-w-full">
      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <header className="mb-8">
        <p className="text-gray-500">
          Portal del administrador
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Mi perfil
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta la información de tu cuenta y
          personaliza tu avatar.
        </p>
      </header>

      {/* =================================================
          MENSAJES
      ================================================= */}

      {mensaje && (
        <div className="mb-6 max-w-3xl bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-6 max-w-3xl bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* =================================================
          PERFIL
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
          {/* AVATAR */}

          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white shadow-md">
            <span className="text-4xl">
              {avatarActual.icono}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {usuario.nombre}
            </h2>

            <p className="text-gray-500">
              Administrador de SecureCampus
            </p>

            <button
              type="button"
              onClick={() => {
                setMostrarAvatares(
                  !mostrarAvatares
                );

                setMensaje("");
                setError("");
              }}
              className="mt-3 text-blue-700 font-medium hover:text-blue-900"
            >
              Cambiar avatar
            </button>
          </div>
        </div>

        {/* =================================================
            SELECTOR DE AVATAR
        ================================================= */}

        {mostrarAvatares && (
          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              Selecciona un avatar
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {avatares.map((opcion) => {
                const seleccionado =
                  avatar === opcion.id;

                return (
                  <button
                    key={opcion.id}
                    type="button"
                    disabled={guardando}
                    onClick={() =>
                      cambiarAvatar(opcion.id)
                    }
                    className={`p-4 rounded-xl border transition ${
                      seleccionado
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 bg-white hover:border-blue-400"
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-3xl">
                        {opcion.icono}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {opcion.nombre}
                    </p>

                    {seleccionado && (
                      <p className="text-xs text-blue-700 mt-1">
                        Actual
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {guardando && (
              <p className="text-sm text-gray-500 mt-4">
                Guardando avatar...
              </p>
            )}
          </div>
        )}

        {/* =================================================
            INFORMACIÓN
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Nombre completo
            </p>

            <p className="font-medium text-gray-900">
              {usuario.nombre}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Correo electrónico
            </p>

            <p className="font-medium text-gray-900">
              {usuario.correo}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Rol
            </p>

            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              Administrador
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Estado
            </p>

            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Activo
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          AVISO
      ================================================= */}

      <section className="mt-6 max-w-3xl bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-blue-800">
          Puedes personalizar tu avatar. Los demás
          datos del perfil son únicamente de consulta.
        </p>
      </section>
    </main>
  );
}