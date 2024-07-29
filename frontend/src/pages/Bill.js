import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFetchGet } from '../fetch/useFetchGet'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from '../components/AlertSuccess'
import AlertDanger from '../components/AlertDanger'
import AlertInfo from '../components/AlertInfo'

const Bill = () => {
   const {user} = useAuthContext()

   const {fetchGetDelete, error: errorFornitori, isLoading: isLoadingFornitori} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorBolletta, isLoading: isLoadingBolletta} = useFetchPostUpdateAuth()
   const {fetchGet, error: errorProdotti, isLoading: isLoadingProdotti} = useFetchGet()
   const [fornitori, setFornitori] = useState('')
   const [prodotti, setProdotti] = useState('')

   const [produttore, setProduttore] = useState('')
   const [prodotto, setProdotto] = useState('')
   const [peso_netto, setPeso_Netto] = useState('')
   const [peso_lordo, setPeso_Lordo] = useState('')
   const [prezzo_kg, setPrezzo_kg] = useState('')
   const [cod_fiscale_produttore, setCodiceFiscale_Produttore] = useState('')
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

   const handleClickSubmit = async(e) => {
      e.preventDefault()
      if(!produttore || !prodotto || !cod_fiscale_produttore || !peso_netto || !peso_lordo || !prezzo_kg ){
         alert('Compila tutti i campi')
         return
      }
      if(Number(peso_netto) >= Number(peso_lordo)){
         alert('Il Peso netto deve essere inferiore del Peso lordo')
         return
      }
      const data = {produttore, cod_fiscale_produttore, prodotto, peso_lordo, peso_netto, prezzo_kg}
      const nuovaBolletta = await fetchPostUpdate('/api/bill/', 'POST', data, user.token)
      setResult(nuovaBolletta)
   }

   const handleChange = (e) => {
      e.preventDefault()
      const cod = e.target.value
      setCodiceFiscale_Produttore(e.target.value)
      setResult(null)
      const name = fornitori.filter((item) => item.cod_fiscale === cod)[0].nome
      setProduttore(name)
   }

   const handleClickReset = (e) => {
      e.preventDefault()
      setProduttore('')
      setProdotto('')
      setPeso_Netto('')
      setPeso_Lordo('')
      setPrezzo_kg('')
      setCodiceFiscale_Produttore('')
      setResult(null)
   }

   return(
   <>
      <h5 className='text-center display-5 text-primary-emphasis'>Bolletta</h5>

      {result && <AlertSuccess message={'Bolletta Registrata'} />}

      <form className='form container-fluid text-center border border-2 border-success rounded w-auto h-auto mx-5 px-5' >
      
         <div className='row m-2'>
            <label htmlFor='produttore' className='col-4 form-label fw-bold text-end'>Produttore</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='produttore'
               onChange={handleChange}
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

         <div className='row m-2'>
            <label htmlFor='nome' className='col-4 form-label fw-bold text-end'>Nome</label>
            <input 
               className='col form-control' 
               type='string'
               id='nome'
               value={produttore}
               readOnly
               disabled
            />
         </div>

         <div className='row m-2'>
            <label htmlFor='prodotto' className='col-4 form-label fw-bold text-end'>Prodotto</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='prodotto'
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

         <div className='row m-2'>
            <label htmlFor='peso_lordo' className='col-4 form-label fw-bold text-end'>Peso Lordo</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_lordo'
               min='100'
               max='10000'
               placeholder='es. 1000'
               onChange={(e) => setPeso_Lordo(e.target.value)}
               value={peso_lordo}
            />
         </div>

         <div className='row m-2'>
            <label htmlFor='peso_netto' className='col-4 form-label fw-bold text-end'>Peso Netto</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_netto'
               min='100'
               max='10000'
               placeholder='es. 1000'
               onChange={(e) => setPeso_Netto(e.target.value)}
               value={peso_netto}
            />
         </div>

         <div className='row m-2'>
            <label htmlFor='prezzo_kg' className='col-4 form-label fw-bold text-end'>Prezzo/kg</label>
            <input 
               className='col form-control' 
               type='number'
               step="0.01"
               min='0.05'
               max='5.00'
               id='prezzo_kg'
               placeholder='es. 1.5'
               onChange={(e) => setPrezzo_kg(e.target.value)}
               value={prezzo_kg}
            />
         </div>

         <div className='row m-2'>
            <label htmlFor='prezzo_tot' className='col-4 form-label fw-bold text-end'>Prezzo Totale</label>
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
            onClick={handleClickSubmit}
            disabled={isLoadingBolletta || isLoadingProdotti || isLoadingFornitori}
         >
         Acquista
         </button>
         <button 
            className='btn btn-outline-warning rounded-pill m-3' 
            onClick={handleClickReset}
            disabled={isLoadingBolletta || isLoadingProdotti || isLoadingFornitori}
         >
         Reset
         </button>

         {errorBolletta && <AlertDanger message={errorBolletta} />}
         {errorProdotti && <AlertDanger message={errorProdotti} />}
         {errorFornitori && <AlertDanger message={errorFornitori} />}
         {(isLoadingProdotti || isLoadingProdotti) && <AlertInfo message={'Caricamento Dati'} />}

      </form>

      </>
   )
}

export default Bill