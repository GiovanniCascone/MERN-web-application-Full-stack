const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProducerSchema = new Schema({
   nome: {
      type: String,
      requred: true
   },
   cod_fiscale: {
      type: String,
      required: true,
   },
   telefono: {
      type: String,
      required: true,
   },
   iban: {
      type: String
   },
   box_id: {
      type: String,
      required: true
   }
}, {timestamps: true})

ProducerSchema.index({cod_fiscale: 1, box_id: 1}, {unique: true})

module.exports = mongoose.model('Producer', ProducerSchema)