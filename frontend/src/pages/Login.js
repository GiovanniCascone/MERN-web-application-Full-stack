import {useState} from 'react'
import {useLogin} from '../hooks/useLogin'
import AlertDanger from '../components/AlertDanger'

const Login = () => {
   const [identificativo, setIdentificativo] = useState('')
   const [password, setPassword] = useState('')
   const [nome_box, setNome_Box] = useState('')
   const [amministratore, setAmministratore] = useState(false)
   const {login, isLoading, error} = useLogin()

   const handleSubmit = async(e) => {
      e.preventDefault()
      if(!identificativo || !password){
         alert('Inserisci tutti i dati necessari')
         return
      }
      login(identificativo, nome_box, password, amministratore)
   }

   return (
   <>
   <h5 className='text-center display-5 text-primary-emphasis'>Login</h5>
   
   <form 
      className='form container-fluid text-center border border-warning rounded w-auto h-auto m-5'
      onSubmit={handleSubmit}
   >
      
      <div className='row m-1 mx-5'>
         <label htmlFor='identificativo' className='col form-label fw-bold'>Numero Utente</label>
         <input 
            className='col form-control' 
            type='number'
            id='identificativo'
            min='1'
            max='74'
            placeholder='es. 1'
            onChange={(e) => setIdentificativo(e.target.value)}
            value={identificativo}
         />
      </div>
      <div className='row m-1 mx-5'>
         <label htmlFor='password' className='col form-label fw-bold'>Password</label>
         <input 
            className='col form-control' 
            type='password' 
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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

      <button 
         className='btn btn-outline-success m-3' 
         disabled={isLoading}
      >
      Login
      </button>

      {error && <AlertDanger message={error} />}

   </form>
   </>
   )
}

export default Login