# Documentación de SecureCampus

## 1. ¿Qué es SecureCampus?

SecureCampus es una plataforma académica desarrollada como proyecto de la materia de Desarrollo Seguro.

El sistema permite trabajar con cuatro tipos de usuario:

- Estudiante
- Profesor
- Jefe de Carrera
- Administrador

Cada usuario inicia sesión con correo y contraseña y, según su rol, entra a un portal diferente.

> **Importante:** la versión actual está enfocada primero en que las funciones principales trabajen correctamente. Las medidas de seguridad se irán aplicando durante las prácticas de la materia.

## 2. Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- Git
- GitHub

Next.js se utiliza para las páginas y las rutas de API. Prisma se utiliza para comunicarse con SQLite.

## 3. Estado actual

### Estudiante

Actualmente puede:

- Iniciar sesión.
- Entrar a su portal.
- Consultar su perfil.
- Consultar sus calificaciones.
- Consultar su promedio.

Pendiente:

- Documentos.
- Solicitudes.
- Historial de solicitudes.

### Profesor

Actualmente puede:

- Iniciar sesión.
- Consultar su perfil.
- Consultar sus grupos asignados.
- Ver alumnos inscritos.
- Registrar una primera calificación.
- Modificar una calificación existente.

### Jefe de Carrera

Actualmente puede:

- Iniciar sesión.
- Consultar su perfil.
- Consultar profesores.
- Registrar profesores.
- Activar o desactivar profesores.
- Consultar grupos.
- Crear grupos.
- Asignar profesores a grupos.
- Consultar alumnos.
- Asignar alumnos a grupos.

### Administrador

Este módulo todavía está pendiente.

Está planeado para:

- Consultar todos los usuarios.
- Crear cuentas.
- Activar o desactivar cuentas.
- Asignar o cambiar roles.
- Consultar roles y permisos.
- Consultar registros de auditoría.

## 4. Flujo general del sistema

```text
Jefe de Carrera
      ↓
crea un grupo
      ↓
asigna un profesor
      ↓
asigna estudiantes
      ↓
Profesor
      ↓
captura o modifica una calificación
      ↓
Estudiante
      ↓
consulta su calificación
```

Toda la información se guarda en SQLite.

## 5. Base estándar

El proyecto incluye:

```text
prisma/cargar-datos.ts
```

Este archivo permite cargar automáticamente datos de prueba:

- 1 Administrador.
- 1 Jefe de Carrera.
- 5 Profesores.
- 10 Estudiantes.
- 5 Grupos.
- Inscripciones.
- Calificaciones de prueba.

Para cargarla:

```bash
npx tsx prisma/cargar-datos.ts
```

## 6. Estado actual de seguridad

La aplicación todavía no debe considerarse segura.

Actualmente se utilizan mecanismos sencillos para probar el funcionamiento:

- Contraseñas de prueba sin hash.
- Usuario guardado en `localStorage`.
- Falta de una sesión real.
- Falta de protección completa de rutas.
- Falta de autorización robusta del lado del servidor.
- Falta de auditoría completa.

Esto es intencional en esta etapa.

Las mejoras de seguridad se documentarán en:

```text
documentacion/seguridad/
```

No se deben utilizar datos personales ni contraseñas reales.

## 7. Archivos de documentación

```text
documentacion/
├── README.md
├── arquitectura.md
├── base-datos.md
├── roles.md
├── ejecucion.md
└── seguridad/
```

- `README.md`: explicación general y estado actual.
- `arquitectura.md`: estructura del proyecto.
- `base-datos.md`: modelos y relaciones.
- `roles.md`: responsabilidades de cada rol.
- `ejecucion.md`: pasos para instalar y ejecutar.
- `seguridad/`: evidencias de seguridad.
