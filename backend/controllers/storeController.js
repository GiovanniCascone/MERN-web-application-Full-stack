const Store = require('../models/storeModel')


// RECUPERO TUTTI I PRODOTTI DA UNO SPECIFICO MAGAZZINO
const getItemsStore = async(req, res) => {
   const box_id = req.box._id

   const store = await Store.find({box_id}).sort({nome: 1})
   if(!store){
      return res.status(400).json({error: 'Errore durante il recupero dei prodotti'})
   }
   res.status(200).json(store)
}

//GET specifico prodotto da specifico magazzino - non usata
const getItemStore = async(req, res) => {
   const box_id = req.box._id
   const nome = req.params
   
   const Store = await Store.find({nome, box_id})
   if(!Store){
      return res.status(400).json({error: 'Errore durante il recupero del prodotto'})
   }
   res.status(200).json(Store)
}


module.exports = {
   getItemsStore,
   getItemStore
}