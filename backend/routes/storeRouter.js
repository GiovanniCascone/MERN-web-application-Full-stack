const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {
   getItemsStore,
   getItemStore
} = require('../controllers/storeController')


const storeRouter = express.Router()

// Middleware Autenticazione - Restituisce (req.box._id) o un errore
storeRouter.use(requireAuth)
// ________________________________________________

storeRouter.get('/', getItemsStore)
storeRouter.get('/:nome', getItemStore)

module.exports = storeRouter 