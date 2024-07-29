import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchGet} from '../fetch/useFetchGet'
import AlertInfo from '../components/AlertInfo'
import AlertDanger from '../components/AlertDanger'



const Sales = () => {
   const {user} = useAuthContext()
   const {fetchGetDelete, error: errorFatture, isLoading: isLoadingFatture} = useFetchGetDeleteAuth()
   const {fetchGet, error: errorClienti, isLoading: isLoadingClienti} = useFetchGet()
   const [fatture, setFatture] = useState(null)
   const [clienti, setClienti] = useState(null)
   const [ricerca, setRicerca] = useState(null)
   const [nome, setNome] = useState('')

   //FETCH DATA CLIENT AND SALES
   //Provare ad inserire uno state refresh per tenere aggiornati i dati dopo una modifica
   useEffect(() => {
      const fetchEffect = async() => {
         const sales = await fetchGetDelete('/api/sale/', 'GET', user.token)
         setFatture(sales)
         const buyers = await fetchGet('/api/buyer/')
         setClienti(buyers)
      }

      fetchEffect()
   }, [user.token])


   //RICERCA
   const handleRicerca = (e) => {
      e.preventDefault()
      const name = e.target.value
      setNome(name)
      console.log('Ricerca ', name)
      setRicerca(fatture.filter((fattura) => fattura.cliente===name))
      console.log('Risultati filter ', ricerca)
   }
   
   return(
      <>
      <h5 className='text-center display-5 text-primary-emphasis mb-2'>Fatture</h5>

      <form className='form container-fluid text-center m-2 p-1 w-auto h-auto'>
         <label htmlFor='cliente' className='text-primary fs-3 m-1'>Ricerca</label>
         <select  
            className='form-select form-control text-center mb-3' 
            type='text'
            id='cliente'
            onChange={(e) => handleRicerca(e)}
            value={nome}
         >
         <option>Seleziona un cliente</option>
         {clienti
         &&
         clienti.map((item) => (
               <option key={item._id}>{item.nome}</option>
         ))
         }
         </select>


      {
      ricerca
      &&
      ricerca.map((fattura) => (
         <Link 
            to={`/saleUpdateDelete/${fattura._id}`}
            className='row text-decoration-none text-dark text-center border border-warning mx-1' 
            key={fattura._id}>
            <span className='col fw-bold'><h6 className='text-success'>CLIENTE</h6>{fattura.cliente}</span>
            <span className='col'><h6 className='text-success'>PRODOTTO</h6>{fattura.prodotto}</span>
            <span className='col'><h6 className='text-success'>TOTALE</h6>{fattura.prezzo_tot} €</span>
            <span className='col-2'><h6 className='text-success'>DATA</h6>{moment(fattura.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
            <span className='col'><h6 className='text-success'>STATO</h6>{fattura.pagata ? <div className='text-success'>Pagata</div> : <div className='text-danger'>Da pagare</div>}
            </span>
         </Link>
      ))
      }
      </form>

      <div className='text-center h-auto w-auto m-2 p-1'>
         <h3 className='text-primary fs-3 fw-normal mt-5'>Tutte le fatture</h3>


         <div className='text-success fw-bold row border border-2 border-warning mx-1'>
            <span className='col'> CLIENTE </span>
            <span className='col'> PRODOTTO </span>
            <span className='col'> TOTALE </span>
            <span className='col-2'> DATA </span>
            <span className='col'> STATO</span>
         </div>
         {(isLoadingClienti || isLoadingFatture) && 
         <AlertInfo message={'Caricmento Dati'} />
         }
         {errorFatture && <AlertDanger message={errorFatture} />}
         {errorClienti && <AlertDanger message={errorClienti} />}

         {fatture
         &&
         fatture.map((fattura) => (
            <Link
               to={`/saleUpdateDelete/${fattura._id}`}
               className='row text-decoration-none text-dark border border-1 border-warning mx-1' 
               key={fattura._id}>
               <span className='col fw-bold'>{fattura.cliente}</span>
               <span className='col'>{fattura.prodotto}</span>
               <span className='col'>{fattura.prezzo_tot} €</span>
               <span className='col-2'>{moment(fattura.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
               <span className='col'> {fattura.pagata ? <span className='text-success'>Pagata</span> : <span className='text-danger'>Da pagare</span>}
               </span>
            </Link>
            ))
         }
      </div>

      </>

   )

}

export default Sales