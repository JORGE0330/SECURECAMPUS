import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";
import { registrarAuditoria } from "@/utilidades/auditoria";

// =====================================================
// OBTENER PROFESORES
// =====================================================

export async function GET() {
  try {
    const profesores = await prisma.usuario.findMany({
      where: {
        rol: {
          nombre: "PROFESOR",
        },
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,
        creadoEn: true,

        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },

      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(profesores);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener los profesores",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// CREAR PROFESOR
// =====================================================

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const actorId = datos.actorId ? Number(datos.actorId) : null;

    const nombre = datos.nombre?.trim();
    const correo = datos.correo?.trim();
    const password = datos.password;

    if (!nombre || !correo || !password) {
      return NextResponse.json(
        {
          mensaje: "Todos los campos son obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    // Comprobar si ya existe el correo

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          mensaje: "Ya existe un usuario con ese correo",
        },
        {
          status: 400,
        }
      );
    }

    // Obtener rol PROFESOR

    const rolProfesor = await prisma.rol.findUnique({
      where: {
        nombre: "PROFESOR",
      },
    });

    if (!rolProfesor) {
      return NextResponse.json(
        {
          mensaje: "No se encontró el rol PROFESOR",
        },
        {
          status: 404,
        }
      );
    }

    // Crear profesor

    const profesor = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password,
        activo: true,
        rolId: rolProfesor.id,
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,

        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    // =====================================================
    // AUDITORÍA
    // =====================================================

    await registrarAuditoria({
      usuarioId: actorId,
      accion: "CREAR_PROFESOR",
      entidad: "Usuario",
      entidadId: profesor.id,
      detalle: `Creó al profesor ${profesor.nombre}`,
    });

    return NextResponse.json(
      {
        mensaje: "Profesor creado correctamente",
        profesor,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al crear el profesor",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// ACTIVAR / DESACTIVAR PROFESOR
// =====================================================

export async function PATCH(request: Request) {
  try {
    const datos = await request.json();

    const actorId = datos.actorId ? Number(datos.actorId) : null;
    const profesorId = Number(datos.profesorId);

    if (!profesorId) {
      return NextResponse.json(
        {
          mensaje: "Falta el ID del profesor",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof datos.activo !== "boolean") {
      return NextResponse.json(
        {
          mensaje: "El estado del profesor no es válido",
        },
        {
          status: 400,
        }
      );
    }

    // Buscar profesor

    const profesorActual = await prisma.usuario.findUnique({
      where: {
        id: profesorId,
      },

      include: {
        rol: true,
      },
    });

    if (!profesorActual) {
      return NextResponse.json(
        {
          mensaje: "El profesor no existe",
        },
        {
          status: 404,
        }
      );
    }

    if (profesorActual.rol.nombre !== "PROFESOR") {
      return NextResponse.json(
        {
          mensaje: "El usuario seleccionado no es profesor",
        },
        {
          status: 400,
        }
      );
    }

    // Actualizar estado

    const profesorActualizado = await prisma.usuario.update({
      where: {
        id: profesorId,
      },

      data: {
        activo: datos.activo,
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,
      },
    });

    // =====================================================
    // AUDITORÍA
    // =====================================================

    await registrarAuditoria({
      usuarioId: actorId,

      accion: datos.activo
        ? "ACTIVAR_PROFESOR"
        : "DESACTIVAR_PROFESOR",

      entidad: "Usuario",
      entidadId: profesorActualizado.id,

      detalle: datos.activo
        ? `Activó al profesor ${profesorActualizado.nombre}`
        : `Desactivó al profesor ${profesorActualizado.nombre}`,
    });

    return NextResponse.json({
      mensaje: datos.activo
        ? "Profesor activado correctamente"
        : "Profesor desactivado correctamente",

      profesor: profesorActualizado,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al actualizar el profesor",
      },
      {
        status: 500,
      }
    );
  }
}