export class CompraModel {
  constructor(db) {
    this.db = db
  }
  getAllCompras() {
    const stmt = this.db.prepare('SELECT * FROM compra')
  }
}
