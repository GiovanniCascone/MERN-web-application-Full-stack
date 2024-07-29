import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import AlertInfo from '../components/AlertInfo'
import AlertDanger from '../components/AlertDanger'

const Bills = () => {
   const {user} = useAuthContext()
   const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
   const [bollette, setBollette] = useState(null)
   const [fornitori, setFornitori] = useState(null)
   
   const [nome, setNome] = useState('')
   const [cod_fiscale, setCod_Fiscale] = useState('')
   const [ricerca, setRicerca] = useState('')



   //FETCH DATA PRODUCER AND BILLS
   useEffect(() => {
      const fetchEffect = async() => {
         const bills = await fetchGetDelete('/api/bill/', 'GET', user.token)
         setBollette(bills)
         const producers = await fetchGetDelete('/api/producer/', 'GET', user.token)
         setFornitori(producers)
      }

      fetchEffect()
   },[user.token])

   
   //RICERCA
   const handleSubmit = (e) => {
      e.preventDefault()
      const cod = e.target.value
      setCod_Fiscale(cod)
      const research = bollette.filter((bolletta) => bolletta.cod_fiscale_produttore === cod)
      setRicerca(research) 
   }


   return(
      <>
      <h5 className='text-center display-5 text-primary-emphasis mb-2'>Bollette</h5>

      <form className='form container-fluid text-center m-2 p-1 w-auto h-auto'>

         <label htmlFor='fornitore' className='text-primary fs-3 m-1'>Fornitore</label>
         <select  
            className='form-select form-control text-center mb-3' 
            type='text'
            id='fornitore'
            onChange={handleSubmit}
            value={cod_fiscale}
         >
         <option>Seleziona un fornitore</option>
         {fornitori
         &&
         fornitori.map((item) => (
               <option key={item._id}>{item.cod_fiscale}</option>
         ))
         }
         </select>
      

      {
      ricerca
      &&
      ricerca.map((bolletta) => (
         <Link 
            to={`/billUpdateDelete/${bolletta._id}`}
            className='row text-decoration-none text-dark text-center border border-warning mx-1'  
            key={bolletta._id}>
            <span className='col-2'><h6 className='text-success'>PRODUTTORE</h6>{bolletta.produttore}</span>
            <span className='col-2'><h6 className='text-success'>COD FISCALE</h6>{bolletta.cod_fiscale_produttore}</span>
            <span className='col-2'><h6 className='text-success'>PRODOTTO</h6>{bolletta.prodotto}</span>
            <span className='col-3'><h6 className='text-success'>DATA</h6>{moment(bolletta.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
            <span className='col-1'><h6 className='text-success'>TOTALE</h6>{bolletta.prezzo_tot} €</span>
            <span className='col-2'><h6 className='text-success'>STATO</h6> {bolletta.pagata ? <span className='text-success'>Pagata</span> : <span className='text-danger'>Da pagare</span>}
            </span>
         </Link>
      ))
      }
      </form>

      {/*LISTA TUTTE LE BOLLETTE */}
      <div className='text-center container-fluid h-auto w-auto m-2'>
         <h3 className='text-primary fw-normal fs-3 mt-5'>Tutte le bollette</h3>

         {isLoading && <AlertInfo message={'Caricamento Dati'} />}
         {error && <AlertDanger message={error} />}

         {bollette
         &&
         bollette.map((bolletta) => (
         <Link 
            to={`/billUpdateDelete/${bolletta._id}`}
            className='row text-decoration-none text-center text-dark border border-warning'  
            key={bolletta._id}>
            <span className='col-2'><h6 className='text-success'>PRODUTTORE</h6>{bolletta.produttore}</span>
            <span className='col-2'><h6 className='text-success'>COD FISCALE</h6>{bolletta.cod_fiscale_produttore}</span>
            <span className='col-2'><h6 className='text-success'>PRODOTTO</h6>{bolletta.prodotto}</span>
            <span className='col-3'><h6 className='text-success'>DATA</h6>{moment(bolletta.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
            <span className='col-1'><h6 className='text-success'>TOTALE</h6>{bolletta.prezzo_tot} €</span>
            <span className='col-2'><h6 className='text-success'>STATO</h6> {bolletta.pagata ? <span className='text-success'>Pagata</span> : <span className='text-danger'>Da pagare</span>}
            </span>
         </Link>
         ))
      }
      </div>

   </>
   )

}

export default Bills