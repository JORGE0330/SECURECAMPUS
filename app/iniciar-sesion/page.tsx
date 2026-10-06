"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function IniciarSesion() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarInicioSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch("/api/autenticacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje);
        return;
      }
      localStorage.setItem("usuario",
         JSON.stringify(datos.usuario)
        );

      const rol = datos.usuario.rol;

      if (rol === "ESTUDIANTE") {
        router.push("/estudiante");
      } else if (rol === "PROFESOR") {
        router.push("/profesor");
      } else if (rol === "JEFE_CARRERA") {
        router.push("/jefe-carrera");
      } else if (rol === "ADMINISTRADOR") {
        router.push("/administrador");
      }
    } catch {
      setMensaje("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-black p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          SecureCampus
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Inicio de sesión
        </p>

        <form onSubmit={manejarInicioSesion} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Correo
            </label>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="correo@securecampus.test"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Contraseña"
              required
            />
          </div>

          {mensaje && (
            <p className="text-red-600 text-sm">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold"
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>
      </div>
    </main>
  );
}