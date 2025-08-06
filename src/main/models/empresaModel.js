export class EmpresaModel {
  constructor(db) {
    this.db = db
  }
  getAllEmpresas() {
    try {
      const stmt = this.db.prepare('SELECT * FROM empresa')
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al conseguir las empresas ${error.message}`)
    }
  }
  createEmpresa({ razon_social, numero_ruc, direccion, email, celular }) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO empresa(razon_social, numero_ruc, direccion, email, celular) VALUES(?,?,?,?,?)'
      )
      const empresa = stmt.run(razon_social, numero_ruc, direccion, email, celular)
      return { id: empresa.lastInsertRowId, nombre: razon_social, ruc: numero_ruc }
    } catch (error) {
      throw new Error(`Error al crear la empresa: ${error.message}`)
    }
  }
  getEmpresaByRuc(ruc) {
    try {
      const stmt = this.db.prepare('SELECT numero_ruc FROM empresa WHERE numero_ruc=?')
      return stmt.get(ruc)
    } catch (error) {
      throw new Error(`No se pudo conseguir el Ruc: ${error.message}`)
    }
  }
}
