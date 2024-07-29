const ProductList = ({prodotti}) => {
   
   return(
      prodotti.map((prodotto) => (
         <div key={prodotto._id} className='row border-bottom border-success'>
            <div className='col border'>{prodotto.nome}</div>
         </div>
      ))
   )
}

export default ProductList