import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import Cadastro from '../Pages/Cadastro.jsx';
import Home from '../Home/index.jsx';
import Header from '../Header/index.jsx';
import DashboardUsuario from '../Dashboards/Usuario/DashboardUsuario.jsx';
import Administrativo from '../Dashboards/Admin/Administrativo.jsx';

const Paths = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard/usuario" element={<DashboardUsuario />} />
      <Route path="/dashboard/admin" element={<Administrativo />} />
    </Routes>
  </BrowserRouter>
);

export default Paths;