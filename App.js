

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import  Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import {ToastContainer} from 'react-toastify'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import 'react-toastify/dist/ReactToastify.css'
import Category from './pages/Category'
import Createlistings from './pages/Createlistings'
import Listings from './pages/Listings'
import Contact from './pages/Contact'

function App() {  
  return (
    <>
    <Router>
    <Routes>
      <Route path='/' element={<Explore  />}/>
      <Route path='/offers' element={<Offers  />}></Route>
      <Route path='/category/:categoryName' element={<Category  />} />
      <Route path='/profile' element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>} />
      </Route>
      <Route path='/sign-in' element={<SignIn  />}/>
      <Route path='/sign-up' element={<Signup  />}/>
      <Route path='/forgot-password' element={<ForgotPassword  />}/>
      <Route path='/create-listing' element={<Createlistings />}/>
      <Route path='/category/:categoryName/:listingId' element={<Listings />}/>
     
      <Route path='/contact/:landlordId' element={<Contact />}/>
      


    </Routes>
    <Navbar/>




    </Router>
    <ToastContainer/>
     
    </>
  );
}

export default App;
