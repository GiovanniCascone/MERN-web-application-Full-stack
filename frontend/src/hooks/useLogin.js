import {useAuthContext} from './useAuthContext'
import {useAuthAdminContext} from '../hooksAdmin/useAuthAdminContext'
import {useState} from 'react'


export const useLogin = () => {
   const [error, setError] = useState(null)
   const [isLoading, setIsLoading] = useState(null)
   const {dispatch} = useAuthContext()
   const {dispatchAdmin} = useAuthAdminContext()
   

   const login = async(identificativo, nome_box, password, amministratore) => {
      setIsLoading(true)
      setError(false)

      console.log(amministratore, nome_box, password, identificativo)

      const response = await fetch('/api/user/login', {
         method: 'POST',
         headers: {'Content-type':'application/json'},
         body: JSON.stringify({identificativo, nome_box, password, admin: amministratore})
     })

      const json = await response.json()

      if(!response.ok){
         setError(json.error)
         setIsLoading(false)
      }else if(!amministratore){
         localStorage.setItem('user', JSON.stringify(json))
         dispatch({type: 'LOGIN', payload: json})
         setIsLoading(false)
         console.log('useLogin Dispatch Box')
      }else{
         localStorage.setItem('admin', JSON.stringify(json))
         dispatchAdmin({type: 'LOGIN', payload: json})
         setIsLoading(false)
         console.log('useLogin Dispatch Admin')
      }

   }

   return {login, error, isLoading}
}
