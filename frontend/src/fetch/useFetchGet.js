import {useState} from 'react'

export const useFetchGet = () => {
   const [error, setError] = useState(null)
   const [isLoading, setIsLoading] = useState(null)


   const fetchGet = async(url) => {
      setError(null)
      setIsLoading(true)
      
      const response = await fetch(url)
      const json = await response.json()

      if(!response.ok){
         setIsLoading(false)
         setError('Errore nel recupero DATI')
      }else{
         console.log(json)
         setIsLoading(false)
         return json
      }

   }

   return {fetchGet, error, isLoading}
}