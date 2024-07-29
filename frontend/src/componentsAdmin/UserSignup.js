import {useState} from 'react'
import AlertSuccess from '../components/AlertSuccess'
import AlertDanger from '../components/AlertDanger'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'


const UserSignup = ({reload, setReload, admin}) => {
   const [identificativo, setIdentificativo] = useState('')
   const [nome_box, setNome_Box] = useState('')
   const [intestatario, setIntestatario] = useState('')
   const [telefono, setTelefono] = useState('')
   const [password1, setPassword1] = useState('')
   const [password2, setPassword2] = useState('')
   const [amministratore, setAmministratore] = useState(false)
   const [result, setResult] = useState(null)
   const {fetchPostUpdate, isLoading, error} = useFetchPostUpdateAuth()

   const handleSubmit = async(e) => {
      e.preventDefault()
      setResult(null)
      let data = null

      //In base al tipo di utente passo campi differenti
      if(amministratore){
         if(!identificativo  || !intestatario || !telefono || !password1 || !password2){
            alert('Compila i campi: Identivicativo - Intestatario - Telefono - Password')
            return
         }else{
            data = {identificativo, intestatario, telefono, password: password1, admin: amministratore}
         }
      }else{
         if(!identificativo || !nome_box || !intestatario || !telefono || !password1 || !password2){
            alert('Compila tutti i campi')
            return
         }else{
            data = {identificativo, nome_box, intestatario, telefono, password: password1}
         }
      }
      if(password1 !== password2){
         alert('Le due password non coincidono')
         return
      }
      const utente = await fetchPostUpdate('/api/user/', 'POST', data, admin.tokenAdmin)
      setResult(utente)
      setReload(!reload)
   }

   const handleReset = (e) => {
      e.preventDefault()
      setIdentificativo('')
      setPassword1('')
      setPassword2('')
      setNome_Box('')
      setTelefono('')
      setIntestatario('')
      setAmministratore(false)
      setResult(null)
   }

   return (
   <form className='form container-fluid text-center border border-2 border-success rounded w-auto h-auto m-5'>

   {result && <AlertSuccess message={'Utente registrato'} />}

      {/*FORM result*/}
      <h3 className='text-primary fw-normal'>Registra Utente</h3>

      <div className='row m-1 mx-5'>
         <label htmlFor='identificativo' className='col-4 form-label fw-bold text-end'>Identificativo</label>
         <input 
            className='col form-control' 
            type='number'
            id='identificativo'
            placeholder='es. 1'
            min={1}
            max={90}
            onChange={(e) => setIdentificativo(e.target.value)}
            value={identificativo}
         />
      </div>

      {/*Password1*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='password1' className='col-4 form-label fw-bold text-end'>Password</label>
         <input 
            className='col form-control' 
            type='password' 
            id='password1'
            onChange={(e) => setPassword1(e.target.value)}
            value={password1}
         />
      </div>
      {/*Password2*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='password2' className='col-4 form-label fw-bold text-end'>Reinserisci Password</label>
         <input 
            className='col form-control' 
            type='password' 
            id='password2'
            onChange={(e) => setPassword2(e.target.value)}
            value={password2}
         />
      </div>

      {/*Intestatario*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='intestatario' className='col-4 form-label fw-bold text-end'>Intestatario</label>
         <input 
            className='col form-control' 
            type='text'
            id='intestatario'
            placeholder='Mario Rossi'
            onChange={(e) => setIntestatario(e.target.value.toUpperCase())}
            value={intestatario}
         />
      </div>

      {/*Telefono*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='telefono' className='col-4 form-label fw-bold text-end'>Telefono</label>
         <input 
            className='col form-control' 
            type='number'
            id='telefono'
            placeholder='3331234567'
            onChange={(e) => setTelefono(e.target.value)}
            value={telefono}
         />
      </div>

      {/*Admin*/}
      <div className='text-center form-switch m-4 mx-5'>
         <label htmlFor='admin' className='form-check-label fw-bold text-end'>Amministratore</label>
         <input 
            className='form-check-input ms-5' 
            type='checkbox'
            role="switch"
            id='admin'
            onChange={(e) => setAmministratore(e.target.checked)}
            checked={amministratore}
         />
      </div>
      {/*nome_box*/}
      {!amministratore
      &&
      <div className='row m-1 mx-5'>
         <label htmlFor='nome_box' className='col-4 form-label fw-bold text-end'>Nome Box</label>
         <input 
            className='col form-control' 
            type='text'
            id='nome_box'
            placeholder='VerdeAgro'
            onChange={(e) => setNome_Box(e.target.value.toUpperCase())}
            value={nome_box}
            />
      </div>
      }


      {/*BOTTONE*/}
      <button 
         className='btn btn-outline-success m-3'
         onClick={handleSubmit}
         disabled={isLoading}
      >
      Signup
      </button>

      <button 
         className='btn btn-outline-warning rounded-pill m-3'
         onClick={handleReset}
         disabled={isLoading}
      >
      Reset
      </button>


      {/*ERRORI*/}
      {error && <AlertDanger message={error} />}

   </form>
   )
}

export default UserSignup