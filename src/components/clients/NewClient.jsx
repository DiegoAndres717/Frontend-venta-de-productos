import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import { CRMContext } from "../../context/CRMContext";

const NewClient = () => {
  const navigate = useNavigate();

  //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  const [cliente, guardarCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });
  //ller los datos del cliente
  const actualizarState = e => {
    guardarCliente({
      ...cliente,
            [e.target.name]: e.target.value
        })
  }
  //agregar un cliente 
  const agregarCliente = e => {
    e.preventDefault();

    //enviar peticion a axios
    clienteAxios.post('/clientes', cliente, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then( res => {
        //validar errores de mongo
        if(res.data.code === 11000){
            Swal.fire({
              icon: 'error',
              title: 'Hubo un error!',
              text: 'Cliente ya registrado'
            })
        }else{
          Swal.fire(
            'Se agregó el Cliente!',
            res.data.msg,
            'success'
          )
        }

        //redireccionar
        navigate('/')
      });
  }

  //validar formulario
  const validarCliente = () => {
    const { nombre, apellido, empresa, email, telefono } = cliente;

    let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length;

    return valido;
  }

  //verificar si esta autenticado o no
  if(!auth.auth && localStorage.getItem('token') === auth.token){
    navigate('/iniciar-sesion')
  }

  return (
    <>
      <h2>Nuevo Cliente</h2>

      <form 
        onSubmit={agregarCliente}
      >
        <legend>Llena todos los campos</legend>
        <div className="campo">
          <label>Nombre:</label>
          <input type="text" 
          placeholder="Nombre Cliente" 
          name="nombre" 
          onChange={actualizarState}
          />
        </div>
        <div className="campo">
          <label>Apellido:</label>
          <input type="text" 
          placeholder="Apellido Cliente" 
          name="apellido" 
          onChange={actualizarState}
          />
        </div>
        <div className="campo">
          <label>Empresa:</label>
          <input type="text" 
          placeholder="Empresa Cliente" 
          name="empresa" 
          onChange={actualizarState}
          />
        </div>
        <div className="campo">
          <label>Email:</label>
          <input type="email" 
          placeholder="Email Cliente" 
          name="email" 
          onChange={actualizarState}
          />
        </div>
        <div className="campo">
          <label>Teléfono:</label>
          <input type="tel" 
          placeholder="Teléfono Cliente" 
          name="telefono" 
          onChange={actualizarState}
          />
        </div>
        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default NewClient;
