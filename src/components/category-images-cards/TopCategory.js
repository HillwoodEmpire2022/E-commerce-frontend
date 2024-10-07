import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const TopCategory = ({ ...props }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef(null);

  // Accessing product classes from the redux store
  const {
    loading: productclassLoading,
    productclass: productclassData,
    errorMessage: productclassError,
  } = useSelector((state) => state.productclass);

  // Handle the click outside to close the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll to show or hide the button after scrolling 40px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative md:flex hidden h-fit w-10 min-w-10 items-center justify-center">
      {/* Button that appears after scrolling 40px */}
      {showScrollButton && (
        <div className="flex h-fit w-10 min-w-10 items-center justify-center rounded border border-gray-300 p-1">
          <button
            className="z-50 text-[#1f6e2a]"
            onClick={() => setShowPopup(!showPopup)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"none"}
            >
              <path
                d="M4 5L20 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12L20 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 19L20 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Popup Container */}
      {showPopup && (
        <div
          ref={containerRef}
          className="absolute left-0 right-0 top-12 z-40 w-fit overflow-hidden"
        >
          <div className="relative flex h-96 w-72 flex-col items-start overflow-hidden overflow-y-auto border border-gray-300 bg-white shadow">
            {/* Header */}
            <div className="sticky left-0 right-0 top-0 flex w-full border-y bg-white px-2 py-2 text-sm font-medium text-black">
              <h1>Choose category</h1>
            </div>

            {/* Categories List */}
            <div className="mt- flex w-full flex-col">
              {!productclassLoading &&
                productclassData &&
                productclassData?.map((pclass, index) => (
                  <Link
                    to={`/shop/?productClass=${pclass.id}`}
                    key={index}
                    className="flex w-full items-center gap-2 rounded p-2 hover:bg-gray-200"
                    onClick={() => setShowPopup(false)} // Close popup on category click
                  >
                    <div className="flex h-8 w-8 rounded-full border p-0">
                      <img
                        src={`${
                          pclass?.icon
                            ? pclass.icon
                            : "https://placehold.jp/80x80.png"
                        }`}
                        alt={pclass.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-semibold capitalize hover:underline">
                      {pclass.name}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
