import Header from "../components/home/Header/Header";
import HeaderBottom from "../components/home/Header/HeaderBottom";
import Footer from "../components/home/Footer/Footer";
import FooterBottom from "../components/home/Footer/FooterBottom";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserCart } from "../redux/userSlice";
import Cookies from "js-cookie";

const UserLayout = (props) => {
  const [userprofile, setUserprofile] = useState();
  const [user, setUser] = useState();
  const storeUserInfo = useSelector((state) => state.userReducer.userInfo);
  const token = Cookies.get("token");
  const { profile, loadprofile, errprofile } = useSelector(
    (state) => state.userprofile
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (storeUserInfo && Object.keys(storeUserInfo.profile).length > 0) {
      axios({
        url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/cartitems`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
        },
      })
        .then((data) => {
          dispatch(
            dispatch(
              updateUserCart(
                data.data.map((item) => {
                  return {
                    _id: item._id,
                    selectedProductImage: item.selectedProductImage,
                    itemName: item.product.name,
                    selectedProductColor: item.selectedProductColor,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    productTotalCost: item.productTotalCost,
                    deliveryFee: item.deliveryFee,
                    availableUnits: item.availableUnits,
                    quantityParameter: item.quantityParameter,
                  };
                })
              )
            )
          );
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
  }, []);

  useEffect(() => {
    if (storeUserInfo) {
      setUser(storeUserInfo);
    }
  }, [storeUserInfo]);

  useEffect(() => {
    if (profile?.data?.user) {
      setUserprofile(profile?.data?.user);
    }
  }, [profile]);

  console.log("storeUserInfo homepage", userprofile, storeUserInfo);

  return (
    <div>
      {/* <Header userInfo={storeUserInfo} account={props.account} /> */}
      <Header userInfo={userprofile} />
      <HeaderBottom />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};

export default UserLayout;
