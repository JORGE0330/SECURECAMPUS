# Base de datos de SecureCampus

## 1. Tecnología

SecureCampus utiliza Prisma y SQLite.

La estructura se define en:

```text
prisma/schema.prisma
```

## 2. Modelos

### Rol

Representa el tipo de usuario.

```text
ESTUDIANTE
PROFESOR
JEFE_CARRERA
ADMINISTRADOR
```

### Usuario

Datos principales:

```text
id
nombre
correo
password
activo
creadoEn
rolId
```

El correo es único.

Cada usuario tiene un rol.

Actualmente las contraseñas de prueba se guardan sin hash porque la seguridad se implementará después.

### Grupo

Datos principales:

```text
id
nombre
materia
profesorId
```

Cada grupo tiene un profesor asignado.

### GrupoEstudiante

Relaciona estudiantes y grupos.

```text
un estudiante puede estar en varios grupos
un grupo puede tener varios estudiantes
```

La combinación `grupoId + estudianteId` es única.

### Calificacion

Datos principales:

```text
id
valor
grupoId
estudianteId
creadoEn
```

La combinación `grupoId + estudianteId` es única.

El profesor puede crear y después modificar la calificación.

### Documento

Datos principales:

```text
id
nombre
archivo
tipo
usuarioId
creadoEn
```

La interfaz de documentos todavía está pendiente.

### Solicitud

Datos principales:

```text
id
tipo
descripcion
estado
usuarioId
creadoEn
```

El estado inicia como `Pendiente`.

La interfaz de solicitudes todavía está pendiente.

## 3. Relaciones principales

```text
Rol
 │
 └── Usuario
      │
      ├── grupos como profesor
      ├── grupos como estudiante
      ├── calificaciones
      ├── documentos
      └── solicitudes

Grupo
 │
 ├── Profesor
 ├── Estudiantes
 └── Calificaciones
```

## 4. Base estándar

El archivo:

```text
prisma/cargar-datos.ts
```

está preparado para generar:

```text
1 Administrador
1 Jefe de Carrera
5 Profesores
10 Estudiantes
5 Grupos
30 inscripciones
30 calificaciones
```

Grupos estándar:

```text
DS-01 → Desarrollo Seguro
BD-01 → Bases de Datos
AA-01 → Aprendizaje Automático
PW-01 → Programación Web
SO-01 → Sistemas Operativos
```

## 5. Cargar datos

```bash
npx tsx prisma/cargar-datos.ts
```

El script utiliza operaciones que evitan duplicar los usuarios y relaciones principales al volver a ejecutarlo.

## 6. Credenciales de desarrollo

Contraseña estándar:

```text
1234
```

Cuentas principales:

```text
Jefe de Carrera
jefe@securecampus.test

Administrador
admin@securecampus.test
```

Profesor de ejemplo:

```text
ana.martinez@securecampus.test
```

Estudiante de ejemplo:

```text
alejandro.lopez@securecampus.test
```

## 7. `dev.db` y GitHub

No subir el archivo SQLite local.

En `.gitignore`:

```gitignore
*.db
*.db-journal
```

Cada integrante reconstruye la base con:

```text
migrations
+
cargar-datos.ts
```

## 8. Migraciones

Cuando se modifica `schema.prisma`:

```bash
npx prisma migrate dev --name nombre-del-cambio
```

No editar migraciones antiguas sin revisar el impacto.

## 9. Consultar la base

Se puede utilizar Prisma Studio:

```bash
npx prisma studio
```

Si se necesita indicar la URL:

```bash
npx prisma studio --url "file:./dev.db"
```

