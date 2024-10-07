import React, { useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "@ant-design/charts";
import Chart from "react-apexcharts";
import { groupBy } from "lodash";
import { fetchUsers } from "../../../redux/Reducers/usersSlice";
import { useEffect } from "react";
import { useUser } from "../../../context/UserContex";

// percentages for daily and monthly orders and earnings based on weekly and yearly data, respectively.

const isInCurrentWeek = (date) => {
  const currentWeekStart = new Date();
  currentWeekStart.setHours(0, 0, 0, 0);
  currentWeekStart.setDate(
    currentWeekStart.getDate() - currentWeekStart.getDay(),
  );
  return date >= currentWeekStart;
};

export const DashboardTopCard = ({ className }) => {
  const { orders } = useSelector((state) => state.orders);

  const now = new Date();
  const today = new Date(now.setDate(now.getDate()));
  const thisweek = new Date(now.setDate(now.getDate() - 7));
  const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

  const totalDailyOrders = orders.filter(
    (order) =>
      new Date(order.createdAt).getDate() == today.getDate() &&
      new Date(order.createdAt).getMonth() == today.getMonth() &&
      today.getFullYear() == new Date(order.createdAt).getFullYear(),
  ).length;
  const totalDailyEarning = orders
    .filter(
      (order) =>
        new Date(order.createdAt).getDate() == today.getDate() &&
        new Date(order.createdAt).getMonth() == today.getMonth() &&
        today.getFullYear() == new Date(order.createdAt).getFullYear(),
    )
    .reduce((acc, order) => acc + order.amount, 0);

  // const totalWeeklyOrders = orders.filter(
  //   (order) => new Date(order.createdAt) > thisweek
  // ).length;

  const totalWeeklyOrders = orders.filter((order) =>
    isInCurrentWeek(new Date(order.createdAt)),
  ).length;
  // const totalWeeklyEarning = orders
  //   .filter((order) => new Date(order.createdAt) > thisweek)
  //   .reduce((acc, order) => acc + order.amount, 0);
  const totalWeeklyEarning = orders
    .filter((order) => isInCurrentWeek(new Date(order.createdAt)))
    .reduce((acc, order) => acc + order.amount, 0);

  const totalMonthlyOrders = orders.filter(
    (order) =>
      new Date(order.createdAt).getMonth() == today.getMonth() &&
      today.getFullYear() == new Date(order.createdAt).getFullYear(),
  ).length;
  const totalMonthlyEarning = orders
    .filter(
      (order) =>
        new Date(order.createdAt).getMonth() == today.getMonth() &&
        today.getFullYear() == new Date(order.createdAt).getFullYear(),
    )
    .reduce((acc, order) => acc + order.amount, 0);

  const totalYearlyOrders = orders.filter(
    (order) => new Date(order.createdAt).getFullYear() == today.getFullYear(),
  ).length;
  const totalYearlyEarning = orders
    .filter(
      (order) => new Date(order.createdAt).getFullYear() == today.getFullYear(),
    )
    .reduce((acc, order) => acc + order.amount, 0);

  // Calculate percentages
  const dailyOrdersPercentage = (totalDailyOrders / totalWeeklyOrders) * 100;
  const dailyEarningPercentage = (totalDailyEarning / totalWeeklyEarning) * 100;
  const weeklyOrdersPercentage = (totalWeeklyOrders / totalMonthlyOrders) * 100;
  const weeklyEarningPercentage =
    (totalWeeklyEarning / totalMonthlyEarning) * 100;
  const monthlyOrdersPercentage =
    (totalMonthlyOrders / totalYearlyOrders) * 100;
  const monthlyEarningPercentage =
    (totalMonthlyEarning / totalYearlyEarning) * 100;

  const yearlyOrdersPercentage = (totalYearlyOrders / totalYearlyOrders) * 100;
  const yearlyEarningPercentage =
    (totalYearlyEarning / totalYearlyEarning) * 100;

  // Background color based on percentages
  // const dailyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const dailyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const weeklyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const weeklyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const monthlyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const monthlyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const yearlyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;
  // const yearlyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(29, 111, 43, 0.8))`;

  // const dailyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const dailyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const weeklyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const weeklyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const monthlyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const monthlyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const yearlyOrdersBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;
  // const yearlyEarningBgColor = `linear-gradient(to right, rgba(29, 111, 43, 0.5), rgba(255, 255, 255, 1))`;

  const dailyOrdersBgColor = `rgb(230, 244, 254)`;
  const dailyEarningBgColor = `rgb(230, 244, 254)`;
  const weeklyOrdersBgColor = `rgb(230, 244, 254)`;
  const weeklyEarningBgColor = `rgb(230, 244, 254)`;
  const monthlyOrdersBgColor = `rgb(230, 244, 254)`;
  const monthlyEarningBgColor = `rgb(230, 244, 254)`;
  const yearlyOrdersBgColor = `rgb(230, 244, 254)`;
  const yearlyEarningBgColor = `rgb(230, 244, 254)`;

  return (
    <Row gutter={[16, 16]} className="w-full">
      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold text-gray-700 shadow-lg"
          style={{ background: dailyOrdersBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">Daily Orders</h3>
          </div>
          <div className="dashboard-top-card__value">
            Total: {totalDailyOrders}{" "}
            <span style={{ fontSize: "12px", color: "#f4a535" }}>Orders</span>
          </div>
          <div className="dashboard-top-card__subtitle">
            Percentage:{" "}
            {isNaN(dailyOrdersPercentage.toFixed(2))
              ? 0
              : dailyOrdersPercentage.toFixed(2)}
            %
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold text-gray-700 shadow-lg"
          style={{ background: dailyEarningBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              Daily Earnings
            </h3>
          </div>
          <div className="dashboard-top-card__value">
            Amount: {totalDailyEarning}{" "}
            <span style={{ fontSize: "12px", color: "#f75d81" }}> Rwf</span>
          </div>
          <div className="dashboard-top-card__subtitle">
            Percentage:{" "}
            {isNaN(dailyEarningPercentage.toFixed(2))
              ? 0
              : dailyEarningPercentage.toFixed(2)}
            %
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold text-gray-700 shadow-lg"
          style={{ background: weeklyOrdersBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              Weekly Orders
            </h3>
          </div>
          <div className="dashboard-top-card__value">
            Total: {totalWeeklyOrders}{" "}
            <span style={{ fontSize: "12px", color: "#f4a535" }}>Orders</span>
          </div>
          <div className="dashboard-top-card__subtitle">
            Percentage:{" "}
            {isNaN(weeklyOrdersPercentage.toFixed(2))
              ? 0
              : weeklyOrdersPercentage.toFixed(2)}
            %
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold text-gray-700 shadow-lg"
          style={{ background: weeklyEarningBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              {" "}
              Weakly Earnings{" "}
            </h3>
          </div>
          <div className="dashboard-top-card__value">
            Amount: {totalWeeklyEarning}{" "}
            <span style={{ fontSize: "12px", color: "#f75d81" }}> Rwf</span>
          </div>
          <div className="dashboard-top-card__subtitle">
            Percentage:{" "}
            {isNaN(weeklyEarningPercentage.toFixed(2))
              ? 0
              : weeklyEarningPercentage.toFixed(2)}
            %
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold text-gray-700 shadow-lg"
          style={{ background: monthlyOrdersBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              Monthly Orders
            </h3>
          </div>
          <div className="dashboard-top-card__value">
            Total: {totalMonthlyOrders}{" "}
            <span style={{ fontSize: "12px", color: "#f4a535" }}>Orders</span>
          </div>
          <div className="dashboard-top-card__subtitle">
            Percentage:{" "}
            {isNaN(monthlyOrdersPercentage.toFixed(2))
              ? 0
              : monthlyOrdersPercentage.toFixed(2)}
            %
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold text-gray-700 shadow-lg"
          style={{ background: monthlyEarningBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              Monthly Earnings
            </h3>
          </div>
          <div className="dashboard-top-card__value">
            Amount: {totalMonthlyEarning}{" "}
            <span style={{ fontSize: "12px", color: "#f75d81" }}> Rwf</span>
          </div>
          <div className="dashboard-top-card__subtitle">
            Percentage:{" "}
            {isNaN(monthlyEarningPercentage.toFixed(2))
              ? 0
              : monthlyEarningPercentage.toFixed(2)}
            %
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card font-semibold shadow-lg"
          style={{ background: monthlyEarningBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              Yearly Orders
            </h3>
          </div>

          <div className="dashboard-top-card__subtitle">
            Total: {totalYearlyOrders}{" "}
            <span style={{ fontSize: "12px", color: "#f4a535" }}>Orders</span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="dashboard-top-card bg-primary font-semibold shadow-lg"
          style={{ background: monthlyEarningBgColor }}
        >
          <div className="dashboard-top-card__title">
            <h3 className="text-xl font-semibold text-[black]">
              Yearly Earnings
            </h3>
          </div>

          <div className="dashboard-top-card__subtitle">
            Amount: {totalYearlyEarning}{" "}
            <span style={{ fontSize: "12px", color: "#f75d81" }}> Rwf</span>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export const OrdersLineCahrt = () => {
  const { orders } = useSelector((state) => state.orders);
  const now = new Date();
  const today = new Date(now.setDate(now.getDate()));
  const yesterday = new Date(now.setDate(now.getDate() - 1));
  const { user } = useUser();

  const totalYesterdayOrders = orders.filter(
    (order) =>
      new Date(order.createdAt).getDate() == yesterday.getDate() &&
      new Date(order.createdAt).getMonth() == yesterday.getMonth() &&
      yesterday.getFullYear() == new Date(order.createdAt).getFullYear(),
  )?.length;

  const totalDailyOrders = orders?.filter(
    (order) =>
      new Date(order.createdAt).getDate() == today.getDate() &&
      new Date(order.createdAt).getMonth() == today.getMonth() &&
      today.getFullYear() == new Date(order.createdAt).getFullYear(),
  ).length;
  const totalDailyEarning = orders
    .filter(
      (order) =>
        new Date(order.createdAt).getDate() == today.getDate() &&
        new Date(order.createdAt).getMonth() == today.getMonth() &&
        today.getFullYear() == new Date(order.createdAt).getFullYear(),
    )
    .reduce((acc, order) => acc + order.amount, 0);

  const totayesterdayEarnings = orders
    ?.filter(
      (order) =>
        new Date(order.createdAt).getDate() == yesterday.getDate() &&
        new Date(order.createdAt).getMonth() == yesterday.getMonth() &&
        yesterday.getFullYear() == new Date(order.createdAt).getFullYear(),
    )
    .reduce((acc, order) => acc + order.amount, 0);

  const [isgreater, setIsgreater] = useState(false);
  useEffect(() => {
    if (
      totalDailyEarning !== 0 &&
      totayesterdayEarnings !== 0 &&
      totalDailyEarning > totayesterdayEarnings
    ) {
      setIsgreater(true);
    } else {
      setIsgreater(false);
    }
  }, []);

  const [orderdata, setOrderdata] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [],
      },
    },

    // series: isgreater
    //   ? [
    //       {
    //         name: "Today",
    //         data: [],
    //         color: "#78e4a3",
    //       },
    //       {
    //         name: "Yesterday",
    //         data: [],
    //         color: "#0d8ffb",
    //       },
    //     ]
    //   : [
    //       {
    //         name: "Today",
    //         data: [],
    //         color: "#f75d81",
    //       },
    //       {
    //         name: "Yesterday",
    //         data: [],
    //         color: "#0d8ffb",
    //       },
    //     ],

    series: [
      {
        name: "Yesterday",
        data: [],
        color: "#0d8ffb",
      },
      {
        name: "Today",
        data: [],
        color: "#78e4a3",
      },
    ],
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
  });

  useEffect(() => {
    // Calculate today's and yesterday's data
    const now = new Date();
    const today = new Date(now.setDate(now.getDate()));
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    const todayData = [];
    const yesterdayData = [];
    for (let hour = 0; hour < 24; hour++) {
      let todayOrderCount = 0;
      let yesterdayOrderCount = 0;
      orders?.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        if (
          orderDate.getDate() === today.getDate() &&
          orderDate.getHours() === hour &&
          orderDate.getMonth() == orderDate.getMonth() &&
          orderDate.getFullYear() == orderDate.getFullYear()
        ) {
          todayOrderCount++;
        } else if (
          orderDate.getDate() === yesterday.getDate() &&
          orderDate.getHours() === hour &&
          yesterday.getMonth() == yesterday.getMonth() &&
          yesterday.getFullYear() == yesterday.getFullYear()
        ) {
          yesterdayOrderCount++;
        }
      });

      todayData.push(todayOrderCount);
      yesterdayData.push(yesterdayOrderCount);
    }

    // Update state with today's and yesterday's data
    setOrderdata((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: Array.from({ length: 24 }, (_, i) => `${i} h:00`),
        },
      },
      series: [
        {
          ...prevState.series[1],
          data: yesterdayData,
        },
        {
          ...prevState.series[0],
          data: todayData,
        },
      ],
    }));
  }, [orders]);

  return (
    <div className=" ">
      {/* <div className="bg-gradient-to-r  w-[100%]   from-primary  via-icon2 to-primeColor  shadow-lg rounded-md  "> */}
      <div className="w-[100%] rounded-md bg-[#e1e7f1] bg-gradient-to-r pt-5 shadow-lg">
        <Row gutter={[16, 16]} className="mx-2 mt-0">
          <Col sm={24} md={8} className="">
            <p className="mb-1 flex items-center pl-3 text-xl font-semibold text-icon1">
              Orders Vs Hours
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p className="mb-1 text-lg font-semibold text-[#f75d81]">
              Orders / {today.getHours()} h:00
            </p>
            <Statistic
              value={totalDailyOrders}
              valueStyle={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{
                    fontSize: "12px",
                    color: "#f4a535",
                  }}
                >
                  Orders
                </span>
              }
              prefix=" Today:"
            />

            <Statistic
              value={totalYesterdayOrders}
              valueStyle={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{
                    fontSize: "12px",
                    color: "#f4a535",
                  }}
                >
                  Orders
                </span>
              }
              prefix="YesterDay:"
            />
          </Col>
          <Col sm={12} md={8} className="">
            <p className="mb-1 text-lg font-semibold text-[#f75d81]">
              Earnings / {today.getHours()} h:00{" "}
            </p>
            <Statistic
              value={totalDailyEarning}
              valueStyle={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{
                    fontSize: "12px",
                    color: "#f75d81",
                  }}
                >
                  {" "}
                  Rwf
                </span>
              }
              prefix=" Today:"
            />

            <Statistic
              value={totayesterdayEarnings}
              valueStyle={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{
                    fontSize: "12px",
                    color: "#f75d81",
                  }}
                >
                  {" "}
                  Rwf
                </span>
              }
              prefix="YesterDay:"
            />
          </Col>
        </Row>
        <Chart
          options={orderdata.options}
          series={orderdata.series}
          // type="line"
          type="area"
          height={400}
          width="100%"
          style={{
            background: "#e1e7f1",
          }}
        />
      </div>
      <div className="flex justify-between sm:flex-col md:flex-row">
        {user?.role == "admin" && <SellerPieChart />}
        <OrdersBarChart />
      </div>
    </div>
  );
};

export const OrdersBarChart = () => {
  const { orders } = useSelector((state) => state.orders);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const ordersPerDayOfWeek = new Array(7).fill(0);

  orders?.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    if (isInCurrentWeek(orderDate)) {
      const dayOfWeek = orderDate.getDay();
      ordersPerDayOfWeek[dayOfWeek]++;
    }
  });
  // const minOrders = Math.min(...ordersPerDayOfWeek);
  // const minOrdersIndex = ordersPerDayOfWeek.indexOf(minOrders);

  // const colors = new Array(7).fill("#1D6F2B");
  // colors[minOrdersIndex] = "#de5f5f";

  const ordersNotZero = ordersPerDayOfWeek.filter((order) => order > 0);
  const minOrders = Math.min(...ordersNotZero);
  const colors = ordersPerDayOfWeek.map((order) =>
    order === minOrders ? "#de5f5f" : "#1D6F2B",
  );

  const [orderdata, setOrderdata] = useState({
    options: {
      colors: colors,
      title: {
        text: "Weekly Orders",
        align: "center",
        style: {
          fontSize: "20px",
          color: "#263238",
        },
      },

      xaxis: {
        categories: daysOfWeek,
      },
      plotOptions: {
        bar: {
          distributed: true,
          // dataLabels: {
          //   position: "top", // top, center, bottom
          // },
        },
      },
    },
    series: [
      {
        name: "orders",
        data: ordersPerDayOfWeek,
      },
    ],
  });

  useEffect(() => {
    setOrderdata({
      options: {
        xaxis: {
          categories: daysOfWeek,
        },
      },
      series: [
        {
          name: "orders",
          data: ordersPerDayOfWeek,
        },
      ],
    });
  }, [orders]);

  return (
    <div className="mt-5 w-[100%] overflow-auto rounded-lg border bg-[#e1e7f1] px-3 shadow-lg md:w-[58%]">
      <Chart
        options={orderdata.options}
        series={orderdata.series}
        type="bar"
        width="100%"
        height="500"
      />
    </div>
  );
};

export const OrdersBarChart1 = () => {
  const { orders } = useSelector((state) => state.orders);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const ordersPerDayOfWeek = new Array(7).fill(0);
  orders?.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const dayOfWeek = orderDate.getDay();
    ordersPerDayOfWeek[dayOfWeek]++;
  });

  const [orderdata, setOrderdata] = useState({
    options: {
      xaxis: {
        categories: daysOfWeek,
      },
    },
    series: [
      {
        name: "orders",
        data: ordersPerDayOfWeek,
      },
    ],
  });

  return (
    <div className="mt-5 w-[100%] overflow-auto rounded-lg border bg-[#e1e7f1] px-3 shadow-lg md:w-[40%]">
      <Chart
        options={orderdata.options}
        series={orderdata.series}
        type="bar"
        width="400"
        height="500"
      />
    </div>
  );
};

export const SellerPieChart = () => {
  const { orders } = useSelector((state) => state.orders);
  const { loading, users } = useSelector((state) => state.users);
  const groupeduser = groupBy(users, "role");

  const grouped = groupBy(users, "role");

  const options = { labels: Object.keys(grouped) };
  const series = Object.values(grouped).map((users) => users?.length);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div className="mt-5 w-[100%] overflow-auto rounded-lg border bg-[#e1e7f1] px-3 shadow-lg md:w-[40%]">
      <Row gutter={[16, 16]} className="">
        {Object.keys(groupeduser).map((role) => (
          <Col sm={24} md={12} key={role}>
            {/* <p
              style={{ fontSize: "12px", color: "#f75d81" }}
              className="font-semibold text-md mb-1"
            >
              {role}
            </p> */}
            <Statistic
              value={groupeduser[role].length || 0}
              valueStyle={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "black",
              }}
              prefix={`${role}:`}
            />
          </Col>
        ))}
      </Row>

      <Chart
        options={options}
        series={series}
        type="pie"
        width="400"
        height="500"
      />
    </div>
  );
};
