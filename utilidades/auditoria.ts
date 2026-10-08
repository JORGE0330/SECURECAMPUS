import { prisma } from "@/utilidades/prisma";

type DatosAuditoria = {
  usuarioId?: number | null;
  accion: string;
  detalle?: string;
  entidad?: string;
  entidadId?: number;
};

export async function registrarAuditoria({
  usuarioId,
  accion,
  detalle,
  entidad,
  entidadId,
}: DatosAuditoria) {
  try {
    await prisma.auditoria.create({
      data: {
        usuarioId: usuarioId ?? null,
        accion,
        detalle,
        entidad,
        entidadId,
      },
    });
  } catch (error) {
    console.error(
      "No se pudo registrar la auditoría:",
      error
    );
  }
}