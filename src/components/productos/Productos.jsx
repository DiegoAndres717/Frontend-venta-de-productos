import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';
import clienteAxios from '../config/axios';
import SpinnerCarga from '../layout/SpinnerCarga';
import Producto from './Producto';

const Productos = () => {
    const navigate = useNavigate();
    const [ productos, guardarProductos ] = useState([]);

    //valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
    //consultar API
    useEffect(() => {
        if(auth.token !== ''){
            //query a la API
            const consultarAPI = async () => {
              try {
                const productosConsulta = await clienteAxios.get('/productos', {
                    headers: {
                      Authorization: `Bearer ${auth.token}`,
                    },
                  });
                  guardarProductos(productosConsulta.data.productos);
              } catch (error) {
                if(error.response.status === 500){
                    navigate('/iniciar-sesion')
                }
              }
            }
            //llamado a la API
            consultarAPI();
        }else {
            navigate('/iniciar-sesion')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productos])
    
    if(!auth.auth){
        navigate('/iniciar-sesion')
      }

    //spinner de carga
    if(!productos.length) return <SpinnerCarga />

    return (
        <>
            <h2>Productos</h2>

            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>
            <ul className="listado-productos">
                {productos.map( producto => (
                    <Producto 
                        key={producto._id}
                        producto={producto}
                    />
                ))}
            </ul>
        </>
    );
};

export default Productos;