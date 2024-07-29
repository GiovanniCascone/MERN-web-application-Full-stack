const mongoose = require('mongoose')

const Schema = mongoose.Schema
//!!! Fare in modo che la chiave sia composta da nome-box_id (unique)
const StoreSchema = new Schema({
   prodotto: {
      type: String,
      required: true,
   },
   peso: {
      type: Number,
      required: true
   },
   box_id: {
      type: String,
      required: true
   }
}, {timestamps: true})

module.exports = mongoose.model('Store', StoreSchema)