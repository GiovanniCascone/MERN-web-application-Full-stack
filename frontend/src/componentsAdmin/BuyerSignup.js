import {useState} from 'react'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from '../components/AlertSuccess'
import AlertDanger from '../components/AlertDanger'

const BuyerSignup = ({admin, reload, setReload}) => {
   const [nome, setNome] = useState('')
   const [limite, setLimite] = useState('')
   const [cliente, setCliente] = useState(null)
   const {fetchPostUpdate, isLoading, error} = useFetchPostUpdateAuth()

   const handleSubmit = async(e) => {
      setCliente(null)
      e.preventDefault()
      if(!nome || ! limite){
         alert('Compila tutti i campi')
      }
      const data = {nome, limite}
      const buyer = await fetchPostUpdate('/api/buyer/', 'POST', data, admin.tokenAdmin)
      setCliente(buyer)
      if(buyer){
         setReload(!reload)
      }
   }

   return (
   <form 
      className='form border border-2 border-success rounded w-auto h-auto m-5'
      onSubmit={handleSubmit}
   >
   
      {/*cliente*/}
      <h3 className='text-primary fs-3 fw-normal'>Registra Cliente</h3>

      {/*SUCCESSI ED ERRORI*/}
      {error && <AlertDanger message={error} />}
      {cliente && <AlertSuccess message={'Utente Registrato'} />}

      {/*Nome*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='nome' className='col-4 form-label fw-bold text-end'>Nome</label>
         <input 
            className='col form-control' 
            type='text'
            id='nome'
            placeholder='VerdeAgro'
            onChange={(e) => setNome(e.target.value.toUpperCase())}
            value={nome}
         />
      </div>

      {/*limite*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='limite' className='col-4 form-label fw-bold text-end'>Limite</label>
         <input 
            className='col form-control' 
            type='number'
            id='limite'
            placeholder='40000'
            onChange={(e) => setLimite(e.target.value)}
            value={limite}
         />
      </div>

      {/*BOTTONE*/}
      <button 
         className='btn btn-outline-success m-3' 
         disabled={isLoading}
      >
      Signup
      </button>
      

   </form>
   )
}

export default BuyerSignup