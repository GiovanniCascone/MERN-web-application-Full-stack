import { useState } from "react";
import ProducerSignup from "../components/ProducerSignup"
import ProducerUpdateDelete from "../components/ProducerUpdateDelete"


const Producer = () => {
   const [reload, setReload]= useState(false)


   return(
      <div className="text-center">
         <h5 className='display-5 text-primary-emphasis mb-2'>Produttore</h5>
         <ProducerSignup reload={reload} setReload={setReload} />
         <div className="py-4"></div>
         <ProducerUpdateDelete reload={reload} setReload={setReload}/>
      </div>

   )
}

export default Producer