const Product = require('../models/productModel')



const getProducts = async(req, res) => {
   const products = await Product.find().sort({nome: 1})
   if(!products){
      return res.status(400).json({error: 'Errore recupero prodotti'})
   }
   res.status(200).json(products)
}

//CREATE PRODUCT
const createProduct = async(req, res) => {
   const {nome} = req.body
   console.log(req.body)
   // Elaboro il nome prodotto
   const name = nome.toUpperCase()

   const matchProduct = await Product.findOne({nome: name})

   if(matchProduct){
      return res.status(400).json({error: 'Prodotto già esistente'})
   }

   try{
      const product = await Product.create({nome: name})
      res.status(200).json(product)
   }catch(error){
      res.status(400).json({error: error.message})
   }
}


const deleteProduct = async(req, res) => {
   const {nome} = req.params
   const product = await Product.findOneAndDelete({nome})
   if(!product){
      return res.status(400).json({error: 'Errore eliminazione prodotto'})
   }
   res.status(200).json(product)
}

module.exports = {getProducts, createProduct, deleteProduct}