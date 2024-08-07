import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa6";

import { Card, Badge, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { statusColors } from "../../../../common/statuscolor";
import { BiBuildingHouse } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { FaPhone } from "react-icons/fa6";
import { format, formatDistanceToNow } from "date-fns";
import { useUser } from "../../../../context/UserContex";
import { ActionMenuButton } from "../../Button/AvtionButton";
import { DeleteFilled, EyeFilled, EditFilled } from "@ant-design/icons";
import { UpdateOrderStatus } from "../Order/updateorderstatus";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { set } from "js-cookie";
const OrderCard = ({ order }) => {
  const user = useUser().user;
  const [orderstatus, setOrderstatus] = useState(order.status);
  const navigate = useNavigate();
  const [orderid, setOrderid] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copy, setCopy] = useState({
    value: order.id,
    copied: false,
  });
  const { orders, loadorders, errorders } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    setCopy({ value: order.id, copied: false });
  }, []);

  const formattedDate = format(order.createdAt, "PPpp"); // e.g., "June 20th, 2020, 4:30 PM"
  const timeAgo = formatDistanceToNow(order.createdAt, { addSuffix: true }); // e.g., "about 2 months ago"

  const openModal = async (state, id) => {
    setOrderid(id);
    setIsModalOpen(state);
  };
  const getItems = (record) => [
    // {
    //   label: <span className="font-bold text-primary">View</span>,
    //   key: "view",
    //   icon: <EyeFilled className=" text-icon1 mr-2" />,
    //   onClick: () => {
    //     navigate(`${record.key}`);
    //   },
    // },
    // || user?.role == "customer"
    user?.role == "admin" && {
      label: <span className="font-bold text-primary">Update</span>,
      key: "edit",
      icon: <EditFilled className=" text-icon2 mr-2" />,
      onClick: async () => {
        await openModal(true, record);
      },
    },
  ];

  const handleupdatestate = async (id, status) => {
    const updatedOrder =
      (await orders) && orders.find((order) => order.id === id);
    setOrderstatus(status);
    // setFilteredData((prevData) =>
    //   prevData.map((orderItem) => {
    //     if (orderItem.key === id) {
    //       return {
    //         ...orderItem,
    //         status: status,
    //       };
    //     }
    //     return orderItem;
    //   })
    // );
  };

  return (
    <Card
      className="order-card mb-3 cursor-pointer bg-[#f5fafc]"
      onClick={() => navigate(`${order.id}`)}
    >
      <div>
        {" "}
        <div className="order-header md:flex md:space-x-3">
          <span className=" font-semibold  block md:flex ">
            <span className="flex space-x-4">
              {" "}
              <span> #{order.id}</span>
              <CopyToClipboard
                text={order.id}
                onCopy={(e) => {
                  setCopy({ value: order.id, copied: true });
                }}
              >
                <FaRegCopy
                  size={30}
                  className=" rounded-full cursor-pointer  text-primary hover:text-white hover:bg-primary p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCopy({ value: order.id, copied: true });
                  }}
                />
              </CopyToClipboard>
              {/* {copy.copied ? (
                <span style={{ color: "red" }}>Copied.</span>
              ) : null} */}
            </span>
            <p className="ml-0 md:ml-5">
              {user?.role == "admin" &&
                order?.momo_payload &&
                order?.momo_payload?.fullname}
            </p>
          </span>

          <Tag
            color={statusColors[orderstatus]}
            style={{ color: "white", fontWeight: "bold" }}
            className="capitalize"
          >
            {/* {order.status} */}

            {orderstatus}
          </Tag>
        </div>
        <div className="order-header flex my-3 space-x-3">
          {order?.payment_type && (
            <span className="flex">
              #payment -{" "}
              <p className="font-semibold ml-2">{order?.payment_type?.type}</p>
            </span>
          )}

          <Tag
            style={{ color: "black", fontWeight: "bold" }}
            className="capitalize  !text-white  !bg-primary"
          >
            {order.items.length} items
          </Tag>
        </div>
        <div className="order-body  my-5">
          <d className=" block md:flex space-y-3 md:space-y-0 md:space-x-2 ">
            <div className="flex space-x-2">
              {" "}
              <span className="flex ">
                <BiBuildingHouse size={20} />
                <p className="">{order.shippingAddress.country}</p>
              </span>
              <span className="flex">
                <IoLocationSharp size={20} />
                <p className="">
                  {order.shippingAddress.province} -{" "}
                  {order.shippingAddress.district}
                </p>
              </span>
            </div>

            <div className="flex space-x-2">
              {user?.role == "admin" && (
                <span className="flex">
                  <FaPhone size={20} />
                  <p className="">{order.shippingAddress.phoneNumber}</p>
                </span>
              )}

              <span className="flex">
                <TbTruckDelivery size={20} />

                <Tag
                  style={{ color: "black", fontWeight: "bold" }}
                  className="capitalize !font-semibold !text-white !bg-primary "
                >
                  <p className="">{order.deliveryPreference}</p>
                </Tag>
              </span>
            </div>
            {user?.role == "admin" && (
              <span className="flex">
                <IoPersonSharp size={20} />
                <p className="">
                  {order?.momo_payload && order?.momo_payload?.fullname}
                </p>
              </span>
            )}
          </d>
        </div>
        <Tag
          style={{ color: "black", fontWeight: "" }}
          className="capitalize !font-semibold !text-primary !p-3"
        >
          <span>{formattedDate}</span> <span>{timeAgo}</span>
        </Tag>{" "}
      </div>
      <UpdateOrderStatus
        setModel={isModalOpen}
        order={order.id}
        openModal={openModal}
        handleupdatestate={handleupdatestate}
      />

      {user?.role == "admin" && (
        <div
          className="absolute top-5 right-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {" "}
          <ActionMenuButton items={getItems(order)} />
        </div>
      )}
    </Card>
  );
};

export default OrderCard;
