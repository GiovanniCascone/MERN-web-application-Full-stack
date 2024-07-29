import {useEffect, useState} from 'react'
import {useAuthContext} from '../hooks/useAuthContext'
import { useFetchGet } from '../fetch/useFetchGet'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import AlertSuccess from '../components/AlertSuccess'
import AlertDanger from '../components/AlertDanger'
import AlertInfo from '../components/AlertInfo'

const Sale = () => {
   const {user} = useAuthContext()

   const {fetchGetDelete, error: errorGetDelete, isLoading: isLoadingGetDelete} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorPU, isLoading: isLoadingPU} = useFetchPostUpdateAuth()
   const {fetchGet, error: errorGet, isLoading: isLoadingGet} = useFetchGet()
   const [clienti, setClienti] = useState('')
   const [prodotti, setProdotti] = useState('')

   const [cliente, setCliente] = useState('')
   const [prodotto, setProdotto] = useState('')
   const [peso_lordo, setPeso_Lordo] = useState('')
   const [peso_netto, setPeso_Netto] = useState('')
   const [prezzo_kg, setPrezzo_kg] = useState('')
   const [bancale, setBancale] = useState('')
   const [n_bancale, setN_Bancale] = useState('')
   const [decorazione, setDecorazione] = useState('')

   const [result, setResult] = useState(null)
   const [debito, setDebito] = useState('')
   const [errorSubmit, setErrorSubmit] = useState(null)
   const [limite, setLimite] = useState(null)


   //FETCH DATA CLIENT AND STORE
   useEffect(() => {
      const fetchEffect = async() => {
         const products = await fetchGetDelete('/api/store/', 'GET', user.token)
         setProdotti(products)
         const buyers = await fetchGet('/api/buyer/')
         setClienti(buyers)
      }

      fetchEffect()
   }, [user.token])
   
   //Controllo limite spesa cliente
   const handleChangeCliente = async(nome) => {
      setErrorSubmit(null)
      setLimite(null)
      setDebito(null)
      setCliente(null)
      setResult(null)

      const limiteSpesa = clienti.filter((item) => (item.nome===nome))[0].limite
      setLimite(limiteSpesa)
      setCliente(nome)
      //Ricerca cliente e debito attuale
      const debitoAttuale = (await fetchGetDelete('/api/sale/debit/' + nome, 'GET', user.token)).debito
      setDebito(debitoAttuale)

   }

   //Reset Form
   const handleClickReset = (e) => {
      e.preventDefault()
      setCliente('')
      setProdotto('')
      setPeso_Lordo('')
      setPeso_Netto('')
      setPrezzo_kg('')
      setBancale('')
      setN_Bancale('')
      setDecorazione('')
      setLimite(null)
      setDebito('')
      setErrorSubmit(null)
      setResult(null)
   }

   // SUBMIT
   const handleClickSubmit = async(e) => {
      e.preventDefault()
      setErrorSubmit(null)

      if(!cliente || !prodotto || !peso_lordo || !peso_netto || !bancale || !n_bancale || !decorazione || !prezzo_kg){
         setErrorSubmit('Compila tutti i campi cordiali saluti dal client')
         return
      }

      const prezzo_tot = (peso_netto*prezzo_kg)+(bancale*n_bancale)+Number(decorazione)
      const nuovoDebito = (Number(debito) + prezzo_tot)

      if(nuovoDebito > limite){
         setErrorSubmit(`Il Cliente sfora il suo limite di spesa a debito: ${nuovoDebito}`)
         return
      }
      setDebito(nuovoDebito)
      const data = {cliente, prodotto, peso_lordo, peso_netto, prezzo_kg, bancale, n_bancale, decorazione, prezzo_tot}
      const nuovaFattura = await fetchPostUpdate('/api/sale/', 'POST', data, user.token)
      setResult(nuovaFattura)
   }
   

   return(
   <>
      <h5 className='text-center display-5 text-primary-emphasis'>Fattura</h5>

      {result && <AlertSuccess message={'Fattura Registrata'} />}

      <form className='form container-fluid text-center border border-2 border-success rounded w-auto h-auto mx-5 px-5'>
         <div className='row border-bottom border-danger py-2 m-1 mx-5'>
            <label htmlFor='cliente' className='col form-label fw-bold'>Cliente</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='cliente'
               onChange={(e) => handleChangeCliente(e.target.value)}
               value={cliente}
            >
            <option value="" disabled selected hidden>Seleziona un cliente</option>
            {clienti
            &&
            clienti.map((item) => (
                  <option key={item._id}>{item.nome}</option>
            ))
            }
            </select>

            <label htmlFor='debito' className='col form-label fw-bold'>Debito</label>
            <input 
               className='col form-control' 
               type='text'
               id='debito'
               value={debito ? `${debito} €` : 'Non definito'}
               disabled readOnly
            />

            <label htmlFor='limite' className='col form-label fw-bold'>Limite di Acquisto</label>
            <input 
               className='col form-control' 
               type='text'
               id='limite'
               value={limite ? `${limite} €`: 'Non definito'}
               disabled readOnly
            />
            
            {errorSubmit && <AlertDanger message={errorSubmit} />}

         </div>
         
         <div className='row m-1 mx-5'>
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
                  <option key={item._id}>{item.prodotto}</option>
            ))
            }
            </select>
         </div>

         <div className='row m-1 mx-5'>
            <label htmlFor='peso_lordo' className='col-4 form-label fw-bold text-end'>Peso Lordo</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_lordo'
               min='0'
               max='10000'
               placeholder='es. 1000'
               onChange={(e) => setPeso_Lordo(e.target.value)}
               value={peso_lordo}
            />
         </div>

         <div className='row m-1 mx-5'>
            <label htmlFor='peso_netto' className='col-4 form-label fw-bold text-end'>Peso Netto</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_netto'
               min='0'
               max='10000'
               placeholder='es. 1000'
               onChange={(e) => setPeso_Netto(e.target.value)}
               value={peso_netto}
            />
         </div>

         <div className='row m-1 mx-5'>
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

         <div className='row m-1 mx-5'>
            <label htmlFor='bancale' className='col-4 form-label fw-bold text-end'>Bancale</label>
            <input 
               className='col form-control' 
               type='number'
               id='bancale'
               min='1'
               max='20'
               placeholder='es. 10'
               onChange={(e) => setBancale(e.target.value)}
               value={bancale}
            />
         </div>

         <div className='row m-1 mx-5'>
            <label htmlFor='peso' className='col-4 form-label fw-bold text-end'>N° Bancale</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso'
               min='1'
               max='10'
               placeholder='es. 2'
               onChange={(e) => setN_Bancale(e.target.value)}
               value={n_bancale}
            />
         </div>

         <div className='row m-1 mx-5'>
            <label htmlFor='decorazione' className='col-4 form-label fw-bold text-end'>Decorazione</label>
            <input 
               className='col form-control' 
               type='number'
               id='decorazione'
               min='0'
               max='20'
               placeholder='es. 10'
               onChange={(e) => setDecorazione(e.target.value)}
               value={decorazione}
            />
         </div>

         <div className='row m-1 mx-5'>
            <label htmlFor='prezzo_tot' className='col-4 form-label fw-bold text-end'>Prezzo Totale</label>
            <input 
               className='col form-control' 
               type='number'
               id='prezzo_tot'
               value={Number((peso_netto*prezzo_kg)+(bancale*n_bancale)+(decorazione*1)).toFixed(2)}
               readOnly
            />
         </div>

         <button 
            className='btn btn-outline-success m-3' 
            onClick={handleClickSubmit}
            disabled={isLoadingPU || isLoadingGet || isLoadingGetDelete}
         >
            Vendi
         </button>
         <button 
            className='btn btn-outline-warning rounded-pill m-3' 
            disabled={isLoadingPU || isLoadingGet || isLoadingGetDelete}
            onClick={handleClickReset}
         >
            Reset
         </button>

         {errorPU && <AlertDanger message={errorPU} />}
         {errorGetDelete && <AlertDanger message={errorGetDelete} />}
         {errorGet && <AlertDanger message={errorGet} />}
         {(isLoadingGet || isLoadingGetDelete) && <AlertInfo message={'Caricamento Dati'} />}
      </form>
      
      

   </>
   )
}

export default Sale