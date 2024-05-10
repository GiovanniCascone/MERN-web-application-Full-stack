const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')


const Schema = mongoose.Schema

const UserSchema = new Schema({
   identificativo: {
      type: Number,
      required: true
   },
   nome_box: {
      type: String
   },
   intestatario: {
      type: String,
      required: true,
   },
   telefono: {
      type: String,
      unique: true,
   },
   password: {
      type: String,
      required: true
   },
   admin: {
      type: Boolean
   }
}, {timestamps: true})

//Chiave composta
UserSchema.index({ identificativo: 1, admin: 1, nome:1 }, {unique: true});


//SIGNUP
UserSchema.statics.signup = async function(data){
   console.log('Campi ', data)

   if(!validator.isMobilePhone(data.telefono, 'it-IT')){
      throw Error('Numero di telefono non valido')
   }

   if(!validator.isStrongPassword(data.password)){
      throw Error('Password debole')
   }

   const exist = await this.findOne({identificativo: data.identificativo, admin: data.admin})
   if(exist){
      throw Error('Box già esistente')
   }

   //Hashing
   const salt = await bcrypt.genSalt(10)
   const hash = await bcrypt.hash(data.password, salt)

   const user = await this.create({...data, password: hash})
   
   return user
}



//LOGIN
UserSchema.statics.login = async function(identificativo, nome_box, password, admin){
   let user = null
   if(!admin){
      user = await this.findOne({identificativo, nome_box})
   }else{
      user = await this.findOne({identificativo, admin})
   }

   if(!user){
      throw Error('Utente inesistente')
   }
   const match = await bcrypt.compare(password, user.password)
   if(!match){
      throw Error('Password non corretta')
   }

   return user
}



//UPDATE PASSWORD
UserSchema.statics.updatePassword = async function(_id, password, vecchiaPassword){
   
   const oldPassword = await this.findById(_id).select('password')
   console.log(oldPassword)
   const match = await bcrypt.compare(vecchiaPassword, oldPassword.password)
   console.log(match)
   if(!match){
      throw Error('La vecchia Password non coincide')
   }

   if(!validator.isStrongPassword(password)){
      throw Error('Password debole: La Password deve contenere almeno 8 caratteri e tra i quali devono essere presenti almento una lettera maiuscola, una minuscola, un numero e un carattere speciale(es. !$?')
   }
   //Hashing
   const salt = await bcrypt.genSalt(10)
   const hash = await bcrypt.hash(password, salt)

   const user = await this.findOneAndUpdate({_id}, {password: hash})
   if(!user){
      throw Error('Modifica Password Fallita')
   }

   return user
}


module.exports = mongoose.model('User', UserSchema)