const BuyerList = ({acquirenti}) => {
   
   return(
      acquirenti.map((cliente) => (
         <div key={cliente._id} className='row border-bottom border-success'>
            <div className='col border'>{cliente.nome}</div>
            <div className='col border'>{cliente.limite}</div>
         </div>
      ))
   )
}

export default BuyerList