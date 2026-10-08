import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function GET() {
  try {
    const roles = await prisma.rol.findMany({
      select: {
        id: true,
        nombre: true,

        _count: {
          select: {
            usuarios: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener los roles",
      },
      {
        status: 500,
      },
    );
  }
}
