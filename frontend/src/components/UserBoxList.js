const UserBoxList = ({utenti}) => {
   
   return(
      utenti.map((utente) => (
         <div key={utente._id} className='row border-bottom border-success'>
            <div className='col border'>{utente.identificativo}</div>
            <div className='col border'>{utente.nome_box}</div>
            <div className='col border'>{utente.intestatario}</div>
            <div className='col border'>{utente.telefono}</div>
         </div>
      ))
   )
}

export default UserBoxList