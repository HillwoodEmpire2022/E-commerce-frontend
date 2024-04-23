import React, { useState } from 'react';
import axios from 'axios';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ReactComponent as Spinner } from '../../assets/images/Spinner.svg';
import {
  EyeFilled,
  EyeInvisibleFilled,
} from '@ant-design/icons';

import Cookies from 'js-cookie';
import AlertComponent from '../designLayouts/AlertComponent';
import { useUser } from '../../context/UserContex';

const SignInForm = () => {
  const { onLogin } = useUser();
  const { state } = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail('');
    setSignInError('');
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword('');
    setSignInError('');
  };

  const handleSignIn = async () => {
    if (!email) {
      setErrEmail('Enter your email');
      return;
    } else if (!EmailValidation(email)) {
      setErrEmail('Enter a Valid email');
      return;
    } else if (!password) {
      setErrPassword('Enter your password');
      return;
    } else if (password.length < 6) {
      setErrPassword(
        'Passwords must be at least 6 characters'
      );
      return;
    }

    try {
      setLoading(true);
      let userData = {
        email: email,
        password: password,
      };
      const result = await axios({
        url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/auth/login`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: userData,
      });

      if (result.status === 200) {
        setEmail('');
        setPassword('');
        setLoading(false);
        Cookies.set('token', result?.data?.token);

        onLogin({
          ...result.data.data.user,
          token: result.data.token,
        });

        // IF USER WAS ACCESSING STATE, NAVIAGETE HIM THERE
        if (state?.returnTo) {
          return navigate(`/${state.returnTo}`);
        }
        if (result.data.data.user.role === 'customer') {
          navigate('/', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.status === 'fail') {
        setSignInError(err.response.data.message);
      } else {
        setSignInError(
          'Unable to sign you in! Try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className='w-full lgl:w-[400px] h-auto flex flex-col gap-4 items-center'
      onKeyDown={(e) => {
        if (e.key === 'Enter') return handleSignIn();
      }}
    >
      <div className='px-6 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin'>
        {signInError && (
          <AlertComponent
            color='failure'
            type='Error!'
            message={signInError}
          />
        )}
        <h1 className='font-titleFont decoration-[1px] font-semibold text-lg mdl:text-4xl mb-4 text-center'>
          Sign in
        </h1>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-.5'>
            <p className='font-titleFont text-base font-semibold text-gray-600'>
              Email
            </p>
            <input
              onChange={handleEmail}
              value={email}
              className='w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium 
                    placeholder:font-normal placeholder:text-[#C4C4C4] rounded border-[1px] border-gray-400 outline-none'
              type='email'
              placeholder='john@example.com'
            />
            {errEmail && (
              <p className='text-sm text-red-500 font-titleFont font-semibold px-4'>
                <span className='font-bold italic mr-1'>
                  !
                </span>
                {errEmail}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='flex flex-col gap-.5 mb-2'>
            <p className='font-titleFont text-base font-semibold text-gray-600'>
              Password
            </p>
            <div className='relative'>
              <input
                onChange={handlePassword}
                value={password}
                className='w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium 
                placeholder:font-normal placeholder:text-[#C4C4C4] rounded border-[1px] border-gray-400 outline-none'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
              />
              <div
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeInvisibleFilled className='text-gray-500' />
                ) : (
                  <EyeFilled className='text-gray-500' />
                )}
              </div>
            </div>
            {errPassword && (
              <p className='text-sm text-red-500 font-titleFont font-semibold px-4'>
                <span className='font-bold italic mr-1'>
                  !
                </span>
                {errPassword}
              </p>
            )}

            <p className='text-xs pt-1'>
              Forgot password?{' '}
              <Link
                className='text-[#1E61CC] duration-300 cursor-pointer hover:underline'
                to='/forgot-password'
              >
                Forgot Password
              </Link>
            </p>
          </div>
          <button
            type='button'
            onClick={handleSignIn}
            className={
              loading
                ? 'bg-[#81b48a] text-gray-200 hover:text-white w-full text-base font-medium h-8 rounded duration-300 disabled'
                : 'bg-[#1D6F2B] hover:bg-[#437a4c] text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-8 rounded duration-300'
            }
          >
            {loading ? (
              <>
                <Spinner className='inline-block mr-3' />
                Signing you In
              </>
            ) : (
              'Sign In'
            )}
          </button>
          <p className='text-xs font-titleFont font-medium -mt-2'>
            Don't have an Account?{' '}
            <Link
              className='text-[#1E61CC] duration-300 cursor-pointer hover:underline'
              to='/signup'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
