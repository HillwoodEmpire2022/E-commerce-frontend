import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";

const ShopSideNav = ({ brands, handlefilterShow }) => {
  return (
    <div className="w-full px-6 py-4 flex flex-col gap-6 border z-30  ">
      <Price handlefilterShow={() => handlefilterShow()} />
      <Brand brands={brands} handlefilterShow={() => handlefilterShow()} />
      {/* <Category icons={true} /> */}
      <Color />
    </div>
  );
};

export default ShopSideNav;
