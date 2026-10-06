import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const correo = datos.correo;
    const password = datos.password;

    const usuario = await prisma.usuario.findUnique({
      where: {
        correo: correo,
      },
      include: {
        rol: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { mensaje: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    if (usuario.password !== password) {
      return NextResponse.json(
        { mensaje: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { mensaje: "Usuario inactivo" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      mensaje: "Inicio de sesión correcto",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { mensaje: "Error del servidor" },
      { status: 500 }
    );
  }
}