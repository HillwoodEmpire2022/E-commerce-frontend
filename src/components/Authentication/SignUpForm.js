import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ReactComponent as Spinner } from "../../assets/images/Spinner.svg";

import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AlertComponent from "../designLayouts/AlertComponent";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

const SignUpForm = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [checked, setChecked] = useState(false);

  const [errFirstName, setErrFirstName] = useState("");
  const [errLastName, setErrLastName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errType, setErrType] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ status: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({
    status: false,
    message: "",
  });
  const [signInError, setSignInError] = useState("");
  const [signinSuccess, setSigninSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const roleSelectRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
    setErrFirstName("");
    setSignInError("");
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
    setErrLastName("");
    setSignInError("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
    setSignInError("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
    setSignInError("");
  };

  const handleconfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setErrPassword("");
    setSignInError("");
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (checked) {
      if (!firstName) {
        setErrFirstName("Enter your first name");
        return;
      }
      if (!lastName) {
        setErrLastName("Enter your last name");
        return;
      }
      if (!email) {
        setErrEmail("Enter your email");
        return;
      } else {
        if (!EmailValidation(email)) {
          setErrEmail("Enter a Valid email");
          return;
        }
      }
      if (!password) {
        setErrPassword("Create a password");
        return;
      } else {
        if (password.length < 8) {
          setErrPassword("Passwords must be at least 8 characters");
          return;
        }
      }

      if (confirmPassword != password) {
        setErrPassword("Passwords not match");
      }

      const selectedRole = roleSelectRef.current.value;

      if (selectedRole == "") {
        setErrType("Account Type not selected");
      }

      setLoading(true);

      let userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: selectedRole,
        confirmPassword: confirmPassword,
      };

      axios({
        url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/auth/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: userData,
      })
        .then((result) => {
          if (result.status === 201 || result.data.status === "success") {
            setSignInError("");
            setErrType("");
            const success = {
              statusCode: result.status,
              message: result.data.data,
            };
            setSigninSuccess(success.message);
          }

          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);

          setSigninSuccess("");
          if (err.message) {
            setSignInError(err.message);
          }

          if (err.response) {
            if (
              err.response.status === 422 ||
              err.response.status === 409 ||
              err.response.status === 401 ||
              err.response.status === 400
            ) {
              setSignInError(err.response.data.message);
            } else {
              setSignInError("Unable to sign you in! Try again later.");
            }
          } else {
            setSignInError("An error occurred. Please try again.");
          }
        });
    }
  };

  const handleGoogleSignUp = (e) => {
    e.preventDefault();
    return window.open(
      `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/auth/google`,
      "_self",
    );
  };

  useEffect(() => {
    if (signInError !== "") {
      setErrorAlert({ status: true, message: signInError });
    } else {
      setErrorAlert({ status: false, message: "" });
    }
  }, [signInError]);

  useEffect(() => {
    if (signinSuccess !== "") {
      setSuccessAlert({ status: true, message: signinSuccess });
    } else {
      setSuccessAlert({ status: false, message: "" });
    }
  }, [signinSuccess]);

  useEffect(() => {
    // Reset selectedRole to empty after successful dispatch
    if (signinSuccess) {
      setSelectedRole("");
    }
  }, [signinSuccess]);

  return (
    <form className="flex h-auto w-full flex-col items-center md:w-[60%] lgl:w-[450px]">
      <div className="flex w-full flex-col justify-center overflow-y-scroll px-6 scrollbar-thin scrollbar-thumb-primeColor">
        {errorAlert.status && (
          <AlertComponent
            color="failure"
            type="Error!"
            message={errorAlert.message}
          />
        )}
        {successAlert.status && (
          <AlertComponent
            color="success"
            type="Success"
            message={successAlert.message}
          />
        )}
        {!successAlert.status && (
          <>
            <h1 className="font-titleFont mb-4 text-center text-2xl font-semibold decoration-[1px] mdl:text-3xl">
              Create your account
            </h1>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-3">
                {/* First name */}
                <div className="gap-.5 flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    First Name
                  </p>
                  <input
                    onChange={handleFirstName}
                    value={firstName}
                    className="h-8 w-full rounded-md border-[1px] border-gray-400 px-4 text-base font-medium outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-wide"
                    type="text"
                    placeholder="eg.John"
                  />
                  {errFirstName && (
                    <p className="font-titleFont px-4 text-sm font-semibold text-red-500">
                      <span className="mr-1 font-semibold italic">!</span>
                      {errFirstName}
                    </p>
                  )}
                </div>
                {/* Last name */}
                <div className="gap-.5 flex flex-col">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Last Name
                  </p>
                  <input
                    onChange={handleLastName}
                    value={lastName}
                    className="h-8 w-full rounded-md border-[1px] border-gray-400 px-4 text-base font-medium outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-wide"
                    type="text"
                    placeholder=" eg: Doe"
                  />
                  {errLastName && (
                    <p className="font-titleFont px-4 text-sm font-semibold text-red-500">
                      <span className="mr-1 font-semibold italic">!</span>
                      {errLastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="gap-.5 flex flex-col">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Email
                </p>
                <input
                  onChange={handleEmail}
                  value={email}
                  className="h-8 w-full rounded-md border-[1px] border-gray-400 px-4 text-base font-medium outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-wide"
                  type="email"
                  placeholder="johndoe@example.com"
                />
                {errEmail && (
                  <p className="font-titleFont px-4 text-sm font-semibold text-red-500">
                    <span className="mr-1 font-semibold italic">!</span>
                    {errEmail}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="gap-.5 flex flex-col">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Password
                </p>

                <div className="relative">
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="h-8 w-full rounded-md border-[1px] border-gray-400 px-4 text-base font-medium outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-wide"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                  />

                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
                  </div>
                </div>

                {errPassword && (
                  <p className="font-titleFont px-4 text-sm font-semibold text-red-500">
                    <span className="mr-1 font-semibold italic">!</span>
                    {errPassword}
                  </p>
                )}
              </div>
              <div className="gap-.5 flex flex-col">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Re-enter the password
                </p>

                <div className="relative">
                  <input
                    onChange={handleconfirmPassword}
                    value={confirmPassword}
                    className="h-8 w-full rounded-md border-[1px] border-gray-400 px-4 text-base font-medium outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-wide"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your  confirmPassword"
                  />

                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
                  </div>
                </div>

                {errPassword && (
                  <p className="font-titleFont px-4 text-sm font-semibold text-red-500">
                    <span className="mr-1 font-semibold italic">!</span>
                    {errPassword}
                  </p>
                )}
              </div>

              <div className="gap-.5 flex flex-col">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Sign up as
                </p>

                <select
                  name="role"
                  ref={roleSelectRef}
                  value={selectedRole} // Set the selected value
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="h-10 w-full rounded-md border-[1px] border-gray-400 px-4 py-2 align-middle text-sm font-medium outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-wide"
                >
                  <option value="" disabled selected hidden>
                    Select an account type
                  </option>
                  <option value="customer" className="text-sm">
                    Customer
                  </option>
                  <option value="seller" className="text-sm">
                    Seller
                  </option>
                </select>
                {errType && (
                  <p className="font-titleFont px-4 text-sm font-semibold text-red-500">
                    <span className="mr-1 font-semibold italic">!</span>
                    {errType}
                  </p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-2 mdl:items-center">
                <input
                  onChange={() => setChecked(!checked)}
                  className="mt-1 h-4 w-4 cursor-pointer bg-[#fff] mdl:mt-0"
                  type="checkbox"
                />
                <p className="text-sm text-primeColor">
                  I agree to the Feli Technology{" "}
                  <a className="text-[#1E61CC]">Terms of Service </a>
                  and <a className="text-[#1E61CC]">Privacy Policy</a>.
                </p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={handleSignUp}
                className={`${
                  checked
                    ? "cursor-pointer bg-[#1D6F2B] hover:bg-[#437a4c]"
                    : "disabled bg-[#81b48a]"
                } mt-3 h-10 w-full rounded-md text-base font-medium text-gray-200 duration-300 hover:text-white`}
              >
                {loading ? (
                  <>
                    <Spinner className="mr-3 inline-block" />
                    Creating your account
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
              <div className="ml-[5%]">
                <hr className="inline-block w-[40%] align-middle"></hr>
                <span className="mx-4 inline-block">or</span>
                <hr className="inline-block w-[40%] align-middle"></hr>
              </div>

              <p className="font-titleFont text-center text-sm font-medium">
                Already have an account?{" "}
                <Link
                  className="Bduration-300 cursor-pointer text-[#1E61CC]"
                  to="/signin"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
export default SignUpForm;
