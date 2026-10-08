import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";

export async function GET() {
  try {
    const registros = await prisma.auditoria.findMany({
      select: {
        id: true,
        accion: true,
        detalle: true,
        entidad: true,
        entidadId: true,
        creadoEn: true,

        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,

            rol: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },

      orderBy: {
        creadoEn: "desc",
      },

      take: 100,
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "No se pudieron obtener los registros de auditoría",
      },
      {
        status: 500,
      },
    );
  }
}
