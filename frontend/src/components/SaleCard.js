import { useState } from "react"
import { useFetchGetDeleteAuth } from "../fetch/useFetchGetDeleteAuth"
import { useFetchPostUpdateAuth } from "../fetch/useFetchPostUpdateAuth"
import moment from 'moment'
import AlertDanger from "./AlertDanger"


const SaleCard = ({fattura, user, id, reload, setReload}) => {
   const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorPU, isLoading: isLoadingPU} = useFetchPostUpdateAuth()
   const [deleted, setDeleted] = useState(null)

   const handleClickElimina = async(e) => {
      e.preventDefault()
      const fatturaEliminata = await fetchGetDelete('/api/sale/' + id, 'DELETE', user.token)
      if(fatturaEliminata){
         setDeleted(fatturaEliminata)
      }
   }

   const handlePagamento = async(e) => {
      e.preventDefault()
      const pagata = !(fattura.pagata)
      const data = {pagata}
      const fatturaPagata = await fetchPostUpdate('/api/sale/paySale/' + id, 'PATCH', data, user.token)
      if(fatturaPagata){
         setReload(!reload)
      }
   }

   return(
   <>
   <h4 className='text-center text-danger-emphasis fs-4 fw-normal'>Dettagli Fattura</h4>
   <h5 className='text-center text-info-emphasis'>{id}</h5>

   {deleted ?
   <AlertDanger message={'Fattura Eliminata'} />
      :
   <div className='card border border-success'>

      <div className="card-body">
         <h5 className="card-title">CLIENTE: <span className="fw-normal">{fattura.cliente}</span></h5>
      </div>
      <ul className="list-group list-group-flush">
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">PRODOTTO:</span >
            <span className="col text-start">{fattura.prodotto}</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">PESO LORDO:</span >
            <span className="col text-start">{fattura.peso_lordo} kg</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">PESO NETTO:</span >
            <span className="col text-start">{fattura.peso_netto} kg</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">PREZZO/KG:</span >
            <span className="col text-start">{fattura.prezzo_kg} €</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">BANCALE:</span >
            <span className="col text-start">{fattura.bancale} €</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">N° BANCALE:</span >
            <span className="col text-start">{fattura.n_bancale}</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">DECORAZIONE:</span >
            <span className="col text-start">{fattura.decorazione} €</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">DATA:</span >
            <span className="col text-start">{moment(fattura.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
         </li>
         <li className="row border-bottom m-1">
            <span className="col fw-semibold text-end">TOTALE:</span >
            <span className="col text-start">{fattura.prezzo_tot} €</span>
         </li>
        
         <li className="list-group-item">
         STATO: {fattura.pagata ? 
                     <button 
                     className='btn btn-outline-success btn-sm m-1' 
                     onClick={handlePagamento}
                     disabled={isLoading || isLoadingPU}
                     >
                        Pagata
                     </button> 
                     : 
                     <button 
                     className='btn btn-outline-danger btn-sm m-1' 
                     onClick={handlePagamento}
                     disabled={isLoading || isLoadingPU}
                     >
                        Da Pagare
                     </button>
               }
         </li>
      </ul>

      <button 
         className='btn btn-outline-danger m-3'
         onClick={handleClickElimina}
         disabled={isLoading || isLoadingPU}
      >
         Elimina
      </button>
      {error && <AlertDanger message={error} />}
      {errorPU && <AlertDanger message={errorPU} />}

   </div> 
   }

   </>
   )
}

export default SaleCard