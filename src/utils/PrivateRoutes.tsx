import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const PrivateRoutes = () => {
  
  const token = Cookies.get('token');
  const auth = token !== undefined;

  return auth ? <Outlet /> : <Navigate to='/login' />;
}

export default PrivateRoutes;