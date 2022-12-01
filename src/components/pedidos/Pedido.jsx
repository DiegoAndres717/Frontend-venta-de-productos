import React from 'react';
import clienteAxios from '../config/axios';
import Swal from 'sweetalert2';

const Pedido = ({pedido}) => {
    
    const { cliente } = pedido;
    //console.log(pedido);

     //eliminar cliente
  const eliminarPedido = idPedido => {
    Swal.fire({
			title: '¿Estas seguro?',
			text: "Un pedido eliminado no se puede recuperar",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.value) {
                // Llamado a axios
                clienteAxios.delete(`/pedidos/${idPedido}`)
                    .then(res => {
                        Swal.fire(  
                            'Eliminado', 
                            res.data.msg, 
                            'success'
                        );
                    });
                    
			}
		});
  }

    return (
        <>
            <li className="pedido">
        <div className="info-pedido">
            <p className="id">ID: {pedido._id}</p>
            <p className="nombre">Cliente: {cliente.nombre} {cliente.apellido}</p>

            <div className="articulos-pedido">
                <p className="productos">Artículos Pedido: </p>
                <ul>
                    { pedido.pedido.map( articulos => (
                        <li key={pedido._id+articulos.producto._id}>
                        <p>{articulos.producto.nombre}</p>
                        <p>Precio: $ {articulos.producto.precio}</p>
                        <p>Cantidad: {articulos.cantidad}</p>
                    </li>
                    ))}
                </ul>
            </div>
            <p className="total">Total: $ {pedido.total} </p>
        </div>
        <div className="acciones">
            <button type="button" 
            className="btn btn-rojo btn-eliminar"
                onClick={() => eliminarPedido(pedido._id)}
            >
                <i className="fas fa-times"></i>
                Eliminar Pedido
            </button>
        </div>
    </li>
        </>
    );
};

export default Pedido;