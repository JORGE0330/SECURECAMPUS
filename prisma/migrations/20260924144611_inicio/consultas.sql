INSERT INTO Rol (nombre)
VALUES
('ESTUDIANTE'),
('PROFESOR'),
('JEFE_CARRERA'),
('ADMINISTRADOR');
SELECT * FROM Rol;


INSERT INTO Usuario
(nombre, correo, password, activo, creadoEn, rolId)
VALUES
(
  'Estudiante Prueba',
  'estudiante@securecampus.test',
  '1234',
  1,
  CURRENT_TIMESTAMP,
  1
),
(
  'Profesor Prueba',
  'profesor@securecampus.test',
  '1234',
  1,
  CURRENT_TIMESTAMP,
  2
),
(
  'Jefe de Carrera',
  'jefe@securecampus.test',
  '1234',
  1,
  CURRENT_TIMESTAMP,
  3
),
(
  'Administrador',
  'admin@securecampus.test',
  '1234',
  1,
  CURRENT_TIMESTAMP,
  4
);

SELECT * FROM Usuario;


-- =====================================================
-- GRUPOS DE PRUEBA
-- =====================================================

INSERT INTO Grupo (nombre, materia, profesorId)
SELECT
    'DS-01',
    'Desarrollo Seguro',
    id
FROM Usuario
WHERE correo = 'profesor@securecampus.test'
AND NOT EXISTS (
    SELECT 1
    FROM Grupo
    WHERE nombre = 'DS-01'
);

INSERT INTO Grupo (nombre, materia, profesorId)
SELECT
    'BD-01',
    'Bases de Datos',
    id
FROM Usuario
WHERE correo = 'profesor@securecampus.test'
AND NOT EXISTS (
    SELECT 1
    FROM Grupo
    WHERE nombre = 'BD-01'
);

INSERT INTO Grupo (nombre, materia, profesorId)
SELECT
    'AA-01',
    'Aprendizaje Automático',
    id
FROM Usuario
WHERE correo = 'profesor@securecampus.test'
AND NOT EXISTS (
    SELECT 1
    FROM Grupo
    WHERE nombre = 'AA-01'
);


-- =====================================================
-- INSCRIBIR AL ESTUDIANTE EN LOS GRUPOS
-- =====================================================

INSERT OR IGNORE INTO GrupoEstudiante (grupoId, estudianteId)
SELECT Grupo.id, Usuario.id
FROM Grupo, Usuario
WHERE Grupo.nombre = 'DS-01'
AND Usuario.correo = 'estudiante@securecampus.test';

INSERT OR IGNORE INTO GrupoEstudiante (grupoId, estudianteId)
SELECT Grupo.id, Usuario.id
FROM Grupo, Usuario
WHERE Grupo.nombre = 'BD-01'
AND Usuario.correo = 'estudiante@securecampus.test';

INSERT OR IGNORE INTO GrupoEstudiante (grupoId, estudianteId)
SELECT Grupo.id, Usuario.id
FROM Grupo, Usuario
WHERE Grupo.nombre = 'AA-01'
AND Usuario.correo = 'estudiante@securecampus.test';


-- =====================================================
-- CALIFICACIONES
-- =====================================================

INSERT OR IGNORE INTO Calificacion
(valor, grupoId, estudianteId, creadoEn)
SELECT
    92,
    Grupo.id,
    Usuario.id,
    CURRENT_TIMESTAMP
FROM Grupo, Usuario
WHERE Grupo.nombre = 'DS-01'
AND Usuario.correo = 'estudiante@securecampus.test';

INSERT OR IGNORE INTO Calificacion
(valor, grupoId, estudianteId, creadoEn)
SELECT
    87,
    Grupo.id,
    Usuario.id,
    CURRENT_TIMESTAMP
FROM Grupo, Usuario
WHERE Grupo.nombre = 'BD-01'
AND Usuario.correo = 'estudiante@securecampus.test';

INSERT OR IGNORE INTO Calificacion
(valor, grupoId, estudianteId, creadoEn)
SELECT
    95,
    Grupo.id,
    Usuario.id,
    CURRENT_TIMESTAMP
FROM Grupo, Usuario
WHERE Grupo.nombre = 'AA-01'
AND Usuario.correo = 'estudiante@securecampus.test';



SELECT
    Usuario.nombre AS estudiante,
    Grupo.materia,
    Grupo.nombre AS grupo,
    Calificacion.valor
FROM Calificacion
INNER JOIN Usuario
    ON Calificacion.estudianteId = Usuario.id
INNER JOIN Grupo
    ON Calificacion.grupoId = Grupo.id;


    SELECT * FROM Usuario;

    SELECT * FROM Grupo;

    SELECT * FROM GrupoEstudiante;

    SELECT * FROM Calificacion;