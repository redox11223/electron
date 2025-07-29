import logoSeblaza from "../assets/logoSeblaza.webp";

{/*export const Header = ({ userName = "NombreUsuario", tipoUsuario = "Tusuario" }) => { */ }
export const Header = ({ userEmail }) => {
    return (
        <div className="header-container w-100 py-2 fixed-top" style={{ background: "#51a3f5ff" }}>
            <div className="container-fluid">

                <div className="row align-items-center">
                    {/* Columna 1: Logo */}
                    <div className="col-4 d-flex align-items-center">
                        <img src={logoSeblaza} alt="Logo" style={{ height: "60px", width: "100px" }} />
                    </div>
                    {/* Columna 2: Vacía */}
                    <div className="col-4"></div>
                    {/* Columna 3: Usuario */}
                    <div className="col-4 text-end">
                        <span className="me-3">usuario: {userEmail}</span>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;