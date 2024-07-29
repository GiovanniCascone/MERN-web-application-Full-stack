const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {
   getProducers,
   createProducer,
   updateProducer,
   deleteProducer
} = require('../controllers/producerController')

const producerRouter = express.Router()

// RICHIESTA AUTH BOX
producerRouter.use(requireAuth)

producerRouter.get('/', getProducers)
producerRouter.post('/', createProducer)
producerRouter.patch('/:id', updateProducer)
producerRouter.delete('/:id', deleteProducer)


module.exports = producerRouter
