const Bill = require('../models/billModel')
const Store = require('../models/storeModel')
const mongoose = require('mongoose')


/*Ho a disposizione l'user id per query reperire i dati specifici dell'utente */

//PRODUZIONE MENSILE______________________________________________________________________________________________
const getProduzione = async(req, res) => {
   const currentYear = new Date().getFullYear();
   
   const produzione = await Bill.aggregate([
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
          quantity: "$peso_netto"
        }
      },
      {
        $group: {
          _id: { month: "$month", product: "$product" }, // Raggruppa per mese e prodotto
          totalQuantity: { $sum: "$quantity" } // Calcola la somma della quantità per ogni gruppo
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



/*Necessaria Autenticazione */

// RECUPERO TUTTE LE BILL DI UNO SPECIFICO MAGAZZINO______________________________________________________________
const getBills = async(req, res) => {
   const box_id = req.box._id

   const bills = await Bill.find({box_id}).sort({createdAt: -1})
   if(!bills){
      return res.status(400).json({error: 'Bill not found'})
   }
   res.status(200).json(bills)
}


// GET ONE BILL
const getBill = async(req, res) => {
   const {id} = req.params

   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: 'Formato ID non valido'})
   }
   const bill = await Bill.findById(id)
   if(!bill){
      return res.status(400).json({error: 'Bill not found'})
   }
   res.status(200).json(bill)
}


// CREA BOLLETTA E AGGIORNA MAGAZZINO_________________________________________________________________________________
const createBill = async(req, res) => {
   const {prodotto, peso_netto, prezzo_kg} = req.body
   const box_id = req.box._id

   //Calcolo campi a run time
   const prezzo_tot = Number(peso_netto) * Number(prezzo_kg)

   const eseguiTransazione = async() => {
      const session = await mongoose.startSession()
      try{
         if(!session.inTransaction()){
            await session.startTransaction()
         }
         //Inserimento prodotto in Magazzino
         const product = await Store.findOne({prodotto, box_id}).session(session)
      
         if(!product){
            const nuovoProdotto = await Store.create([{prodotto, peso: peso_netto, box_id}], {session: session})
            if(!nuovoProdotto){
               throw new Error('Errore creazione Prodotto')
            }
         }else{
            const nuovoPeso = (product.peso) + Number(peso_netto)
            const update = await Store.findByIdAndUpdate({_id: product._id}, {peso: nuovoPeso}).session(session)
            if(!update){
               throw new Error('Errore Update')
            }
         }
        
         const bill = await Bill.create([{...req.body, prezzo_tot, box_id}], {session: session})
         if(!bill){
            return res.status(400).json({error: 'Errore Creazione Bolletta'})
         }
         await session.commitTransaction()
         res.status(200).json(...bill)
      }catch(err){
         await session.abortTransaction()
         res.status(400).json({error: err.message})
      }finally{
         await session.endSession()
      }
   }

   eseguiTransazione()
}



// UPDATE ONE BILL_______________________________________________________________________________________________
const updateBill = async(req, res) => {
   const {id} = req.params
   const box_id = req.box._id

   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: 'ID non valido'})
   }
   
   const eseguiTransazione = async() => {
      const session = await mongoose.startSession()

      try{
         if(!session.inTransaction()){
            await session.startTransaction()
         }

         const update = await Bill.findByIdAndUpdate(id, {...req.body}).session(session)
         if(!update){
            throw new Error('Error update Bolletta')
         }
         //AGGIORNAMENTO MAGAZZINO
         const productBefore = await Store.findOne({prodotto: update.prodotto, box_id}).session(session)
         if(!productBefore){
            throw new Error('Prodotto non esistente in magazzino')
         }


         const setPeso = (productBefore.peso - update.peso_netto)

         if(setPeso === 0){
            const deleteProduct = await Store.findByIdAndDelete({_id: productBefore._id}).session(session)
            if(!deleteProduct){
               throw new Error('Error eliminazione prodotto in magazzino')
            }
         }else{
            const prodottoSettato = await Store.findByIdAndUpdate({_id: productBefore._id}, {peso: setPeso}).session(session)
            console.log(prodottoSettato)
            if(!prodottoSettato){
               throw new Error('Error reset peso')
            }
         }


         const productDaAggiornare = await Store.findOne({prodotto: req.body.prodotto, box_id}).session(session)

         if(!productDaAggiornare){
            const nuovoProdotto = await Store.create([{prodotto: req.body.prodotto, peso: req.body.peso_netto, box_id}], {session: session})
            if(!nuovoProdotto){
               throw new Error('Errore creazione nuovo prodotto in magazzino')
            } 
         }else{
            const nuovoPeso = productDaAggiornare.peso + Number(req.body.peso_netto)
            const aggiornaPeso = await Store.findOneAndUpdate({prodotto: req.body.prodotto, box_id}, {peso: nuovoPeso}).session(session)
            if(!aggiornaPeso){
               throw new Error('Error aggiornamento peso')
            }
         }
         //FINE AGGIORNAMENTO
         await session.commitTransaction()
         res.status(200).json(update)
      }catch(error){
         await session.abortTransaction()
         return res.status(400).json({error: error.message})
      }finally{
         await session.endSession()
      }

   }

   eseguiTransazione()
}



// DELETE ONE BILL____________________________________________________________________________________________
const deleteBill = async(req, res) => {
   const {id} = req.params
   const box_id = req.box._id
   if(!mongoose.Types.ObjectId.isValid){
      return res.status(400).json({error: 'ID non valido'})
   }

   const eseguiTransazione = async() => {
      const session = await mongoose.startSession()

      try{
         if(!session.inTransaction()){
            await session.startTransaction()
         }

         const bill = await Bill.findByIdAndDelete(id).session(session)
         if(!bill){
            throw new Error('Bill not found')
         }

         //AGGIORNAMENTO MAGAZZINO
         const product = await Store.findOne({prodotto: bill.prodotto, box_id}).session(session)
         if(!product){
            throw new Error('Prodotto non presente in magazzino')
         }

         const nuovoPeso = product.peso - bill.peso_netto
         if(nuovoPeso <= 0){
            const deleteProduct = await Store.findByIdAndDelete({_id: product._id}).session(session)
            if(!deleteProduct){
               throw new Error('Error eliminazione prodotto in magazzino')
            }
         }else{
            const aggiornaPeso = await Store.findOneAndUpdate({_id: product._id}, {peso: nuovoPeso}).session(session)
            if(!aggiornaPeso){
               throw new Error('Error aggiornamento peso magazzino')
            }
         }
         //FINE AGGIORNAMENTO
         await session.commitTransaction()
         res.status(200).json(bill)
      }catch(error){
         await session.abortTransaction()
         res.status(400).json({error: error.message})
      }finally{
         await session.endSession()
      }
   }

   eseguiTransazione()
}


//PAGA BILL_______________________________________________________________________________________________
const payBill = async(req, res) => {
   const {id} = req.params
   console.log(req.body)
   try{
      const bill = await Bill.findByIdAndUpdate(id, {...req.body})
      res.status(200).json(bill)
   }catch(err){
      res.status(400).json({error: err.message})
   }

}


module.exports = { getProduzione, getBills, getBill, createBill, updateBill, deleteBill, payBill }