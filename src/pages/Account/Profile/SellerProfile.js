import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { RiEdit2Fill } from "react-icons/ri";
import CompanyModel from "../../../components/Seller/CompanyModel/CompanyModel";

const SellerProfile = () => {
  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userprofile, setUserprofile] = useState();

  const { profile, loadprofile, errprofile } = useSelector(
    (state) => state.userprofile
  );

  const Dispatch = useDispatch();
  const storeUserInfo = useSelector(
    (state) => state.userReducer.userInfo.profile
  );

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    console.log("model is closed", isModalOpen);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (storeUserInfo) {
      setUser(storeUserInfo);
    }
  }, [storeUserInfo]);

  useEffect(() => {
    if (profile?.data?.user) {
      setUserprofile(profile?.data?.user);
    }
  }, [profile]);

  console.log("storeUserInfo homepage", userprofile);

  return (
    <>
      <div className="bg-white border shadow-lg rounded-md w-full min-h-[500px]">
        <div className=" rounded-t-md flex  justify-between space-x-3 font-normal pl-10  py-3  px-2 text-xl">
          <div className="flex space-x-2">
            {userprofile != null ? (
              <>
                <img src={userprofile?.photo} />
                <h1>{userprofile?.firstName}</h1>
              </>
            ) : (
              <>
                <FaUser size={25} />
                <h1>My Hill Global Market</h1>
              </>
            )}
          </div>

          {userprofile != null && userprofile.role == "customer" ? (
            <div className="flex space-x-2 cursor-pointer">
              <RiEdit2Fill size={25} />
              <h1>Edit My Profile</h1>
            </div>
          ) : (
            <div className="flex space-x-2 cursor-pointer" onClick={showModal}>
              <RiEdit2Fill size={25} />
              <h1>Add Seller Info</h1>
            </div>
          )}
        </div>
        {userprofile != null && (
          <div className=" pl-10 mt-10 ">
            <h1>Email : {userprofile.email}</h1>
            <h1>firstName : {userprofile.firstName}</h1>
            <h1>lastName : {userprofile.lastName}</h1>
          </div>
        )}

        <CompanyModel isModalOpen={isModalOpen} handleCancel={handleCancel} />
      </div>
    </>
  );
};

export default SellerProfile;
