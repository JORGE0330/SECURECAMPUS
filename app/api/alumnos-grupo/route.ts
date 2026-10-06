import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const grupoId = Number(searchParams.get("grupoId"));

    if (!grupoId) {
      return NextResponse.json(
        { mensaje: "Falta el ID del grupo" },
        { status: 400 }
      );
    }

    const grupo = await prisma.grupo.findUnique({
      where: {
        id: grupoId,
      },

      select: {
        id: true,
        nombre: true,
        materia: true,

        estudiantes: {
          select: {
            estudiante: {
              select: {
                id: true,
                nombre: true,
                correo: true,

                calificaciones: {
                  where: {
                    grupoId: grupoId,
                  },

                  select: {
                    id: true,
                    valor: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!grupo) {
      return NextResponse.json(
        { mensaje: "Grupo no encontrado" },
        { status: 404 }
      );
    }

    const estudiantes = grupo.estudiantes.map((registro) => ({
      id: registro.estudiante.id,
      nombre: registro.estudiante.nombre,
      correo: registro.estudiante.correo,
      calificacion:
        registro.estudiante.calificaciones.length > 0
          ? registro.estudiante.calificaciones[0]
          : null,
    }));

    return NextResponse.json({
      id: grupo.id,
      nombre: grupo.nombre,
      materia: grupo.materia,
      estudiantes,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { mensaje: "Error al obtener los estudiantes" },
      { status: 500 }
    );
  }
}