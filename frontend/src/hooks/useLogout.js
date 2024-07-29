import {useAuthContext} from './useAuthContext'
import {useAuthAdminContext} from '../hooksAdmin/useAuthAdminContext'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
   const {user, dispatch} = useAuthContext()
   const {admin, dispatchAdmin} = useAuthAdminContext()
   const navigate = useNavigate()

   const logout = () => {
      if(user){
         console.log('UserLogout')
         localStorage.removeItem('user')
         dispatch({type: 'LOGOUT'})
      }
      if(admin){
         console.log('Admin Logout')
         localStorage.removeItem('admin')
         dispatchAdmin({type: 'LOGOUT'})
      }
      navigate('/')
   }

   return logout
}
