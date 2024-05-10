//Gestire Routing di tutti i componenti
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { useAuthAdminContext } from './hooksAdmin/useAuthAdminContext'

//Components & Pages
import NotFound from './NotFound'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Bill from './pages/Bill'
import Sale from './pages/Sale'
import Login from './pages/Login'
import Store from './pages/Store'
import Bills from './pages/Bills'
import Sales from './pages/Sales'
import Producer from './pages/Producer'
import BillUpdateDelete from './pages/BillUpdateDelete'
import SaleUpdateDelete from './pages/SaleUpdateDelete'
//Admin
import Product from './pagesAdmin/Product'
import User from './pagesAdmin/User'
import Buyer from './pagesAdmin/Buyer'
import Trend from './pages/Trend'



function App() {
  const {user} = useAuthContext()
  const {admin} = useAuthAdminContext()

 
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        {/*Da sistemare*/}
        <Route exact path='/login' element={!user && !admin ? <Login /> : <Navigate to='/' />} />
        {/*USER*/}
        <Route exact path='/bill' element={user ? <Bill /> : <NotFound />} />
        <Route exact path='/sale' element={user ? <Sale /> : <NotFound />} />
        <Route exact path='/store' element={user ? <Store /> : <NotFound />} />
        <Route exact path='/bills' element={user ? <Bills /> : <NotFound />} />
        <Route exact path='/sales' element={user ? <Sales /> : <NotFound />} />
        <Route exact path='/producer' element={user ? <Producer /> : <NotFound />} />
        <Route exact path='/trend' element={user ? <Trend /> : <NotFound />} />
        {/*Path non presenti in Navbar*/}
        <Route exact path='/billUpdateDelete/:id' element={user ? <BillUpdateDelete /> : <NotFound />} />
        <Route exact path='/saleUpdateDelete/:id' element={user ? <SaleUpdateDelete /> : <NotFound />} />


        {/*ADMIN*/}
        <Route exact path='/box' element={admin ? <User /> : <NotFound />} />
        <Route exact path='/product' element={admin ? <Product /> : <NotFound />} />
        <Route exact path='/buyer' element={admin ? <Buyer /> : <NotFound />} />

      </Routes>
    </Router>
  )
}

export default App
