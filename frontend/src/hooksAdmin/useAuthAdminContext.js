import {AuthAdminContext} from '../context/authAdminContext'
import {useContext} from 'react'

export const useAuthAdminContext = () => {
   const context = useContext(AuthAdminContext)
   if(!context){
      throw Error('Contesto autenticazione non presente')
   }

   return context
}