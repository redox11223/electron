
import { FaInfoCircle } from "react-icons/fa";

export const Inventario = () => {
  return (
    <div>
        Control de Stock
        <br />
        <button className="btn btn-primary mb-3">Nueva Orden</button>

        <div className="row">
            <div className="col-6">
                ordenes
                <input type="text" className="form-control mb-3" placeholder="Buscar orden..." width=' 10px'/>
            </div>
            <div className="col-6">
                Nombre/Numero/producto
                <input type="text" className="form-control mb-3" width=' 10px' />
            </div>
        </div>
        <div className="row">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID Orden</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Aquí se renderizarían los productos */}
                    <tr>
                        <td>1</td>
                        <td>Activo</td>
                        <td>2025-01-12</td>
                        <td>Soler $ Palau</td>
                        <td>
                            <button className="btn btn-info btn-sm">Editar</button>
                            <a href="#"><FaInfoCircle size={20} style={{ marginRight: 8 }}/></a>
                            <button className="btn btn-danger btn-sm">Desactivar</button>
                        </td>
                    </tr>
                    {/* Más productos... */}
                </tbody>
            </table>
        </div>
    </div>
  )
}
