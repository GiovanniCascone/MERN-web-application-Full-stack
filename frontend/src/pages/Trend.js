import {useEffect, useState} from 'react'
import AlertDanger from '../components/AlertDanger'
import AlertInfo from '../components/AlertInfo'
import ProduzioneList from '../components/ProduzioneList'
import { useFetchGetDeleteAuth } from '../fetch/useFetchGetDeleteAuth'
import { useAuthContext } from '../hooks/useAuthContext'
import CommercializzazioneList from '../components/CommercializzazioneList'


const Trend = () => {
    const {user} = useAuthContext()
    const {fetchGetDelete, error, isLoading} = useFetchGetDeleteAuth()
    const [produzione, setProduzione] = useState(null)
    const [commercializzazione, setCommercializzazione] = useState(null)

    useEffect(() => {
        const fetchEffect = async() => {
           const produzione = await fetchGetDelete('/api/bill/produzione', 'GET', user.token)
           setProduzione(produzione)

           const commercializzazione = await fetchGetDelete('/api/sale/commercializzazione', 'GET', user.token)
           setCommercializzazione(commercializzazione)
        }
  
        fetchEffect()
     },[user.token])
    

    return(
    <>

        <div className='text-center text-warning-emphasis mt-5'>
            <span className='border border-info p-3'>
                Trend riferiti ai flussi in entrata e uscita dell'intero Mercato Ortofrutticolo nell'anno corrente
            </span>
        </div>

        <div className='container-fluid text-center my-2 mt-5'>
            <h3 className='text-primary-emphasis'>Produzione Mensile</h3>
            <div className='m-1 px-5'>
                <div className='row border border-primary border-2 text-success fw-bold'>
                    <div className='col'>MESE</div>
                    <div className='col'>PRODOTTO</div>
                    <div className='col'>PRODUZIONE/KG</div>
                </div>
                    {isLoading && <AlertInfo message={'Caricamento Dati'} />}
                    {error && <AlertDanger message={error} />}

                    {produzione && <ProduzioneList produzione={produzione} />}
                </div>
        </div>

        <div className='container-fluid text-center my-2 mt-5'>
            <h3 className='text-primary-emphasis'>Vendita Mensile</h3>
            <div className='m-1 px-5'>
                <div className='row border border-primary border-2 text-success fw-bold'>
                    <div className='col'>MESE</div>
                    <div className='col'>PRODOTTO</div>
                    <div className='col'>KG VENDUTI</div>
                    <div className='col'>PREZZO MEDIO</div>
                </div>
                    {isLoading && <AlertInfo message={'Caricamento Dati'} />}
                    {error && <AlertDanger message={error} />}

                    {commercializzazione && <CommercializzazioneList commercializzazione={commercializzazione} />}
                </div>
        </div>

      
    </>

    )
}
export default Trend