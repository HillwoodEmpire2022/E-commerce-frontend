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

      {showFooter && (
        // <div className="max-w-container mx-auto">
        <FooterBottom />
        // </div>
      )}

      <a
        href="https://wa.me//+250798697197"
        target="_blank"
        className="fixed text-white z-50 right-4 bottom-10 w-12 h-12 hover:animate-bounce"
      >
        <img src={whatsappIcon} className="w-full h-full border" alt="WhatsApp" />
      </a>
    </>
  );
}
