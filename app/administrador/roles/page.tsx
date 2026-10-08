"use client";

import {
  useEffect,
  useState,
} from "react";

type Rol = {
  id: number;
  nombre: string;

  _count: {
    usuarios: number;
  };
};

const permisos: Record<
  string,
  string[]
> = {
  ESTUDIANTE: [
    "Consultar su perfil",
    "Consultar sus calificaciones",
    "Consultar su promedio",
    "Consultar documentos",
    "Crear solicitudes",
  ],

  PROFESOR: [
    "Consultar su perfil",
    "Consultar sus grupos",
    "Ver alumnos inscritos",
    "Registrar calificaciones",
    "Modificar calificaciones",
  ],

  JEFE_CARRERA: [
    "Consultar su perfil",
    "Consultar profesores",
    "Registrar profesores",
    "Activar o desactivar profesores",
    "Crear grupos",
    "Asignar profesores",
    "Asignar alumnos a grupos",
  ],

  ADMINISTRADOR: [
    "Consultar su perfil",
    "Consultar todos los usuarios",
    "Crear usuarios",
    "Asignar roles",
    "Activar o desactivar cuentas",
    "Consultar roles y permisos",
    "Consultar auditoría",
  ],
};

function nombreVisible(
  rol: string
) {
  switch (rol) {
    case "ESTUDIANTE":
      return "Estudiante";

    case "PROFESOR":
      return "Profesor";

    case "JEFE_CARRERA":
      return "Jefe de Carrera";

    case "ADMINISTRADOR":
      return "Administrador";

    default:
      return rol;
  }
}

export default function RolesAdministrador() {
  const [roles, setRoles] =
    useState<Rol[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelado = false;

    fetch(
      "/api/administrador/roles"
    )
      .then(async (respuesta) => {
        const datos =
          await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje
          );
        }

        return datos;
      })

      .then((datos) => {
        if (!cancelado) {
          setRoles(datos);
        }
      })

      .catch((error) => {
        if (!cancelado) {
          setError(
            error.message ||
            "No se pudieron cargar los roles"
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
  }, []);


  if (cargando) {
    return (
      <main className="p-10">
        <p className="text-gray-500">
          Cargando roles...
        </p>
      </main>
    );
  }


  return (
    <main className="p-10">

      <header className="mb-8">

        <p className="text-gray-500">
          Portal del administrador
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Roles y permisos
        </h1>

        <p className="text-gray-600 mt-2">
          Consulta los roles disponibles
          y las funciones asociadas a cada uno.
        </p>

      </header>


      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}


      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {roles.map((rol) => (

          <article
            key={rol.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm text-blue-700 font-semibold">
                  Rol
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  {nombreVisible(
                    rol.nombre
                  )}
                </h2>

              </div>


              <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                {
                  rol._count
                    .usuarios
                }{" "}
                usuario(s)
              </span>

            </div>


            <div className="mt-6">

              <h3 className="font-semibold text-gray-900 mb-3">
                Permisos y funciones
              </h3>


              <ul className="space-y-2">

                {(
                  permisos[
                    rol.nombre
                  ] ?? []
                ).map(
                  (permiso) => (

                    <li
                      key={permiso}
                      className="flex items-start gap-2 text-gray-600"
                    >

                      <span className="text-green-600">
                        ✓
                      </span>

                      <span>
                        {permiso}
                      </span>

                    </li>

                  )
                )}

              </ul>

            </div>


            {rol.nombre ===
              "ADMINISTRADOR" && (

              <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">

                El rol Administrador está
                reservado y no puede asignarse
                desde la creación normal de
                usuarios.

              </div>

            )}

          </article>

        ))}

      </section>

    </main>
  );
}