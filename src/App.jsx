import React, { useContext } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Clients from "./components/clients/Clients";
import EditClient from "./components/clients/EditClient";
import NewClient from "./components/clients/NewClient";
import Header from "./components/layout/Header";
import Navegation from "./components/layout/Navegation";
import NuevoPedido from "./components/pedidos/NuevoPedido";
import Pedidos from "./components/pedidos/Pedidos";
import EditarProducto from "./components/productos/EditarProducto";
import NuevoProducto from "./components/productos/NuevoProducto";
import Productos from "./components/productos/Productos";
import { CRMContext, CRMProvider } from "./context/CRMContext";

function App() {

  const [ auth, guardarAuth ] = useContext(CRMContext);

  return (
      <HashRouter>
        <CRMProvider value={[ auth, guardarAuth ]}>
        <Header />
        <div className="grid contenedor contenido-principal">
          <Navegation />
       
        <main className="caja-contenido col-9">
          {/* TODO : Routing a los diferentes componentes */}
          <Routes>
              <Route path="/" element={ <Clients/>} />
              <Route path="clientes/nuevos" element={ <NewClient />}/>
              <Route path="clientes/editar/:id" element={ <EditClient />}/>

              <Route path="/productos" element={ <Productos/>} />
              <Route path="/productos/nuevo" element={ <NuevoProducto/>} />
              <Route path="/productos/editar/:id" element={ <EditarProducto/>} />
              
              <Route path="/pedidos" element={ <Pedidos/>} />
              <Route path="/pedidos/nuevo/:id" element={ <NuevoPedido/>} />

              <Route path="/iniciar-sesion" element={ <Login/>} />
              <Route path="/crear-cuenta" element={ <Login/>} />
          </Routes>
        </main>
        </div>
        </CRMProvider>
      </HashRouter>
  );
}

export default App;
