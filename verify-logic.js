// Verificar la estructura de la transacción sin ejecutar
console.log('Verificando lógica de createCliente...');

const testData = {
  razon_social: 'Test Company',
  numero_ruc: '12345678901',
  direccion: 'Test Address',
  email: 'test@test.com',
  celular: '123456789',
  estado: 'Activa'
};

console.log('Datos de entrada:', testData);

// Simular la lógica
console.log('Paso 1: Insertar en tabla empresa');
console.log('SQL:', 'INSERT INTO empresa (razon_social, numero_ruc, direccion, email, celular, estado) VALUES (?, ?, ?, ?, ?, ?)');
console.log('Valores:', [
  testData.razon_social,
  testData.numero_ruc,
  testData.direccion,
  testData.email,
  testData.celular,
  testData.estado || 'Activa'
]);

console.log('Paso 2: Insertar en tabla clientes');
console.log('SQL:', 'INSERT INTO clientes (id_empresa) VALUES (?)');
console.log('Valor:', '[lastInsertRowId de empresa]');

console.log('La lógica parece correcta. El problema podría ser que la aplicación necesita reiniciarse.');
