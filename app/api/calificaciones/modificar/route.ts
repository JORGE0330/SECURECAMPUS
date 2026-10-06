import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";


// =====================================================
// MODIFICAR UNA CALIFICACIÓN EXISTENTE
// =====================================================

export async function PUT(request: Request) {
  try {
    const datos = await request.json();

    const calificacionId = Number(datos.calificacionId);
    const nuevoValor = Number(datos.valor);

    if (!calificacionId) {
      return NextResponse.json(
        {
          mensaje: "Falta el ID de la calificación",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(nuevoValor) ||
      nuevoValor < 0 ||
      nuevoValor > 100
    ) {
      return NextResponse.json(
        {
          mensaje: "La calificación debe estar entre 0 y 100",
        },
        {
          status: 400,
        }
      );
    }

    const calificacion =
      await prisma.calificacion.update({
        where: {
          id: calificacionId,
        },

        data: {
          valor: nuevoValor,
        },
      });

    return NextResponse.json({
      mensaje: "Calificación actualizada correctamente",
      calificacion,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al modificar la calificación",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// CREAR UNA NUEVA CALIFICACIÓN
// =====================================================

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const grupoId = Number(datos.grupoId);
    const estudianteId = Number(datos.estudianteId);
    const valor = Number(datos.valor);

    if (!grupoId || !estudianteId) {
      return NextResponse.json(
        {
          mensaje: "Faltan datos del grupo o estudiante",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(valor) ||
      valor < 0 ||
      valor > 100
    ) {
      return NextResponse.json(
        {
          mensaje: "La calificación debe estar entre 0 y 100",
        },
        {
          status: 400,
        }
      );
    }


    // Verificamos que el alumno pertenezca al grupo
    const perteneceGrupo =
      await prisma.grupoEstudiante.findUnique({
        where: {
          grupoId_estudianteId: {
            grupoId,
            estudianteId,
          },
        },
      });

    if (!perteneceGrupo) {
      return NextResponse.json(
        {
          mensaje: "El estudiante no pertenece a este grupo",
        },
        {
          status: 400,
        }
      );
    }


    // Evitar una calificación duplicada
    const existente =
      await prisma.calificacion.findUnique({
        where: {
          grupoId_estudianteId: {
            grupoId,
            estudianteId,
          },
        },
      });

    if (existente) {
      return NextResponse.json(
        {
          mensaje: "El estudiante ya tiene una calificación",
        },
        {
          status: 400,
        }
      );
    }


    const calificacion =
      await prisma.calificacion.create({
        data: {
          grupoId,
          estudianteId,
          valor,
        },
      });

    return NextResponse.json(
      {
        mensaje: "Calificación registrada correctamente",
        calificacion,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al registrar la calificación",
      },
      {
        status: 500,
      }
    );
  }
}