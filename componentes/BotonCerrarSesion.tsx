"use client";

import { useRouter } from "next/navigation";

export default function BotonCerrarSesion() {
  const router = useRouter();

  function cerrarSesion() {
    localStorage.removeItem("usuario");

    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={cerrarSesion}
      className="w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-950 hover:text-red-200 transition"
    >
      Cerrar sesión
    </button>
  );
}