import { createContext, useReducer, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'


export const AuthAdminContext = createContext()

export const authReducer = (stateAdmin, action) => {
   switch(action.type){
      case 'LOGIN':
         return {
            admin: action.payload
         }
      case 'LOGOUT':
         return {
            admin: null
         }
      default:
         return { admin: stateAdmin }
   }
}

export const AuthAdminContextProvider = ({children}) => {
   const [stateAdmin, dispatchAdmin] = useReducer(authReducer, {
      admin: null
   })
   
   const isTokenExpired = (token) => {
      if (!token) return true; // Se non c'è un token, è considerato scaduto
      const decodedToken = jwtDecode(token);
      return Date.now() >= decodedToken.exp * 1000; // Verifica se la data di scadenza è passata
   }

   /*Controllo eseguito prima del caricamento dell'app per verificare la presenza di un Utente già loggato*/
   useEffect (() => {
      const admin = JSON.parse(localStorage.getItem('admin'))
      if (admin && !isTokenExpired(admin.token)) {
         dispatchAdmin({ type: 'LOGIN', payload: admin });
       } else {
         // Rimuovi l'utente memorizzato se il token è scaduto
         localStorage.removeItem('admin');
       }
   }, [])

   console.log('Stato di autenticazione Admin: ', stateAdmin)

   return (
      <AuthAdminContext.Provider value={{...stateAdmin, dispatchAdmin}}>
         {children}
      </AuthAdminContext.Provider>
   )
}