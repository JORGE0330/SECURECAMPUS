import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";
import { registrarAuditoria } from "@/utilidades/auditoria";

// =====================================================
// MODIFICAR UNA CALIFICACIÓN EXISTENTE
// =====================================================

export async function PUT(request: Request) {
  try {
    const datos = await request.json();

    const actorId = datos.actorId ? Number(datos.actorId) : null;
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

    // =====================================================
    // OBTENER CALIFICACIÓN ANTES DEL CAMBIO
    // =====================================================

    const calificacionAnterior = await prisma.calificacion.findUnique({
      where: {
        id: calificacionId,
      },

      select: {
        id: true,
        valor: true,

        estudiante: {
          select: {
            id: true,
            nombre: true,
          },
        },

        grupo: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
        },
      },
    });

    if (!calificacionAnterior) {
      return NextResponse.json(
        {
          mensaje: "La calificación no existe",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // ACTUALIZAR CALIFICACIÓN
    // =====================================================

    const calificacion = await prisma.calificacion.update({
      where: {
        id: calificacionId,
      },

      data: {
        valor: nuevoValor,
      },
    });

    // =====================================================
    // AUDITORÍA
    // =====================================================

    await registrarAuditoria({
      usuarioId: actorId,
      accion: "MODIFICAR_CALIFICACION",
      entidad: "Calificacion",
      entidadId: calificacion.id,

      detalle:
        `Modificó la calificación de ${calificacionAnterior.estudiante.nombre} ` +
        `en ${calificacionAnterior.grupo.nombre} - ${calificacionAnterior.grupo.materia} ` +
        `de ${calificacionAnterior.valor} a ${nuevoValor}`,
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

    const actorId = datos.actorId ? Number(datos.actorId) : null;

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

    // =====================================================
    // VERIFICAR QUE EL ALUMNO PERTENEZCA AL GRUPO
    // =====================================================

    const perteneceGrupo = await prisma.grupoEstudiante.findUnique({
      where: {
        grupoId_estudianteId: {
          grupoId,
          estudianteId,
        },
      },

      select: {
        id: true,

        estudiante: {
          select: {
            id: true,
            nombre: true,
          },
        },

        grupo: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
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

    // =====================================================
    // EVITAR CALIFICACIÓN DUPLICADA
    // =====================================================

    const existente = await prisma.calificacion.findUnique({
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

    // =====================================================
    // CREAR CALIFICACIÓN
    // =====================================================

    const calificacion = await prisma.calificacion.create({
      data: {
        grupoId,
        estudianteId,
        valor,
      },
    });

    // =====================================================
    // AUDITORÍA
    // =====================================================

    await registrarAuditoria({
      usuarioId: actorId,
      accion: "REGISTRAR_CALIFICACION",
      entidad: "Calificacion",
      entidadId: calificacion.id,

      detalle:
        `Registró la calificación ${valor} para ` +
        `${perteneceGrupo.estudiante.nombre} en ` +
        `${perteneceGrupo.grupo.nombre} - ${perteneceGrupo.grupo.materia}`,
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