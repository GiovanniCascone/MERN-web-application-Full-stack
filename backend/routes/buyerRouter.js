const express = require('express')
const requireAuthAdmin = require('../middleware/requireAuthAdmin')
const {getBuyer, createBuyer, getBuyers, updateBuyer, deleteBuyer} = require('../controllers/buyerController')

const buyerRouter = express.Router()


buyerRouter.get('/', getBuyers)
buyerRouter.get('/:nome', getBuyer)

//Auth Admin
buyerRouter.use(requireAuthAdmin)

buyerRouter.post('/', createBuyer)
buyerRouter.patch('/:nome', updateBuyer)
buyerRouter.delete('/:nome', deleteBuyer)


module.exports = buyerRouter