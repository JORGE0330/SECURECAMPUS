import { prisma } from "../utilidades/prisma";

async function cargarDatos() {
  console.log("======================================");
  console.log(" CARGANDO BASE ESTÁNDAR SECURECAMPUS");
  console.log("======================================");


  // =====================================================
  // 1. ROLES
  // =====================================================

  const rolEstudiante = await prisma.rol.upsert({
    where: {
      nombre: "ESTUDIANTE",
    },

    update: {},

    create: {
      nombre: "ESTUDIANTE",
    },
  });


  const rolProfesor = await prisma.rol.upsert({
    where: {
      nombre: "PROFESOR",
    },

    update: {},

    create: {
      nombre: "PROFESOR",
    },
  });


  const rolJefeCarrera = await prisma.rol.upsert({
    where: {
      nombre: "JEFE_CARRERA",
    },

    update: {},

    create: {
      nombre: "JEFE_CARRERA",
    },
  });


  const rolAdministrador = await prisma.rol.upsert({
    where: {
      nombre: "ADMINISTRADOR",
    },

    update: {},

    create: {
      nombre: "ADMINISTRADOR",
    },
  });

  console.log("✅ Roles listos");


  // =====================================================
  // 2. CUENTAS PRINCIPALES
  // =====================================================

  await prisma.usuario.upsert({
    where: {
      correo: "jefe@securecampus.test",
    },

    update: {
      nombre: "Jefe de Carrera",
      activo: true,
      rolId: rolJefeCarrera.id,
    },

    create: {
      nombre: "Jefe de Carrera",
      correo: "jefe@securecampus.test",
      password: "1234",
      activo: true,
      rolId: rolJefeCarrera.id,
    },
  });


  await prisma.usuario.upsert({
    where: {
      correo: "admin@securecampus.test",
    },

    update: {
      nombre: "Administrador",
      activo: true,
      rolId: rolAdministrador.id,
    },

    create: {
      nombre: "Administrador",
      correo: "admin@securecampus.test",
      password: "1234",
      activo: true,
      rolId: rolAdministrador.id,
    },
  });

  console.log("✅ Jefe de Carrera y Administrador listos");


  // =====================================================
  // 3. PROFESORES
  // =====================================================

  const datosProfesores = [
    {
      nombre: "Ana Martínez",
      correo: "ana.martinez@securecampus.test",
    },
    {
      nombre: "Carlos Hernández",
      correo: "carlos.hernandez@securecampus.test",
    },
    {
      nombre: "Laura García",
      correo: "laura.garcia@securecampus.test",
    },
    {
      nombre: "Miguel Torres",
      correo: "miguel.torres@securecampus.test",
    },
    {
      nombre: "Sofía Ramírez",
      correo: "sofia.ramirez@securecampus.test",
    },
  ];


  const profesores = [];


  for (const datos of datosProfesores) {
    const profesor = await prisma.usuario.upsert({
      where: {
        correo: datos.correo,
      },

      update: {
        nombre: datos.nombre,
        activo: true,
        rolId: rolProfesor.id,
      },

      create: {
        nombre: datos.nombre,
        correo: datos.correo,
        password: "1234",
        activo: true,
        rolId: rolProfesor.id,
      },
    });

    profesores.push(profesor);
  }


  console.log(`✅ Profesores: ${profesores.length}`);


  // =====================================================
  // 4. ESTUDIANTES
  // =====================================================

  const datosEstudiantes = [
    {
      nombre: "Alejandro López",
      correo: "alejandro.lopez@securecampus.test",
    },
    {
      nombre: "Mariana Sánchez",
      correo: "mariana.sanchez@securecampus.test",
    },
    {
      nombre: "Daniel Rodríguez",
      correo: "daniel.rodriguez@securecampus.test",
    },
    {
      nombre: "Fernanda Gómez",
      correo: "fernanda.gomez@securecampus.test",
    },
    {
      nombre: "José Hernández",
      correo: "jose.hernandez@securecampus.test",
    },
    {
      nombre: "Valeria Torres",
      correo: "valeria.torres@securecampus.test",
    },
    {
      nombre: "Diego Martínez",
      correo: "diego.martinez@securecampus.test",
    },
    {
      nombre: "Camila Flores",
      correo: "camila.flores@securecampus.test",
    },
    {
      nombre: "Sebastián Ramírez",
      correo: "sebastian.ramirez@securecampus.test",
    },
    {
      nombre: "Regina Castillo",
      correo: "regina.castillo@securecampus.test",
    },
  ];


  const estudiantes = [];


  for (const datos of datosEstudiantes) {
    const estudiante = await prisma.usuario.upsert({
      where: {
        correo: datos.correo,
      },

      update: {
        nombre: datos.nombre,
        activo: true,
        rolId: rolEstudiante.id,
      },

      create: {
        nombre: datos.nombre,
        correo: datos.correo,
        password: "1234",
        activo: true,
        rolId: rolEstudiante.id,
      },
    });

    estudiantes.push(estudiante);
  }


  console.log(`✅ Estudiantes: ${estudiantes.length}`);


  // =====================================================
  // 5. GRUPOS Y MATERIAS
  // =====================================================

  const datosGrupos = [
    {
      nombre: "DS-01",
      materia: "Desarrollo Seguro",
      profesor: profesores[0],
    },
    {
      nombre: "BD-01",
      materia: "Bases de Datos",
      profesor: profesores[1],
    },
    {
      nombre: "AA-01",
      materia: "Aprendizaje Automático",
      profesor: profesores[2],
    },
    {
      nombre: "PW-01",
      materia: "Programación Web",
      profesor: profesores[3],
    },
    {
      nombre: "SO-01",
      materia: "Sistemas Operativos",
      profesor: profesores[4],
    },
  ];


  const grupos = [];


  for (const datos of datosGrupos) {
    const grupoExistente = await prisma.grupo.findFirst({
      where: {
        nombre: datos.nombre,
      },
    });


    let grupo;


    if (grupoExistente) {
      grupo = await prisma.grupo.update({
        where: {
          id: grupoExistente.id,
        },

        data: {
          materia: datos.materia,
          profesorId: datos.profesor.id,
        },
      });

    } else {
      grupo = await prisma.grupo.create({
        data: {
          nombre: datos.nombre,
          materia: datos.materia,
          profesorId: datos.profesor.id,
        },
      });
    }


    grupos.push(grupo);
  }


  console.log(`✅ Grupos: ${grupos.length}`);


  // =====================================================
  // 6. ASIGNAR ALUMNOS A LOS GRUPOS
  // =====================================================

  const alumnosPorGrupo = [
    // DS-01
    [0, 1, 2, 3, 4, 5],

    // BD-01
    [0, 1, 4, 5, 6, 7],

    // AA-01
    [0, 2, 3, 6, 8, 9],

    // PW-01
    [1, 2, 4, 7, 8, 9],

    // SO-01
    [3, 5, 6, 7, 8, 9],
  ];


  let totalAsignaciones = 0;


  for (
    let posicionGrupo = 0;
    posicionGrupo < grupos.length;
    posicionGrupo++
  ) {

    const grupo = grupos[posicionGrupo];

    const alumnosAsignados =
      alumnosPorGrupo[posicionGrupo];


    for (
      const posicionEstudiante
      of alumnosAsignados
    ) {

      const estudiante =
        estudiantes[posicionEstudiante];


      await prisma.grupoEstudiante.upsert({
        where: {
          grupoId_estudianteId: {
            grupoId: grupo.id,
            estudianteId: estudiante.id,
          },
        },

        update: {},

        create: {
          grupoId: grupo.id,
          estudianteId: estudiante.id,
        },
      });


      totalAsignaciones++;
    }
  }


  console.log(
    `✅ Inscripciones en grupos: ${totalAsignaciones}`
  );


  // =====================================================
  // 7. CALIFICACIONES DE PRUEBA
  // =====================================================

  const calificaciones = [

    // ===================================================
    // DESARROLLO SEGURO
    // ===================================================

    {
      grupo: grupos[0],
      estudiante: estudiantes[0],
      valor: 92,
    },
    {
      grupo: grupos[0],
      estudiante: estudiantes[1],
      valor: 95,
    },
    {
      grupo: grupos[0],
      estudiante: estudiantes[2],
      valor: 88,
    },
    {
      grupo: grupos[0],
      estudiante: estudiantes[3],
      valor: 90,
    },
    {
      grupo: grupos[0],
      estudiante: estudiantes[4],
      valor: 85,
    },
    {
      grupo: grupos[0],
      estudiante: estudiantes[5],
      valor: 93,
    },


    // ===================================================
    // BASES DE DATOS
    // ===================================================

    {
      grupo: grupos[1],
      estudiante: estudiantes[0],
      valor: 87,
    },
    {
      grupo: grupos[1],
      estudiante: estudiantes[1],
      valor: 91,
    },
    {
      grupo: grupos[1],
      estudiante: estudiantes[4],
      valor: 89,
    },
    {
      grupo: grupos[1],
      estudiante: estudiantes[5],
      valor: 94,
    },
    {
      grupo: grupos[1],
      estudiante: estudiantes[6],
      valor: 82,
    },
    {
      grupo: grupos[1],
      estudiante: estudiantes[7],
      valor: 96,
    },


    // ===================================================
    // APRENDIZAJE AUTOMÁTICO
    // ===================================================

    {
      grupo: grupos[2],
      estudiante: estudiantes[0],
      valor: 95,
    },
    {
      grupo: grupos[2],
      estudiante: estudiantes[2],
      valor: 86,
    },
    {
      grupo: grupos[2],
      estudiante: estudiantes[3],
      valor: 91,
    },
    {
      grupo: grupos[2],
      estudiante: estudiantes[6],
      valor: 88,
    },
    {
      grupo: grupos[2],
      estudiante: estudiantes[8],
      valor: 97,
    },
    {
      grupo: grupos[2],
      estudiante: estudiantes[9],
      valor: 90,
    },


    // ===================================================
    // PROGRAMACIÓN WEB
    // ===================================================

    {
      grupo: grupos[3],
      estudiante: estudiantes[1],
      valor: 94,
    },
    {
      grupo: grupos[3],
      estudiante: estudiantes[2],
      valor: 90,
    },
    {
      grupo: grupos[3],
      estudiante: estudiantes[4],
      valor: 84,
    },
    {
      grupo: grupos[3],
      estudiante: estudiantes[7],
      valor: 93,
    },
    {
      grupo: grupos[3],
      estudiante: estudiantes[8],
      valor: 89,
    },
    {
      grupo: grupos[3],
      estudiante: estudiantes[9],
      valor: 96,
    },


    // ===================================================
    // SISTEMAS OPERATIVOS
    // ===================================================

    {
      grupo: grupos[4],
      estudiante: estudiantes[3],
      valor: 87,
    },
    {
      grupo: grupos[4],
      estudiante: estudiantes[5],
      valor: 92,
    },
    {
      grupo: grupos[4],
      estudiante: estudiantes[6],
      valor: 85,
    },
    {
      grupo: grupos[4],
      estudiante: estudiantes[7],
      valor: 90,
    },
    {
      grupo: grupos[4],
      estudiante: estudiantes[8],
      valor: 94,
    },
    {
      grupo: grupos[4],
      estudiante: estudiantes[9],
      valor: 88,
    },
  ];


  for (const datos of calificaciones) {
    await prisma.calificacion.upsert({
      where: {
        grupoId_estudianteId: {
          grupoId: datos.grupo.id,
          estudianteId: datos.estudiante.id,
        },
      },

      update: {
        valor: datos.valor,
      },

      create: {
        grupoId: datos.grupo.id,
        estudianteId: datos.estudiante.id,
        valor: datos.valor,
      },
    });
  }


  console.log(
    `✅ Calificaciones: ${calificaciones.length}`
  );


  // =====================================================
  // TERMINADO
  // =====================================================

  console.log("");
  console.log("======================================");
  console.log(" BASE ESTÁNDAR CARGADA CORRECTAMENTE ✅");
  console.log("======================================");
  console.log("");

  console.log("Cuentas principales:");
  console.log("");

  console.log("Jefe de Carrera:");
  console.log("jefe@securecampus.test");
  console.log("Contraseña: 1234");
  console.log("");

  console.log("Administrador:");
  console.log("admin@securecampus.test");
  console.log("Contraseña: 1234");
  console.log("");

  console.log("Profesores: 5");
  console.log("Estudiantes: 10");
  console.log("Grupos: 5");

  console.log("");
  console.log("Contraseña estándar: 1234");
  console.log("");
}


cargarDatos()
  .catch((error) => {

    console.error("");
    console.error(
      "❌ Error al cargar los datos:"
    );

    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });