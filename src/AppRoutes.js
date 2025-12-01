import { Route, Routes } from 'react-router-dom';
import UniversityRoutes from './UniversityRoutes';

const AppRoutes = ({ onLogout }) => {
  return (
    <Routes>
      <Route path="/*" element={<UniversityRoutes onLogout={onLogout} />} />
    </Routes>
  );
};

export default AppRoutes;