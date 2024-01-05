import { Routes, Route } from "react-router-dom";
import About from "./pages/Default/About/About";
import Cart from "./pages/Default/Cart/Cart";
import Contact from "./pages/Default/Contact/Contact";
import Home from "./pages/Default/Home/Home";
import Journal from "./pages/Default/Journal/Journal";
import Payment from "./pages/Default/payment/Payment";
import ProductDetails from "./pages/Default/ProductDetails/ProductDetails";
import Shop from "./pages/Default/Shop/Shop";
import UserLayout from "./Layouts/UserLayout";
import IndexLayout from "./Layouts/IndexLayout";
import UserHome from "./pages/Account/Home/UserHome";
import Authentication from "./pages/Authentication";
import Loader from "./components/loader/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { logIn } from "./redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import cookiejar from "axios-cookiejar-support";
import Cookies from "js-cookie";
import ActivateAccount from "./pages/ActivateAccount";
import SellerProfile from "./pages/Account/Profile/SellerProfile";
import ProfileLayout from "./Layouts/ProfileLayout";
import { GetMyprofile } from "./APIs/UserAPIs";
import { FeliTechLogo_transparent, FeliTechWhiteLogo } from "./assets/images";

const App = () => {
  const [user, setUser] = useState();
  const token = Cookies.get("token");
  const { profile, loadprofile, errprofile } = useSelector(
    (state) => state.userprofile
  );

  // axios.interceptors.request.use((config) => {
  //   config.withCredentials = true;
  //   config.jar = cookiejar.jar();
  //   return config;
  // });
  axios.interceptors.request.use((config) => {
    config.withCredentials = true;
    return config;
  });
  // axios.defaults.withCredentials = true;

  const Dispatch = useDispatch();
  const dispatch = useDispatch();
  const storeUserInfo = useSelector(
    (state) => state.userReducer.userInfo.profile
  );

  const checkForGoogleUserInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URL}/auth/google/success`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      sessionStorage.setItem("token", response.data.token);

      Dispatch(logIn({ profile: response.data.user, logInType: "ByGoogle" }));
    } catch (error) {
      console.log({ error: error });
    }
  };
  useEffect(() => {
    checkForGoogleUserInfo();
  }, []);

  useEffect(() => {
    if (loadprofile == true) {
      dispatch(GetMyprofile(token))
        .unwrap()
        .then((data) => {
          if (data?.data && data.status == "success") {
            setUser(data?.data?.user);
          }
        })
        .catch((error) => {});
    }
  }, [loadprofile, dispatch, token]);

  // Fetch user only when the component mounts
  useEffect(() => {
    if (!user) {
      dispatch(GetMyprofile(token))
        .unwrap()
        .then((data) => {
          if (data?.data && data.status == "success") {
            setUser(data?.data?.user);
          }
        })
        .catch((error) => {});
    }
  }, [dispatch, user, token]);

  return (
    <>
      {/* <Loader /> */}
      {loadprofile ? (
        <div className="flex items-center justify-center h-screen">
          <img className="w-28 mb-6" src={FeliTechWhiteLogo} alt="logoLight" />
        </div>
      ) : (
        <Routes>
          {user ? (
            <Route path="/accounts/" element={<UserLayout />}>
              <Route path="" element={<UserHome />}></Route>
              <Route path="shop" element={<Shop />}></Route>
              <Route path="about" element={<About />}></Route>
              <Route path="contact" element={<Contact />}></Route>
              <Route path="journal" element={<Journal />}></Route>
              {/* ==================== Header Navlink End here ===================== */}
              {/* <Route path="offer" element={<Offer />}></Route> */}
              <Route path="product" element={<ProductDetails />}></Route>
              <Route path="cart" element={<Cart />}></Route>
              <Route path="paymentgateway" element={<Payment />}></Route>
              {/* <Route path="profile" element={<SellerProfile />}></Route> */}
              <Route path="myAccount" element={<ProfileLayout />}>
                <Route path="profile" element={<SellerProfile />}></Route>
              </Route>
            </Route>
          ) : (
            <>
              <Route path="/" element={<IndexLayout />}>
                {/* ==================== Header Navlink Start here =================== */}
                <Route index element={<Home />}></Route>

                <Route path="shop" element={<Shop />}></Route>
                <Route path="about" element={<About />}></Route>
                <Route path="contact" element={<Contact />}></Route>
                <Route path="journal" element={<Journal />}></Route>

                {/* <Route
                path="shop"
                element={() => {
                  if (false) return Navigate("/login");

                  return <ShopComponen />;
                }}
              ></Route> */}

                {/* ==================== Header Navlink End here ===================== */}
                {/* <Route path="offer" element={<Offer />}></Route> */}
                <Route path="product" element={<ProductDetails />}></Route>
                <Route path="cart" element={<Cart />}></Route>
                <Route path="paymentgateway" element={<Payment />}></Route>
              </Route>
            </>
          )}
          <Route
            path="/user/verify-account/:token"
            element={<ActivateAccount />}
          ></Route>
          <Route
            path="signup"
            element={
              <Authentication openForm={{ signin: false, signup: true }} />
            }
          ></Route>
          <Route
            path="signin"
            element={
              <Authentication openForm={{ signin: true, signup: false }} />
            }
          ></Route>
        </Routes>
      )}
    </>
  );
};

export default App;
