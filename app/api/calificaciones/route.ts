import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const estudianteId = Number(searchParams.get("estudianteId"));

    if (!estudianteId) {
      return NextResponse.json(
        { mensaje: "Falta el ID del estudiante" },
        { status: 400 }
      );
    }

    const calificaciones = await prisma.calificacion.findMany({
      where: {
        estudianteId: estudianteId,
      },
      select: {
        id: true,
        valor: true,
        creadoEn: true,
        grupo: {
          select: {
            nombre: true,
            materia: true,
          },
        },
      },
    });

    return NextResponse.json(calificaciones);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { mensaje: "Error al obtener las calificaciones" },
      { status: 500 }
    );
  }
}