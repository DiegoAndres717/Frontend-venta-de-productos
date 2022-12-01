import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CRMContext } from '../../context/CRMContext';
import clienteAxios from '../config/axios';

const NuevoProducto = () => {
    const navigate = useNavigate();
    //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
    })
    //archivo de imagen
    const [ archivo, guardarArchivo ] = useState('');
    //almacenar producto
    const agregarProducto = async e => { 
        e.preventDefault();

        // crear un formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        //almacenar en la DB
        try {
            const res = await clienteAxios.post('/productos', formData, {
                    headers: {
                        'Content-Type' : 'multipart/form-data',
                        Authorization: `Bearer ${auth.token}`
                    }
            });
            console.log(res)
            //lanzar alerta
            if (res.status === 200) {
                Swal.fire(
                    'Agregado Correctamente',
                    res.data.msg,
                    'success'
                )
            }
            //redireccionar
            navigate('/productos');

        } catch (error) {
            console.log(error);
            //lanzar alerta
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Vuelva a intentarlo',
            })
        }
    }

    //leer formulario
    const leerFormulario = e => {
        guardarProducto({
            ...producto,
            [e.target.name]: e.target.value
        })
    }
    //coloca la imagen en el state
    const leerArchivo = e => {
        guardarArchivo( e.target.files[0] );
    }

    return (
        <>
            <h2>Nuevo Producto</h2>

            <form
               onSubmit={agregarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                    type="text" 
                    placeholder="Nombre Producto" 
                    name="nombre"
                    onChange={leerFormulario}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                    type="number" 
                    name="precio" 
                    min="0.00" 
                    step="0.01" 
                    placeholder="Precio" 
                    onChange={leerFormulario}
                    />
                </div>
            
                <div className="campo">
                    <label>Imagen:</label>
                    <input 
                    type="file"  
                    name="imagen"   
                    onChange={leerArchivo}
                    />
                </div>

                <div className="enviar">
                        <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Agregar Producto" />
                </div>
            </form>
        </>
    );
};

export default NuevoProducto;