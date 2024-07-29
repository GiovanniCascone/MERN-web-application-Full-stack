import { useEffect, useState } from 'react'

const Componente = () => {
   //Dichiarazioni variabili, oggetti, hook ecc..____________________________
  const [prodotto, setProdotto] = useState()

   //Funzioni________________________________________________________________
   useEffect(() => {
      const fetchEffect = async() => {
         const product = await fetch('http://localhost:3000/prodotto/1', {
            method: GET
         })
         setProdotto(product)
      }
      fetchEffect()
   },[user.token])

   const handleClick = () => {
      alert('Hai cliccato')
   }

   //Restituisce contenuto____________________________________________________
   return(
   <>
      <div>Acquista prodotto {prodotto}</div>
      <button onClick={handleClick}> Cliccami </button>
   </>
   )
}

//Esportazione________________________________________________________________
export default Componente