import { Route, Routes } from 'react-router-dom';
import InformeTrimestral from './components/InformeTrimestral/InformeTrimestral';
import PATForm from './components/PATForm/PATForm';
import PlaneacionCuatri from './components/PlaneacionCuatri/PlaneacionCuatri';
import UniversityDashboard from './UniversityDashboard';
import UniversityRoutes from './UniversityRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas principales de la aplicación */}
      <Route path="/" element={<UniversityDashboard />} />
      <Route path="/informe-trimestral" element={<InformeTrimestral />} />
      <Route path="/pat-formulario" element={<PATForm />} />
      <Route path="/planeacion-cuatri" element={<PlaneacionCuatri />} />
      
      {/* Rutas adicionales de UniversityRoutes */}
      <Route path="/*" element={<UniversityRoutes />} />
    </Routes>
  );
};

export default AppRoutes;