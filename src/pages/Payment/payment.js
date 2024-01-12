import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";

const PaymentDone = () => {
  const [activate, setActivate] = useState("");
  // const queryParams = new URLSearchParams(useLocation().search);
  // const token = queryParams.get("token");

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // const activateAccount = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.REACT_APP_BACKEND_SERVER_URL}/auth/activate-account/${token}`,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     if (response.status === 200) {
    //       setActivate(response.data.message);
    //       setTimeout(() => {
    //         // navigate("/signin");
    //       }, 3000);
    //     }
    //   } catch (error) {
    //     if (error.response && error.response.status === 400) {
    //       setActivate(error.response.data.message);
    //       setTimeout(() => {
    //         // navigate("/signin");
    //       }, 3000);
    //     } else {
    //       setActivate("Error during activation. Please try again.");
    //       setTimeout(() => {
    //         // navigate("/signin");
    //       }, 3000);
    //     }
    //   }
    // };
    // if (token) {
    //   activateAccount();
    // }
  }, [token]);

  return (
    <>
      <div className=" w-full  h-screen flex flex-col-reverse items-center pt-7 justify-center ">
        {/* <div className=" text-[#1D6F2B] font-titleFont text-4xl">
          {activate}
        </div> */}
        <div className=" text-[#1D6F2B] font-titleFont text-4xl mt-0">
          <h1>Payment successfully</h1>
        </div>
        <FiCheckCircle size={70} />
      </div>
    </>
  );
};

export default PaymentDone;
