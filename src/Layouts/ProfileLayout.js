import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { GetMyprofile } from "../APIs/UserAPIs";

const ProfileLayout = () => {
  const [user, setUser] = useState();
  const [userprofile, setUserprofile] = useState();

  const token = Cookies.get("token");
  const { profile, loadprofile, errprofile } = useSelector(
    (state) => state.userprofile
  );
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(GetMyprofile(token));
  // }, [token]);
  // implement redux
  // useEffect(() => {
  //   if (loadprofile == true) {
  //     dispatch(GetMyprofile(token))
  //       .unwrap()
  //       .then((data) => {
  //         console.log("data", data);
  //         if (data?.data && data.status == "success") {
  //           setUser(data?.data?.user);
  //         }
  //       })
  //       .catch((error) => {});
  //   }
  // }, [loadprofile, dispatch, token]);

  // // Fetch user only when the component mounts
  // useEffect(() => {
  //   if (user == null || user == undefined) {
  //     dispatch(GetMyprofile(token))
  //       .unwrap()
  //       .then((data) => {
  //         console.log("data", data);
  //         if (data?.data && data.status == "success") {
  //           setUser(data?.data?.user);
  //         }
  //       })
  //       .catch((error) => {});
  //   }
  // }, [dispatch, user, token]);

  useEffect(() => {
    if (profile?.data?.user) {
      setUserprofile(profile?.data?.user);
    }
  }, [profile]);

  return (
    <>
      <div className="flex my-10 max-w-container mx-auto px-4 space-x-2">
        <div className=" w-[30%] bg-secondary rounded-md  h-fit ">
          <div className="bg-primary rounded-t-md flex space-x-3  font-bold py-3 text-white px-2 text-xl">
            <FaUser size={25} />
            <h1>My Hill Global Market</h1>
          </div>
          <ul className="px-5 py-3">
            <li>
              <NavLink
                className={({ isActive }) => {
                  return isActive
                    ? "w-full text-[#1D6F2B] lg:hover:text-[#1D6F2B] lg:hover:bg-[#E5E5E5] lg:hover:rounded-md  font-semibold hidden md:inline-block lg:py-1"
                    : "w-full lg:hover:text-[#1D6F2B] lg:hover:bg-[#E5E5E5] lg:hover:rounded-md   font-semibold hidden md:inline-block lg:py-1 ";
                }}
                to={`profile`}
              >
                OverView
              </NavLink>
            </li>
            {user?.role == "seller" || userprofile?.role == "seller" ? (
              ""
            ) : (
              <li>
                <NavLink to={`orders`}>My Orders</NavLink>
              </li>
            )}
            <li>
              <NavLink to={`password-reset`}>Password Reset</NavLink>
            </li>
            <li>
              <NavLink to={`signout`}>Logout</NavLink>
            </li>
          </ul>
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
