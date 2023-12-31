import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { resetCart } from "../../../redux/productsSlice";
import { emptyCart } from "../../../assets/images/index";
import ItemCard from "./ItemCard";
import axios from "axios";
import { reset_userCart, updateUserCart } from "../../../redux/userSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.userReducer.userInfo)
  const userCart = userInfo.cart
  const productsCart = useSelector((state) => state.productsReducer.products)
  const [cartItems, setCartItems] = useState(() => { 
    if (userInfo && Object.keys(userInfo.profile).length > 0) {
      return userCart;
    } else { 
      return productsCart
    }
  });
  const [totalAmounts, setTotalAmounts] = useState({subTotal: 0, totalDeliveryFee: 0, overallTotal: 0});

  const deleteAllCart = () => { 
    if (userInfo && Object.keys(userInfo.profile).length > 0) {
      axios({
        url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/cart/deleteall`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("userToken")}`
        }
      }).then((data) => {
        if (data.status === 200) {
          dispatch(reset_userCart())
        }
      })
    } else { 
      dispatch(resetCart())
    }
    
  }

  useEffect(() => {
    if (userInfo && Object.keys(userInfo.profile).length > 0) {
      axios({
        url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/cartitems`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`
        }
      }).then((data) => {
        dispatch(updateUserCart(data.data.map(item => { 
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
            quantityParameter: item.quantityParameter
          }
        }))) 
      }).catch((error) => { 
        console.log(error);
      })
    }
  }, [])

  useEffect(() => {
    
    if (userInfo && Object.keys(userInfo.profile).length > 0) {
      setCartItems(userCart)
    } else { 
      setCartItems(productsCart)
    }
  }, [userCart, productsCart, userInfo]);

  useEffect(() => {
    let subTotal = 0
    let totalDeliveryFee = 0
    let overallTotal = 0
    cartItems.forEach((item) => {
      subTotal += (item.price * item.quantity)
      totalDeliveryFee += item.deliveryFee
      overallTotal += item.productTotalCost
    });

    setTotalAmounts({ subTotal ,totalDeliveryFee ,overallTotal, })
  }, [cartItems])

  return (
    <div className="max-w-container mx-auto px-4 lg:py-32">
      {cartItems && cartItems.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] rounded-lg text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Product Cost</h2>
          </div>
          <div className="mt-5">
            {cartItems.map((item) => (
              <div key={item._id}>
                <ItemCard
                  itemInfo={item}
                  userInfo={userInfo}
                  totalAmounts={totalAmounts}
                  setTotalAmounts={setTotalAmounts}
                  userCart={userCart}
                />
              </div>
            ))}
          </div>

          <button
            onClick={deleteAllCart}
            className="py-2 px-10 rounded-lg bg-red-500 text-white font-semibold mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    ${totalAmounts.subTotal}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Total delivery fee
                  <span className="font-semibold tracking-wide font-titleFont">
                    ${totalAmounts.totalDeliveryFee}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    ${totalAmounts.overallTotal}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/paymentgateway">
                  <button className="w-52 h-10 rounded-lg bg-[#1D6F2B] text-white hover:bg-black duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
