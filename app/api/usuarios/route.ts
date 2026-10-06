import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      correo: true,
      activo: true,
      rol: {
        select: {
          nombre: true,
        },
      },
    },
  });

  return NextResponse.json(usuarios);
}