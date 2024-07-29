import {useState} from 'react'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from '../components/AlertSuccess'
import AlertDanger from '../components/AlertDanger'

const ProductSignup = ({reload, setReload, admin}) => {
   const [nome, setNome] = useState('')
   const [prodotto, setProdotto] = useState(null)
   const {fetchPostUpdate, isLoading, error} = useFetchPostUpdateAuth()

   const handleSubmit = async(e) => {
      setProdotto(null)
      e.preventDefault()
      if(!nome){
         alert('Inserisci il NOME prodotto')
         return
      }
      const data = {nome}
      const product = await fetchPostUpdate('/api/product/', 'POST', data, admin.tokenAdmin)
      setProdotto(product)
      setReload(!reload)
   }

   return (
   <form 
      className='form border border-2 border-success rounded w-auto h-auto m-5'
      onSubmit={handleSubmit}
   >
      <h3 className='text-primary fw-normal py-1'>Registra un nuovo prodotto</h3>

      {/*Nome*/}
      <div className='row m-1 mx-5'>
         <label htmlFor='nome' className='col-4 form-label fw-bold text-end'>Nome</label>
         <input 
            className='col form-control' 
            type='text'
            id='nome'
            placeholder='MELENZANA'
            onChange={(e) => setNome(e.target.value.toUpperCase())}
            value={nome}
         />
      </div>

      {/*BOTTONE*/}
      <button 
         className='btn btn-outline-success m-3' 
         disabled={isLoading}
      >
         Signup
      </button>

      {/*SUCCESSI ED ERRORI*/}
      {prodotto && <AlertSuccess message={`Prodotto registrato ${prodotto.nome}`} />}
      {error && <AlertDanger message={error} />}

   </form>
   )
}

export default ProductSignup