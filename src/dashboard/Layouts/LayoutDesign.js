import React, { useContext, useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LockOutlined,
  CloseSquareFilled,
  FastBackwardOutlined,
  HomeFilled,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout, Menu, Button, Dropdown, Space, Avatar, Image } from "antd";
import { MenuProps } from "antd";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Menus } from "../Common";
import Cookies from "js-cookie";
import { useUser } from "../../context/UserContex";
import { BiArrowToLeft, BiLeftArrow } from "react-icons/bi";
import { motion } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import { FeliTechLogo_transparent } from "../../assets/images";

const { Header, Sider, Content } = Layout;

const TitleContext = React.createContext();

export const useTitleContext = () => React.useContext(TitleContext);

export const LayoutDesign = ({ userprofile }) => {
  // const [collapsed, setCollapsed] = React.useState(false);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 500);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 500);
  const { user, onLogout } = useUser();
  const userRole = user?.role;

  const { profile, errprofile } = useSelector((state) => state.userprofile);

  // State to hold the dynamic title
  const [dynamicTitle, setDynamicTitle] = React.useState("Dashboard");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      errprofile &&
      (errprofile.message === "jwt expired, Please login again" ||
        errprofile.message === "jwt malformed, Please login again")
    ) {
      Cookies.remove("token");
      localStorage.removeItem("selectedKey");
      navigate("/");
    }
  }, [errprofile, navigate]);
  const titles = {
    0: "Dashboard",
    1: "Users",
    // 2: "Contract",
    2: "ProductsClass",
    3: "Brands",
    4: "Categories",
    5: "Orders",
    6: "Products",
    7: "Profile",
    8: "Logout",
  };
  // Function to handle menu item click and update title
  const handleMenuClick = (menuItem) => {
    // Update the dynamic title based on the selected menu item
    setDynamicTitle(titles[menuItem.key]);
    localStorage.setItem("selectedKey", menuItem.key);
  };

  let selectedKey = localStorage.getItem("selectedKey");

  if (selectedKey === null) {
    localStorage.setItem("selectedKey", "0");
  }
  let keyselected = parseInt(selectedKey);

  useEffect(() => {
    switch (keyselected) {
      case 0:
        navigate("/user/dashboard");
        break;
      case 1:
        navigate("/user/users");
        break;
      // case 2:
      //   navigate("/user/contract");
      //   break;
      case 2:
        navigate("/user/productclass");
        break;

      case 3:
        navigate("/user/brand");
        break;

      case 4:
        navigate("/user/category");
        break;
      case 5:
        navigate("/user/order");
        break;
      case 6:
        navigate("/user/dashproduct");
        break;
      case 7:
        navigate("/user/profile");
        break;
      case 8:
        handleSignOut();
        break;
      default:
        break;
    }
  }, [keyselected]);

  const handleSignOut = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  const handleItemClick = (key) => {
    if (key === "1") {
      navigate("/user/profile");
      localStorage.setItem("selectedKey", "7");
    } else if (key === "2") {
      handleSignOut();
      // onLogout();
      // navigate("/", { replace: true });
    }
  };

  const items = [
    {
      key: "1",
      label: <Space className="pr-6 py-[.5rem]  ">view Profile</Space>,
      icon: <UserOutlined className="pl-4" />,
      onClick: () => handleItemClick("1"),
    },
    {
      key: "2",
      label: <Space className="pr-6 py-[.5rem]">Logout</Space>,
      icon: <LockOutlined className="pl-4" />,
      onClick: () => handleItemClick("2"),
    },
  ];
  useEffect(() => {
    if (
      errprofile &&
      (errprofile.message === "jwt expired, Please login again" ||
        errprofile.message === "jwt malformed, Please login again")
    ) {
      Cookies.remove("token");

      navigate("/");
    }
  }, [errprofile, navigate]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    // const handleResize = () => {
    //   if (window.innerWidth <= 500) {
    //     setCollapsed(true);
    //     setShowSidebar(false);
    //   } else {
    //     setShowSidebar(true);
    //   }
    // };

    const handleResize = () => {
      if (window.innerWidth <= 500) {
        setCollapsed(true);
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
        if (!collapsed) setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <TitleContext.Provider value={titles[selectedKey]}>
      <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
        {showSidebar && (
          <Sider
            collapsible
            collapsed={collapsed}
            defaultCollapsed={true}
            style={
              window.innerWidth > 500
                ? {
                    backgroundColor: "white",
                    marginTop: 64,
                  }
                : {
                    backgroundColor: "white",
                    // overflow: "auto",
                    zIndex: showSidebar ? 50 : -1,
                    position: "fixed",
                    top: 65,
                    left: 0,
                    bottom: 0,

                    transition: "width 0.3s ease",
                  }
            }
            // className="bg-[#FFF] shadow-lg sidebar "
            // trigger={null}
            // collapsible
            // collapsed={collapsed}
            // style={{
            //   // overflow: "auto",
            //   // minHeight: "100%",
            //   backgroundColor: "white",

            //   // borderRight: "1px solid ",
            // }}
          >
            <div className="flex items-center justify-between  ml-2 pr-2 pt-0 mt-0 border  ">
              <Image
                onClick={() => navigate("/", { replace: true })}
                width={200}
                preview={false}
                src={FeliTechLogo_transparent}
              />

              <motion.button>
                <HomeFilled
                  onClick={() => navigate("/", { replace: true })}
                  className="text-primary text-lg m-3"
                  size={90}
                  style={{ color: "green", fontSize: "30px" }}
                />
              </motion.button>
            </div>

            <Menu
              // theme="light"
              // mode="inline"
              defaultSelectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              style={{ color: "black" }}
              className="font-semibold !text-black h-full"
            >
              {Menus.map((item, index) => {
                return (
                  item.roles.includes(userRole) && (
                    <Menu.Item
                      key={index}
                      icon={item.icon}
                      onClick={() => {
                        if (item.name === "Logout") {
                          handleSignOut();
                        } else if (window.innerWidth <= 500) {
                          setCollapsed(!collapsed);
                          toggleSidebar();
                        }
                      }}
                    >
                      <NavLink
                        style={{ color: "black" }}
                        to={`/user/${item.link}`}
                      >
                        {item.name}{" "}
                      </NavLink>
                    </Menu.Item>
                  )
                );
              })}
            </Menu>
          </Sider>
        )}
        <Layout className="overflow-auto scrollbar-hidden bg-light">
          <Header className="fixed z-50 w-[100%] top-0 left- right-0 border shadow-md bg-white !text-primary flex justify-between pl-0 pr-1  md:pr-5">
            <div className="flex items-center pl-2 ">
              <Button
                type="text"
                // icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  setCollapsed(!collapsed);
                  toggleSidebar();
                }}
                style={{
                  fontSize: "30px",
                  width: 50,
                  height: 50,
                  fontWeight: "",
                  color: "#1D6F2B",
                  // backgroundColor: "red",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {collapsed ? (
                  <MenuFoldOutlined size={20} />
                ) : (
                  <CloseSquareFilled size={20} />
                )}
              </Button>

              <TitleDisplay />
            </div>
            <div className="ml-auto flex items-center">
              <Dropdown
                className=" "
                menu={{ items }}
                placement="bottomRight"
                arrow
                overlay={
                  <Menu>
                    {items.map((item) => (
                      <Menu.Item key={item.key} onClick={item.onClick}>
                        {item.icon}
                        {item.label}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <div className="  pr-0 flex justify-end ">
                  {user?.photo || user?.profileImageUrl == "default.jpg" ? (
                    <>
                      <Avatar
                        shape="square"
                        size={50}
                        icon={<UserOutlined />}
                        className="bg-[#1D6F2B] mr-0"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={`${user && user?.photo}`}
                        className=" rounded-full mt-1 mb-1 "
                        alt={user?.firstName}
                      />
                    </>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{
              // padding: '2rem 5rem',
              background: "#f9fafb",
              // textAlign: "center",
              justifyContent: "center",
              // alignItems: "center",
              display: "flex",
            }}
            className="h-full md:py-2 px-2 md:px-5 mt-20"
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </TitleContext.Provider>
  );
};

// TitleDisplay component to consume the dynamic title from context
const TitleDisplay = () => {
  const dynamicTitle = useTitleContext();

  return (
    <h1
      className="font-semibold text-primary text-xl md:text-2xl "
      style={{ marginLeft: "16px" }}
    >
      {dynamicTitle}
    </h1>
  );
};
