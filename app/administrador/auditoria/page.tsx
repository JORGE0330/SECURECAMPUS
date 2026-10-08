"use client";

import { useEffect, useState } from "react";

type RegistroAuditoria = {
    id: number;
    accion: string;
    detalle: string | null;
    entidad: string | null;
    entidadId: number | null;
    creadoEn: string;

    usuario: {
        id: number;
        nombre: string;
        correo: string;

        rol: {
            nombre: string;
        };
    } | null;
};

export default function AuditoriaAdministrador() {
    const [registros, setRegistros] = useState<RegistroAuditoria[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelado = false;

        fetch("/api/administrador/auditoria")
            .then(async (respuesta) => {
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje);
                }

                return datos;
            })
            .then((datos) => {
                if (!cancelado) {
                    setRegistros(datos);
                }
            })
            .catch((error) => {
                if (!cancelado) {
                    setError(error.message || "No se pudo cargar la auditoría");
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
                <p className="text-gray-500">Cargando auditoría...</p>
            </main>
        );
    }

    return (
        <main className="p-10 w-full max-w-full overflow-x-hidden">
            <header className="mb-8">
                <p className="text-gray-500">Portal del administrador</p>

                <h1 className="text-3xl font-bold text-gray-900">
                    Auditoría
                </h1>

                <p className="text-gray-600 mt-2">
                    Consulta las acciones importantes realizadas dentro de SecureCampus.
                </p>
            </header>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">Fecha</th>
                                <th className="text-left p-4">Usuario</th>
                                <th className="text-left p-4">Rol</th>
                                <th className="text-left p-4">Acción</th>
                                <th className="text-left p-4">Detalle</th>
                                <th className="text-left p-4">Entidad</th>
                            </tr>
                        </thead>

                        <tbody>
                            {registros.map((registro) => (
                                <tr
                                    key={registro.id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="p-4 text-gray-600 whitespace-nowrap">
                                        {new Date(registro.creadoEn).toLocaleString("es-MX")}
                                    </td>

                                    <td className="p-4">
                                        <p className="font-medium text-gray-900">
                                            {registro.usuario?.nombre ?? "Sistema"}
                                        </p>

                                        {registro.usuario && (
                                            <p className="text-sm text-gray-500">
                                                {registro.usuario.correo}
                                            </p>
                                        )}
                                    </td>

                                    <td className="p-4 text-gray-700">
                                        {registro.usuario?.rol.nombre ?? "-"}
                                    </td>

                                    <td className="p-4">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {registro.accion}
                                        </span>
                                    </td>

                                    <td className="p-4 text-gray-700">
                                        {registro.detalle ?? "Sin detalle"}
                                    </td>

                                    <td className="p-4 text-gray-500">
                                        {registro.entidad ?? "-"}

                                        {registro.entidadId
                                            ? ` #${registro.entidadId}`
                                            : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {registros.length === 0 && (
                    <p className="p-6 text-gray-500">
                        Todavía no existen registros de auditoría.
                    </p>
                )}
            </section>
        </main>
    );
}