import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import { CRMContext } from "../../context/CRMContext";

const EditClient = (props) => {
  const navigate = useNavigate();
  //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
  //obtene id
  const { id } = useParams();

  //clientes state
  const [cliente, datosCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });
  
  //cuando carga el componente
  useEffect(() => {
    //Query a la API
    if(auth.token !== ''){
      const consultaApi = async () => {
        try {
          const clienteConsulta = await clienteAxios.get(`/clientes/${id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
      
          //colocar los datos en el state
          datosCliente(clienteConsulta.data.cliente);
        } catch (error) {
          if(error.response.status === 500){
            navigate('/iniciar-sesion')
        }
        }
      };
      consultaApi();
    }else {
      navigate('/iniciar-sesion')
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //leer los datos del cliente
  const actualizarState = e => {
        datosCliente({
            ...cliente,
            [e.target.name]: e.target.value,
        });
    }   
    const actualizarCliente = e => {
        e.preventDefault();

        // enviar petición por axios
        clienteAxios.put(`/clientes/${cliente._id}`, cliente, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }) 
            .then(res => {
                // validar si hay errores de mongo 
                if(res.data.code === 11000) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Cliente ya esta registrado'
                    })
                } else {
                    Swal.fire(
                        'Correcto',
                        'Se actualizó Correctamente',
                        'success'
                    )
                }

                // redireccionar
                navigate('/');
            })
    }

  //validar formulario
  const validarCliente = () => {
    const { nombre, apellido, empresa, email, telefono } = cliente;

    const valido =
      !nombre === '' ||
      !apellido === '' ||
      !empresa === '' ||
      !email === '' ||
      !telefono === '';

    return valido;
  };

  return (
    <>
      <h2>Editar Cliente</h2>

      <form
        onSubmit={actualizarCliente}
      >
        <legend>Llena todos los campos</legend>
        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>
        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>
        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>
        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>
        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>
        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default EditClient;
