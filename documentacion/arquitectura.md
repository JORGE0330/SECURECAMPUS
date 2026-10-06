# Arquitectura de SecureCampus

## 1. Objetivo

Este archivo explica cómo está organizado SecureCampus y para qué sirve cada carpeta importante.

## 2. Estructura general

```text
securecampus/
├── app/
│   ├── administrador/
│   ├── api/
│   ├── estudiante/
│   ├── jefe-carrera/
│   ├── profesor/
│   ├── iniciar-sesion/
│   ├── generated/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── componentes/
├── utilidades/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── consultas.sql
│   └── cargar-datos.ts
├── documentacion/
├── public/
├── .env
├── .gitignore
└── package.json
```

## 3. Carpeta `app`

### `app/page.tsx`

Es la página inicial de SecureCampus.

Al entrar a:

```text
http://localhost:3000
```

debe mostrarse la bienvenida y un botón para iniciar sesión.

### `app/iniciar-sesion`

Contiene la pantalla de acceso.

Después del inicio de sesión se redirige según el rol:

```text
ESTUDIANTE      → /estudiante
PROFESOR        → /profesor
JEFE_CARRERA    → /jefe-carrera
ADMINISTRADOR   → /administrador
```

### `app/estudiante`

Ejemplos:

```text
/estudiante
/estudiante/perfil
/estudiante/calificaciones
/estudiante/documentos
/estudiante/solicitudes
```

### `app/profesor`

Ejemplos:

```text
/profesor
/profesor/perfil
/profesor/grupos
/profesor/grupos/[id]
```

`[id]` es una ruta dinámica.

Por ejemplo:

```text
/profesor/grupos/1
```

consulta el grupo con ID 1.

### `app/jefe-carrera`

Ejemplos:

```text
/jefe-carrera
/jefe-carrera/perfil
/jefe-carrera/profesores
/jefe-carrera/grupos
/jefe-carrera/alumnos
```

### `app/administrador`

Se utilizará para el módulo Administrador.

Actualmente está pendiente.

## 4. Carpeta `app/api`

Contiene rutas que reciben peticiones desde las páginas y trabajan con Prisma.

Ejemplos:

```text
/api/autenticacion
/api/usuarios
/api/calificaciones
/api/calificaciones/modificar
/api/grupos
/api/grupos-jefe
/api/alumnos-grupo
/api/alumnos-jefe
/api/profesores
```

Flujo típico:

```text
Página
  ↓
fetch()
  ↓
API de Next.js
  ↓
Prisma
  ↓
SQLite
```

## 5. Carpeta `componentes`

Contiene componentes reutilizables.

Ejemplos:

```text
menuLateral.tsx
menuProfesor.tsx
menuJefeCarrera.tsx
BotonCerrarSesion.tsx
```

## 6. Carpeta `utilidades`

Contiene:

```text
utilidades/prisma.ts
```

Este archivo crea y reutiliza la conexión de Prisma.

## 7. Carpeta `prisma`

### `schema.prisma`

Define los modelos:

```text
Rol
Usuario
Grupo
GrupoEstudiante
Calificacion
Documento
Solicitud
```

### `migrations`

Guarda el historial de cambios de la base.

Estos archivos sí deben mantenerse en GitHub.

### `cargar-datos.ts`

Carga los datos estándar para desarrollo.

### `consultas.sql`

Contiene consultas o cargas manuales utilizadas durante el desarrollo.

## 8. Base local

SecureCampus utiliza SQLite.

Cada integrante tiene su propia base local.

El archivo `dev.db` no debe subirse a GitHub.

En `.gitignore` debe existir:

```gitignore
*.db
*.db-journal
```

## 9. Comunicación entre roles

```text
Jefe de Carrera
crea grupo
      ↓
SQLite
      ↓
Profesor
ve el grupo
      ↓
registra calificación
      ↓
SQLite
      ↓
Estudiante
ve la calificación
```

## 10. Reglas para trabajar en el proyecto

- Respetar los nombres de rutas.
- No subir `.env`.
- No subir `dev.db`.
- No subir `node_modules`.
- No modificar migraciones anteriores sin revisar el impacto.
- Antes de hacer `push`, ejecutar `git status`.

## 11. Seguridad

La arquitectura actual permite probar funciones, pero todavía no implementa la seguridad final.

Las mejoras se documentarán en:

```text
documentacion/seguridad/
```
