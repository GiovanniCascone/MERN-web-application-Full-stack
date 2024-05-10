// CONNECTION TO DB AND SERVER
require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
// ROUTER
const billRouter = require('./routes/billRouter')
const saleRouter = require('./routes/saleRouter')
const userRouter = require('./routes/userRouter')
const storeRouter = require('./routes/storeRouter')
const productRouter = require('./routes/productRouter')
const buyerRouter = require('./routes/buyerRouter')
const producerRouter = require('./routes/producerRouter')

const app = express()

//MIDDLEWARE______________________________________
app.use((req, res, next) => {
   console.log(req.path, req.method)
   next()
})

app.use(express.json())

//ROUTES__________________________________________
app.use('/api/user', userRouter)
app.use('/api/bill', billRouter)
app.use('/api/sale', saleRouter)
app.use('/api/store', storeRouter)
app.use('/api/product', productRouter)
app.use('/api/buyer', buyerRouter)
app.use('/api/producer', producerRouter)
//________________________________________________


//CONNECTION DB & SERVER
mongoose.connect(process.env.MONGO_URI)
   .then(() => {
      app.listen(process.env.PORT, () => {
         console.log('Connecting to DB & Listening on PORT: ', process.env.PORT)
      })
   })
   .catch((err) => {
      console.log('Errore di connessione al DB: ', err)
   })