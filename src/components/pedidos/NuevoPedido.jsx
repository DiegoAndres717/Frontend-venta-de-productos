import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CRMContext } from '../../context/CRMContext';
import clienteAxios from '../config/axios';
import FormCantidaProducto from './FormCantidaProducto';
import FromBuscarProducto from './FromBuscarProducto';

const NuevoPedido = () => {
    let navigate = useNavigate();

  //valores del context
  const [auth, guardarAuth] = useContext(CRMContext );
    //extraer id del cliente
    const { id } = useParams();
    //state
    const [ cliente, guardarCliente ] = useState({});
    const [ busqueda, guardarBusqueda ] = useState('');
    const [ productos, guardarProductos ] = useState([]);
    const [ total, guardarTotal ] = useState(0);

    useEffect(() => {
        //obtener el cliente
        if(auth.token !== ''){
            const consultaAPI = async () => {
                try {
                    const resultado = await clienteAxios.get(`/clientes/${id}`, {
                        headers: {
                          Authorization: `Bearer ${auth.token}`,
                        },
                      });
                    //console.log(resultado.data.cliente);
                    guardarCliente(resultado.data.cliente)
                } catch (error) {
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion')
                    }
                }
            }
            consultaAPI();
            //actualizamos el total
            actualizarTotal();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productos])
    
    const buscarProducto = async e => {
        e.preventDefault();

        //obtener productos de la busqueda
        const resultaBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
        //console.log(resultaBusqueda.data)
        //si no hay resultado una alerta y si si hay al state se va
        if (resultaBusqueda.data[0]){
            let productoResultado = resultaBusqueda.data[0];
            //agregar la llave producto
            productoResultado.producto = resultaBusqueda.data[0]._id
            productoResultado.cantidad = 0;
            //console.log(productoResultado)

            //ponerlo en el state
            guardarProductos([...productos, productoResultado])
        }else{
            //no hay resultado
            Swal.fire({
                icon: 'error',
                title: 'No Resultados',
                text: 'No hay resultados'
            })
        }
    }
    //almacenar una busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda( e.target.value );
    }
    //acualizar cantidad de productos
    const restarProductos = i => {
        //copiar el arreglo original
        const todosProductos = [...productos];
        //validar si está en cero
        if(todosProductos[i].cantidad === 0) return;

        //decremento
        todosProductos[i].cantidad--

        //guardar en el state
        guardarProductos(todosProductos);
    }
    const sumarProductos = i => {
        //copiar el arreglo original
        const todosProductos = [...productos];

         //incremento
         todosProductos[i].cantidad++

         //guardar en el state
         guardarProductos(todosProductos);
    }
    //eliminar producto del state
    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter( producto => producto.producto !== id );

        guardarProductos(todosProductos);
    }

    //actualizar total a pagar
    const actualizarTotal = () => {
        if(productos.length === 0) {
            guardarTotal(0)
            return;
        }
        //calcular nuevo total
        let nuevoTotal = 0;

        //recorrer productos y sus cantidades
        productos.map( producto => nuevoTotal += (producto.cantidad * producto.precio));

        //almacenar el total
        guardarTotal(nuevoTotal);

    }
    //almacena el pedido en db
    const realizarPedido = async e => {
        e.preventDefault();

        
        //construir el objeto
        const pedido = {
            "cliente": id,
            "pedido": productos,
            "total": total
        }
        //console.log(pedido);
        //almacenar en db
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido );

        //leer resultado
        if(resultado.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: "Se agregó un nuevo pedido"
            })
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Error',
                text: 'Vuelva a Intentarlo'
            })
        }
        navigate('/pedidos')
    }
    //verificar si esta autenticado o no
  if(!auth.auth && localStorage.getItem('token') === auth.token){
    navigate('/iniciar-sesion')
  }

    return (
        <>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                <p>Telefono: {cliente.telefono}</p>
            </div>

            <FromBuscarProducto 
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />
                <ul className="resumen">
                    {productos.map((producto, index) => (
                        <FormCantidaProducto
                            key={producto.producto}
                            producto={producto}
                            restarProductos={restarProductos}
                            sumarProductos={sumarProductos}
                            eliminarProductoPedido={eliminarProductoPedido}
                            index={index}
                        />
                    ))}
                </ul>
                <p className='total'>Total a Pagar: <span>$ {total}</span></p>
                { total > 0 ? (
                    <form
                        onSubmit={realizarPedido}
                    >
                        <input type="submit"
                            className='btn btn-verde btn-block'
                            value='Realizar Pedido'
                        />
                    </form>
                ) : null }
        </>
    );
};

export default NuevoPedido;