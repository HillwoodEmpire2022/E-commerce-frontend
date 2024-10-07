import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa6";
import { motion } from "framer-motion";
import { IoIosHeartEmpty } from "react-icons/io";
import {
  FeliTechLogo_transparent,
  FeliTechWhiteLogo,
} from "../../assets/images";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { leftNavBarList } from "../../constants";
import { FiHeart } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { useSelector } from "react-redux";
import UserAvatarDropdown from "./UserAvatarDropdown";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Search } from "../Search/Search";
import { useCurrency } from "../Currency/CurrencyProvider/CurrencyProvider";
import Image from "../designLayouts/Image";
import { useUser } from "../../context/UserContex";
import SearchBar from "./SearchBar";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { MobileCategoryNav } from "../ProductsCategories";
import ProductClassAccordion from "../pageProps/shopPage/Accordions/ProductClass";
import ProductCategoryAccordion from "../pageProps/shopPage/Accordions/productCategory";
import ProductSubCategoryAccordion from "../pageProps/shopPage/Accordions/ProductSubCategory";
import ProductBrandAccordion from "../pageProps/shopPage/Accordions/productBrand";
import { TopCategory } from "../category-images-cards/TopCategory";

// let cart = JSON.parse(localStorage.getItem("cart"));

export async function fetchCategories() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/categories`,
    );

    return response.data.data.categories;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
}

const Header = (props) => {
  // Get Logged in user
  const { user, onLogout } = useUser();
  const navigate = useNavigate();
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const [search, setSearch] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  const categoryId = searchParams.get("category");

  const {
    fromCurrency,
    toCurrency,
    setFromCurrency,
    setToCurrency,
    currentCurrency,
    handleSetCurrenctCurrency,
    currencies,
  } = useCurrency();

  const cart = useSelector((state) => state.cart);

  const cartTotal = cart.reduce((total, product) => total + product.items, 0);
  const wishlist = useSelector((state) => state.wishlist);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;

    // Assuming you want to toggle between "From" and "To" currencies
    if (fromCurrency === selectedCurrency) {
      setFromCurrency(toCurrency);
      setToCurrency(selectedCurrency);
    } else {
      setToCurrency(selectedCurrency);
      setFromCurrency(fromCurrency);
    }
  };

  const handleSignOut = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  // implementation of  Shop by Category

  const {
    isLoading,
    data: categories,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  let headerIconStyles =
    "inline-block lg:hover:text-[#1D6F2B] lg:hover:bg-[#E5E5E5] lg:hover:rounded-full py-2.5 px-2";
  return (
    <div className="h-100px sticky top-0 z-50 w-full border-b-[1px] border-b-gray-200 bg-white">
      <div className="relative flex justify-end border-b-[1px] border-b-gray-200 bg-[white] px-4 py-1 text-black md:hidden">
        <ul className="z-50 flex items-center gap-1 p-0 md:max-w-[320px] lg:max-w-[400px]">
          <div className="">
            {" "}
            <Link to="/">
              <Image className=" " imgSrc={FeliTechLogo_transparent} />
            </Link>
          </div>
          <li className="">
            <span className="mr-0 inline-block font-light text-[#1D6F2B] hover:text-[#1D6F2B]">
              <select
                value={currentCurrency}
                onChange={(e) => handleSetCurrenctCurrency(e.target.value)}
                className="rounded border-gray-200 bg-gray-50 p-1 text-xs text-gray-700"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </span>
          </li>

          <li className="relative mr-3 lg:mx-6">
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "align-middle font-light text-[red]"
                  : "align-middle font-light";
              }}
              to="/wishlist/"
              state={{
                data: location.pathname.split("/")[1],
              }}
            >
              <FiHeart
                className="px-2.5 py-1.5 lg:hover:rounded-full lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]"
                size={40}
              />
              {
                <p className="z-1 absolute -right-2 -top-1 -ml-4 mt-1 flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-[#fff] bg-[#1D6F2B] text-[12px] font-semibold text-white">
                  {wishlist.length}
                </p>
              }
            </NavLink>
          </li>

          <li className="relative">
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "rounded bg-white py-1 align-middle font-semibold text-[#1D6F2B] hover:text-[#1D6F2B]"
                  : "align-middle font-semibold hover:text-[#1D6F2B]";
              }}
              to="/cart"
              state={{
                data: location.pathname.split("/")[1],
              }}
            >
              <BsCart3 className={headerIconStyles} size={40} />
              {
                <p className="z-1 absolute -right-2 -top-1 -ml-4 mt-1 flex h-6 w-6 items-center justify-center rounded-md border-[0.5px] border-[#fff] bg-[#1D6F2B] text-[12px] font-semibold text-white">
                  {cartTotal}
                </p>
              }
            </NavLink>
          </li>

          <li className="ml-3">
            {" "}
            {user ? (
              <UserAvatarDropdown
                ismobileview={true}
                userInfo={user}
                isUser={true}
                logOut={onLogout}
              />
            ) : (
              <UserAvatarDropdown ismobileview={true} isUser={false} />
            )}
          </li>
        </ul>
      </div>

      <nav className="relative mx-auto flex h-full max-w-container items-center gap-6 px-4 md:items-center md:justify-between">
        <div className="ml-0 flex w-[90%] items-center space-x-5 md:!w-[250px]">
          <div className="hidden md:inline-block">
            {" "}
            <Link to="/">
              <div className=" ">
                <Image
                  className="h-[80px] w-[156px]"
                  imgSrc={FeliTechLogo_transparent}
                />
              </div>
            </Link>
          </div>

          <div className="!m-auto !my-2 !w-[90%] md:hidden">
            <SearchBar ismobileview={true} />
          </div>

          {/* <div className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-10">
            <FaSearch onClick={() => setSearch(true)} className="w-5 h-5" />
          </div> */}
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="absolute right-4 top-4 inline-block h-6 w-8 cursor-pointer md:hidden"
            />
          {sidenav && (
            <div
              className="fixed right-0 top-0 h-screen w-full overflow-auto bg-black bg-opacity-80 text-gray-200"
              style={{
                zIndex: 3000,
              }}
              onMouseMove={(e) => {
                e.stopPropagation();
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
            >
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-[80%]"
              >
                <div
                  className="ml-0 h-full w-full overflow-auto bg-primary p-6"
                  style={{
                    zIndex: 3000,
                  }}
                >
                  <img
                    className="mb-6 w-40"
                    src={FeliTechWhiteLogo}
                    alt="logoLight"
                  />
                  <ul className="flex flex-col gap-2 text-gray-200">
                    {leftNavBarList.map((item) => (
                      <li
                        className="hoverEffect items-center border-r-gray-300 text-lg font-normal text-gray-200 decoration-[1px] underline-offset-[4px] last:border-r-0 hover:font-semibold hover:text-white hover:underline md:border-r-[2px]"
                        key={item._id}
                      >
                        <NavLink
                          to={item.link}
                          state={{
                            data: location.pathname.split("/")[1],
                          }}
                          onClick={() => setSidenav(false)}
                        >
                          {item.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`mt-4 overflow-auto bg-[#1D6F2B] ${
                      // categoryId  ? "hidden" : "blocks"
                      ""
                    } `}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseOver={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <h1
                      onClick={() => setCategory(!category)}
                      className="font-titleFont mb-2 flex cursor-pointer items-center justify-between text-base"
                    >
                      Shop by Category{" "}
                      <span className="text-lg">{category ? "-" : "+"}</span>
                    </h1>
                    {category && !isLoading && (
                      <motion.ul
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-1 text-sm"
                      >
                        <div className="w-full flex-col space-y-2 overflow-auto mdl:overflow-hidden">
                          {" "}
                          <div className="z-0">
                            <ProductClassAccordion
                              setSidenav={setSidenav}
                              isSidebar={sidenav}
                              ismobile={true}
                            />
                          </div>
                          <div className="z-0">
                            <ProductCategoryAccordion
                              ismobile={true}
                              setSidenav={setSidenav}
                            />
                          </div>
                          {categoryId && (
                            <div className="z-0">
                              <ProductSubCategoryAccordion
                                setSidenav={setSidenav}
                                ismobile={true}
                              />
                            </div>
                          )}
                          <div className="z-0">
                            <ProductBrandAccordion
                              setSidenav={setSidenav}
                              ismobile={true}
                            />
                          </div>
                        </div>
                      </motion.ul>
                    )}
                  </div>
                </div>
                <span
                  onClick={() => setSidenav(false)}
                  className="absolute -right-10 top-2 flex h-8 w-8 cursor-pointer items-center justify-center border-[1px] border-gray-300 text-2xl text-gray-300 duration-300 hover:border-red-500 hover:text-red-500"
                >
                  <MdClose />
                </span>
              </motion.div>
            </div>
          )}
        </div>
        <TopCategory />

        <SearchBar />

        <div className="hidden md:block">
          <ul className="z-50 flex items-center gap-2 p-0 md:max-w-[320px] lg:max-w-[400px]">
            <li>
              <span className="mr-6 hidden font-light text-[#1D6F2B] hover:text-[#1D6F2B] md:inline-block">
                <select
                  value={currentCurrency}
                  onChange={(e) => handleSetCurrenctCurrency(e.target.value)}
                  className="rounded border-gray-200 bg-gray-50 p-1 text-xs text-gray-700"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </span>
            </li>

            {user ? (
              ""
            ) : (
              <ul className="flex items-center">
                <li className="rounded border border-gray-300 px-4 xl:border-none">
                  <NavLink
                    className={({ isActive }) => {
                      return isActive
                        ? "w-full text-center text-[14px] font-semibold text-[#1D6F2B] md:inline-block lg:px-2 lg:py-1 lg:hover:rounded-md lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]"
                        : "w-full text-center text-[14px] font-semibold md:inline-block lg:px-2 lg:py-1 lg:hover:rounded-md lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]";
                    }}
                    to="/signin"
                  >
                    Login
                  </NavLink>
                </li>

                <li className="hidden xl:flex">
                  <NavLink
                    className={({ isActive }) => {
                      return isActive
                        ? "w-full rounded-md bg-[#1D6F2B] px-2 py-1 text-center text-[14px] font-semibold text-white md:inline-block lg:px-2 lg:py-1 lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]"
                        : "w-full rounded-md bg-[#1D6F2B] px-2 py-1 text-center text-[14px] font-semibold text-white md:inline-block lg:px-2 lg:py-1 lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]";
                    }}
                    to="/signup"
                  >
                    Register
                  </NavLink>
                </li>
              </ul>
            )}
            {user ? <></> : ""}
            <li className="relative ml-2 lg:ml-6">
              <NavLink
                className={({ isActive }) => {
                  return isActive
                    ? "relative hidden align-middle font-light text-[#1D6F2B] md:inline-block"
                    : "relative hidden align-middle font-light md:inline-block";
                }}
                to="/wishlist/"
                state={{
                  data: location.pathname.split("/")[1],
                }}
              >
                {/* <IoIosHeartEmpty
                  className="px-2.5 py-1.5 lg:hover:rounded-full lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]"
                  size={40}
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={40}
                  height={40}
                  className="px-2.5 py-1.5 lg:hover:rounded-full lg:hover:bg-[#E5E5E5] lg:hover:text-[#1D6F2B]"
                  fill={"none"}
                >
                  <path
                    d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {
                  <p className="z-1 absolute right-[-5px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#fff] bg-[#1D6F2B] text-xs font-semibold text-white">
                    {wishlist.length}
                  </p>
                }
              </NavLink>
            </li>
            <li className="relative">
              <NavLink
                className={({ isActive }) => {
                  return isActive
                    ? "align-middle font-semibold text-[#1D6F2B] hover:text-[#1D6F2B]"
                    : "align-middle font-semibold hover:text-[#1D6F2B]";
                }}
                to="/cart"
                state={{
                  data: location.pathname.split("/")[1],
                }}
              >
                <BsCart3 className={headerIconStyles} size={40} />
                {
                  <p className="z-1 absolute -right-2 -top-1 -ml-4 mt-1 flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-[#fff] bg-[#1D6F2B] text-[12px] font-semibold text-white">
                    {cartTotal}
                  </p>
                }
              </NavLink>
            </li>

            {user ? (
              <UserAvatarDropdown userInfo={user} logOut={onLogout} />
            ) : (
              ""
            )}
          </ul>

          <HiMenuAlt2
            onClick={() => setSidenav(!sidenav)}
            className="absolute right-4 top-6 inline-block h-6 w-8 cursor-pointer md:hidden"
          />
          {sidenav && (
            <div className="fixed left-0 top-0 z-50 h-screen w-full bg-black bg-opacity-80 text-gray-200">
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-[80%]"
              >
                <div className="h-full w-full bg-[#1D6F2B] p-6">
                  <img
                    className="mb-6 w-28"
                    src={FeliTechWhiteLogo}
                    alt="logoLight"
                  />
                  <ul className="flex flex-col gap-2 text-gray-200">
                    <li className="hoverEffect items-center border-r-gray-300 text-lg font-normal text-gray-200 decoration-[1px] underline-offset-[4px] last:border-r-0 hover:font-semibold hover:text-white hover:underline md:border-r-[2px]">
                      <Link to="/" onClick={() => setSidenav(false)}>
                        {"Home"}
                      </Link>
                    </li>
                    <li className="hoverEffect items-center border-r-gray-300 text-lg font-normal text-gray-200 decoration-[1px] underline-offset-[4px] last:border-r-0 hover:font-semibold hover:text-white hover:underline md:border-r-[2px]">
                      <Link
                        to="/shop"
                        state={{
                          data: location.pathname.split("/")[1],
                        }}
                        onClick={() => setSidenav(false)}
                      >
                        {"Shop"}
                      </Link>
                    </li>
                    <li className="hoverEffect items-center border-r-gray-300 text-lg font-normal text-gray-200 decoration-[1px] underline-offset-[4px] last:border-r-0 hover:font-semibold hover:text-white hover:underline md:border-r-[2px]">
                      <Link
                        to="/about"
                        state={{
                          data: location.pathname.split("/")[1],
                        }}
                        onClick={() => setSidenav(false)}
                      >
                        {"About"}
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-4 bg-[#1D6F2B]">
                    <h1
                      onClick={() => setCategory(!category)}
                      className="font-titleFont mb-2 flex cursor-pointer items-center justify-between text-base"
                    >
                      Shop by Category{" "}
                      <span className="text-lg">{category ? "-" : "+"}</span>
                    </h1>
                  </div>
                  <div className="mt-4">
                    <h1
                      onClick={() => setBrand(!brand)}
                      className="font-titleFont mb-2 flex cursor-pointer items-center justify-between text-base"
                    >
                      Shop by Brand
                      <span className="text-lg">{brand ? "-" : "+"}</span>
                    </h1>
                    {brand && (
                      <motion.ul
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-1 text-sm"
                      >
                        <li className="headerSedenavLi">New Arrivals</li>
                        <li className="headerSedenavLi">Gudgets</li>
                        <li className="headerSedenavLi">Accessories</li>
                        <li className="headerSedenavLi">Electronics</li>
                        <li className="headerSedenavLi">Others</li>
                      </motion.ul>
                    )}
                  </div>
                </div>
                <span
                  onClick={() => setSidenav(false)}
                  className="absolute -right-10 top-2 flex h-8 w-8 cursor-pointer items-center justify-center border-[1px] border-gray-300 text-2xl text-gray-300 duration-300 hover:border-red-500 hover:text-red-500"
                >
                  <MdClose />
                </span>
              </motion.div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
