import { useEffect, useState } from "react"
import UserSignup from "../componentsAdmin/UserSignup"
import UserUpdateDelete from "../componentsAdmin/UserUpdateDelete"
import UserList from '../components/UserList'
import { useFetchGetDeleteAuth } from "../fetch/useFetchGetDeleteAuth"
import { useAuthAdminContext } from "../hooksAdmin/useAuthAdminContext"
import AlertDanger from "../components/AlertDanger"
import AlertInfo from '../components/AlertInfo'



const Box = () => {
   const {admin} = useAuthAdminContext()
   const [boxes, setBoxes] = useState()
   const [reload, setReload] = useState()
   const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()

   useEffect(() => {
      const fetchEffect = async() => {
         const utenti = await fetchGetDelete('api/user/', 'GET', admin.tokenAdmin)
         setBoxes(utenti)
      }

      fetchEffect()
   }, [reload, admin.tokenAdmin])

   return (
   <>
      <h5 className='display-5 text-center text-primary-emphasis my-3'>Gestione Utenti</h5>

      {isLoading && <AlertInfo message={'Caricamento dati'} />}
      {error && <AlertDanger message={error} />}
      
      <UserSignup reload={reload} setReload={setReload} admin={admin}/>
      <UserUpdateDelete boxes={boxes} reload={reload} setReload={setReload} admin={admin}/>

      <div className='container-fluid text-center my-2 mt-5'>
         <h3 className='text-primary-emphasis'>Lista Utenti</h3>
         <div className='m-1 px-5'>
            <div className='row border border-primary border-2 text-success fw-bold'>
               <div className='col'>ADMIN</div>
               <div className='col'>NUMERO</div>
               <div className='col'>NOME BOX</div>
               <div className='col'>INTESTATARIO</div>
               <div className='col'>TELEFONO</div>
            </div>
               {isLoading && <AlertInfo message={'Caricamento Dati'} />}
               {error && <AlertDanger message={error} />}

               {boxes && <UserList utenti={boxes} />}
         </div>
      </div>
      
   </>
   )
}

export default Box