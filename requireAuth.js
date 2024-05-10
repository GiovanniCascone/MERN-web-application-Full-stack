const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async(req, res, next) => {
   //Verifico Autorizzazione
   const { authorization } = req.headers
   if(!authorization){
      return res.status(401).json({error: 'Utente non autenticato: Token richiesto'})
   }
   
   const token = authorization.split(' ')[1]

   try{
      const {_id} = jwt.verify(token, process.env.SECRET)
      // Box.id a disposizione di tutte le chiamate successive al middleware
      req.box = await User.findById(_id).select('_id')
      next()
   }catch(err){
      res.status(401).json({error: 'Richiesta non autorizzata: token non valido o scaduto - Riesegui l\'accesso'})
   }
}


module.exports = requireAuth