const ProduzioneList = ({produzione}) => {
   
   return(
      produzione.map((item) => (
         <div key={item._id} className='row border-bottom border-success'>
            <div className='col border'>{item._id.month}</div>
            <div className='col border text-start'>{item._id.product}</div>
            <div className='col border'>{item.totalQuantity}</div>
         </div>
      ))
   )
}

export default ProduzioneList