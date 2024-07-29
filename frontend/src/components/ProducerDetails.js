const ProducerDetails = ({data}) => {
   return(
      <ul className="list-group text-start m-2">
         <h5 className='text-warning-emphasis text-center'>Dettagli Produttore</h5>
         <li className="list-group-item ps-5">
            <span className='fw-bold text-success'>ID:</span>
            <span className='fs-6'> {data._id}</span>
         </li>
         <li className="list-group-item ps-5">
            <span className='fw-bold text-success'>NOME:</span>
            <span className=' fs-6'> {data.nome}</span>
         </li>
         <li className="list-group-item ps-5">
            <span className='fw-bold text-success'>CODICE FISCALE:</span>
            <span className=' fs-6'> {data.cod_fiscale}</span>
         </li>
         <li className="list-group-item ps-5">
            <span className='fw-bold text-success'>TELEFONO:</span>
            <span className=' fs-6'> {data.telefono}</span>
         </li>
         <li className="list-group-item ps-5">
            <span className='fw-bold text-success'>IBAN:</span>
            <span className=' fs-6'> {data.iban}</span>
         </li>

      </ul>

   )

}

export default ProducerDetails