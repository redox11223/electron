import logoSeblaza from "../assets/seblaza.png";

export const Header = ({ userEmail }) => {
    return (
        <div className="header-container w-100 fixed-top" style={{  height: "80px", display: "flex", alignItems: "center" }}>
            <div className="container-fluid">
                <div className="row align-items-center w-100" style={{ marginBottom: "0px" }}>
                    {/* Columna 1: Logo */}
                    <div className="col-4 d-flex align-items-center justify-content-start">
                        <img src={logoSeblaza} alt="Logo" style={{ width: "160px" }} />
                    </div>
                    {/* Columna 2: Vacía */}
                    <div className="col-4"></div>
                    {/* Columna 3: Usuario */}
                    <div className="col-4 text-end d-flex align-items-center justify-content-end">
                        <span className="me-3">usuario: {userEmail}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;