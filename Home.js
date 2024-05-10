import {useEffect, useState} from 'react'
import { useFetchGet } from '../fetch/useFetchGet'
import Mercuriale from '../components/Mercuriale'
import AlertDanger from '../components/AlertDanger'
import AlertInfo from '../components/AlertInfo'
import UserBoxList from '../components/UserBoxList'


const Home = () => {
    const {fetchGet, error, isLoading} = useFetchGet()
    const [prodotti, setProdotti] = useState(null)
    const [utenti, setUtenti] = useState(null)

    //RECUPERO MERCURIALE DALLE BOLLETTE
    useEffect(() => {
        const fetchEffect = async() => {
            const products = await fetchGet('/api/sale/mercuriale') 
            setProdotti(products)

            const users = await fetchGet('/api/user/box')
            setUtenti(users)
        }

        fetchEffect()
    }, [])
    

    return(
    <>
        <header className='container-fluid text-center'>
            <h1 className='display-3 text-primary'>Mercato Ortofrutticolo di Vittoria</h1>
            <span>  
                <h5>IL FIORE ALL'OCCHIELLO DELLA CITTÀ DI VITTORIA</h5>
                Inaugurato nel 1986, il mercato ha una superficie totale di mq 246.000.
                La proprietà è della Regione Siciliana, la gestione è del Comune di Vittoria
            </span>
        </header>

        <div className='container-fluid text-center my-2 mt-5'>
            <h3 className='text-primary-emphasis'>Mercuriale</h3>
            <span className='text-warning-emphasis'>Prezzo medio riferito alle vendite degli ultimi 7 giorni</span>
            <div className='m-1 px-5'>
                <div className='row border border-primary border-2 text-success fw-bold'>
                    <div className='col'>
                    PRODOTTO
                    </div>
                    <div className='col'>
                    PREZZO MEDIO - VENDITA
                </div>
                </div>
                    {isLoading && <AlertInfo message={'Caricamento Dati'} />}
                    {error && <AlertDanger message={error} />}

                    {prodotti && <Mercuriale prodotti={prodotti} />}
                </div>
        </div>

        <div className='container-fluid text-center my-2 mt-5'>
            <h3 className='text-primary-emphasis'>Lista Box</h3>
            <div className='m-1 px-5'>
                <div className='row border border-primary border-2 text-success fw-bold'>
                    <div className='col'>NUMERO</div>
                    <div className='col'>NOME BOX</div>
                    <div className='col'>INTESTATARIO</div>
                    <div className='col'>TELEFONO</div>
                </div>
                    {isLoading && <AlertInfo message={'Caricamento Dati'} />}
                    {error && <AlertDanger message={error} />}

                    {utenti && <UserBoxList utenti={utenti} />}
                </div>
        </div>

        <footer className='container-fluid text-center text-info bg-dark p-4 shadow mt-auto'>
            <h1 className='text-warning-emphasis bg-light badge fs-5'>CONTATTI</h1>
            <div className='row'>
                <div className='col'>
                    <span className='fw-bold mb-1'>Vittoria Mercati</span><br/>
                    <span>Email: vittoriamercati@gmail.com</span><br/>
                    <span>Telefono: 3334445556</span><br/>
                </div>
                <div className='col'>
                    <span className='fw-bold mb-1'>Associazione Commissionari</span><br/>
                    <span>Email: commissionari@gmail.com</span><br/>
                    <span>Telefono: 3331112223</span><br/>
                </div>
            </div>
        </footer>
    </>

    )
}
export default Home