const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProductSchema = new Schema({
   nome: {
      type: String,
      required: true,
      unique: true
   }
}, {timestamps: true})

module.exports = mongoose.model('Product', ProductSchema)