const express = require('express')
const { 
   getMercuriale,
   getCommercializzazione,
   getSales,
   getDebit,
   getSale,
   createSale,
   updateSale,
   deleteSale,
   paySale
} = require('../controllers/saleController')
const requireAuth = require('../middleware/requireAuth')

const saleRouter = express.Router()

//Non necessaria l'autenticazione
saleRouter.get('/mercuriale', getMercuriale)

/*Richiesta Autenticazione */
saleRouter.use(requireAuth)
//______________________________________________

saleRouter.get('/', getSales)
saleRouter.get('/commercializzazione', getCommercializzazione)
saleRouter.get('/debit/:nome', getDebit)
saleRouter.get('/:id', getSale)
saleRouter.post('/', createSale)
saleRouter.patch('/:id', updateSale)
saleRouter.patch('/paySale/:id', paySale)
saleRouter.delete('/:id', deleteSale)

module.exports = saleRouter
