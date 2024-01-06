import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUserInfo } from "../../../redux/userSlice";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserAvatarDropdown = (props) => {
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const dropDownRef = useRef();
  const avatarRef = useRef();
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const location = useLocation();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (avatarRef.current && avatarRef.current.contains(e.target) === false) {
        if (
          dropDownRef.current &&
          dropDownRef.current.contains(e.target) === false
        ) {
          return setDisplayDropdown(false);
        }
      }
    });
  }, []);

  const handleSignOut = (e) => {
    e.preventDefault();

    if (props.userInfo.logInType === "ByGoogle") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_SERVER_URL}/logout`)
        .then(() => {
          Dispatch(resetUserInfo());
          sessionStorage.removeItem("userToken");
          window.open(`${process.env.REACT_APP_INDEX_PAGE_URL}`, "_self");
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (props.userInfo.logInType === "ByEmail") {
      navigate("/");
      Dispatch(resetUserInfo());
      sessionStorage.removeItem("userToken");
      Cookies.removeItem("token");
      window.open(`${process.env.REACT_APP_INDEX_PAGE_URL}`, "_self");
    }
  };

  return (
    <>
      <li
        className="hidden rounded-full border-2 border-white hover:border-slate-300  md:inline-block align-middle w-[40px] md:ml-4 cursor-pointer"
        onClick={() => setDisplayDropdown(!displayDropdown)}
        ref={avatarRef}
      >
        <img
          className="inline-block w-[40px] rounded-full"
          // src={props.userInfo.profile.profileImageUrl}
          src={props.userInfo.photo}
          alt={`${props.userInfo.firstName}'s account settings`}
        />
      </li>
      {displayDropdown && (
        <div
          className="absolute top-[75px] right-2 w-40 rounded-md  py-2 px-2 border-2 bg-[#1D6F2B]"
          ref={dropDownRef}
        >
          <ul className="  text-center">
            {props.userInfo.firstName ? (
              <li className="w-[100%] text-center py-2 px-2 lg:hover:bg-[#E5E5E5] rounded-md cursor-pointer ">
                <NavLink
                  className={({ isActive }) => {
                    return isActive
                      ? "text-[#1D6F2B] font-semibold hidden md:inline-block align-middle"
                      : "font-semibold hidden md:inline-block align-middle";
                  }}
                  to="myAccount"
                  // state={{ data: location.pathname.split("/")[1] }}
                >
                  Account Settings
                </NavLink>
              </li>
            ) : (
              ""
            )}
            <li
              className="w-[100%] bottom-2 text-center py-2 px-2 lg:hover:bg-[#E5E5E5] rounded-md cursor-pointer"
              onClick={handleSignOut}
            >
              Sign out
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UserAvatarDropdown;
