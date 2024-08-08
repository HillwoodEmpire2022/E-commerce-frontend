import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MenuIcon from "../../assets/images/menu.png";
import MenuIconWhite from "../../assets/images/menu-white.png";
import { FaSearch } from "react-icons/fa";
import Flex from "../designLayouts/Flex";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../constants";
import { useLocation } from "react-router-dom";
import HomePageCategories from "../homePageCategories/HomePageCategories";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../ProductsCategories";
import axios from "axios";
export async function searchproduct(name) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/products?name=${name}&fields=name,price,seller,discountPercentage,colorMeasurementVariations,hasColors,hasMeasurements,productImages.productThumbnail.url`
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
    <div className={` ${ismobileview ? " " : "hidden md:block w-[40%]"}`}>
      <div className="">
        <Flex className="flex lg:flex-row items-start lg:items-center justify-between max-w-max lg:pb-0 h-full lg:h-24">
          <div className="relative w-full lg:w-[600px]  h-[50px] text-base text-primeColor  flex items-center gap-2 justify-between px-6 rounded-md border-[2px]">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px] border-none"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5 " />
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
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3  break-words"
                    >
                      <img
                        className="w-24"
                        src={item?.productImages?.productThumbnail?.url}
                        alt="productImg"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p
                          className="text-xs overflow-auto break-words "
                          dangerouslySetInnerHTML={{
                            __html: item?.description?.slice(0, 80),
                          }}
                        ></p>
                        <p className="text-sm">
                          Price:{" "}
                          <span className="text-primeColor font-semibold">
                            {item.currency} {item.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative"></div>
        </Flex>
      </div>
    </div>
  );
};

export default SearchBar;
