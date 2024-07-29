import { useEffect, useState } from 'react'
import { useFetchGet } from '../fetch/useFetchGet'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from './AlertSuccess'
import AlertDanger from './AlertDanger'


const BillForm = ({bolletta, user, id, reload, setReload}) => {

   const {fetchGetDelete, error: errorFornitori, isLoading: isLoadingFornitori} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorPU, isLoading: isLoadingPU} = useFetchPostUpdateAuth()
   const {fetchGet, error: errorProdotti, isLoading: isLoadingProdotti} = useFetchGet()
   const [fornitori, setFornitori] = useState('')
   const [prodotti, setProdotti] = useState('')

   const [produttore, setProduttore] = useState('')
   const [cod_fiscale_produttore, set_Cod_Fiscale_produttore] = useState()
   const [prodotto, setProdotto] = useState('')
   const [peso_netto, setPeso_Netto] = useState('')
   const [peso_lordo, setPeso_Lordo] = useState('')
   const [prezzo_kg, setPrezzo_kg] = useState('')
   const [result, setResult] = useState(null)


   //FETCH DATA PRODUCER AND PRODUCT
   useEffect(() => {
      const fetchEffect = async() => {
         const products = await fetchGet('/api/product/')
         setProdotti(products)
         const producers = await fetchGetDelete('/api/producer/', 'GET', user.token)
         setFornitori(producers)
      }

      fetchEffect()
   },[user.token])

   const handleAggiorna = async(e) => {
      e.preventDefault()
      if(!produttore || !cod_fiscale_produttore || !prodotto || !peso_lordo || !peso_netto || !prezzo_kg){
         alert('Compila tutti i campi')
         return
      }
      if(peso_lordo <= peso_netto){
         alert('Il Peso Netto deve essere minore del Peso Lordo')
         return
      }
      const prezzo_tot = (Number(peso_netto * prezzo_kg).toFixed(2))
      const data = {produttore, cod_fiscale_produttore, prodotto, peso_lordo, peso_netto, prezzo_kg, prezzo_tot}
      const updateBill = await fetchPostUpdate('/api/bill/' + id, 'PATCH', data, user.token)
      setResult(updateBill)
      if(updateBill){
         setReload(!reload)
      }
   }

   const handleChangeCod = (e) => {
      e.preventDefault()
      const cod = e.target.value
      set_Cod_Fiscale_produttore(e.target.value)
      const name = fornitori.filter((item) => item.cod_fiscale === cod)[0].nome
      setProduttore(name)
   }

   const handleReset = (e) => {
      e.preventDefault()
      setProduttore('')
      set_Cod_Fiscale_produttore('')
      setProdotto('')
      setPeso_Netto('')
      setPeso_Lordo('')
      setPrezzo_kg('')
      setResult(null)
   }

   return(
   <>
      
      <form className='form w-auto h-auto'>

         {result && <AlertSuccess message={'Bolletta Aggiornata'} />}

         <div className='row m-1 my-2'>
            <label htmlFor='produttore' className='col-3 form-label fw-bold text-start'>Produttore</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='produttore'
               onChange={handleChangeCod}
               value={cod_fiscale_produttore}
            >
            <option>Seleziona un produttore</option>
            {fornitori
            &&
            fornitori.map((item) => (
                  <option key={item._id}>{item.cod_fiscale}</option>
            ))
            }
            </select>
         </div>
         
         <div className='row m-1 my-2'>
            <label htmlFor='nome' className='col-3 form-label fw-bold text-start'>Nome</label>
            <input 
               className='col form-control' 
               type='string'
               id='nome'
               value={produttore}
               disabled
            />
         </div>

         <div className='row m-1 my-2'>
            <label htmlFor='prodotto' className='col-3 form-label fw-bold text-start'>Prodotto</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='prodotto'
               placeholder={bolletta.prodotto}
               onChange={(e) => setProdotto(e.target.value)}
               value={prodotto}
            >
            <option>Seleziona un prodotto</option>
            {prodotti
            &&
            prodotti.map((item) => (
                  <option key={item._id}>{item.nome}</option>
            ))
            }
            </select>
         </div>

         <div className='row m-1 my-2'>
            <label htmlFor='peso_lordo' className='col-3 form-label fw-bold text-start'>Peso Lordo</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_lordo'
               min='100'
               max='10000'
               placeholder={bolletta.peso_lordo}
               onChange={(e) => setPeso_Lordo(e.target.value)}
               value={peso_lordo}
            />
         </div>

         <div className='row m-1 my-2'>
            <label htmlFor='peso_netto' className='col-3 form-label fw-bold text-start'>Peso Netto</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_netto'
               min='100'
               max='10000'
               placeholder={bolletta.peso_netto}
               onChange={(e) => setPeso_Netto(e.target.value)}
               value={peso_netto}
            />
         </div>

         <div className='row m-1 my-2'>
            <label htmlFor='prezzo_kg' className='col-3 form-label fw-bold text-start'>Prezzo/kg</label>
            <input 
               className='col form-control' 
               type='number'
               step="0.01"
               min='0.05'
               max='5.00'
               id='prezzo_kg'
               placeholder={bolletta.prezzo_kg}
               onChange={(e) => setPrezzo_kg(e.target.value)}
               value={prezzo_kg}
            />
         </div>

         <div className='row m-1 my-2'>
            <label htmlFor='prezzo_tot' className='col-3 form-label fw-bold text-start'>Prezzo Totale</label>
            <input 
               className='col form-control' 
               type='number'
               id='prezzo_tot'
               value={Number(peso_netto * prezzo_kg).toFixed(2)}
               disabled readOnly
            />
         </div>

         <button 
            className='btn btn-outline-success m-3'
            onClick={handleAggiorna}
            disabled={isLoadingPU || isLoadingProdotti || isLoadingFornitori}
         >
         Modifica
         </button>
         <button 
            className='btn btn-outline-warning rounded-pill m-3'
            onClick={handleReset} 
            disabled={isLoadingPU || isLoadingProdotti || isLoadingFornitori}
         >
         RESET
         </button>

         {errorPU && <AlertDanger message={errorPU} />}
         {errorProdotti && <AlertDanger message={errorProdotti} />}
         {errorFornitori && <AlertDanger message={errorFornitori} />}
   
      </form>

   </>
   )
}

export default BillForm