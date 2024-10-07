import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Spinner } from "../../assets/images/Spinner.svg";
import { useUser } from "../../context/UserContex";
import { twofaicon } from "../../assets/images";
import { SignInFormModal } from "./Signinmodal";

// OTP Component
const TwoFactor = () => {
  const { onLogin } = useUser();
  const navigate = useNavigate();
  const [isNouser, setIsNouser] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle OTP digit change
  const handleOtpChange = (element, index) => {
    const value = element.value;

    // Allow only numbers and move to next input automatically
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to next input
      if (index < 5) {
        const nextElement = document.getElementById(`otp-${index + 1}`);
        if (nextElement) nextElement.focus();
      }
    } else if (value === "") {
      // Backspace handling
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move to previous input on backspace
      if (index > 0) {
        const prevElement = document.getElementById(`otp-${index - 1}`);
        if (prevElement) prevElement.focus();
      }
    }
  };

  // Function to handle OTP verification
  const handleOtpVerification = async () => {
    setLoading(true);
    const otpCode = otp.join(""); // Combine all digits
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/auth/verify-otp`,
        { otp: otpCode },
      );
      setLoading(false);
      Cookies.set("token", result.data.token);

      console.log("user", result.data.data.user);

      onLogin({
        ...result.data.data.user,
        token: result.data.token,
      });

      if (result.data.data.user.role === "customer") {
        navigate("/", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container flex flex-col items-center">
      <h1 className="mb-2 text-lg font-semibold">Enter code</h1>
      <p className="mb-4 text-sm text-gray-600">We sent a code to your email</p>

      {/* OTP Inputs */}
      <div className="otp-inputs mb-4 flex items-center justify-center gap-1 md:gap-2">
        <img src={twofaicon} className="h-14 w-14 md:h-20 md:w-20" />
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleOtpChange(e.target, index)}
            className="w-10 rounded border border-gray-300 bg-[#669e68] bg-opacity-50 text-center text-2xl font-semibold text-white focus:border-green-500 focus:outline-none md:h-16 md:w-16"
          />
        ))}

        <img src={twofaicon} className="h-14 w-14 md:h-20 md:w-20" />
      </div>

      <SignInFormModal isNouser={isNouser} setIsNouser={setIsNouser} />

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Verify OTP Button */}
      <button
        type="button"
        onClick={handleOtpVerification}
        disabled={loading}
        className={`${
          loading ? "bg-green-300" : "bg-primary hover:bg-green-700"
        } w-full rounded-full py-2 text-base font-medium text-white duration-300 md:w-1/2`}
      >
        {loading ? (
          <>
            <Spinner className="mr-3 inline-block" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      {/* Resend Link */}
      <p className="mt-4 text-sm">
        Didn't get a code?{" "}
        <Link className="text-green-500" to="/signin">
          Click to resend
        </Link>
      </p>
    </div>
  );
};

export default TwoFactor;
