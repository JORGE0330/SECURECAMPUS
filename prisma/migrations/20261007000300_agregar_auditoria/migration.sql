-- CreateTable
CREATE TABLE "Auditoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accion" TEXT NOT NULL,
    "detalle" TEXT,
    "entidad" TEXT,
    "entidadId" INTEGER,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
