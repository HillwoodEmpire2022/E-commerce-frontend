import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SearchBar from "../Header/SearchBar";
import FooterBottom from "../Footer/FooterBottom";
import { whatsappIcon, FeliTechLogo_transparent } from "../../assets/images";
import Image from "./Image";

export default function PageLayout({ children, showFooter, userInfo }) {
  return (
    <>
      <Header userInfo={userInfo} />
      <div className="mt-6">{children}</div>

      {/* <div className=" w-14 h-20 sticky z-50 bottom-0 right-0 ml-2 mr-0  py-0  ">
        <a href=" https://wa.me/250798697197" target="_blank" className=" mb-0">
          <Image imgSrc={whatsappIcon} />
        </a>
      </div> */}
      {showFooter && (
        <>
          {/* <Footer /> */}
          <FooterBottom />
        </>
      )}
    </>
  );
}
