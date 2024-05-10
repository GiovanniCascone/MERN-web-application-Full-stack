import {AuthContext} from '../context/authContext'
import {useContext} from 'react'

export const useAuthContext = () => {
   const context = useContext(AuthContext)
   if(!context){
      console.log('errore context')
      throw Error('Contesto autenticazione non presente')
   }

   return context
}