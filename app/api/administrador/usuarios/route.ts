import { NextResponse } from "next/server";
import { prisma } from "@/utilidades/prisma";
import { registrarAuditoria } from "@/utilidades/auditoria";

// =====================================================
// OBTENER TODOS LOS USUARIOS
// =====================================================

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,
        creadoEn: true,

        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },

      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al obtener los usuarios",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// CREAR USUARIO
// =====================================================

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const actorId = datos.actorId ? Number(datos.actorId) : null;

    const nombre = datos.nombre?.trim();
    const correo = datos.correo?.trim();
    const password = datos.password;
    const rolNombre = datos.rol;

    if (!nombre || !correo || !password || !rolNombre) {
      return NextResponse.json(
        {
          mensaje: "Todos los campos son obligatorios",
        },
        {
          status: 400,
        },
      );
    }

    // No permitimos crear administradores
    // desde esta interfaz.

    if (rolNombre === "ADMINISTRADOR") {
      return NextResponse.json(
        {
          mensaje: "No se pueden crear administradores desde esta opción",
        },
        {
          status: 400,
        },
      );
    }

    const rolesPermitidos = ["ESTUDIANTE", "PROFESOR", "JEFE_CARRERA"];

    if (!rolesPermitidos.includes(rolNombre)) {
      return NextResponse.json(
        {
          mensaje: "El rol seleccionado no es válido",
        },
        {
          status: 400,
        },
      );
    }

    // Comprobar que no exista el correo

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          mensaje: "Ya existe un usuario con ese correo",
        },
        {
          status: 400,
        },
      );
    }

    // Buscar el rol seleccionado

    const rol = await prisma.rol.findUnique({
      where: {
        nombre: rolNombre,
      },
    });

    if (!rol) {
      return NextResponse.json(
        {
          mensaje: "No se encontró el rol seleccionado",
        },
        {
          status: 404,
        },
      );
    }

    // Crear el usuario

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password,
        activo: true,
        rolId: rol.id,
      },

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,

        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    // =====================================================
    // AUDITORÍA: CREAR USUARIO
    // =====================================================

    await registrarAuditoria({
      usuarioId: actorId,
      accion: "CREAR_USUARIO",
      entidad: "Usuario",
      entidadId: usuario.id,

      detalle:
        `Creó al usuario ${usuario.nombre} ` + `con rol ${usuario.rol.nombre}`,
    });

    return NextResponse.json(
      {
        mensaje: "Usuario creado correctamente",
        usuario,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al crear el usuario",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// CAMBIAR ROL O ESTADO
// =====================================================

export async function PATCH(request: Request) {
  try {
    const datos = await request.json();

    const actorId = datos.actorId ? Number(datos.actorId) : null;

    const usuarioId = Number(datos.usuarioId);

    if (!usuarioId) {
      return NextResponse.json(
        {
          mensaje: "Falta el ID del usuario",
        },
        {
          status: 400,
        },
      );
    }

    // Obtener información ANTES del cambio

    const usuarioActual = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },

      include: {
        rol: true,
      },
    });

    if (!usuarioActual) {
      return NextResponse.json(
        {
          mensaje: "El usuario no existe",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // PROTEGER ADMINISTRADOR
    // =====================================================

    if (usuarioActual.rol.nombre === "ADMINISTRADOR") {
      return NextResponse.json(
        {
          mensaje:
            "La cuenta administrador no puede modificarse desde esta opción",
        },
        {
          status: 400,
        },
      );
    }

    const datosActualizar: {
      activo?: boolean;
      rolId?: number;
    } = {};

    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    if (typeof datos.activo === "boolean") {
      datosActualizar.activo = datos.activo;
    }

    // =====================================================
    // CAMBIAR ROL
    // =====================================================

    if (datos.rol) {
      const rolesPermitidos = ["ESTUDIANTE", "PROFESOR", "JEFE_CARRERA"];

      if (!rolesPermitidos.includes(datos.rol)) {
        return NextResponse.json(
          {
            mensaje: "El rol seleccionado no es válido",
          },
          {
            status: 400,
          },
        );
      }

      const nuevoRol = await prisma.rol.findUnique({
        where: {
          nombre: datos.rol,
        },
      });

      if (!nuevoRol) {
        return NextResponse.json(
          {
            mensaje: "No se encontró el rol seleccionado",
          },
          {
            status: 404,
          },
        );
      }

      datosActualizar.rolId = nuevoRol.id;
    }

    // =====================================================
    // ACTUALIZAR USUARIO
    // =====================================================

    const usuarioActualizado = await prisma.usuario.update({
      where: {
        id: usuarioId,
      },

      data: datosActualizar,

      select: {
        id: true,
        nombre: true,
        correo: true,
        activo: true,

        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    // =====================================================
    // AUDITORÍA: ACTIVAR / DESACTIVAR
    // =====================================================

    if (typeof datos.activo === "boolean") {
      await registrarAuditoria({
        usuarioId: actorId,

        accion: datos.activo ? "ACTIVAR_USUARIO" : "DESACTIVAR_USUARIO",

        entidad: "Usuario",

        entidadId: usuarioActualizado.id,

        detalle: datos.activo
          ? `Activó al usuario ${usuarioActualizado.nombre}`
          : `Desactivó al usuario ${usuarioActualizado.nombre}`,
      });
    }

    // =====================================================
    // AUDITORÍA: CAMBIAR ROL
    // =====================================================

    if (datos.rol) {
      await registrarAuditoria({
        usuarioId: actorId,

        accion: "CAMBIAR_ROL",

        entidad: "Usuario",

        entidadId: usuarioActualizado.id,

        detalle:
          `Cambió el rol de ${usuarioActualizado.nombre} ` +
          `de ${usuarioActual.rol.nombre} ` +
          `a ${usuarioActualizado.rol.nombre}`,
      });
    }

    return NextResponse.json({
      mensaje: "Usuario actualizado correctamente",

      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        mensaje: "Error al actualizar el usuario",
      },
      {
        status: 500,
      },
    );
  }
}
