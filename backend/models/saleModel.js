const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SaleSchema = new Schema({
   cliente: {
      type: String,
      required: true
   },
   prodotto: {
      type: String,
      required: true
   },
   peso_lordo: {
      type: Number,
      required: true
   },
   peso_netto: {
      type: Number,
      required: true
   },
   prezzo_kg: {
      type: Number,
      required: true
   },
   bancale: {
      type: Number,
      required: true
   },
   n_bancale: {
      type: Number,
      required: true
   },
   decorazione: {
      type: Number
   },
   prezzo_tot: {
      type: Number,
      required: true
   },
   box_id: {
      type: String,
      required: true
   },
   pagata: {
      type: Boolean,
      default: false,
      required: true
   }
}, {timestamps: true})


module.exports = mongoose.model('Sale', SaleSchema)