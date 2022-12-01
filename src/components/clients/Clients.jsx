import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";
import clienteAxios from "../config/axios";
import SpinnerCarga from "../layout/SpinnerCarga";
import Client from "./Client";

const Clients = () => {
    const navigate = useNavigate();
  const [clientes, guardarClientes] = useState([]);

  //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
  //console.log(auth)
    
  useEffect(() => {
    if(auth.token !== ''){
        //Query a al API
        const consultarAPI = async () => {
          try {
            const getClientes = await clienteAxios.get("/clientes", {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              });
              //console.log(getClientes.data)
        
              //colocar resultado en el state
              guardarClientes(getClientes.data.clientes);
          } catch (error) {
            if(error.response.status === 500){
                navigate('/iniciar-sesion')
            }
          }
        };
        consultarAPI();
    }else {
        navigate('/iniciar-sesion')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes]);
  //si state sta false
  if(!auth.auth){
    navigate('/iniciar-sesion')
  }

  //spinner de carga
  if (!clientes.length) return <SpinnerCarga />;

  return (
    <>
      <h2>Clientes</h2>
      <Link to={"clientes/nuevos"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Client key={cliente._id} cliente={cliente} />
        ))}
      </ul>
    </>
  );
};

export default Clients;
