const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'test.db');

console.log('Verificando base de datos...');
console.log('Ruta:', dbPath);
console.log('Existe:', fs.existsSync(dbPath));

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log('Tamaño:', stats.size, 'bytes');
  console.log('Última modificación:', stats.mtime);
}
