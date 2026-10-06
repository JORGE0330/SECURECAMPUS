import Link from "next/link";

export default function Inicio() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="min-h-screen flex flex-col">

        {/* Barra superior */}
        <header className="flex items-center justify-between px-10 py-6 border-b border-slate-800">

          <h1 className="text-2xl font-bold">
            SecureCampus
          </h1>

          <Link
            href="/iniciar-sesion"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium transition"
          >
            Iniciar sesión
          </Link>

        </header>


        {/* Contenido principal */}
        <section className="flex-1 flex items-center justify-center px-6">

          <div className="max-w-4xl text-center">

            <p className="text-blue-400 font-semibold mb-4">
              Plataforma académica
            </p>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Bienvenido a
              <span className="text-blue-500">
                {" "}SecureCampus
              </span>
            </h2>

            <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
              Gestiona información académica, grupos,
              profesores, alumnos y calificaciones desde
              una sola plataforma.
            </p>


            <div className="mt-10">

              <Link
                href="/iniciar-sesion"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
              >
                Iniciar sesión
              </Link>

            </div>


            {/* Roles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 text-left">

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">
                  Estudiantes
                </h3>

                <p className="text-gray-400 text-sm">
                  Consulta tus calificaciones,
                  documentos y solicitudes.
                </p>
              </div>


              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">
                  Profesores
                </h3>

                <p className="text-gray-400 text-sm">
                  Consulta grupos y administra
                  calificaciones.
                </p>
              </div>


              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">
                  Gestión académica
                </h3>

                <p className="text-gray-400 text-sm">
                  Administra profesores, alumnos
                  y grupos académicos.
                </p>
              </div>

            </div>

          </div>

        </section>


        <footer className="text-center text-gray-500 text-sm py-6">
          SecureCampus
        </footer>

      </div>

    </main>
  );
}