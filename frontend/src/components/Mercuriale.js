const Mercuriale = ({prodotti}) => {
   
   return(
      prodotti.map((prodotto) => (
         <div key={prodotto._id} className='row border-bottom border-success'>
            <div className='col border'>{prodotto._id}</div>
            <div className='col border'>{Number(prodotto.prezzo_medio).toFixed(2)}</div>
         </div>
      ))
   )
}

export default Mercuriale