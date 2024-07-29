import {useState } from 'react'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import AlertDanger from '../components/AlertDanger'


const ProductDelete = ({reload, setReload, admin, products}) => {
   const [nome, setNome] = useState('')
   const [ricerca, setRicerca] = useState(null)
   const [deleted, setDeleted] = useState(null)
   const {fetchGetDelete, error: errorElimina, isLoading: isLoadingElimina} = useFetchGetDeleteAuth()
   


   const handleRicerca = (e) => {
      setDeleted(false)
      setNome(e.target.value)
      const name = e.target.value
      setRicerca(products.filter((item) => item.nome==name)[0])
   }


   const handleClickElimina = async(e) => {
      e.preventDefault()
      const prodottoEliminato = await fetchGetDelete('api/product/' + nome, 'DELETE', admin.tokenAdmin)
      setDeleted(prodottoEliminato)
      if(prodottoEliminato){
         setReload(!reload)
      }
   }

   return(
   <div className='border border-success border-2 rounded m-1 mx-5 p-2'>
      {/*BARRA RICERCA*/}
      <label htmlFor='fornitore' className='form-label text-primary fs-3'>Elimina prodotto</label>
      <select
         className='fw-bold form-select form-control text-center'
         type='text'
         id='fornitore'
         onChange={handleRicerca}
         value={nome}
      >
      <option>Seleziona prodotto</option>
      {products
      &&
      products.map((item) => (
            <option key={item._id}>{item.nome}</option>
      ))
      }
      </select>

      {/*RISULTATI RICERCA E FORM UPDATE*/}
      {ricerca
      &&
      <div className='border border-warning rounded w-auto h-auto m-2'>

         {deleted ?
            <AlertDanger message={`Prodotto ${deleted.nome} eliminato`} />
               :
            <>
               <span className='fw-bold text-success'>NOME: </span>
               <span className='fw-bold'> {ricerca.nome}</span>
               
               <button 
                  className='btn btn-outline-danger m-3'
                  onClick={handleClickElimina}
                  disabled={isLoadingElimina}
               >
                  Elimina
               </button>
            </>
         }

      </div>
      }

      {/*ERRORI*/}
      {errorElimina && <AlertDanger message={errorElimina} />}

   </div>
   )
}
   

export default ProductDelete