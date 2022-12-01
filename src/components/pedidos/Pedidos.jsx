import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";
import clienteAxios from "../config/axios";
import SpinnerCarga from "../layout/SpinnerCarga";
import Pedido from "./Pedido";

const Pedidos = () => {
  const navigate = useNavigate();
  const [pedidos, guardarPedidos] = useState([]);

  //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
  useEffect(() => {
    if(auth.token !== ''){
      const consultaAPI = async () => {
        try {
          const respuesta = await clienteAxios.get("/pedidos",  {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          guardarPedidos(respuesta.data);
        } catch (error) {
          if(error.response.status === 500){
            navigate('/iniciar-sesion')
        }
        }
      };
      consultaAPI();
    }else {
      navigate('/iniciar-sesion')
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidos]);

  if(!auth.auth){
    navigate('/iniciar-sesion')
  }

  //spinner de carga
  if (!pedidos.length) return <SpinnerCarga />;

  return (
    <>
      <h2>Pedidos</h2>
      <ul className="listado-pedidos">
        {pedidos.map((pedido) => (
          <Pedido key={pedido._id} pedido={pedido} />
        ))}
      </ul>
    </>
  );
};

export default Pedidos;
