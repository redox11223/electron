export const Routes = (ipcMain, db) => {
  ipcMain.handle('get-users', () => {
    const stmt = db.prepare('SELECT * FROM test')
    const users = stmt.all()
    return users
  })
  ipcMain.handle('create-user', (nombre) => {
    const stmt = db.prepare('INSERT INTO usuarios(nombre)  VALUES(?)')
    stmt.run(nombre)
    return { success: true }
  })
}
