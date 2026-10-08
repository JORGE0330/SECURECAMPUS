import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";
import { registrarAuditoria } from "@/utilidades/auditoria";

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

    const actorId = datos.actorId ? Number(datos.actorId) : null;

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

    // =====================================================
    // COMPROBAR QUE EL ESTUDIANTE EXISTE
    // =====================================================

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

    // =====================================================
    // COMPROBAR QUE EL GRUPO EXISTE
    // =====================================================

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

    // =====================================================
    // COMPROBAR SI YA ESTÁ INSCRITO
    // =====================================================

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

    // =====================================================
    // CREAR RELACIÓN ESTUDIANTE - GRUPO
    // =====================================================

    const asignacion = await prisma.grupoEstudiante.create({
      data: {
        grupoId,
        estudianteId,
      },
    });

    // =====================================================
    // AUDITORÍA
    // =====================================================

    await registrarAuditoria({
      usuarioId: actorId,
      accion: "ASIGNAR_ESTUDIANTE",
      entidad: "GrupoEstudiante",
      entidadId: asignacion.id,

      detalle:
        `Asignó al estudiante ${estudiante.nombre} ` +
        `al grupo ${grupo.nombre} de ${grupo.materia}`,
    });

    // =====================================================
    // RESPUESTA
    // =====================================================

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