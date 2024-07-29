const Sale = require('../models/saleModel')
const Store = require('../models/storeModel')
const mongoose = require('mongoose')

/*Autenticazione Necessaria 
ho a disposizione l'box_id per query reperire i dati specifici dell'utente */

/*Non necessaria Autenticazione*/
// RECUPERO TUTTE LE BOLLETTE PER MERCURIALE____________________________________________________________________________
const getMercuriale = async(req, res) => {
   const setteGiorniFa = new Date()
   setteGiorniFa.setDate(setteGiorniFa.getDate() - 7)

   const sales = await Sale.aggregate([
      {
         $match: { createdAt: {$gte: setteGiorniFa, $lte: new Date()} }
      },
      {
        $group: {
          _id: '$prodotto',
          prezzo_medio: { $avg: '$prezzo_kg' }
        },
      },
      {
         $sort: {
            _id: 1
         }
      }
    ])

   if(!sales){
      return res.status(400).json({error: 'Errore recupero Bills'})
   }     
   res.status(200).json(sales)
}



//PRODUZIONE MENSILE______________________________________________________________________________________________
const getCommercializzazione = async(req, res) => {
   const currentYear = new Date().getFullYear();
   
   const produzione = await Sale.aggregate([
      {
         $match: {
           $expr: {
             $eq: [{ $year: "$updatedAt" }, currentYear] // Filtra per l'anno corrente
           }
         }
      },
      {
        $project: {
          month: { $month: "$updatedAt" }, // Estrai il mese dalla data di produzione
          product: "$prodotto",
          quantity: "$peso_netto",
          price: "$prezzo_kg"
        }
      },
      {
        $group: {
          _id: { month: "$month", product: "$product" }, // Raggruppa per mese e prodotto
          totalQuantity: { $sum: "$quantity" }, // Calcola la somma della quantità per ogni gruppo
          averagePrice: { $avg: "$price" } // Calcola la somma della quantità per ogni gruppo
        }
      },
      {
        $sort: { "_id.month": 1, "_id.product": 1 } // Ordina i risultati per mese e poi per prodotto
      }
   ])
    
   if(!produzione){
      return res.status(400).json({error: 'Recupero Produzione fallito'})
   }

   res.status(200).json(produzione)
}



// RECUPERO DI TUTTE LE FATTURE DI UNO SPECIFICO BOX________________________________________________________________
const getSales = async(req, res) => {
   const box_id = req.box._id
   const sales = await Sale.find({box_id}).sort({createdAt: -1})
   if(!sales){
      return res.status(400).json({error: 'Errore durante il recupero delle fatture'})
   }
   res.status(200).json(sales)
}



// GET ONE SALE_____________________________________________________________________________________________________
const getSale = async(req, res) => {
   const {id} = req.params
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: 'Invalid ID'})
   }

   const sale = await Sale.findById(id)
   if(!sale) return res.status(400).json({error: 'Sale not found'})
   res.status(200).json(sale)
}


// RICERCA DEBITO TOTALE DI UNO SPECIFICO CLIENTE___________________________________________________________________
const getDebit = async(req, res) => {
   const {nome} = req.params

   const debito = await Sale.aggregate([
      {
         $match: {cliente: nome, pagata: false}
      },
      {
         $group: {
            _id: '$cliente',
            debito: {$sum: '$prezzo_tot'}
         }
      }
   ])
  
   if(debito==''){
      return res.status(200).json({_id: nome, debito: 0})
   }
   if(!debito){
      return res.status(400).json({error: 'Errore nel recupero del debito'})
   }
   res.status(200).json(...debito)
}


// CREATE ONE SALE-Con Transaction---------------------------------------------------------------------------
const createSale = async(req, res) => {
   const box_id = req.box._id

   async function eseguiTransazione() {
      //Avvio transazione per atomiticizzare le operazioni
      const session = await mongoose.startSession()

      //INSERIMENTO IN MAGAZZINO
      try{      
         if (!session.inTransaction()) {
            await session.startTransaction();
         }
         
         const product = await Store.findOne({prodotto: req.body.prodotto, box_id}).session(session)
         
         if(!product){
            throw new Error('Prodotto non presente in magazzino')
         }else{
            const nuovoPeso = Number(product.peso) - Number(req.body.peso_netto)
            if(nuovoPeso < 0){
               throw new Error(`${product.prodotto} disponibile in magazzino kg: ${product.peso}`)
            }
            //DELETE
            if(nuovoPeso === 0){
               const deleteProduct = await Store.findByIdAndDelete({_id: product._id}).session(session)
               if(!deleteProduct){
                  throw new Error('Errore Estrazione')
               }
            }else{
               //UPDATE
               const update = await Store.findByIdAndUpdate({_id: product._id}, {peso: nuovoPeso}).session(session)
               if(!update){
                  throw new Error('Errore Estrazione')
               }
            }

         }
   
         //Se L'inserimento in magazzino è andato a buon fine creo la fattura
         const sale = await Sale.create([{...req.body, box_id}], {session: session})
         await session.commitTransaction()
         res.status(200).json(...sale)
      }catch(err){
         await session.abortTransaction()
         res.status(400).json({error: err.message})
      }finally{
         await session.endSession()
      }
   }

   // Chiamata alla funzione per eseguire la query con la sessione
   eseguiTransazione()

}



// UPDATE ONE SALE----------------------------------------------------------------------
const updateSale = async(req, res) => {
   const {id} = req.params
   const box_id = req.box._id
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: 'Invalid ID'})
   }

   const eseguiTransazione = async () => {
      const session = await mongoose.startSession()
      
      try{
         if(!session.inTransaction()){
            await session.startTransaction()
         }

         const saleBefore = await Sale.findById(id).session(session)
         if(!saleBefore){
            throw new Error('Errore: Fattura non trovata')
         }
         //AGGIORNAMENTO MAGAZZINO

         //Reset peso
         const productBefore = await Store.findOne({prodotto: saleBefore.prodotto, box_id}).session(session)
         if(!productBefore){
            const create = await Store.create([{prodotto: saleBefore.prodotto, peso: saleBefore.peso_netto, box_id}], {session: session})
            if(!create){
               throw new Error('Errore: Crazione prodotto fallita')
            }
         }else{
            const setPeso = (productBefore.peso + saleBefore.peso_netto)
            const resetPeso = await Store.findOneAndUpdate({_id: productBefore._id}, {peso: setPeso}).session(session)
            if(!resetPeso){
               throw new Error('Errore: Reset peso fallita')
            }
         }
         
         const productDaAggiornare = await Store.findOne({prodotto: req.body.prodotto, box_id}).session(session)
         if(!productDaAggiornare){
            //Da controllare se con la transaction poi si annulla il reset del magazzino
            throw new Error('Errore: Prodotto non disponibile in magazzino')
         }

         const nuovoPeso = productDaAggiornare.peso - Number(req.body.peso_netto)
         if(nuovoPeso < 0){
            throw new Error(`${productDaAggiornare.nome} disponibile in magazzino kg: ${productDaAggiornare.peso}`)
         }else if(nuovoPeso === 0){
            const cancella = await Store.findByIdAndDelete({_id: productDaAggiornare._id}).session(session)
            if(!cancella){
               throw new Error('Errore: Cancellazione prodotto in magazzino')
            }
         }else{
            const aggiornaPeso = await Store.findByIdAndUpdate({_id: productDaAggiornare._id}, {peso: nuovoPeso}).session(session)
            if(!aggiornaPeso){
               throw new Error('Errore: Aggiornamento peso fallito')
            }
         }
         //---//

         //AGGIORNAMENTO FATTURA
         const update = await Sale.findByIdAndUpdate(id, {...req.body}).session(session)
         if(!update){
            throw new Error('Errore: Aggiornamento Fattura fallito')
         }
         await session.commitTransaction()
         res.status(200).json(update)
      }catch(error){
         await session.abortTransaction()
         res.status(400).json({error: error.message})
      }finally{
         await session.endSession()
      }
   }

   eseguiTransazione()

}




// DELETE ONE SALE----------------------------------------------------------------------------------------------------
const deleteSale = async(req, res) => {
   const {id} = req.params
   const box_id = req.box._id
   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: 'Invalid ID'})
   }

   const eseguiTransazione = async() => {
      const session = await mongoose.startSession()

      try{
         if(!session.inTransaction()){
            await session.startTransaction()
         }

         const saleBefore = await Sale.findById(id).session(session)
         if(!saleBefore){
            throw new Error('Fattura non trovata')
         }

         //AGGIORNAMENTO MAGAZZINO
         const product = await Store.findOne({prodotto: saleBefore.prodotto, box_id}).session(session)
         
         if(!product){
            const create = await Store.create([{prodotto: saleBefore.prodotto, peso: saleBefore.peso_netto, box_id}], {session: session})
            if(!create){
               throw new Error('Error creazione prodotto in magazzino')
            }
         }else{
            const nuovoPeso = product.peso + saleBefore.peso_netto
            const aggiornaPeso = await Store.findByIdAndUpdate({_id: product._id}, {peso: nuovoPeso}).session(session)
            if(!aggiornaPeso){
               throw new Error('Errore aggiornamento peso magazzino')
            }
         }
         //---//

         //ELIMINAZIONE FATTURA
         const sale = await Sale.findByIdAndDelete(id).session(session)
         if(!sale){
            throw new Error('Fattura non trovata')
         }
         await session.commitTransaction()
         res.status(200).json(sale)
      }catch(error){
         await session.abortTransaction()
         return res.status(400).json({error: error.message})
      }finally{
         await session.endSession()
      }
   }

   eseguiTransazione()
}


//PAGA SALE--------------------------------------------------------------------------------------------------------
const paySale = async(req, res) => {
   const {id} = req.params

   try{
      const sale = await Sale.findByIdAndUpdate(id, {...req.body})
      res.status(200).json(sale)
   }catch(err){
      res.status(400).json({error: err.message})
   }

}


module.exports = { getMercuriale, getCommercializzazione, getSales, getDebit, getSale, createSale, updateSale, deleteSale, paySale}