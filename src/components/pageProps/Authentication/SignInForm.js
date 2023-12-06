import React, { useState, useEffect } from "react";
import googelIcon from "../../../assets/images/google-icon.jpg"
import axios from "axios";
import { logIn } from "../../../redux/userSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { ReactComponent as Spinner } from "../../../assets/images/Spinner.svg"
import  AlertComponent  from "../../../components/designLayouts/AlertComponent.js";


const SignInForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ status: false, message: "" });
  const [signInError, setSignInError] = useState("");
  const Dispatch = useDispatch();
  
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
    setSignInError("")
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
    setSignInError("")
  };
  
  const handleSignIn = () => {
      if (!email) {
        setErrEmail("Enter your email");
        return
      } else if (!EmailValidation(email)) {
          setErrEmail("Enter a Valid email");
          return
      } else if (!password) {
        setErrPassword("Enter your password");
        return
      } else if (password.length < 6) {
          setErrPassword("Passwords must be at least 6 characters");
          return
      } else { 
        setLoading(true)
        let userData = {
          email: email,
          password: password
        };

        axios({
          url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/user/login`,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: userData,
        }).then((result) => {        
          if (result.status === 200) {
            setEmail("");
            setPassword("");
            setLoading(false)
            sessionStorage.setItem("userToken", result.data.token)
            Dispatch(logIn({
              profile: result.data.user,
              logInType: "ByEmail",
            }))
            navigate("/accounts/", { replace: true })
          } 
        }).catch(err => {
          const error = { 
            statusCode: err.response.status,
            message: err.response.data.message,
          }

          if (error.statusCode === 422 ||
            error.statusCode === 409 ||
            error.statusCode === 401) {
            setSignInError(error.message)
          } else { 
            setSignInError("Unable to sign you in! Try again later.")
          }
          setLoading(false)
          console.log(error);
        })
      }
  };

  const handleGoogleSignIn = (e) => { 
    e.preventDefault();
    return window.open(
      `${process.env.REACT_APP_BACKEND_SERVER_URL}/auth/google`,
      "_self"
    )
  }

  useEffect(() => {
    if (signInError !== "") {
      setErrorAlert({ status: true, message: signInError })
    } else { 
      setErrorAlert({ status: false, message: "" })
    }
  }, [signInError])

  return (
          <form className="w-full lgl:w-[450px] h-auto flex flex-col gap-4 items-center" onKeyDown={(e) => {
            if (e.key === "Enter") return handleSignIn()
          }}>
            <div className="px-6 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin">
            {errorAlert.status && (
              <AlertComponent
                color="failure"
                type="Error!"
                message={errorAlert.message} />
              )}
              <h1 className="font-titleFont decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Sign in
              </h1>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium 
                    placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="john@example.com"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium 
                    placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Enter your password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                <button
                type="button"
                onClick={handleSignIn}
                className={loading ? "bg-[#81b48a] text-gray-200 hover:text-white w-full text-base font-medium h-10 rounded-md duration-300 disabled" : 
                  "bg-[#1D6F2B] hover:bg-[#437a4c] text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"}
                >
                {loading ?
                  <>
                    <Spinner className="inline-block mr-3" />
                    Signing you In
                  </>
                  : "Sign In"}
                
                </button>
                <p className="text-sm text-center font-titleFont font-medium -mt-2">
                  Don't have an Account?{" "}
                    <span 
                        className="text-[#1E61CC] duration-300 cursor-pointer"
                        onClick={() => props.setOpenForm({signin: false, signup: true})}
                    >
                      Sign up
                    </span>
                </p>
                <div className="ml-[5%] text-center">
                  <hr className="inline-block w-[30%] align-middle"></hr>
                  <span className="inline-block mx-4">or</span>
                  <hr className="inline-block w-[30%] align-middle"></hr>
                </div>  
                <button
                  className="bg-[#fff] text-[#202124] border-2 border-gray-400 cursor-pointer w-full text-base 
                  font-medium h-10 rounded-md flex items-center justify-center gap-2 duration-300"
                  onClick={ handleGoogleSignIn}
                >
                  <img src={googelIcon} className="w-[20px]" /> Sign in with Google
                </button>
               
              </div>
            </div>
          </form>
  );
};

export default SignInForm;