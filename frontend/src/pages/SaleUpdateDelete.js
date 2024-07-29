import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { useFetchGetDeleteAuth } from "../fetch/useFetchGetDeleteAuth"
import { useAuthContext } from "../hooks/useAuthContext"
import SaleCard from "../components/SaleCard";
import SaleForm from "../components/SaleForm"
import AlertInfo from "../components/AlertInfo";
import AlertDanger from "../components/AlertDanger";

const SaleUpdateDelete = () => {
    const {id} = useParams()
    const {user} = useAuthContext()
    const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
    const [fattura, setFattura] = useState()
    const [reload, setReload] = useState(false)
   
    useEffect(() => {
      const fetchEffect = async() => {
        const sale = await fetchGetDelete('/api/sale/' + id, 'GET', user.token)
        setFattura(sale)
      }

      fetchEffect()
    },[user.token, reload])
    return(
       
    <div className="container-fluid text-center w-auto h-auto m-1">
        <h1 className='text-center display-6 text-primary-emphasis mb-5'>Elimina-Modifica Fattura</h1>
        
        {isLoading && <AlertInfo message={'caricamento Dati'} />}
        {error && <AlertDanger message={error} />}

        {fattura
        &&
        <div className="row">

            {/*CARD*/}
            <div className="col">
                <SaleCard fattura={fattura} user={user} id={id} reload={reload} setReload={setReload}/>
            </div>

            {/*FORM*/}
            <div className="col">
                <SaleForm fattura={fattura} user={user} id={id} reload={reload} setReload={setReload}/>
            </div>
            
        </div>
            }
    </div>
        
    )
   
}

export default SaleUpdateDelete