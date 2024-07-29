import {useState} from 'react'


export const useFetchPostUpdateAuth = () => {
   const [error, setError] = useState(null)
   const [isLoading, setIsLoading] = useState(null)

   const fetchPostUpdate = async(url, metodo, data, token) => {
      setIsLoading(true)
      setError(false)
      console.log('Fetch: ', url, metodo)
      
      const response = await fetch(url, {
         method: metodo,
         headers: {
            'Content-type':'application/json',
            'Authorization': `Bearer ${token}`
         },
            body: JSON.stringify({...data})
     })

      const json = await response.json()

      if(!response.ok){
         setError(json.error)
         setIsLoading(false)
      }else{
         setIsLoading(false)
         return json
      }

   }

   return {fetchPostUpdate, error, isLoading}
}