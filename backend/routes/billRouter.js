const express = require('express')
const {
   getBills,
   getBill,
   createBill,
   updateBill,
   deleteBill,
   payBill,
   getProduzione
} = require('../controllers/billController')
const requireAuth = require('../middleware/requireAuth')

const billRouter = express.Router()


/*Percorsi accessibili solo per utenti Autenticati */

/*MIDDLEWARE DI CONTROLLO AUTH - Restituisce l'ID utente(req.box_id) o un errore______*/
billRouter.use(requireAuth)
//__________________________________________________________

billRouter.get('/', getBills)
billRouter.get('/produzione', getProduzione)
billRouter.get('/:id', getBill)
billRouter.post('/', createBill)
billRouter.patch('/:id', updateBill)
billRouter.patch('/payBill/:id', payBill)
billRouter.delete('/:id', deleteBill)



//___________________________________________________________

module.exports = billRouter