import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { useFetchGetDeleteAuth } from "../fetch/useFetchGetDeleteAuth"
import { useAuthContext } from "../hooks/useAuthContext"
import BillCard from "../components/BillCard";
import BillForm from "../components/BillForm"
import AlertInfo from "../components/AlertInfo";
import AlertDanger from "../components/AlertDanger";

const BillUpdateDelete = () => {
    const {id} = useParams()
    const {user} = useAuthContext()
    const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
    const [bolletta, setBolletta] = useState()
    const [reload, setReload] = useState(false)
   
   
    useEffect(() => {
      const fetcheffect = async() => {
        const bill = await fetchGetDelete('/api/bill/' + id, 'GET', user.token)
        setBolletta(bill)
      }

      fetcheffect()
    },[user.token, reload])

    return(
       
    <div className="container-fluid text-center m-2 w-auto h-auto">
        <h1 className='display-6 text-primary-emphasis mb-5'>Elimina | Modifica Bolletta</h1>

        {isLoading && <AlertInfo message={'Caricamento Dati'} />}
        {error && <AlertDanger message={error} />}

        {bolletta
        &&
        <div className="row">

            {/*CARD*/}

            <div className="col card text-center border border-success m-1 shadow">
                <h5 className='text-warning-emphasis'>Dettagli Bolletta</h5>
                <h5 className='text-info-emphasis border-bottom border-success pb-2'>N° {id}</h5>
                <BillCard bolletta={bolletta} user={user} id={id} reload={reload} setReload={setReload}/>
            </div>

            {/*FORM*/}
            <div className="col text-center border border-warning rounded m-1 shadow">
                <h5 className='text-warning-emphasis'>Aggiorna Bolletta</h5>
                <h5 className='text-info-emphasis border-bottom border-warning pb-2'>N° {id}</h5>
                <BillForm bolletta={bolletta} user={user} id={id} reload={reload} setReload={setReload}/>
            </div>
            
        </div>
        }
    </div>
        
    )
   
}

export default BillUpdateDelete