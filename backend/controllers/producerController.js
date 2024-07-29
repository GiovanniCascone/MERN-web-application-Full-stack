const Producer = require('../models/producerModel')
const validator = require('validator')

// RECUPERA TUTTI I PRODUTTORI DI UNO SPECIFICO BOX
const getProducers = async(req, res) => {
   const box_id = req.box._id
   
   const producer = await Producer.find({box_id}).sort({nome: 1})
   if(!producer){
      return res.status(400).json({error: 'Errore durante il recupero dei Produttori'})
   }
   
   res.status(200).json(producer)
}



// CREA PRODUTTORE
const createProducer = async(req, res) => {
   const box_id = req.box._id
   const {nome, cod_fiscale, telefono, iban} = req.body

   // CONTROLLO CAMPI
   if(iban && !validator.isIBAN(iban)){
      return res.status(400).json({error: 'IBAN NON VALIDO'})
   }
   if(!validator.isTaxID(cod_fiscale, 'it-IT')){
      return res.status(400).json({error: 'CODICE FISCALE NON VALIDO'})
   }
   if(!validator.isMobilePhone(telefono, 'it-IT')){
      return res.status(400).json({error: 'NUMERO DI TELEFONO NON VALIDO'})
   }

   try{
      const producer = await Producer.create({nome, cod_fiscale, telefono, iban, box_id})
      res.status(200).json(producer)
   }catch(err){
      res.status(400).json({error: "Errore creazione Produttore. Controlla che non sia già registrato " +err.message})
   }
}



// UPDATE PRODUCER
const updateProducer = async(req, res) => {
   const box_id = req.box._id
   const {id} = req.params
   const {nome, cod_fiscale, telefono, iban} = req.body

   // CONTROLLO CAMPI
   if(iban && !validator.isIBAN(iban)){
      return res.status(400).json({error: 'IBAN NON VALIDO'})
   }
   if(!validator.isTaxID(cod_fiscale, 'it-IT')){
      return res.status(400).json({error: 'CODICE FISCALE NON VALIDO'})
   }
   if(!validator.isMobilePhone(telefono, 'it-IT')){
      return res.status(400).json({error: 'NUMERO DI TELEFONO NON VALIDO'})
   }

   try{
      const producer = await Producer.findByIdAndUpdate(id, {nome, cod_fiscale, telefono, iban, box_id})
      if(!producer){
         throw new Error('Produttore non presente')
      }
      res.status(200).json(producer)
   }catch(err){
      res.status(400).json({error: err.message})
   }
}



// DELETE ONE PRODUCER
const deleteProducer = async(req, res) => {
   const {id} = req.params
   const producer = await Producer.findByIdAndDelete(id)
   console.log(producer)
   if(!producer || producer==''){
      return res.status(400).json({error: 'Eliminazione Produttore Fallita: Produttore non trovato'})
   }
   res.status(200).json(producer)
}



module.exports = {getProducers, createProducer, updateProducer, deleteProducer}