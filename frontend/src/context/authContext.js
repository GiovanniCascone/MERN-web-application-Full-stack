import { createContext, useReducer, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'


export const AuthContext = createContext()

export const authReducer = (state, action) => {
   switch(action.type){
      case 'LOGIN':
         return {
            user: action.payload
         }
      case 'LOGOUT':
         return {
            user: null
         }
      default:
         return { user: state }
   }
}

export const AuthContextProvider = ({children}) => {
   const [state, dispatch] = useReducer(authReducer, {
      user: null
   })
   
   const isTokenExpired = (token) => {
      if (!token) return true; // Se non c'è un token, è considerato scaduto
      const decodedToken = jwtDecode(token);
      return Date.now() >= decodedToken.exp * 1000; // Verifica se la data di scadenza è passata
    }
    

   /*Controllo eseguito prima del caricamento dell'app per verificare la presenza di un Utente già loggato*/
   useEffect (() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && !isTokenExpired(user.token)) {
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        // Rimuovi l'utente memorizzato se il token è scaduto
        localStorage.removeItem('user');
      }
   }, [])

   console.log('Stato di autenticazione utente: ', state)

   return (
      <AuthContext.Provider value={{...state, dispatch}}>
         {children}
      </AuthContext.Provider>
   )
}