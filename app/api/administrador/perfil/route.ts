import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";
import { registrarAuditoria } from "@/utilidades/auditoria";

// =====================================================
// OBTENER PERFIL
// =====================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const usuarioId = Number(searchParams.get("usuarioId"));

    if (!usuarioId) {
      return NextResponse.json(
        {
          mensaje: "Falta el ID del usuario",
        },
        {
          status: 400,
        }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,
        avatar: true,

        rol: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          mensaje: "El usuario no existe",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener el perfil",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// CAMBIAR AVATAR
// =====================================================

export async function PATCH(request: Request) {
  try {
    const datos = await request.json();

    const usuarioId = Number(datos.usuarioId);
    const avatar = datos.avatar;

    if (!usuarioId || !avatar) {
      return NextResponse.json(
        {
          mensaje: "Faltan datos para actualizar el avatar",
        },
        {
          status: 400,
        }
      );
    }

    const avataresPermitidos = [
      "avatar1",
      "avatar2",
      "avatar3",
      "avatar4",
      "avatar5",
    ];

    if (!avataresPermitidos.includes(avatar)) {
      return NextResponse.json(
        {
          mensaje: "El avatar seleccionado no es válido",
        },
        {
          status: 400,
        }
      );
    }

    const usuario = await prisma.usuario.update({
      where: {
        id: usuarioId,
      },

      data: {
        avatar,
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        avatar: true,
      },
    });

    await registrarAuditoria({
      usuarioId,
      accion: "CAMBIAR_AVATAR",
      entidad: "Usuario",
      entidadId: usuario.id,
      detalle: `${usuario.nombre} cambió su avatar de perfil`,
    });

    return NextResponse.json({
      mensaje: "Avatar actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al actualizar el avatar",
      },
      {
        status: 500,
      }
    );
  }
}