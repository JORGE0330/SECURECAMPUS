import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const profesorId = Number(searchParams.get("profesorId"));

    if (!profesorId) {
      return NextResponse.json(
        { mensaje: "Falta el ID del profesor" },
        { status: 400 }
      );
    }

    const grupos = await prisma.grupo.findMany({
      where: {
        profesorId: profesorId,
      },

      select: {
        id: true,
        nombre: true,
        materia: true,

        _count: {
          select: {
            estudiantes: true,
          },
        },
      },

      orderBy: {
        materia: "asc",
      },
    });

    return NextResponse.json(grupos);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { mensaje: "Error al obtener los grupos" },
      { status: 500 }
    );
  }
}