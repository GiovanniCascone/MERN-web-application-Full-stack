const express = require('express')
const { 
   loginUser, 
   signupUser, 
   getUser, 
   getUsers,
   getUsersBox,
   updateUser, 
   deleteUser, 
   updatePasswordUser} 
   = require('../controllers/userController')
const requireAuthAdmin = require('../middleware/requireAuthAdmin')


// ROUTER
const userRouter = express.Router()

// ROUTES
userRouter.post('/login', loginUser)
userRouter.get('/', getUsers)
userRouter.get('/box', getUsersBox)
userRouter.get('/:num', getUser)

//REQUEST AUTH ADMIN_____________
userRouter.use(requireAuthAdmin)
//_______________________________

// PROTECTED ROUTES 
userRouter.post('/', signupUser)
userRouter.patch('/:_id', updateUser)
userRouter.patch('/password/:_id', updatePasswordUser)
userRouter.delete('/:_id', deleteUser)



module.exports = userRouter