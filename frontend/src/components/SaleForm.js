import { useEffect, useState } from 'react'
import { useFetchGet } from '../fetch/useFetchGet'
import { useFetchPostUpdateAuth } from '../fetch/useFetchPostUpdateAuth'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import AlertSuccess from './AlertSuccess'
import AlertDanger from './AlertDanger'
import AlertInfo from './AlertInfo'

//Inserire controllo limite di spesa
const SaleForm = ({fattura, user, id, reload, setReload}) => {
   const {fetchPostUpdate, error: errorPU, isLoading: isLoadingPU} = useFetchPostUpdateAuth()
   const {fetchGetDelete, error: errorGD, isLoading: isLoadingGD} = useFetchGetDeleteAuth()
   const {fetchGet, error, isLoading} = useFetchGet()
   const [clienti, setClienti] = useState('')
   const [prodotti, setProdotti] = useState('')

   const [debito, setDebito] = useState('')
   const [limite, setLimite] = useState(null)

   const [cliente, setCliente] = useState('')
   const [prodotto, setProdotto] = useState('')
   const [peso_netto, setPeso_Netto] = useState('')
   const [peso_lordo, setPeso_Lordo] = useState('')
   const [prezzo_kg, setPrezzo_kg] = useState('')
   const [bancale, setBancale] = useState('')
   const [n_bancale, setN_Bancale] = useState('')
   const [decorazione, setDecorazione] = useState('')

   const [result, setResult] = useState(null)


   //FETCH DATA PRODUCER AND PRODUCT
   useEffect(() => {
      const fetchEffect = async() => {
         const products = await fetchGetDelete('/api/store/', 'GET', user.token)
         setProdotti(products)
         const buyers = await fetchGet('/api/buyer/')
         setClienti(buyers)
      }

      fetchEffect()
   },[user.token])

   //Controllo limite spesa cliente
   const handleChangeCliente = async(nome) => {
      setLimite(null)
      setDebito(null)
      setCliente(null)

      //Ricerca e Set cliente e limite di spesa - non mi piace tanto questo meccanismo
      if(nome !== 'Seleziona un cliente'){
         setLimite(clienti.filter((item) => (item.nome===nome))[0].limite)
         setCliente(nome)
         //Ricerca cliente e spesa attuale
         const debitoCliente = (await fetchGetDelete('/api/sale/debit/' + nome, 'GET', user.token)).debito
         setDebito(debitoCliente)
      }
   }


   const handleAggiorna = async(e) => {
      e.preventDefault()
      if(!cliente || !prodotto || !peso_lordo || !peso_netto || !prezzo_kg || !bancale || !n_bancale || !decorazione){
         alert('Compila tutti i campi')
         return
      }
      if(peso_lordo <= peso_netto){
         alert('Il Peso Netto deve essere minore del Peso Lordo')
         return
      }

      const prezzo_tot = ((peso_netto * prezzo_kg)+(bancale*n_bancale)+Number(decorazione))
      const nuovoDebito = (Number(debito) - Number(fattura.prezzo_tot) + Number(prezzo_tot))

      if(nuovoDebito > limite){
         alert('Il Cliente '+cliente+' sfora il limite di spesa a debito: '+limite+' Nuovo Debito: '+nuovoDebito)
         return
      }
      const data = {cliente, prodotto, peso_lordo, peso_netto, prezzo_kg, bancale, n_bancale, decorazione, prezzo_tot}
      const saleUpdated = await fetchPostUpdate('/api/sale/' + id, 'PATCH', data, user.token)
      setResult(saleUpdated)
      if(saleUpdated){
         setReload(!reload)
      }
   }

   const handleReset = (e) => {
      e.preventDefault()
      setCliente('')
      setProdotto('')
      setPeso_Netto('')
      setPeso_Lordo('')
      setPrezzo_kg('')
      setBancale('')
      setN_Bancale('')
      setDecorazione('')
      setLimite(null)
      setResult(null)
      setDebito(null)
   }

   return(
   <>
      <h4 className='text-center text-warning-emphasis fs-4 fw-normal'>Aggiorna Fattura</h4>
      <h5 className='text-center text-info-emphasis'>{id}</h5>
      <form className='form container-fluid text-center border border-warning rounded w-auto h-auto p-3'>

         {result && <AlertSuccess message={'Fattura Aggiornata'} />}

         <div className='row m-1'>
            <label htmlFor='cliente' className='col-3 form-label text-start fw-bold'>Cliente</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='cliente'
               placeholder={fattura.nome}
               onChange={(e)=> handleChangeCliente(e.target.value)}
               value={cliente}
            >
            <option>Seleziona un cliente</option>
            {clienti
            &&
            clienti.map((item) => (
                  <option key={item._id}>{item.nome}</option>
            ))
            }
            </select>
         </div>

         <div className='row m-1 my-2'>
            <label htmlFor='debito' className='col-3 form-label text-start fw-bold'>Debito</label>
               <input 
                  className='col form-control' 
                  type='text'
                  id='debito'
                  value={debito ? `${debito} €` : 'Non definito'}
                  disabled readOnly
               />

               <label htmlFor='limite' className='col-3 form-label text-start fw-bold'>Limite di Acquisto</label>
               <input 
                  className='col form-control' 
                  type='text'
                  id='limite'
                  value={limite ? `${limite} €` : 'Non definito'}
                  disabled readOnly
               />
         </div>

         <div className='row m-1'>
            <label htmlFor='prodotto' className='col-3 form-label text-start fw-bold'>Prodotto</label>
            <select  
               className='col form-select form-control' 
               type='text'
               id='prodotto'
               placeholder={fattura.prodotto}
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

         <div className='row m-1'>
            <label htmlFor='peso_lordo' className='col-3 form-label text-start fw-bold'>Peso Lordo</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_lordo'
               min='100'
               max='10000'
               placeholder={fattura.peso_lordo}
               onChange={(e) => setPeso_Lordo(e.target.value)}
               value={peso_lordo}
            />
         </div>

         <div className='row m-1'>
            <label htmlFor='peso_netto' className='col-3 form-label text-start fw-bold'>Peso Netto</label>
            <input 
               className='col form-control' 
               type='number'
               id='peso_netto'
               min='100'
               max='10000'
               placeholder={fattura.peso_netto}
               onChange={(e) => setPeso_Netto(e.target.value)}
               value={peso_netto}
            />
         </div>

         <div className='row m-1'>
            <label htmlFor='prezzo_kg' className='col-3 form-label text-start fw-bold'>Prezzo/kg</label>
            <input 
               className='col form-control' 
               type='number'
               step="0.01"
               min='0.05'
               max='5.00'
               id='prezzo_kg'
               placeholder={fattura.prezzo_kg}
               onChange={(e) => setPrezzo_kg(e.target.value)}
               value={prezzo_kg}
            />
         </div>

         <div className='row m-1'>
            <label htmlFor='bancale' className='col-3 form-label text-start fw-bold'>Bancale</label>
            <input 
               className='col form-control' 
               type='number'
               step="1"
               min='0'
               max='20'
               id='bancale'
               placeholder={fattura.bancale}
               onChange={(e) => setBancale(e.target.value)}
               value={bancale}
            />
         </div>

         
         <div className='row m-1'>
            <label htmlFor='n_bancale' className='col-3 form-label text-start fw-bold'>N°Bancale</label>
            <input 
               className='col form-control' 
               type='number'
               step="1"
               min='0'
               max='5'
               id='n_bancale'
               placeholder={fattura.n_bancale}
               onChange={(e) => setN_Bancale(e.target.value)}
               value={n_bancale}
            />
         </div>

         <div className='row m-1'>
            <label htmlFor='decorazione' className='col-3 form-label text-start fw-bold'>Decorazione</label>
            <input 
               className='col form-control' 
               type='number'
               step="1"
               min='0'
               max='20'
               id='decorazione'
               placeholder={fattura.decorazione}
               onChange={(e) => setDecorazione(e.target.value)}
               value={decorazione}
            />
         </div>

         <div className='row m-1'>
            <label htmlFor='prezzo_tot' className='col-3 form-label text-start fw-bold'>Prezzo Totale</label>
            <input 
               className='col form-control' 
               type='number'
               id='prezzo_tot'
               value={Number((peso_netto * prezzo_kg)+(bancale * n_bancale) +(decorazione*1)).toFixed(2)}
               disabled readOnly
            />
         </div>

         <button 
            className='btn btn-outline-success m-3'
            onClick={handleAggiorna}
            disabled={isLoadingPU || isLoadingGD || isLoading}
         >
         Modifica
         </button>
         <button 
            className='btn btn-outline-warning rounded-pill m-3'
            onClick={handleReset} 
            disabled={isLoadingPU || isLoadingGD || isLoading}
         >
            RESET
         </button>

         {error && <AlertDanger message={error} />}
         {errorPU && <AlertDanger message={errorPU} />}
         {errorGD && <AlertDanger message={errorGD} />}
         {(isLoading || isLoadingGD) && <AlertInfo message={'Caricamento Dati'} />}

      </form>

   </>
   )
}

export default SaleForm