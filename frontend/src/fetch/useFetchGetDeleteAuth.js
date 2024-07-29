import {useState} from 'react'

export const useFetchGetDeleteAuth = () => {
   const [error, setError] = useState(null)
   const [isLoading, setIsLoading] = useState(null)

   //FUNCTION GET OR DELETE
   const fetchGetDelete = async(url, metodo, token) => {
      console.log('Fetch: ', url, metodo)
      setError(null)
      setIsLoading(true)

      const response = await fetch(url, {
         method: metodo,
         headers: {"Authorization": `Bearer ${token}`}
      })
      const json = await response.json()

      if(!response.ok){
         setIsLoading(false)
         setError(json.error)
      }else{
         setIsLoading(false)
         return json
      }

   }

   return {fetchGetDelete, error, isLoading}
}