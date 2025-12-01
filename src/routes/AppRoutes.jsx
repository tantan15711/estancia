import { Route, Routes } from 'react-router-dom';
import UniversityLayout from '../components/layout/UniversityLayout';
import Dashboard from '../components/dashboard/Dashboard';

const AppRoutes = ({ onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<UniversityLayout onLogout={onLogout} />}>
        <Route index element={<Dashboard />} />
        {/* Aquí puedes agregar más rutas hijas si las necesitas */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;