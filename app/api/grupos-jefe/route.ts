import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";


// =====================================================
// OBTENER TODOS LOS GRUPOS
// =====================================================

export async function GET() {
  try {
    const grupos = await prisma.grupo.findMany({
      select: {
        id: true,
        nombre: true,
        materia: true,

        profesor: {
          select: {
            id: true,
            nombre: true,
            correo: true,
            activo: true,
          },
        },

        _count: {
          select: {
            estudiantes: true,
          },
        },
      },

      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(grupos);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener los grupos",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// CREAR UN NUEVO GRUPO
// =====================================================

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const nombre = datos.nombre?.trim();
    const materia = datos.materia?.trim();
    const profesorId = Number(datos.profesorId);

    if (!nombre || !materia || !profesorId) {
      return NextResponse.json(
        {
          mensaje: "Todos los campos son obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    const profesor = await prisma.usuario.findFirst({
      where: {
        id: profesorId,

        rol: {
          nombre: "PROFESOR",
        },
      },

      select: {
        id: true,
        nombre: true,
        activo: true,
      },
    });

    if (!profesor) {
      return NextResponse.json(
        {
          mensaje: "El profesor seleccionado no existe",
        },
        {
          status: 404,
        }
      );
    }

    if (!profesor.activo) {
      return NextResponse.json(
        {
          mensaje: "El profesor seleccionado está inactivo",
        },
        {
          status: 400,
        }
      );
    }

    const grupo = await prisma.grupo.create({
      data: {
        nombre,
        materia,
        profesorId,
      },

      select: {
        id: true,
        nombre: true,
        materia: true,

        profesor: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        mensaje: "Grupo creado correctamente",
        grupo,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al crear el grupo",
      },
      {
        status: 500,
      }
    );
  }
}