const express = require('express')
const {getProducts, createProduct, deleteProduct} = require('../controllers/productController')
const requireAuthAdmin = require('../middleware/requireAuthAdmin')
 
const productRouter = express.Router()


//Al momento non necessaria autenticazione
 
productRouter.get('/', getProducts)

//Necessaria Autenticazione Admin
productRouter.use(requireAuthAdmin)

productRouter.post('/', createProduct)
productRouter.delete('/:nome', deleteProduct)


module.exports = productRouter