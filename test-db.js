const Database = require('better-sqlite3');
const path = require('path');

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'db', 'test.db');
const db = new Database(dbPath);

console.log('=== Verificando estructura de la base de datos ===');

try {
  // Verificar si existen las tablas principales
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tablas existentes:', tables.map(t => t.name));

  // Verificar estructura de la tabla venta
  console.log('\n=== Estructura de tabla venta ===');
  const ventaInfo = db.prepare('PRAGMA table_info(venta)').all();
  console.log(ventaInfo);

  // Verificar si hay datos en clientes
  console.log('\n=== Clientes existentes ===');
  const clientes = db.prepare('SELECT * FROM clientes LIMIT 5').all();
  console.log(clientes);

  // Verificar si hay datos en empresa
  console.log('\n=== Empresas existentes ===');
  const empresas = db.prepare('SELECT * FROM empresa LIMIT 5').all();
  console.log(empresas);

  // Verificar foreign keys
  console.log('\n=== Estado de foreign keys ===');
  const fkStatus = db.prepare('PRAGMA foreign_keys').get();
  console.log(fkStatus);

  // Si no hay empresas, crear una de prueba
  if (empresas.length === 0) {
    console.log('\n=== Creando empresa de prueba ===');
    const insertEmpresa = db.prepare(`
      INSERT INTO empresa (razon_social, numero_ruc, direccion, email, celular) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const empresaResult = insertEmpresa.run('Empresa Test', '12345678901', 'Dirección Test', 'test@test.com', '123456789');
    console.log('Empresa creada con ID:', empresaResult.lastInsertRowId);

    // Crear cliente asociado
    const insertCliente = db.prepare('INSERT INTO clientes (id_empresa) VALUES (?)');
    const clienteResult = insertCliente.run(empresaResult.lastInsertRowId);
    console.log('Cliente creado con ID:', clienteResult.lastInsertRowId);
  }

  // Probar inserción en venta sin id_usuario
  console.log('\n=== Probando inserción en venta ===');
  const clienteTest = db.prepare('SELECT id_cliente FROM clientes LIMIT 1').get();
  if (clienteTest) {
    try {
      const insertVenta = db.prepare('INSERT INTO venta(id_cliente, fecha, total, estado) VALUES(?, ?, ?, ?)');
      const ventaResult = insertVenta.run(clienteTest.id_cliente, '2025-08-07', 100.50, 'completada');
      console.log('Venta de prueba creada con ID:', ventaResult.lastInsertRowId);
      
      // Eliminar la venta de prueba
      db.prepare('DELETE FROM venta WHERE id_venta = ?').run(ventaResult.lastInsertRowId);
      console.log('Venta de prueba eliminada');
    } catch (error) {
      console.error('Error al insertar venta:', error.message);
    }
  }

} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
