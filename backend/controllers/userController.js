const User = require('../models/userModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')

//CREATE TOKEN FOR STANDARD USER
const createToken = (_id) => {
   return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

//CREATE TOKEN FOR ADMIN
const createTokenAdmin = (_id) => {
   return jwt.sign({_id}, process.env.SECRETADMIN, {expiresIn: '3d'})
}



//SIGNUP
const signupUser = async(req, res) => {
   try{
      const user = await User.signup({...req.body})
      res.status(200).json(user)
   }catch(err){
      res.status(400).json({error: err.message})
   }
}



//LOGIN
const loginUser = async(req, res) => {
   const {identificativo, nome_box, password, admin} = req.body
  
   try{
      const user = await User.login(identificativo, nome_box, password, admin)

      //Control or Admin or User => Different Token
      if(user.admin){
         const tokenAdmin = createTokenAdmin(user._id)
         console.log('Creazione Token Admin')
         res.status(200).json({identificativo, nome: user.intestatario, tokenAdmin})
      }else{
         const token = createToken(user._id)
         console.log('Creazione Token')
         res.status(200).json({identificativo, nome: user.nome_box, token})
      }

   }catch(err){
      res.status(400).json({error: err.message})
   }
}



//FETCH ALL USER ADMIN AND BOX
const getUsers = async(req, res) => {
   const boxes = await User.find({}).sort({admin: -1, identificativo: 1})
   if(!boxes || boxes.length === 0){
      return res.status(400).json({error: 'Utenti non definiti o non sono ancora stati registrati'})
   }
   res.status(200).json(boxes)
}



//FETCH ALL USER BOX
const getUsersBox = async(req, res) => {
   const boxes = await User.find({ admin: { $exists: false } }).sort({identificativo: 1})
   if(!boxes || boxes.length === 0){
      return res.status(400).json({error: 'Utenti non definiti o non sono ancora stati registrati'})
   }
   res.status(200).json(boxes)
}



//FETCH ONE USER WITH NUM BOX non so se la chiamo da qualche parte
const getUser = async(req, res) => {
   const {num} = req.params
   console.log('box num: ', num)
   const utente = await User.findOne({box: num})
   console.log('Box ', utente)
   if(!utente){
      return res.status(400).json({error: 'Utente Inesistente'})
   }
   res.status(200).json(utente)
}



//UPDATE USER--------------------------------------------------------------------------------------------
const updateUser = async(req, res) => {
   const {_id} = req.params

   if(!validator.isMobilePhone(req.body.telefono, 'it-IT')){
      return res.status(400).json({error: 'Numero di telefono non valido'})
   }

   const utente = await User.findByIdAndUpdate({_id}, {...req.body})
   
   if(!utente){
      return res.status(400).json({error: 'Aggiornamento Fallito'})
   }
   res.status(200).json(utente)
}



//UPDATE PASSWORD USER----------------------------------------------------------------------------------
const updatePasswordUser = async(req, res) => {
   const {_id} = req.params
   const {password, vecchiaPassword} = req.body
 
   try{
      const utente = await User.updatePassword(_id, password, vecchiaPassword)
      res.status(200).json(utente)
   }catch(err){
      return res.status(400).json({error: err.message})
   }
 
}



//DELETE USER---------------------------------------------------------------------------------------------------
const deleteUser = async(req, res) => {
   const {_id} = req.params

   const utente = await User.findByIdAndDelete({_id})
   if(!utente){
      return res.status(400).json({error: `Eliminazione Fallita | Utente: ${utente.identificativo}`})
   }
   res.status(200).json(utente)
}





module.exports = { loginUser, signupUser, getUser, getUsers, getUsersBox, updateUser, updatePasswordUser, deleteUser }