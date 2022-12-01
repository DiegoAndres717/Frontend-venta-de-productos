import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CRMContext } from '../../context/CRMContext';
import clienteAxios from '../config/axios';

const Login = () => {
    const navigate = useNavigate();

    //auth y token
    const [ auth, guardarAuth ] = useContext(CRMContext);

    const [ credenciales, guardarCredenciales ] = useState({});

    const iniciarSesion = async e => {
        e.preventDefault();

        //autenticar usuario
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);
            //console.log(respuesta);
            const { token } = respuesta.data;
            localStorage.setItem('token', token);

            //colocar en el state
            guardarAuth({
                token,
                auth: true
            })

            Swal.fire(
                'Login Correcto',
                'Has iniciado Sesión',
                'success'
            )
            navigate('/')

        } catch (error) {
            //console.log(error)
            if(error.response){
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.msg
                })
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Hubo un error'
                })
            }

        }
    }

    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }

    return (
        <>
            <div className="login">
                <h2>Iniciar Sesión</h2>
                <div className="contenedor-formulario">
                    <form
                        onSubmit={iniciarSesion}
                    >
                        <div className="campo">
                            <label>Email</label>
                            <input 
                            type="text" 
                            name="email"
                            placeholder='Ingresar Email' 
                            required
                            onChange={leerDatos}
                            />
                        </div>
                        <div className="campo">
                            <label>Password</label>
                            <input 
                            type="password" 
                            name="password"
                            placeholder='Ingresar Password' 
                            required
                            onChange={leerDatos}
                            />
                        </div>

                        <input type="submit" 
                        value='Iniciar Sesión' 
                        className='btn btn-verde btn-block'
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;