import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";


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
// REGISTRAR PROFESOR
// =====================================================

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const nombre = datos.nombre;
    const correo = datos.correo;
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

    const usuarioExistente =
      await prisma.usuario.findUnique({
        where: {
          correo: correo,
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

    const rolProfesor =
      await prisma.rol.findUnique({
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
          status: 500,
        }
      );
    }

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
      },
    });

    return NextResponse.json(
      {
        mensaje: "Profesor registrado correctamente",
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
        mensaje: "Error al registrar el profesor",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// ACTIVAR / DAR DE BAJA
// =====================================================

export async function PATCH(request: Request) {
  try {
    const datos = await request.json();

    const id = Number(datos.id);
    const activo = datos.activo;

    if (!id) {
      return NextResponse.json(
        {
          mensaje: "Falta el ID del profesor",
        },
        {
          status: 400,
        }
      );
    }

    const profesor = await prisma.usuario.update({
      where: {
        id: id,
      },

      data: {
        activo: activo,
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,
      },
    });

    return NextResponse.json({
      mensaje: activo
        ? "Profesor activado correctamente"
        : "Profesor dado de baja correctamente",

      profesor,
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