const Buyer = require('../models/buyerModel')

//Recupero tutti i clienti
const getBuyers = async(req, res) => {
   const buyers = await Buyer.find().sort({nome: 1})
   if(!buyers || buyers==''){
      return res.status(400).json({error: 'Errore durante il recupero di tutti i clienti'})
   }
   res.status(200).json(buyers)
}

//GET ONE BUYER 
const getBuyer = async(req, res) => {
   const {nome} = req.params
   
   const buyer = await Buyer.findOne({nome})
   if(!buyer){
      return res.status(400).json({error: 'Errore durante la ricerca del cliente: Cliente non trovato.'})
   }
   res.status(200).json(buyer)
}


//CREATE BUYER
const createBuyer = async(req, res) => {
   const {nome, limite} = req.body
   try{
      // Elaboro il nome
      const name = nome.toUpperCase()
      const buyer = await Buyer.create({nome: name, limite})
      res.status(200).json(buyer)
   }catch(err){
      res.status(400).json({error: err.message})
   }
}

//UPDATE BUYER
const updateBuyer = async(req, res) => {
   const {nome} = req.params
   const {limite} = req.body
   const buyer = await Buyer.findOneAndUpdate({nome}, {limite})
   if(!buyer){
      return res.status(400).json({error: 'Aggiornamento Buyer Fallito'})
   }
   res.status(200).json(buyer)
}

//DELETE BUYER
const deleteBuyer = async(req, res) => {
   const {nome} = req.params
   const buyer = await Buyer.findOneAndDelete({nome})
   if(!buyer){
      return res.status(400).json({error: 'Eliminazione Buyer Fallita'})
   }
   res.status(200).json(buyer)
}

module.exports = {getBuyers, getBuyer, createBuyer, updateBuyer, deleteBuyer}