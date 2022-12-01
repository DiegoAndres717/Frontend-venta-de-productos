import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";
const Navegation = () => {
  const [auth, guardarAuth] = useContext(CRMContext);

  //if(!auth.auth) return null; es lo mismo

  return (
    <>
      {auth.auth ? (
        <aside className="sidebar col-3">
          <h2>Administración</h2>
          <nav className="navegacion">
            <Link to={"/"} className="clientes">
              Clientes
            </Link>
            <Link to={"/productos"} className="productos">
              Productos
            </Link>
            <Link to={"/pedidos"} className="pedidos">
              Pedidos
            </Link>
          </nav>
        </aside>
      ) : null}
    </>
  );
};

export default Navegation;
