import { useState } from "react"
import { useFetchGetDeleteAuth } from "../fetch/useFetchGetDeleteAuth"
import { useFetchPostUpdateAuth } from "../fetch/useFetchPostUpdateAuth"
import AlertDanger from "./AlertDanger"
import moment from 'moment'

const BillCard = ({bolletta, user, id, reload, setReload}) => {
   const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
   const {fetchPostUpdate, error: errorPU, isLoading: isLoadingPU} = useFetchPostUpdateAuth()
   const [deleted, setDeleted] = useState(false)

   const handleClickElimina = async(e) => {
      e.preventDefault()
      const bollettaEliminata = await fetchGetDelete('/api/bill/' + id, 'DELETE', user.token)
      if(bollettaEliminata){
         setDeleted(true)
      }
   }

   const handlePagamento = async(e) => {
      e.preventDefault()
      console.log('handlePagamento')
      const pagata = !(bolletta.pagata)
      const data = {pagata}
      const bollettaAggiornata = await fetchPostUpdate('/api/bill/payBill/' + id, 'PATCH', data, user.token)
      if(bollettaAggiornata){
         setReload(!reload)
      }
   }

   return(
   <>
      {deleted ? 
            <div className='alert alert-danger m-3'>BOLLETTA: N° {id} ELIMINATA</div>
         :
      <>
         <div className="card-body">
            <h5 className="card-title">PRODUTTORE: <span className="fw-normal">{bolletta.produttore}</span></h5>
            <h6 className="card-title">COD FISCALE: <span className="fw-normal">{bolletta.cod_fiscale_produttore}</span></h6>
         </div>
         <ul className="list-group list-group-flush">
            <li className="row border-bottom m-1">
               <span className="col fw-semibold text-end">PRODOTTO:</span >
               <span className="col text-start">{bolletta.prodotto}</span>
            </li>
            <li className="row border-bottom m-1">
               <span className="col fw-semibold text-end">PESO LORDO:</span >
               <span className="col text-start">{bolletta.peso_lordo} kg</span>
            </li>
            <li className="row border-bottom m-1">
               <span className="col fw-semibold text-end">PESO NETTO:</span >
               <span className="col text-start">{bolletta.peso_netto} kg</span >
            </li>
            <li className="row border-bottom m-1">
               <span className="col fw-semibold text-end">PREZZO/KG:</span >
               <span className="col text-start">{bolletta.prezzo_kg} € </span >
            </li>
            <li className="row border-bottom m-1">
               <span className="col fw-semibold text-end">DATA:</span >
               <span className="col text-start">{moment(bolletta.createdAt).format('DD/MM/YYYY HH:mm:ss')} </span >
            </li>
            <li className="row border-bottom m-1">
               <span className="col fw-semibold text-end">TOTALE: </span >
               <span className="col text-start">{bolletta.prezzo_tot} € </span >
            </li>
            <li className="list-group-item fw-semibold">
            STATO: {bolletta.pagata ? 
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
      </>
   }
  
   </> 
   )
}

export default BillCard