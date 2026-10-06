# Ejecución de SecureCampus

## 1. Objetivo

Este documento explica cómo ejecutar SecureCampus desde una computadora nueva.

Seguir los pasos en orden.

## 2. Requisitos

Instalar:

- Git
- Node.js
- npm
- Visual Studio Code

También se necesita acceso al repositorio de GitHub.

## 3. Clonar

```bash
git clone URL_DEL_REPOSITORIO
cd securecampus
```

## 4. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

`node_modules` se genera automáticamente y no se sube a GitHub.

## 5. Crear `.env`

Crear en la raíz:

```text
.env
```

Contenido:

```env
DATABASE_URL="file:./dev.db"
```

`.env` es local y no debe subirse.

## 6. Generar Prisma Client

```bash
npx prisma generate
```

## 7. Crear la base

```bash
npx prisma migrate dev
```

Cada integrante tendrá su propia base SQLite.

No necesita recibir `dev.db` de otro integrante.

## 8. Cargar datos estándar

```bash
npx tsx prisma/cargar-datos.ts
```

Esto prepara:

```text
1 Administrador
1 Jefe de Carrera
5 Profesores
10 Estudiantes
5 Grupos
Inscripciones
Calificaciones
```

## 9. Iniciar el proyecto

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Debe mostrarse la página inicial de SecureCampus.

## 10. Credenciales de prueba

Contraseña estándar:

```text
1234
```

Jefe de Carrera:

```text
jefe@securecampus.test
```

Administrador:

```text
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

## 11. `dev.db`

No se comparte por GitHub.

En `.gitignore`:

```gitignore
*.db
*.db-journal
```

Cada integrante reconstruye su base con:

```bash
npx prisma migrate dev
npx tsx prisma/cargar-datos.ts
```

## 12. Prisma Studio

Primero intentar:

```bash
npx prisma studio
```

Si hace falta una URL explícita:

```bash
npx prisma studio --url "file:./dev.db"
```

En PowerShell, si aparece un problema relacionado con SQLite experimental:

```powershell
$env:NODE_OPTIONS="--experimental-sqlite"
npx prisma studio --url "file:./dev.db"
```

## 13. Problemas comunes

### Falta `.env`

Comprobar que exista:

```text
securecampus/.env
```

con:

```env
DATABASE_URL="file:./dev.db"
```

### Error con npm

```bash
npm install --legacy-peer-deps
```

### Error con Prisma Client

```bash
npx prisma generate
npm run dev
```

### No aparecen usuarios estándar

```bash
npx tsx prisma/cargar-datos.ts
```

### Puerto 3000 ocupado

Detener el proceso anterior con:

```text
Ctrl + C
```

y ejecutar de nuevo:

```bash
npm run dev
```




