# Roles de SecureCampus

## 1. Roles existentes

```text
ESTUDIANTE
PROFESOR
JEFE_CARRERA
ADMINISTRADOR
```

## 2. Estudiante

Puede actualmente:

- Iniciar sesión.
- Consultar su perfil.
- Consultar calificaciones.
- Consultar promedio.

Pendiente:

- Documentos.
- Solicitudes.
- Historial de solicitudes.

El estudiante no debe modificar sus propias calificaciones.

## 3. Profesor

Puede:

- Iniciar sesión.
- Consultar su perfil.
- Consultar sus grupos.
- Ver alumnos inscritos.
- Registrar una calificación.
- Modificar una calificación.

Ejemplo:

```text
Profesor
   ↓
Mis grupos
   ↓
DS-01
   ↓
lista de estudiantes
   ↓
capturar o actualizar calificación
```

## 4. Jefe de Carrera

Se encarga de la organización académica.

Puede:

- Consultar su perfil.
- Consultar profesores.
- Registrar profesores.
- Activar o desactivar profesores.
- Consultar grupos.
- Crear grupos.
- Asignar profesores a grupos.
- Consultar alumnos.
- Asignar alumnos a grupos.

## 5. Administrador

El módulo todavía está pendiente.

Está planeado para:

- Consultar todos los usuarios.
- Crear cuentas de Estudiante.
- Crear cuentas de Profesor.
- Crear cuentas de Jefe de Carrera.
- Activar o desactivar cuentas.
- Asignar o cambiar roles.
- Consultar roles y permisos.
- Consultar auditoría.

El rol `ADMINISTRADOR` no se asignará desde el formulario normal de usuarios.

La cuenta inicial se crea desde la base estándar.

## 6. Diferencia entre Administrador y Jefe de Carrera

```text
Administrador
→ administra cuentas y roles

Jefe de Carrera
→ administra la organización académica
```

Ejemplo:

```text
Administrador
crea una cuenta con rol PROFESOR
        ↓
Jefe de Carrera
asigna ese profesor a un grupo
```

## 7. Flujo completo

```text
Jefe de Carrera
      ↓
crea grupo
      ↓
asigna profesor
      ↓
asigna estudiante
      ↓
Profesor
      ↓
captura calificación
      ↓
Estudiante
      ↓
consulta calificación
```

## 8. Estado funcional

```text
ESTUDIANTE
✅ Perfil
✅ Calificaciones
⏳ Documentos
⏳ Solicitudes

PROFESOR
✅ Perfil
✅ Grupos
✅ Alumnos
✅ Crear calificación
✅ Modificar calificación

JEFE DE CARRERA
✅ Perfil
✅ Profesores
✅ Grupos
✅ Asignaciones

ADMINISTRADOR
⏳ Pendiente
```

