import '../assets/productos.css'

export const Productos = () => {
  return (
    <>
      <h2>Venta</h2>
      <div className="productos-container">
        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-primary mb-3">Agregar Nuevo Producto</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input type="text" className="form-control mb-3" placeholder="Buscar producto..." />
          </div>
          <div className="col-md-6">
            <button className="btn btn-secondary mb-3">Aplicar filtro</button>
          </div>
        </div>
        <div className="row">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí se renderizarían los productos */}
              <tr>
                <td>1</td>
                <td>Producto 1</td>
                <td>$10.00</td>
                <td>100</td>
                <td>
                  <button className="btn btn-info btn-sm">Editar</button>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
              {/* Más productos... */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Productos
