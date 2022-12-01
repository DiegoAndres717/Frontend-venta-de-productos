import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CRMContext } from '../../context/CRMContext';
import clienteAxios from '../config/axios';
import SpinnerCarga from '../layout/SpinnerCarga';

const EditarProducto = () => {

    const { id } = useParams();
    //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
    // state
    const [ producto, guardarProducto ] = useState({
        nombre: '',
        precio: '',
        imagen: '',
    });
    //archivo de imagen
    const [ archivo, guardarArchivo ] = useState('');

    //cuando components carga
    useEffect(() => {
        if(auth.token !== ''){
            //consulta a la API
            const consultaApi = async () => {
                try {
                    const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
                        headers: {
                          Authorization: `Bearer ${auth.token}`,
                        },
                      });
                    //console.log(productoConsulta.data);
                    guardarProducto(productoConsulta.data.producto);
                } catch (error) {
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion')
                    }
                }
            }
          consultaApi();
        }else {
            navigate('/iniciar-sesion')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    //editar producto
    const navigate = useNavigate();
    const editarProducto = async e => {
        e.preventDefault();

        // crear un formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        //almacenar en la DB
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData);
            //console.log(res)
            //lanzar alerta
            if (res.status === 200) {
                Swal.fire(
                    'Editado Correctamente',
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
    //extraer los valores del state
    const { nombre, precio, imagen } = producto;

    if(!nombre || !precio || !imagen ) return <SpinnerCarga/>

    return (
        <>
            <h2>Editar Producto</h2>

            <form
               onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                    type="text" 
                    placeholder="Nombre Producto" 
                    name="nombre"
                    onChange={leerFormulario}
                    defaultValue={nombre}
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
                    defaultValue={precio}
                    />
                </div>
            
                <div className="campo">
                    <label>Imagen:</label>
                    { imagen ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt="Imagen" width='300'/>
                    ) : null}
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
                        value="Editar Producto" />
                </div>
            </form>
        </>
    );
};

export default EditarProducto;