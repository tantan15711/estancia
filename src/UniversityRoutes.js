import { Route, Routes } from 'react-router-dom';
import InformeTrimestral from './components/InformeTrimestral/InformeTrimestral';
import PATForm from './components/PATForm/PATForm';
import PlaneacionCuatri from './components/PlaneacionCuatri/PlaneacionCuatri';
import Dashboard from './Dashboard'; // ← Corregido: Dashboard, no UniversityOashboard
import UniversityLayout from './UniversityLayout';

const UniversityRoutes = ({ onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<UniversityLayout onLogout={onLogout} />}>
        <Route index element={<Dashboard />} />
        <Route path="informe-trimestral" element={<InformeTrimestral />} />
        <Route path="pat-formulario" element={<PATForm />} />
        <Route path="planeacion-cuatri" element={<PlaneacionCuatri />} />
      </Route>
    </Routes>
  );
};

export default UniversityRoutes;