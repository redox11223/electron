import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

let db = null

export const dbConfig = () => {
  if (!db) {
    const dbPath = path.join(app.getAppPath(), 'db', 'test.db')
    db = new Database(dbPath)

    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    db.pragma('busy_timeout = 5000')
  }
  return db
}
export const closeDB = () => {
  if (db) {
    try {
      db.close()
    } catch (err) {
      console.error('Error cerrando la Base de datos:', err)
    } finally {
      db = null
    }
  }
}
