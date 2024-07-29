import { useState, useEffect } from "react"
import { useAuthAdminContext } from '../hooksAdmin/useAuthAdminContext'
import {useFetchGet} from '../fetch/useFetchGet'
import BuyerSignup from "../componentsAdmin/BuyerSignup"
import BuyerUpdateDelete from "../componentsAdmin/BuyerUpdateDelete"
import AlertInfo from "../components/AlertInfo"
import AlertDanger from "../components/AlertDanger"
import BuyerList from "../components/BuyerList"


const Buyer = () => {
   const {admin} = useAuthAdminContext()
   const {fetchGet, error, isLoading} = useFetchGet()
   const [buyers, setBuyers] = useState()
   const [reload, setReload] = useState()

   useEffect(() => {
      const fetchEffect = async() => {
         const acquirenti = await fetchGet('/api/buyer/')
         setBuyers(acquirenti)
      }

      fetchEffect()
   },[reload])

   return (
   <div className="container text-center">

      <h5 className='display-5 text-center text-primary-emphasis my-3'>Gestione Clienti</h5>

      {isLoading && <AlertInfo message={'Caricamento Dati'} />}
      {error && <AlertDanger message={'Errore recupero dati'} />}

      <BuyerSignup admin={admin} reload={reload} setReload={setReload} />
      <BuyerUpdateDelete admin={admin} reload={reload} setReload={setReload} buyers={buyers} />

      <div className='container-fluid text-center my-2 mt-5'>
         <h3 className='text-primary-emphasis'>Lista Acquirenti</h3>
         <div className='m-1 px-5'>
            <div className='row border border-primary border-2 text-success fw-bold'>
               <div className='col'>NOME</div>
               <div className='col'>LIMITE DI SPESA</div>
            </div>
            {isLoading && <AlertInfo message={'Caricamento Dati'} />}
            {error && <AlertDanger message={error} />}

            {buyers && <BuyerList acquirenti={buyers} />}
         </div>
      </div>

   </div>
   )
}

export default Buyer