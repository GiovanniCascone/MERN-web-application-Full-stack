import {useState} from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from './AlertSuccess'
import AlertDanger from './AlertDanger'


const ProducerSignup = ({reload, setReload}) => {
   const {user} = useAuthContext()

   const [nome, setNome] = useState('')
   const [cod_fiscale, setCod_Fiscale] = useState('')
   const [telefono, setTelefono] = useState('')
   const [iban, setIban] = useState('')

   const {fetchPostUpdate, isLoading, error} = useFetchPostUpdateAuth()
   const [result, setResult] = useState(null)


   const handleClickSubmit = async(e) => {
      e.preventDefault()
      //CONTROLLO CAMPI
      if(!nome || !cod_fiscale || !telefono){
         alert('Compila i campi: NOME - COD FISCALE - TELEFONO')
         return
      }
      const data = {nome, cod_fiscale, telefono, iban}
      const nuovoProduttore = await fetchPostUpdate('/api/producer/', 'POST', data, user?.token)
      setResult(nuovoProduttore)
      if(nuovoProduttore){
         setReload(!reload)
      }
   }

   const handleClickReset = (e) => {
      e.preventDefault()
      setNome('')
      setCod_Fiscale('')
      setIban('')
      setTelefono('')
      setResult(null)
   }

   return (  

   <form className='form container-fluid text-center border-bottom border-top border-success w-auto h-auto my-2 px-5 mx-5'>
      
      <h3 className='text-primary fs-3 fw-normal'>Registra nuovo produttore</h3>

      {result && <AlertSuccess message={'Nuovo Produttore registarto'} />}

      <div className='row m-1'>
         <label htmlFor='nome' className='col-4 form-label text-end fw-bold'>Nome</label>
         <input 
            className='col form-control' 
            type='text'
            id='nome'
            placeholder='es. VerdeAgro'
            onChange={(e) => setNome(e.target.value.toUpperCase())}
            value={nome}
         />
      </div>

      <div className='row m-1'>
         <label htmlFor='cod_fiscale' className='col-4 form-label text-end fw-bold'>Codice Fiscale</label>
         <input 
            className='col form-control' 
            type='text' 
            id='cod_fiscale'
            onChange={(e) => setCod_Fiscale(e.target.value.toUpperCase())}
            value={cod_fiscale}
         />
      </div>

      <div className='row m-1'>
         <label htmlFor='telefono' className='col-4 form-label text-end fw-bold'>Telefono</label>
         <input 
            className='col form-control' 
            type='number'
            id='telefono'
            placeholder='es. 1'
            onChange={(e) => setTelefono(e.target.value)}
            value={telefono}
         />
      </div>

      <div className='row m-1'>
         <label htmlFor='iban' className='col-4 text-end form-label fw-bold'>IBAN</label>
         <input 
            className='col form-control' 
            type='text' 
            id='iban'
            onChange={(e) => setIban(e.target.value.toUpperCase())}
            value={iban}
         />
      </div>

      <button 
         className='btn btn-outline-success' 
         onClick={handleClickSubmit}
         disabled={isLoading}
      >
      Registra
      </button>
      <button 
            className='btn btn-outline-warning rounded-pill m-3' 
            onClick={handleClickReset}
            disabled={isLoading}
      >
      Reset
      </button>

      {error && <AlertDanger message={error} />}

   </form>
   )
}

export default ProducerSignup