const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BuyerSchema = new Schema({
   nome: {
      type: String,
      required: true,
      unique: true
   },
   limite: {
      type: Number,
      required: true
   }
}, {timestamps: true})


module.exports = mongoose.model('Buyer', BuyerSchema)