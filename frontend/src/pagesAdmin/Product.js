import ProductSignup from "../componentsAdmin/ProductSignup"
import ProductDelete from "../componentsAdmin/ProductDelete"
import {useFetchGet} from '../fetch/useFetchGet'
import { useEffect, useState } from "react"
import AlertInfo from "../components/AlertInfo"
import AlertDanger from "../components/AlertDanger"
import { useAuthAdminContext } from "../hooksAdmin/useAuthAdminContext"
import ProductList from "../components/ProductList"

const Product = () => {
   const {admin} = useAuthAdminContext()
   const [reload, setReload] = useState()
   const [products, setProducts] = useState(null)
   const {fetchGet, error, isLoading} = useFetchGet()

   
   useEffect(() => {
      const fetchEffect = async() => {
         const prodotti = await fetchGet('/api/product/')
         setProducts(prodotti)
      }

      fetchEffect()      
   },[reload])


   return (
   <div className="container text-center">
      <h5 className='display-5 text-center text-primary-emphasis my-3'>Gestione Prodotti</h5>

      {isLoading && <AlertInfo message={'Caricamento Dati'} />}
      {error && <AlertDanger message={'Errore recupero dati'} />}

      <ProductSignup reload={reload} setReload={setReload} admin={admin} />
      <ProductDelete reload={reload} setReload={setReload} admin={admin} products={products} />

      <div className='container-fluid text-center my-2 mt-5'>
         <h3 className='text-primary-emphasis'>Lista Prodotti</h3>
         <div className='m-1 px-5'>
         <div className='row border border-primary border-2 text-success fw-bold'>
            <div className='col'>NOME</div>
         </div>
            {isLoading && <AlertInfo message={'Caricamento Dati'} />}
            {error && <AlertDanger message={error} />}

            {products && <ProductList prodotti={products} />}
         </div>
      </div>

   </div>
   )
}
 
export default Product