import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettings } from "./Redux/settingSlice";
import { getCustomers } from "./Redux/customerSlice";
import axios from "axios";
import Source from "../Source";
import account from'../assets/dashboard/account.png'
import sell from'../assets/dashboard/sell.png'
import purchase from'../assets/dashboard/purchase.png'
import stock from'../assets/dashboard/stock.png'
import transaction from'../assets/dashboard/transaction.png'
import Expensepic from'../assets/dashboard/expense.svg'
import debit from'../assets/dashboard/debit.png'
import credit from'../assets/dashboard/credit.png'
import transformation from'../assets/dashboard/transformation.png'
import money from'../assets/dashboard/money.png'
import Transformations from "./Transformations/Transformations";
import { getUsers } from "./Redux/userSlice";
import { FormattedMessage } from "react-intl";
import { Checkuser } from "./Checkuser";
import { getSidebars } from "./Redux/sidebarSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { settings, statuss } = useSelector((state) => state.settings);
  const { sidebars,statusSidebar} = useSelector((state) => state.sidebars);
  const { users, statusu } = useSelector((state) => state.users);
  const [dashboardData, setdashboardData] = useState({
    belance: 0,
    sell: 0,
    purchase: 0,
    transaction: 0,
    transformations: 0,
    money:0,
    stock:0,
    debit:0,
    credit:0,
    expense:0,
  });

  useEffect(() => {
    axios
      .get(Source.getAddress() + "/api/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        console.log(res);
        setdashboardData({
          ...dashboardData,
          belance: res.data.belance,
          sell: res.data.sell,
          purchase: res.data.purchase,
          transaction: res.data.transaction,
          transformations: res.data.transformation,
          money:res.data.money,
          stock:res.data.stock,
          debit:res.data.debit,
          credit:res.data.credit,
          expense:res.data.expense,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    if ( statuss === null) {
      dispatch(getSettings());
    }


    if (statusu !== "succeeded" && users.length === 0) {
      dispatch(getUsers());
    }
    if(statusSidebar===null){
      dispatch(getSidebars());
    }
  }, []);

  const cards = [
    {
      title: <FormattedMessage id="Total Accounts" />,
      Show:"Accounts",
      group:"Transaction_Group",
      text: dashboardData.belance,
      img:account,  
      bg: "#0077b6",
      textColor: "white",
      link: "./account",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Total Sells" />,
      Show:"Sell",
      group:"Items_Group",
      text: dashboardData.sell,
      img:sell,
      bg: "#ff70a6",
      link: "./sell",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Total Purchases" />,
      text: dashboardData.purchase,
      Show:"Purchase",
      group:"Items_Group",
      img:purchase,
      bg: "#34a0a4",
      link: "./purchase",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Total transactions :" />,
      text: dashboardData.transaction,
      group:"Transaction_Group",
      Show:"Deposite",
      bg: "#f2542d",
      img:transaction,
      link: "./deposite",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    }
    ,
    {
      title: <FormattedMessage id="Debit" />,
      text: dashboardData.debit,
      group:"Transaction_Group",
      Show:"Deposite",
      bg: "#f2942d",
      img:debit,
      link: "./debit",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Credit" />,
      text: dashboardData.credit,
      group:"Transaction_Group",
      Show:"Deposite",
      bg: "#4D859C",
      img:credit,
      link: "./credit",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Total Transformations" />,
      group:"Transaction_Group",
      Show:"Transformation",
      text: dashboardData.transformations,
      img:transformation,
      link: "./transformations",
      bg: "#3f37c9",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Total Stocks" />,
      Show:"Stock",
      group:"Transaction_Group",
      text: dashboardData.stock,
      img:stock,
      link: "./stock",
      bg: "#e5383b",
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
    {
      title: <FormattedMessage id="Total Moneys" />,
      Show:"Currency",
      text: dashboardData.money,
      img:money,
      link: "./money_type",
      bg: "#42a5f5",  
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },{
      title: <FormattedMessage id="Expenses" />,
      Show:"Expenses",
      text: dashboardData.expense,
      img:Expensepic ,
      link: "./expense",
      bg: "#9925ff",  
      textColor: "white",
      captions: <FormattedMessage id="Sell All" />,
    },
  ];
  return (
    <div className="container py-3">
      <div className="row g-4">
        {cards.map((card, index) => {
          // console.log(sidebars);
          // console.log(index);
          // console.log(sidebars[0][card.Show]);
          if(sidebars[0][card.Show]===0 || sidebars[0][card.group]===0){
            return null;
          }
          return (
          <div className="col-md-4 col-lg-3 " key={index}>
            <div className={`card shadow-sm`} 
              style={{
                color:'white',
                backgroundColor:card.bg,
                backgroundImage: `url(${card.img})`,
                backgroundSize: '80px 45px', // اندازه دقیق تصویر
                backgroundPosition: 'center', // موقعیت تصویر
                backgroundRepeat: 'no-repeat', // جلوگیری از تکرار تصویر
                // width:""
                // border: '2px solid black', // اضافه کردن حاشیه
                // borderRadius: '10px', // گرد کردن گوشه‌ها
              }}
            >
              <div className="fw-bold fs-6 center">{card.title}</div>
              <div className={`card-body bg-gradient `}>
                <div className="d-flex mt-4" style={{justifyContent:"space-between"}}>
                <a
                  className={`card-link mt-3 text-bg-${card.textColor || ""} ${localStorage.getItem("language") === "en" ? "" : "afgFont"}`}
                  // className={`App ${localStorage.getItem("language") === "en" ? "" : "afgFont"}`}
                  style={{
                    // backgroundColor:'red',
                    textDecoration: "none",
                    color: card.textColor || "defaultColor",
                    // margin:'auto'
                  }}
                  href={card.link}
                >
                  {card.captions}
                </a>
                  <p className={`card-text fs-2 ${card.textColor || ""} ${localStorage.getItem("language") === "en" ? "" : "afgFont"}`}>{card.text}</p>
                </div>
              </div>
              {/* <div className="card-body text-center">
              </div> */}
            </div>
          </div>)
        })}
      </div>
    </div>
  );
}
