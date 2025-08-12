const { db } = require('./src/main/config/db')

console.log('Verificando estructura de la base de datos...')

try {
  // Verificar si existen las tablas
  const tablas = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log('Tablas existentes:', tablas.map(t => t.name))

  // Verificar si existe la tabla persona
  const personaExists = tablas.some(t => t.name === 'persona')
  const rolExists = tablas.some(t => t.name === 'rol')
  const usuarioExists = tablas.some(t => t.name === 'usuario')

  if (!personaExists) {
    console.log('Creando tabla persona...')
    db.exec(`
      create table persona(
        id_persona INTEGER primary key AUTOINCREMENT,
        nombre varchar(50) not NULL,
        apellido varchar(50) not NULL,
        dni varchar(10) not NULL UNIQUE,
        direccion TEXT,
        email varchar(100),
        celular varchar(12) not NULL
      );
    `)
  }

  if (!rolExists) {
    console.log('Creando tabla rol...')
    db.exec(`
      create table rol(
        id_rol INTEGER primary key AUTOINCREMENT, 
        nombre_rol varchar(50) not NULL
      );
    `)
    
    // Insertar roles predeterminados
    console.log('Insertando roles predeterminados...')
    db.prepare('INSERT INTO rol (nombre_rol) VALUES (?)').run('Administrador')
    db.prepare('INSERT INTO rol (nombre_rol) VALUES (?)').run('Usuario')
    db.prepare('INSERT INTO rol (nombre_rol) VALUES (?)').run('Vendedor')
  }

  if (!usuarioExists) {
    console.log('Creando tabla usuario...')
    db.exec(`
      create table usuario(
        id_usuario INTEGER primary key AUTOINCREMENT,
        nombre_usuario varchar(50) not NULL,
        password varchar(50) not NULL,
        estado varchar(15) DEFAULT "Activo",
        id_persona integer not null UNIQUE,
        id_rol integer not null,
        fecha_creacion datetime DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
        FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
      );
    `)
  }

  // Verificar datos existentes
  console.log('\nConteo de registros:')
  console.log('Personas:', db.prepare('SELECT COUNT(*) as count FROM persona').get().count)
  console.log('Roles:', db.prepare('SELECT COUNT(*) as count FROM rol').get().count)
  console.log('Usuarios:', db.prepare('SELECT COUNT(*) as count FROM usuario').get().count)

  // Mostrar roles existentes
  const roles = db.prepare('SELECT * FROM rol').all()
  console.log('\nRoles disponibles:', roles)

  console.log('\nEstructura de la base de datos verificada correctamente.')

} catch (error) {
  console.error('Error al verificar la base de datos:', error)
}
