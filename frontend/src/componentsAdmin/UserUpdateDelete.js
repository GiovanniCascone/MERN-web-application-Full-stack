import { useState } from 'react'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from '../components/AlertSuccess'
import AlertDanger from '../components/AlertDanger'


const BoxUpdateDelete = ({boxes, reload, setReload, admin}) => {
   const [id, setId] = useState('')
   const [nome_box, setNome_Box] = useState('')
   const [intestatario, setIntestatario] = useState('')
   const [telefono, setTelefono] = useState('')
   const [vecchiaPassword, setVecchiaPassword] = useState('')
   const [password1, setPassword1] = useState('')
   const [password2, setPassword2] = useState('')

   const [ricerca, setRicerca] = useState(null)
   const [resultU, setResultU] = useState(false)
   const [resultUP, setResultUP] = useState(false)
   const [deleted, setDeleted] = useState(false)
   
   const {fetchPostUpdate, error: errorUpdate, isLoading: isLoadingUpdate} = useFetchPostUpdateAuth()
   const {fetchGetDelete, error: errorDelete, isLoading: isLoadingDelete} = useFetchGetDeleteAuth()


   const handleRicerca = (e) => {
      setDeleted(false)
      setResultU(false)
      setResultUP(false)
      setNome_Box('')
      setIntestatario('')
      setTelefono('')
      setVecchiaPassword('')
      setPassword1('')
      setPassword2('')
      const id_user = e.target.value
      setId(e.target.value)
      const boxSpecifico = boxes.filter((item) => item._id === id_user)[0]
      setRicerca(boxSpecifico)
   }

   const handleClickAggiorna = async(e) => {
      e.preventDefault()
      if(ricerca.admin){
         if(!telefono || !intestatario){
            alert('Compila i campi : Telefono - Intestatario')
            return
         }
      }else{
         if(!telefono || !intestatario || !nome_box){
            alert('Compila campi: Telefono - Intestatario - Nome Box')
            return
         }
      }
      const data = {nome_box, telefono, intestatario}
      const updateUser = await fetchPostUpdate('/api/user/'+id, 'PATCH', data, admin.tokenAdmin)
      setResultU(updateUser)
      if(updateUser){
         setReload(!reload)
      }
   }

   const handleClickAggiornaPassword = async(e) => {
      e.preventDefault()
      if(!password1 || !password2 || !vecchiaPassword){
         alert('Compila tutti i campi')
         return
      }
      if(password1 !== password2){
         alert('Le due nuove Password non coincidono')
         return
      }
      //Inserire ciontrollo vecchia password
      const data = {id, password: password1, vecchiaPassword}
      const updatePassword = await fetchPostUpdate('/api/user/password/'+id, 'PATCH', data, admin.tokenAdmin)
      setResultUP(updatePassword)
      if(updatePassword){
         setReload(!reload)
      }
   }

   const handleClickElimina = async(e) => {
      e.preventDefault()
      const boxEliminato = await fetchGetDelete('/api/user/'+id, 'DELETE', admin.tokenAdmin) 
      setDeleted(boxEliminato)
      if(boxEliminato){
         setReload(!reload)
      }
   }

   return(
   <div className='container-fluid text-center border border-success border-2 rounded m-5 w-auto h-auto'>
      
      {/*BARRA RICERCA*/}
      <div className='m-2'>
         <label htmlFor='utente' className='form-label text-primary fs-3 fw-normal py-1'>Ricerca Utente</label>
         <select
            className='text-center fw-bold form-select form-control'
            type='text'
            id='utente'
            onChange={handleRicerca}
            value={id}
         >
         <option>Seleziona Utente</option>
         {boxes
         &&
         boxes.map((item) => (
               <option key={item._id} value={item._id}>{item.identificativo}</option>
         ))
         }
         </select>
      </div>

      {/*RISULTATI RICERCA E FORM UPDATE*/}
      {ricerca
      &&
      <div className='row'>
         <div className='col'>
            {deleted ?
               <AlertDanger message={'Box Eliminato'} />
                  :
               <> 
                  <div className='text-center border border-warning rounded w-auto h-auto m-1'>
                     {resultU ?
                     <>
                     <h5 className='text-primary-emphasis fw-normal'>Utente Aggiornato</h5>
                        {/*Tipologia Utente*/}
                        <div className='text-warning-emphasis'>
                           {ricerca.admin ? <h6>Tipo: Amministratore</h6> : <h6>Tipo: Box</h6>}
                        </div>
                        <h6 className='text-warning-emphasis fw-normal'>Codice: {id}</h6>
                     
                        <ul className='list-group text-start m-1'>
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>IDENTIFICATIVO:</span> 
                              <span className='px-2'>{ricerca.identificativo}</span>
                           </li>
                           {nome_box
                           &&
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>NOME BOX:</span> 
                              <span className='px-2'>{nome_box}</span>
                           </li>
                           }
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>INTESTATARIO:</span> 
                              <span className='px-2'>{intestatario}</span>
                           </li>
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>TELEFONO:</span> 
                              <span className='px-2'>{telefono}</span>
                           </li>                     
                        </ul>
                        
                     </>
                        :
                     <>
                     <h5 className='text-primary-emphasis fw-normal'>Dettagli Utente</h5>
                        {/*Tipologia Utente*/}
                        <div className='text-warning-emphasis'>
                           {ricerca.admin ? <h6>Tipo: Amministratore</h6> : <h6>Tipo: Box</h6>}
                        </div>
                        <h6 className='text-warning-emphasis fw-normal'>Codice: {id}</h6>
                     
                        <ul className='list-group text-start m-1'>
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>IDENTIFICATIVO:</span> 
                              <span className='px-2'>{ricerca.identificativo}</span>
                           </li>
                           {ricerca.nome_box
                           &&
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>NOME BOX:</span> 
                              <span className='px-2'>{ricerca.nome_box}</span>
                           </li>
                           }
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>INTESTATARIO:</span> 
                              <span className='px-2'>{ricerca.intestatario}</span>
                           </li>
                           <li className="list-group-item">
                              <span className='text-success fw-bold'>TELEFONO:</span> 
                              <span className='px-2'>{ricerca.telefono}</span>
                           </li>                     
                        </ul>
                        
                     </>
                     }
                     
                     <button 
                        className='btn btn-outline-danger m-3'
                        onClick={handleClickElimina}
                        disabled={isLoadingDelete}
                     >
                        Elimina
                     </button>

                     {errorDelete && <AlertDanger message={errorDelete} />}

                  </div>
                  </>
            }
 
         </div>


         {/*FORM*/}
         <div className='col'>
            <form className='form text-center border border-warning rounded w-auto h-auto m-1'>
         
               <h5 className='text-primary-emphasis fw-normal'>Aggiorna Utente</h5>
               {/*Tipologia Utente*/}
               <div className='text-warning-emphasis'>
                  {ricerca.admin ? <h6>Tipo: Amministratore</h6> : <h6>Tipo: Box</h6>}
               </div>
               <h6 className='text-warning-emphasis fw-normal'>Codice: {id}</h6>               

               {/*Identificativo*/}
               <div className='row m-1 mx-4'>
                  <label htmlFor='boxU' className='col-3 form-label fw-bold text-start'>Identificativo</label>
                  <input 
                     className='col form-control' 
                     type='number'
                     id='boxU'
                     value={ricerca.identificativo}
                     readOnly
                  />
               </div>

               {/*nome_box*/}
               {!ricerca.admin
               &&
               <div className='row m-1 mx-4'>
                  <label htmlFor='nome_boxU' className='col-3 form-label fw-bold text-start'>Nome Box</label>
                  <input 
                     className='col form-control' 
                     type='text'
                     id='nome_boxU'
                     placeholder={ricerca.nome_box}
                     onChange={(e) => setNome_Box(e.target.value.toUpperCase())}
                     value={nome_box}
                  />
               </div>
               }


               {/*Intestatario*/}
               <div className='row m-1 mx-4'>
                  <label htmlFor='intestatarioU' className='col-3 form-label fw-bold text-start'>Intestatario</label>
                  <input 
                     className='col form-control' 
                     type='text'
                     id='intestatarioU'
                     placeholder={ricerca.intestatario}
                     onChange={(e) => setIntestatario(e.target.value.toUpperCase())}
                     value={intestatario}
                  />
               </div>

               {/*Telefono*/}
               <div className='row m-1 mx-4'>
                  <label htmlFor='telefonoU' className='col-3 form-label fw-bold text-start'>Telefono</label>
                  <input 
                     className='col form-control' 
                     type='number'
                     id='telefonoU'
                     placeholder={ricerca.telefono}
                     onChange={(e) => setTelefono(e.target.value)}
                     value={telefono}
                  />
               </div>

           

               {/*BUTTONS*/}
               <button 
                  className='btn btn-outline-success m-3'
                  onClick={handleClickAggiorna}
                  disabled={isLoadingUpdate || isLoadingDelete}
               >
                  Aggiorna
               </button>
            </form>


               {/*SUCCESSI ED ERRORI*/}
               {resultU && <AlertSuccess message={'Utente aggiornato'} />}
               {resultUP && <AlertSuccess message={'Password utente aggiornata'} />}
               {errorUpdate && <AlertDanger message={errorUpdate} />}


            {/*FORM Password*/}
            <form className='form text-center border border-warning rounded w-auto h-auto m-1 p-2'>
               <h5 className='text-primary-empasis fs-5 fw-normal m-1'>Aggiorna Password</h5>

               <label htmlFor='vecchiapassword' className='text-primary-empasis fw-bold m-1 mt-3'>Vecchia Password</label>
               <input 
                  className='form-control' 
                  type='password' 
                  id='vecchiapassword'
                  onChange={(e) => setVecchiaPassword(e.target.value)}
                  value={vecchiaPassword}
               />

               <label htmlFor='updatepassword1' className='text-primary-empasis fw-bold m-1'>Nuova Password</label>
               <input 
                  className='form-control' 
                  type='password' 
                  id='updatepassword1'
                  onChange={(e) => setPassword1(e.target.value)}
                  value={password1}
               />

               <label htmlFor='updatepassword1' className='text-primary-empasis fw-bold m-1'>Reinserisci Nuova Password</label>
               <input 
                  className='form-control' 
                  type='password' 
                  id='updatepassword1'
                  onChange={(e) => setPassword2(e.target.value)}
                  value={password2}
               />

           
               <button 
                  className='btn btn-outline-success m-3'
                  onClick={handleClickAggiornaPassword}
                  disabled={isLoadingUpdate}
               >
                  Aggiorna Password
               </button>

            </form>

         </div>
      </div>
      }

   </div>
   )
}
   

export default BoxUpdateDelete