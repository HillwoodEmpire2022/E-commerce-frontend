import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/Default/About/About';
import Contact from './pages/Default/Contact/Contact';
import Shop from './pages/Default/Shop/Shop';
import Home from './pages/Home';

import SignIn from './pages/SignIn';

import Protect from './components/Protect';
import Loader from './components/loader/Loader';
import { useUser } from './context/UserContex';
import {
  Category,
  Company,
  Contract,
  DashProducts,
  Dashboard,
  Orders,
  Retailer,
} from './dashboard/Components';
import SingleOrder from './dashboard/Components/Orders/Order/singleOrder';
import { LayoutDesign } from './dashboard/Layouts/LayoutDesign';
import SellerProfile from './pages/Account/Profile/SellerProfile';
import ActivateAccount from './pages/ActivateAccount';
import Cart from './pages/Cart';
import ForgotPassword from './pages/ForgotPassword';
import PageNotFound from './pages/PageNotFound';
import Product from './pages/ProductDetails/Product';
import VerifyPaymentPage from './pages/ProductDetails/VerifyPaymentPage';
import ResetPassword from './pages/ReserPassword';
import SignUp from './pages/SignUp';
import Users from './pages/Users';

// localStorage.removeItem("selectedKey");

const App = () => {
  const { isCheckingAuth, user } = useUser();

  return (
    <>
      {isCheckingAuth ? (
        <Loader />
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='signin' element={<SignIn />} />
          <Route path='signup' element={<SignUp />} />
          <Route
            path='cart'
            element={
              <Protect returnTo='cart'>
                <Cart />
              </Protect>
            }
          />
          <Route
            path='products/:id'
            element={<Product />}
          />
          <Route path='shop' element={<Shop />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route
            path='forgot-password'
            element={<ForgotPassword />}
          />
          <Route
            path='reset-password/:resetToken'
            element={<ResetPassword />}
          />
          <Route
            path='/activate-account/:token'
            element={<ActivateAccount />}
          />
          <Route
            path='/payment-verification'
            element={<VerifyPaymentPage />}
          />
          <Route
            path='user'
            element={
              <Protect>
                <LayoutDesign />
              </Protect>
            }
          >
            <Route
              index
              element={
                user?.role === 'admin'
                  ? (localStorage.setItem(
                      'selectedKey',
                      '0'
                    ),
                    (<Navigate replace to='dashboard' />))
                  : user?.role === 'seller'
                  ? (localStorage.setItem(
                      'selectedKey',
                      '5'
                    ),
                    (<Navigate replace to='dashproduct' />))
                  : user &&
                    (localStorage.setItem(
                      'selectedKey',
                      '5'
                    ),
                    (<Navigate replace to='profile' />))
              }
            />
            <Route
              path='dashboard'
              element={<Dashboard />}
            />
            <Route path='seller' element={<Company />} />
            <Route path='contract' element={<Contract />} />
            <Route
              path='dashproduct'
              element={<DashProducts />}
            />
            <Route path='retailer' element={<Retailer />} />
            <Route
              path='profile'
              element={<SellerProfile />}
            ></Route>
            <Route path='category' element={<Category />} />
            <Route path='users' element={<Users />} />
            <Route path='order' element={<Orders />} />
            <Route
              path='order/:id'
              element={<SingleOrder />}
            />
            <Route path='*' element={<PageNotFound />} />
          </Route>

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      )}
    </>
  );
};

export default App;
