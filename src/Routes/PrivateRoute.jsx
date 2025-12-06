
import { Navigate, useLocation } from 'react-router'
import useAuth from '../Hooks/useAuth'
import LoadingSpinner from '../Components/Shared/LoadingSpinner'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner />
  if (user) return children
  return <Navigate to='/auth/login' state={location.pathname} replace='true' />
}

export default PrivateRoute
