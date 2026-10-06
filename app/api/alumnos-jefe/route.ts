import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";


// =====================================================
// OBTENER ESTUDIANTES
// =====================================================

export async function GET() {
  try {
    const estudiantes = await prisma.usuario.findMany({
      where: {
        rol: {
          nombre: "ESTUDIANTE",
        },
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,

        gruposComoAlumno: {
          select: {
            grupo: {
              select: {
                id: true,
                nombre: true,
                materia: true,
              },
            },
          },
        },
      },

      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(estudiantes);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener los estudiantes",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// ASIGNAR ESTUDIANTE A UN GRUPO
// =====================================================

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const estudianteId = Number(datos.estudianteId);
    const grupoId = Number(datos.grupoId);

    if (!estudianteId || !grupoId) {
      return NextResponse.json(
        {
          mensaje: "Debes seleccionar un estudiante y un grupo",
        },
        {
          status: 400,
        }
      );
    }


    // Comprobar que el estudiante existe
    const estudiante = await prisma.usuario.findFirst({
      where: {
        id: estudianteId,

        rol: {
          nombre: "ESTUDIANTE",
        },
      },
    });

    if (!estudiante) {
      return NextResponse.json(
        {
          mensaje: "El estudiante seleccionado no existe",
        },
        {
          status: 404,
        }
      );
    }


    // Comprobar que el grupo existe
    const grupo = await prisma.grupo.findUnique({
      where: {
        id: grupoId,
      },
    });

    if (!grupo) {
      return NextResponse.json(
        {
          mensaje: "El grupo seleccionado no existe",
        },
        {
          status: 404,
        }
      );
    }


    // Comprobar si ya está inscrito
    const asignacionExistente =
      await prisma.grupoEstudiante.findUnique({
        where: {
          grupoId_estudianteId: {
            grupoId,
            estudianteId,
          },
        },
      });

    if (asignacionExistente) {
      return NextResponse.json(
        {
          mensaje: "El estudiante ya pertenece a este grupo",
        },
        {
          status: 400,
        }
      );
    }


    // Crear relación estudiante-grupo
    const asignacion =
      await prisma.grupoEstudiante.create({
        data: {
          grupoId,
          estudianteId,
        },
      });

    return NextResponse.json(
      {
        mensaje: "Estudiante asignado correctamente",
        asignacion,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al asignar el estudiante",
      },
      {
        status: 500,
      }
    );
  }
}