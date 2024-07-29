import {useEffect, useState} from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import AlertDanger from '../components/AlertDanger'
import AlertInfo from '../components/AlertInfo'

const Store = () => {
   const {user} = useAuthContext()

   const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
   const [prodotti, setProdotti] = useState()

   useEffect(() => {
      const fetchEffect = async() => {
         setProdotti(await fetchGetDelete('/api/store/', 'GET', user?.token))
      }

      fetchEffect()
   },[user?.token])
   
   return(
      <>
      <h5 className='text-center display-5 text-primary-emphasis mb-5'>Magazzino</h5>
      

      <div className='text-center h-auto w-auto m-2 mx-5 px-5'>
         <div className='row text-success border border-2 border-primary rounded m-2'>
            <h4 className='col'>PRODOTTO</h4>
            <h4 className='col'>PESO</h4>
         </div>

         {isLoading && <AlertInfo message={'Caricamento Dati'} />}
         {error && <AlertDanger message={error} />}

         {prodotti
         &&
         prodotti.map((prodotto) => (
            <div className='row border border-warning rounded m-2' key={prodotto._id}>
               <h5 className='col text-success-emphasis'>{prodotto.prodotto}</h5>
               <h5 className='col'>{prodotto.peso} kg</h5>
            </div>
            ))
         }
      </div>
      </>
   )

}

export default Store