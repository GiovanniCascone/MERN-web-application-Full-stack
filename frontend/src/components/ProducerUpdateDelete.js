import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import ProducerDetails from './ProducerDetails'
import AlertDanger from './AlertDanger'
import AlertSuccess from './AlertSuccess'


const ProducerUpdateDelete = ({reload, setReload}) => {
   const {user} = useAuthContext()

   const {fetchGetDelete, error: errorGD, isLoading: isLoadingGD} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorPU, isLoading: isLoadingPU} = useFetchPostUpdateAuth()
   const [producers, setProducers] = useState(null)

   const [nome, setNome] = useState('')
   const [cod_fiscale, setCod_Fiscale] = useState('')
   const [telefono, setTelefono] = useState('')
   const [iban, setIban] = useState('')
   const [ricerca, setRicerca] = useState(null)
   const [_id, set_Id] = useState(null)
   const [update, setUpdate] = useState(null)
   const [deleted, setDeleted] = useState(null)



   //FETCH DATA producers
   useEffect(() => {
      const fetchEffect = async() => {
         const produttori = await fetchGetDelete('/api/producer/', 'GET', user.token)
         setProducers(produttori)
      }

      fetchEffect()
   },[reload])

   const handleRicerca = (e) => {
      setCod_Fiscale('')
      setIban('')
      setTelefono('')
      setUpdate(null)
      setDeleted(null)
      const name = e.target.value.toUpperCase()
      setNome(name)
      const research = producers.filter((item) => item.nome==name)[0]
      setRicerca(research)
      if(research){
         const id_research = producers.filter((item) => item.nome==name)[0]._id
         set_Id(id_research)
      }
   }

   const handleClickAggiorna = async(e) => {
      e.preventDefault()
      console.log('ID: ', _id)
      console.log('handleAggiorna ', _id)
      if(!nome || !telefono || !iban || !cod_fiscale){
         alert('Compila tutti i campi')
         return
      }
      const data = {nome, cod_fiscale, telefono, iban}
      const aggiornamento = await fetchPostUpdate('/api/producer/' + _id, 'PATCH', data, user.token)
      if(!aggiornamento){
         return
      }
      setUpdate({_id, nome, telefono, cod_fiscale, iban})
      if(aggiornamento){
         setReload(!reload)
      }
   }

   const handleClickElimina = async(e) => {
      e.preventDefault()
      console.log('handleElimina')
      const produttoreEliminato = await fetchGetDelete('/api/producer/' + _id, 'DELETE', user.token)
      if(produttoreEliminato){
         setDeleted(true)
         setReload(!reload)
      }
   }

   return(
   <div className='text-center border-bottom border-top border-success mx-5 px-5 m-1 p-1'>
      {/*BARRA RICERCA*/}
      <form className='container m-1'>
         <label htmlFor='produttore' className='text-primary fs-3 fw-normal my-2'>Aggiorna - Elimina Produttore</label>
         <select
            className='col text-center fw-bold form-select form-control'
            type='text'
            id='produttore'
            onChange={handleRicerca}
            value={nome}
         >
         <option>Seleziona Produttore</option>
         {producers
         &&
         producers.map((item) => (
               <option key={item._id}>{item.nome}</option>
         ))
         }
         </select>
      </form>
      {/*RISULTATI RICERCA E FORM UPDATE*/}
      {ricerca
      &&
      <div className='row'>
         {update ? 
         <div className='col'>
            <div className='container-fluid text-center border border-1 border-success rounded w-auto h-auto m-1'>
               <AlertSuccess message={'Aggiornamento effettuato con successo'} />
               <ProducerDetails data={update}/>
            </div>
            <button 
                  className='btn btn-outline-danger m-3'
                  onClick={handleClickElimina}
                  disabled={isLoadingPU || isLoadingGD}
               >
               Elimina
            </button>

            {errorGD && <AlertDanger message={errorGD} />}

         </div>
         :
         <div className='col'>
            {deleted ? 
            <div className='alert alert-danger'>PRODUTTORE {ricerca.nome} ELIMINATO</div>
            :
            <>
            <div className='container-fluid text-center border border-warning rounded w-auto h-auto m-1' >
               <ProducerDetails data={ricerca}/>
            </div>
            
            <button 
                  className='btn btn-outline-danger m-3'
                  onClick={handleClickElimina}
                  disabled={isLoadingPU || isLoadingGD}
               >
               Elimina
            </button>
            </>
            }

            {errorGD && <AlertDanger message={errorGD} />}

         </div>
         }
         
         {/*FORM UPDATE*/}
         <div className='col'>
            <form className='form container-fluid text-center border border-1 border-warning rounded w-auto h-auto m-2'>
         
               <h5 className='text-warning-emphasis'>Aggiorna Produttore</h5>
               <h5 className='text-warning-emphasis mb-3'>{ricerca._id}</h5>
     
               {/*Nome*/}
               <div className='row m-1'>
                  <label htmlFor='nomeU' className='col-3 form-label fw-bold text-start'>Nome</label>
                  <input 
                     className='col form-control' 
                     type='text'
                     id='nomeU'
                     onChange={(e) => setNome(e.target.value.toUpperCase())}
                     value={nome}
                  />
               </div>

               {/*Cod_Fiscale*/}
               <div className='row m-1'>
               <label htmlFor='cod_fiscaleU' className='col-3 form-label fw-bold text-start'>Codice Fiscale</label>
               <input 
                  className='col form-control' 
                  type='text'
                  id='cod_fiscaleU'
                  onChange={(e) => setCod_Fiscale(e.target.value.toUpperCase())}
                  value={cod_fiscale}
               />
               </div>
              
               {/*telefono*/}
               <div className='row m-1'>
                  <label htmlFor='telefonoU' className='col-3 form-label fw-bold text-start'>Telefono</label>
                  <input 
                     className='col form-control' 
                     type='number'
                     id='telefonoU'
                     onChange={(e) => setTelefono(e.target.value)}
                     value={telefono}
                  />
               </div>

               {/*Iban*/}
               <div className='row m-1'>
               <label htmlFor='ibanU' className='col-3 form-label fw-bold text-start'>IBAN</label>
               <input 
                  className='col form-control' 
                  type='text'
                  id='ibanU'
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  value={iban}
               />
               </div>
               

               {/*BUTTONS*/}
               <button 
                  className='btn btn-outline-success m-3'
                  onClick={handleClickAggiorna}
                  disabled={isLoadingPU || isLoadingGD}
               >
                  Aggiorna
               </button>

               {/*ERRORI*/}
               {errorPU && <AlertDanger message={errorPU} />}

            </form>
         </div>
      </div>
      }

   </div>
   )
}
   

export default ProducerUpdateDelete
