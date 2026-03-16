import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { token, username } = useSelector(state => state.auth)

  const isAuthenticated = !!token

  const handleLogout = () => {
    dispatch(logout())
  }

  return {
    token,
    username,
    isAuthenticated,
    logout: handleLogout,
  }
}
