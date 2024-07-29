import { useState } from 'react'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertDanger from '../components/AlertDanger'
import AlertSuccess from '../components/AlertSuccess'


const BuyerUpdateDelete = ({admin, reload, setReload, buyers}) => {
   const {fetchGetDelete, error: errorElimina, isLoading: isLoadingElimina} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorUpdate, isLoading: isLoadingUpdate} = useFetchPostUpdateAuth()
   const [nome, setNome] = useState('')
   const [limite, setLimite] = useState('')
   const [ricerca, setRicerca] = useState(null)
   const [result, setResult] = useState(null)
   const [deleted, setDeleted] = useState(false)


   const handleRicerca = (e) => {
      setResult(null)
      setDeleted(false)
      const name = e.target.value
      setNome(e.target.value)
      console.log('handleRicerca ', name)
      const cliente = buyers.filter((item) => item.nome==name)[0]
      setRicerca(cliente)
   }

   const handleClickAggiorna = async(e) => {
      e.preventDefault()
      console.log('handleAggiorna')
      if(!limite){
         alert('Compila il campo Limite')
         return
      }
      const data = {limite}
      const clienteAggiornato = await fetchPostUpdate('/api/buyer/' + nome.toUpperCase(), 'PATCH', data, admin.tokenAdmin)
      if(clienteAggiornato){
         setResult(clienteAggiornato)
         setReload(!reload)
      }
   }

   const handleClickElimina = async(e) => {
      e.preventDefault()
      console.log('handleElimina')
      const clienteEliminato = await fetchGetDelete('/api/buyer/' + nome, 'DELETE', admin.tokenAdmin)
      if(clienteEliminato){
         setDeleted(clienteEliminato)
         setReload(!reload)
      }
   }

   return(
   <div className='text-center border border-success border-2 rounded m-1 mx-5 p-3'>
      
      {/*BARRA RICERCA*/}
      <label htmlFor='cliente' className='form-label text-primary fs-3 fw-normal py-1'>Aggiorna - Elimina Cliente</label>
      <select
         className='form-select form-control text-center fw-bold'
         type='text'
         id='cliente'
         onChange={handleRicerca}
         value={nome}
      >
      <option>Seleziona Cliente</option>
      {buyers
      &&
      buyers.map((item) => (
            <option key={item._id}>{item.nome}</option>
      ))
      }
      </select>

      {/*RISULTATI RICERCA E FORM UPDATE*/}
      {ricerca
      &&
      <div className='row'>
         
         <div className='col border border-warning rounded w-auto h-auto m-2'>
            {deleted ?
               <AlertDanger message={`Cliente ${deleted.nome} eliminato`} />
                  :
               <>
                  {result ?
                  <>
                     <h5 className='fs-5 text-success'>NOME</h5>
                     <p className='fs-5'> {nome}</p>
                     <h5 className='fs-5 text-success'>LIMITE</h5>
                     <p className='fs-5'> {limite}</p>
                  </>
                     :
                  <>
                     <h5 className='fs-5 text-success'>NOME</h5>
                     <p className='fs-5'> {ricerca.nome}</p>
                     <h5 className='fs-5 text-success'>LIMITE</h5>
                     <p className='fs-5'> {ricerca.limite}</p>
                  </>
                  }

                  <button 
                     className='btn btn-outline-danger m-3'
                     onClick={handleClickElimina}
                     disabled={isLoadingElimina}
                  >
                     Elimina
                  </button>
               </>
            }

            {errorElimina && <AlertDanger message={errorElimina} />}

         </div>

         {/*FORM UPDATE*/}
         <form className='col form border border-warning rounded w-auto h-auto m-2'>
         
            <h5 className='text-primary-emphasis fw-normal'>Aggiorna Cliente</h5>
   
            {/*Nome*/}
            <div className='row m-1 mx-5'>
               <label htmlFor='nome' className='col-3 form-label fw-bold text-start'>Nome</label>
               <input 
                  className='col form-control' 
                  type='text'
                  id='nome'
                  placeholder={ricerca.nome}
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                  value={nome}
                  readOnly
               />
            </div>
            
            {/*limite*/}
            <div className='row m-1 mx-5'>
               <label htmlFor='limite' className='col-3 form-label fw-bold text-start'>Limite</label>
               <input 
                  className='col form-control' 
                  type='number'
                  id='limite'
                  placeholder={ricerca.limite}
                  onChange={(e) => setLimite(e.target.value)}
                  value={limite}
               />
            </div>

            {/*BUTTONS*/}
            <button 
               className='btn btn-outline-success m-3'
               onClick={handleClickAggiorna}
               disabled={isLoadingUpdate || isLoadingElimina}
            >
            Aggiorna
            </button>

            {/*SUCCESSI ED ERRORI*/}
            {result && <AlertSuccess message={`Clinte ${result.nome} aggiornato`} />}
            {errorUpdate && <AlertDanger message={errorUpdate} />}

         </form>
      </div>
      }

   </div>
   )
}
   

export default BuyerUpdateDelete