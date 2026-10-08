"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

type Rol = {
    id: number;
    nombre: string;
};

type Usuario = {
    id: number;
    nombre: string;
    correo: string;
    activo: boolean;
    rol: Rol;
};

export default function UsuariosAdministrador() {
    const [usuarios, setUsuarios] =
        useState<Usuario[]>([]);

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [nombre, setNombre] =
        useState("");

    const [correo, setCorreo] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [rol, setRol] =
        useState("ESTUDIANTE");

    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");


    async function cargarUsuarios() {
        try {
            const respuesta = await fetch(
                "/api/administrador/usuarios"
            );

            const datos =
                await respuesta.json();

            if (!respuesta.ok) {
                setError(datos.mensaje);
                return;
            }

            setUsuarios(datos);

        } catch {
            setError(
                "No se pudieron cargar los usuarios"
            );
        }
    }


    useEffect(() => {
        fetch("/api/administrador/usuarios")
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
                setUsuarios(datos);
            })

            .catch((error) => {
                setError(error.message);
            });

    }, []);


    async function crearUsuario(
        evento: FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        setMensaje("");
        setError("");


        try {
            const respuesta = await fetch(
                "/api/administrador/usuarios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        nombre,
                        correo,
                        password,
                        rol,
                    }),
                }
            );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {
                setError(datos.mensaje);
                return;
            }


            setNombre("");
            setCorreo("");
            setPassword("");
            setRol("ESTUDIANTE");

            setMostrarFormulario(false);

            setMensaje(
                "Usuario creado correctamente"
            );

            await cargarUsuarios();

        } catch {
            setError(
                "No se pudo crear el usuario"
            );
        }
    }


    async function cambiarEstado(
        usuario: Usuario
    ) {
        setMensaje("");
        setError("");

        try {
            const respuesta = await fetch(
                "/api/administrador/usuarios",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        usuarioId: usuario.id,
                        activo: !usuario.activo,
                    }),
                }
            );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {
                setError(datos.mensaje);
                return;
            }


            setMensaje(
                usuario.activo
                    ? "Usuario desactivado correctamente"
                    : "Usuario activado correctamente"
            );


            await cargarUsuarios();

        } catch {
            setError(
                "No se pudo cambiar el estado"
            );
        }
    }


    async function cambiarRol(
        usuarioId: number,
        nuevoRol: string
    ) {
        setMensaje("");
        setError("");


        try {
            const respuesta = await fetch(
                "/api/administrador/usuarios",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        usuarioId,
                        rol: nuevoRol,
                    }),
                }
            );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {
                setError(datos.mensaje);
                return;
            }


            setMensaje(
                "Rol actualizado correctamente"
            );


            await cargarUsuarios();

        } catch {
            setError(
                "No se pudo cambiar el rol"
            );
        }
    }


    return (
        <main className="p-10">

            <header className="mb-8 flex items-center justify-between">

                <div>

                    <p className="text-gray-500">
                        Portal del administrador
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Usuarios
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Administra las cuentas y roles
                        de SecureCampus.
                    </p>

                </div>


                <button
                    type="button"

                    onClick={() => {
                        setMostrarFormulario(
                            !mostrarFormulario
                        );

                        setMensaje("");
                        setError("");
                    }}

                    className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition"
                >
                    + Crear usuario
                </button>

            </header>


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


            {mostrarFormulario && (

                <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">

                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Crear nuevo usuario
                    </h2>


                    <form
                        onSubmit={crearUsuario}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
                    >

                        <div>

                            <label className="block text-gray-700 mb-2">
                                Nombre
                            </label>

                            <input
                                type="text"
                                value={nombre}

                                onChange={(evento) =>
                                    setNombre(
                                        evento.target.value
                                    )
                                }

                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"

                                required
                            />

                        </div>


                        <div>

                            <label className="block text-gray-700 mb-2">
                                Correo
                            </label>

                            <input
                                type="email"
                                value={correo}

                                onChange={(evento) =>
                                    setCorreo(
                                        evento.target.value
                                    )
                                }

                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"

                                required
                            />

                        </div>


                        <div>

                            <label className="block text-gray-700 mb-2">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                value={password}

                                onChange={(evento) =>
                                    setPassword(
                                        evento.target.value
                                    )
                                }

                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"

                                required
                            />

                        </div>


                        <div>

                            <label className="block text-gray-700 mb-2">
                                Rol
                            </label>

                            <select
                                value={rol}

                                onChange={(evento) =>
                                    setRol(
                                        evento.target.value
                                    )
                                }

                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                            >

                                <option value="ESTUDIANTE">
                                    Estudiante
                                </option>

                                <option value="PROFESOR">
                                    Profesor
                                </option>

                                <option value="JEFE_CARRERA">
                                    Jefe de Carrera
                                </option>

                            </select>

                        </div>


                        <div className="md:col-span-2 xl:col-span-4 flex gap-3">

                            <button
                                type="submit"
                                className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800"
                            >
                                Guardar usuario
                            </button>


                            <button
                                type="button"

                                onClick={() =>
                                    setMostrarFormulario(
                                        false
                                    )
                                }

                                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300"
                            >
                                Cancelar
                            </button>

                        </div>

                    </form>

                </section>

            )}


            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

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
                                    Rol
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

                            {usuarios.map(
                                (usuario) => {

                                    const esAdministrador =
                                        usuario.rol.nombre ===
                                        "ADMINISTRADOR";


                                    return (
                                        <tr
                                            key={usuario.id}
                                            className="border-t border-gray-200"
                                        >

                                            <td className="p-4 font-medium text-gray-900">
                                                {usuario.nombre}
                                            </td>


                                            <td className="p-4 text-gray-600">
                                                {usuario.correo}
                                            </td>


                                            <td className="p-4">

                                                {esAdministrador ? (

                                                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                                                        Administrador
                                                    </span>

                                                ) : (

                                                    <select
                                                        value={
                                                            usuario
                                                                .rol
                                                                .nombre
                                                        }

                                                        onChange={(
                                                            evento
                                                        ) =>
                                                            cambiarRol(
                                                                usuario.id,
                                                                evento
                                                                    .target
                                                                    .value
                                                            )
                                                        }

                                                        className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
                                                    >

                                                        <option value="ESTUDIANTE">
                                                            Estudiante
                                                        </option>

                                                        <option value="PROFESOR">
                                                            Profesor
                                                        </option>

                                                        <option value="JEFE_CARRERA">
                                                            Jefe de Carrera
                                                        </option>

                                                    </select>

                                                )}

                                            </td>


                                            <td className="p-4">

                                                {usuario.activo ? (

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

                                                {esAdministrador ? (

                                                    <span className="text-gray-400">
                                                        Protegido
                                                    </span>

                                                ) : (

                                                    <button
                                                        type="button"

                                                        onClick={() =>
                                                            cambiarEstado(
                                                                usuario
                                                            )
                                                        }

                                                        className={
                                                            usuario.activo
                                                                ? "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                                                : "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                                        }
                                                    >

                                                        {usuario.activo
                                                            ? "Desactivar"
                                                            : "Activar"}

                                                    </button>

                                                )}

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </main>
    );
}