import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MenuIcon from "../../assets/images/menu.png";
import MenuIconWhite from "../../assets/images/menu-white.png";
import { FaSearch } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import Flex from "../designLayouts/Flex";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import HomePageCategories from "../homePageCategories/HomePageCategories";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../ProductsCategories";
import DisplayCurrency from "../Currency/DisplayCurrency/DisplayCurrency";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

export async function searchproduct(name) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/products/search?name=${name}&fields=name,price,seller,discountPercentage,createdAt,colorMeasurementVariations,hasColors,hasMeasurements,productImages.productThumbnail.url`
    );

    return response.data.data.products;
  } catch (error) {
    return [];
  }
}

const SearchBar = ({ ismobileview }) => {
  // const { data: products } = useQuery({
  //   queryKey: ["products-search"],
  //   queryFn: ({ pageParam = 1 }) => {
  //     return fetchProducts(pageParam);
  //   },
  // });

  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();

  // useEffect(() => {
  //   document.body.addEventListener('click', (e) => {
  //     if (
  //       ref?.current !== null &&
  //       ref?.current.contains(e.target) === false
  //     ) {
  //       return setShowCategories(false);
  //     }
  //   });
  // }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoriesMenuClick = () => {
    return setShowCategories(!showCategories);
  };

  // useEffect(() => {
  //   const filtered = products?.filter((item) =>
  //     item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredProducts(filtered);
  // }, [products, searchQuery]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchproduct(searchQuery).then((data) => {
        setFilteredProducts(data);
      });
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  return (
    <div
      className={` ${
        ismobileview ? " " : "hidden md:block w-full rounded-md"
      }`}
    >
      <div className="relative w-full lg:w-[90%] h-[40px] md:h-[40px] m-auto text-sm text-primeColor  flex items-center gap-2 justify-between p-0 rounded-md">
        <input
          className="flex-1 h-full rounded-l-md text-sm  mr-3 !w-[90%] border-gray-400 !md:w-[85%] outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px] "
          type="text"
          onChange={handleSearch}
          value={searchQuery}
          placeholder="Search your products here"
        />
        {!searchQuery ? (
          <div className=" absolute rounded-r-md bg-primary h-full justify-center items-center flex right-0 w-20 md:w-10 ">
            <CiSearch size={20} className=" text-white" />
          </div>
        ) : (
          <div className=" absolute bg-primary rounded-r-md h-full justify-center items-center flex right-0 w-20 md:w-10 ">
            <RxCross2
              size={20}
              className=" text-white"
              onClick={() => setSearchQuery("")}
            />
          </div>
        )}

        {searchQuery && (
          <div
            className={`w-full mx-auto h-96  bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
          >
            {searchQuery &&
              filteredProducts.map((item) => (
                <div
                  onClick={() => {
                    navigate(`/products/${item.id}`);

                    setShowSearchBar(true);
                    setSearchQuery("");
                  }}
                  key={item.id}
                  className=" w-full px-2  bg-gray-100 mb-3 flex items-start gap-3  break-words"
                >
                  <img
                    className="w-24  h-24 object-fill border rounded-md"
                    src={item?.productImages?.productThumbnail?.url}
                    alt=""
                  />
                  <div className="flex flex-col gap-1 overflow-auto">
                    <p className="font-medium text-sm md:text-md ">
                      {item.name.length > 80
                        ? item.name.slice(0, 80) + "..."
                        : item.name}
                    </p>
                    <p
                      className="text-xs overflow-auto break-words "
                      dangerouslySetInnerHTML={{
                        __html: item?.description?.slice(0, 80),
                      }}
                    ></p>
                    <p className="text-sm flex">
                      Price:{" "}
                      {/* <span className="text-primeColor font-semibold">
                            {item.currency} {item.price}
                          </span> */}
                      <div>
                        {item.discountPercentage <= 0 && (
                          <div className="text-[#1D6F2B] font-semibold">
                            <DisplayCurrency product={item} isDiscount={true} />
                          </div>
                        )}
                        {item.discountPercentage > 0 && (
                          <>
                            <div className=" text-[#1D6F2B] font-semibold  ">
                              <DisplayCurrency
                                product={item}
                                isDiscount={true}
                              />
                            </div>

                            <div className=" text-[#00000080] font-semibold line-through">
                              <DisplayCurrency
                                product={item}
                                isDiscount={false}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
