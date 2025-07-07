import React, { useState, useEffect, useMemo } from "react";
import Source from "./Source";
// import Sidebar from "./Sidebar.js";
import { Collapse } from "react-bootstrap";
import { useCollapse } from "react-collapsed";
// import useCollapse from "./usecollapse.js";
import Setting_pic from "./assets/icon/settings.png";
import Customer_pic from "./assets/icon/customers_pic.png";
import Deposite_pic from "./assets/icon/deposite.png";
import Withdraw_pic from "./assets/icon/withdraw.png";
import CustomerReport from "./assets/icon/CustomerReport.png";
import DraftCustomers from "./assets/icon/DraftCustomer.png";
import All_Transactions from "./assets/icon/all_transaction.png";
import DraftAccount from "./assets/icon/DraftAccount.png";
import DraftTransaction from "./assets/icon/DraftTransaction.png";
import DraftMoney from "./assets/icon/DraftMoney.png";
import Cash_pic from "./assets/icon/money.png";
import ItemsPic from "./assets/icon/items.png";
import ItemPic from "./assets/icon/item.png";
import StockPic from "./assets/icon/stock.png";
import MoneyType from "./assets/icon/moneytype.png";
import PurchasePic from "./assets/icon/purchase.png";
import SellPic from "./assets/icon/sell.png";
import Down from "./assets/icon/down.png";
import Menu from "./assets/icon/menuu.png";
import Business from "./assets/icon/Business.png";
import Logout from "./assets/icon/logout.png";
import Manager from "./assets/icon/manager.png";
import MoneyPic from "./assets/icon/money.png";
import DashboardPic from "./assets/icon/dashboard.png";
import Wellcom from "./pages/forms/Wellcom";
import AccountPic from "./assets/icon/accounts.png";
import Customers from "./pages/Customers.js";
import Draft_pic from "./assets/icon/draft.png";
import ItemTypePic from "./assets/icon/itemtype.png";
import Transformation from "./assets/icon/transformation.png";
import Retrunpurchasepic from "./assets/icon/returnpurchase.png";
import Retrunsellpic from "./assets/icon/returnsell.png";

import Change from "./assets/icon/changepass.png";
import expand from "./assets/icon/down.png";
import alldraft from "./assets/icon/alldraft.png";
import ThirdDeptDtable from "./pages/ThirdDeptDtable.js";
import "../src/App.css";
import Loading from "./Loading.js";
import { getSettings } from "./pages/Redux/settingSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

export default function SidebarPa({isToggled,setIsToggled}) {
  const handleToggle=()=>{
    setIsToggled((prevState) => !prevState);
  }
  const dispatch = useDispatch();
  const { settings, statuss } = useSelector((state) => state.settings);
  useEffect(() => {
    if (statuss !== "succeeded" && !settings) {
      dispatch(getSettings());
    }
  }, [dispatch, statuss]);
  // console.log(settings);
  const [isReportCollapsed, setIsReportCollapsed] = useState(
    JSON.parse(localStorage.getItem("ReportCollapseState"))
  );
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(
    JSON.parse(localStorage.getItem("transactionCollapseState"))
  );
  const [isDraftExpanded, setIsDraftExpanded] = useState(
    JSON.parse(localStorage.getItem("draftCollapseState"))
  );

  const [isStockExpanded, setIsStockExpanded] = useState(
    JSON.parse(localStorage.getItem("StockCollapseState"))
  );

  const handleReportToggle = () => {
    setIsReportCollapsed((prev) => !prev);
    localStorage.setItem("ReportCollapseState", !isReportCollapsed);
  };
  const handleTransactionToggle = () => {
    setIsTransactionCollapsed((prev) => !prev);
    localStorage.setItem("transactionCollapseState", !isTransactionCollapsed);
  };
  const handleDraftToggle = () => {
    setIsDraftExpanded((prev) => !prev);
    localStorage.setItem("draftCollapseState", !isDraftExpanded);
  };

  const handleStockToggle = () => {
    setIsStockExpanded((prev) => !prev);
    localStorage.setItem("StockCollapseState", !isStockExpanded);
  };
  const TransactionToggleOpen = () => {
    setIsTransactionCollapsed((prev) => false);
    localStorage.setItem("transactionCollapseState", false);
  };
  const DraftToggleOpen = () => {
    setIsDraftExpanded((prev) => false);
    localStorage.setItem("draftCollapseState", false);
  };

  const StockToggleOpen = () => {
    setIsStockExpanded((prev) => false);
    localStorage.setItem("StockCollapseState", false);
  };

  const Close = () => {
    setIsDraftExpanded((prev) => true);
    localStorage.setItem("draftCollapseState", true);
    setIsTransactionCollapsed((prev) => true);
    localStorage.setItem("transactionCollapseState", true);
    setIsStockExpanded((prev) => true);
    localStorage.setItem("StockCollapseState", true);

    setIsReportCollapsed((prev) => true);
    localStorage.setItem("ReportCollapseState", true);
  };
  const CloseforReport = () => {
    setIsDraftExpanded((prev) => true);
    localStorage.setItem("draftCollapseState", true);
    setIsTransactionCollapsed((prev) => true);
    localStorage.setItem("transactionCollapseState", true);
    setIsStockExpanded((prev) => true);
    localStorage.setItem("StockCollapseState", true);
  };
  const CloseTransaction = () => {
    setIsTransactionCollapsed((prev) => true);
    localStorage.setItem("transactionCollapseState", true);
  };
  const CloseReport = () => {
    setIsReportCollapsed((prev) => true);
    localStorage.setItem("ReportCollapseState", true);
  };
  const CloseDraft = () => {
    setIsDraftExpanded((prev) => true);
    localStorage.setItem("draftCollapseState", true);
  };

  const CloseStock = () => {
    setIsStockExpanded((prev) => true);
    localStorage.setItem("StockCollapseState", true);
  };

  return (
    <aside
    id={isToggled || localStorage.getItem('toggle')==='true' ? "sidebar2" : "collapsed2"}
      style={{ 
      backgroundColor: "#4a5cf2", 
      width: "10%", 
      direction: "rtl", // تغییر جهت به راست
      textAlign: "right" // تراز متن به راست
    }}
    className="fw-bold"
    //   id={isToggled.isToggled ? "sidebar" : "collapsed"}
    //   style={{ backgroundColor: "#4a5cf2", width: "15%" }}
    //   className="fw-bold "
    >
      <div className="h-100 " style={{ backgroundColor: "white" }}>
        <div
          className="sidebar-logo m-0 "
          style={{ backgroundColor: "#4a5cf2", height: "3.3rem" }}
        >
          <div className="d-flex justify-between">

          <a href="#" className="w-100 d-flex">{settings[0]?.company_name}</a>
          <button
            className="btn p-0 m-0 mb-6 w-25 d-block d-md-none" // نمایش در موبایل، مخفی در دسکتاپ
            onClick={() => handleToggle()}
            id="sidebar-toggle"
            type="button"
            style={{ 
              marginLeft: localStorage.getItem('language') === 'en' ? '0' : 'auto', // انتقال به سمت راست در حالت rtl
              marginRight: localStorage.getItem('language') === 'en' ? 'auto' : '0', // انتقال به سمت چپ در حالت ltr
            }}
          >
  <img src={Menu} style={{ width: "30px" }} className="p-0 m-0" />
</button>
          </div>
        </div>
        <ul
          className="sidebar-nav pt-0 fs-2 overflow-auto"
          style={{ maxHeight: "95vh" }}
        >
          <li
            className="sidebar-header mt-5 fw-bold fs-4 center"
            style={{ color: "black" }}
          >
            <img
                      src={Source.getAddress()+'/api/getImage/logo.png'}
                      // alt={row.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
            {/* <span  style={{fontSize:"1.8rem"}}>
            <FormattedMessage id="Navbar" />
            </span> */}
          </li>
          <li className="sidebar-item mt-2">
            <a
              href="/"
              className={`sidebar-link ${
                window.location.pathname === "/" &&
                "backgroundblue text-light"
              }`}
              style={{ color: "black" }}
              onClick={Close}
            >
              <div className="d-flex align-items-center gap-2">
              <img src={DashboardPic} alt="" className="navhome"
                //   style={{ width: "20px", height: "20px" }}
              />
              <span className="fs-5">
              <FormattedMessage id="Dashboard" />
              </span>
              </div>
            </a>
          </li>
          <li className="sidebar-item ">
            <a
              onClick={() => {
                handleTransactionToggle();
                CloseDraft();
                CloseStock();
                CloseReport();
              }}
              className={`sidebar-link d-flex align-items-center justify-content-between ${
                localStorage.getItem("transactionCollapseState") === "false"
                  ? "backgroundblue text-light"
                  : ""
              }`}
              style={{
                color: "black",
                // padding: "10px",
                transition: "all 0.3s ease",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={Business}
                  alt=""
                  className="navhome"
                //   style={{ width: "20px", height: "20px" }}x
                />
                <span className="fs-5">
                  <FormattedMessage id="Transactions" />
                </span>                
              </div>
              <img
                src={expand}
                alt="Expand"
                className={`navhome ${
                  isTransactionCollapsed ? "not-rotated" : "rotated"
                }`}
                style={{ width: "15px", height: "15px" }}
              />
            </a>
            <Collapse in={!isTransactionCollapsed}>
              <div className={`list-unstyled ms-4`}>
                {/* <li>
            <a
              href="/alltransactions"
              className={`sidebar-link ${
                window.location.pathname === "/alltransactions" &&
                "bluebackground text-light"
              }`}
              style={{ color: "black", marginLeft: "0.2rem" }}
              onClick={() => {
                localStorage.setItem("transactionExpand", false);
                localStorage.setItem("collapseTransaction", true);
                TransactionToggleOpen();
                CloseDraft();
                CloseReport();
              }}
            >
              <img src={All_Transactions} alt="" className="navhome" style={{ width: '10%', height: '10%' }} />
              All Transactions
            </a>
          </li> */}
                <li>
                  <a
                    href="/transformations"
                    className={`sidebar-link ${
                      window.location.pathname === "/transformations" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black", marginLeft: "0.2rem" }}
                    onClick={() => {
                      localStorage.setItem("transactionExpand", false);
                      localStorage.setItem("collapseTransaction", true);
                      TransactionToggleOpen();
                      CloseDraft();
                    }}
                  >
                    <img
                      src={Transformation}
                      alt=""
                      className="navhome"
                      style={{ width: "10%", height: "10%" }}
                    />
                    <span className="fs-5">
                    <FormattedMessage id="Transformation" />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/deposite"
                    className={`sidebar-link ${
                      window.location.pathname === "/deposite" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black", marginLeft: "0.2rem" }}
                    onClick={() => {
                      localStorage.setItem("transactionExpand", false);
                      localStorage.setItem("collapseTransaction", true);
                      TransactionToggleOpen();
                      CloseDraft();
                    }}
                  >
                    <img
                      src={Deposite_pic}
                      alt=""
                      className="navhome"
                      style={{ width: "10%", height: "10%" }}
                    />
                    <span className="fs-5">
                    <FormattedMessage id="Deposite" />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/withdraw"
                    className={`sidebar-link ${
                      window.location.pathname === "/withdraw" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      TransactionToggleOpen();
                      CloseDraft();
                    }}
                  >
                    <img
                      src={Withdraw_pic}
                      alt=""
                      className="navhome"
                      style={{ width: "13%", height: "13%" }}
                    />
                    <span className="fs-5">
                    <FormattedMessage id="Withdraw" />
                    </span>
                  </a>
                </li>
              </div>
            </Collapse>
          </li>

          <li className="sidebar-item">
            <a
              onClick={() => {
                handleReportToggle();
                CloseDraft();
                CloseStock();
                CloseTransaction();
              }}
              className={`sidebar-link d-flex align-items-center justify-content-between ${
                localStorage.getItem("ReportCollapseState") === "false"
                  ? "backgroundblue text-light"
                  : ""
              }`}
              style={{ color: "black", }}
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={CustomerReport}
                  alt=""
                  className="navhome"
                //   style={{ width: "20px", height: "20px" }}
                />
                <span className="fs-5">
                  <FormattedMessage id="Reports" />
                </span>
              </div>

              <img
                src={expand}
                alt="Expand"
                className={`navhome ${
                  isReportCollapsed ? "not-rotated" : "rotated"
                }`}
                style={{ width: "15px", height: "15px" }}
              />
            </a>

            <Collapse in={!isReportCollapsed} className="collapse">
              <ul className="list-unstyled ms-4">
                <li>
                  <a
                    href="/customerreport"
                    className={`sidebar-link d-flex align-items-center gap-2 ${
                      window.location.pathname === "/customerreport"
                        ? "bluebackground text-light"
                        : ""
                    }`}
                    style={{ color: "black", padding: "8px" }}
                    onClick={() => {
                      localStorage.setItem("ReportExpand", false);
                      localStorage.setItem("collapseReport", true);
                      CloseDraft();
                      CloseforReport();
                    }}
                  >
                    <img
                      src={Deposite_pic}
                      alt="Customer Reports"
                      className="navhome"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span className="fs-5">
                    <FormattedMessage id="Report Customer" />
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="/benefitreport"
                    className={`sidebar-link d-flex align-items-center gap-2 ${
                      window.location.pathname === "/benefitreport"
                        ? "bluebackground text-light"
                        : ""
                    }`}
                    style={{ color: "black", padding: "8px" }}
                    onClick={() => {
                      CloseDraft();
                      CloseforReport();
                    }}
                  >
                    <img
                      src={Deposite_pic}
                      alt="benefit report"
                      className="navhome"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span className="fs-5">
                    <FormattedMessage id="benefit report" />
                    </span>
                  </a>
                </li>
              </ul>
            </Collapse>
          </li>

          <li className="sidebar-item">
            <a
              href="/customers"
              className={`sidebar-link ${
                window.location.pathname === "/customers" &&
                "backgroundblue text-light"
              }`}
              style={{ color: "black" }}
              onClick={Close}
            >
              <img src={Customer_pic} alt="" className="navhome" />
              <span className="fs-5">
              <FormattedMessage id="Customers" />
              </span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="/cash"
              className={`sidebar-link ${
                window.location.pathname === "/cash" &&
                "backgroundblue text-light"
              }`}
              style={{ color: "black" }}
              onClick={Close}
            >
              <img src={Cash_pic} alt="" className="navhome" />
              <span className="fs-5">
              {" "}  <FormattedMessage id="Cash" />
              </span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="/account"
              className={`sidebar-link ${
                window.location.pathname === "/account" &&
                "backgroundblue text-light"
              }`}
              style={{ color: "black" }}
              onClick={Close}
            >
              <img src={AccountPic} alt="" className="navhome" />
              <span className="fs-5">
              <FormattedMessage id="Accounts" />
              </span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="/money_type"
              className={`sidebar-link ${
                window.location.pathname === "/money_type" &&
                "backgroundblue text-light"
              }`}
              style={{ color: "black", marginLeft: "0rem" }}
              onClick={Close}
            >
              <img
                src={MoneyType}
                alt=""
                className="navhome"
                style={{ width: "13%", height: "13%" }}
              />
              <span className="fs-5">
              <FormattedMessage id="Currency" />
              </span>
            </a>
          </li>
          {/* items hide on this */}
          <li className="sidebar-item">
            <a
              onClick={() => {
                handleStockToggle();
                CloseDraft();
                CloseTransaction();
                CloseReport();
              }}
              className={`sidebar-link d-flex align-items-center justify-content-between ${
                localStorage.getItem("StockCollapseState") === "false"
                  ? "backgroundblue text-light"
                  : ""
              }`}
              style={{ color: "black", paddingRight: "4px" }}
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={ItemsPic}
                  alt=""
                  className="navhome"
                  style={{ width: "22px", height: "22px" }}
                />
                <span className="fs-5">
                  <FormattedMessage id="Items" />
                </span>
              </div>
              <img
                src={expand}
                alt="Expand"
                className={`navhome ${
                  isStockExpanded ? "not-rotated" : "rotated"
                }`}
                style={{ width: "15px", height: "15px",  }}
              />
            </a>

            <Collapse in={!isStockExpanded}>
              {/* <ul className="list-unstyled ms-4"  > */}
              <ul className="list-unstyled ms-4" style={{ maxHeight: "450px" }}>
                <li>
                  <a
                    href="/itemtype"
                    className={`sidebar-link ${
                      window.location.pathname === "/itemtype" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      localStorage.setItem("StockExpand", false);
                      localStorage.setItem("collapseStock", true);
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={ItemTypePic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Item Type" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/items"
                    className={`sidebar-link ${
                      window.location.pathname === "/items" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={ItemPic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Items" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/stock"
                    className={`sidebar-link ${
                      window.location.pathname === "/stock" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={StockPic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Stock" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/purchase"
                    className={`sidebar-link ${
                      window.location.pathname === "/purchase" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={PurchasePic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Purchase" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/sell"
                    className={`sidebar-link ${
                      window.location.pathname === "/sell" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={SellPic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Sell" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/purchasereturn"
                    className={`sidebar-link ${
                      window.location.pathname === "/purchasereturn" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={Retrunpurchasepic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Purchase" />{" "}
                    <FormattedMessage id="Return" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/sellreturn"
                    className={`sidebar-link ${
                      window.location.pathname === "/sellreturn" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      StockToggleOpen();
                      // CloseStock();
                    }}
                  >
                    <img src={Retrunsellpic} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Sell" />{" "}
                    <FormattedMessage id="Return" />
              </span>
                  </a>
                </li>
              </ul>
            </Collapse>
          </li>
          <li className="sidebar-item">
            <a
              onClick={() => {
                handleDraftToggle();
                CloseTransaction();
                CloseStock();
                CloseReport();
              }}
              className={`sidebar-link d-flex align-items-center justify-content-between ${
                localStorage.getItem("draftCollapseState") === "false"
                  ? "backgroundblue text-light"
                  : ""
              }`}
              style={{ color: "black", paddingRight: "4px" }}
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={alldraft}
                  alt="Draft Icon"
                  className="navhome"
                  style={{ width: "26px", height: "26px" }}
                />
                <span className="fs-5">
                  <FormattedMessage id="All Draft" />
                </span>
              </div>

              <img
                src={expand}
                alt="Expand"
                className={`navhome ${
                  isDraftExpanded ? "not-rotated" : "rotated"
                }`}
                style={{ width: "15px", height: "15px" }}
              />
            </a>
            <Collapse in={!isDraftExpanded}>
              <ul className="list-unstyled ms-4">
                <li>
                  <a
                    href="/drafttransactions"
                    className={`sidebar-link ${
                      window.location.pathname === "/drafttransactions" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      DraftToggleOpen();
                      CloseTransaction();
                    }}
                  >
                    <img src={DraftTransaction} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Draft Transactions" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/draftcustomer"
                    className={`sidebar-link ${
                      window.location.pathname === "/draftcustomer" &&
                      "bluebackground text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      DraftToggleOpen();
                      CloseTransaction();
                    }}
                  >
                    <img src={DraftCustomers} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Draft Customers" />
              </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/draftmoney"
                    className={`sidebar-link ${
                      window.location.pathname === "/draftmoney" &&
                      "backgroundblue text-light"
                    }`}
                    style={{ color: "black" }}
                    onClick={() => {
                      DraftToggleOpen();
                      CloseTransaction();
                    }}
                  >
                    <img src={DraftMoney} alt="" className="navhome" />
                    <span className="fs-5">
                    <FormattedMessage id="Draft Currency" />
              </span>
                  </a>
                </li>
                {localStorage.getItem("userTokenname") === "admin" && (
                  <li>
                    <a
                      href="/draftaccount"
                      className={`sidebar-link ${
                        window.location.pathname === "/draftaccount" &&
                        "bluebackground text-light"
                      }`}
                      style={{ color: "black" }}
                      onClick={() => {
                        DraftToggleOpen();
                        CloseTransaction();
                      }}
                    >
                      <img src={DraftAccount} alt="" className="navhome" />
                      <span className="fs-5">
                      <FormattedMessage id="Draft Accounts" />
              </span>
                    </a>
                  </li>
                )}
              </ul>
            </Collapse>
          </li>
          <li className="sidebar-item">
            <a
              href="/setting"
              className={`sidebar-link ${
                window.location.pathname === "/setting" &&
                "backgroundblue text-light"
              }`}
              style={{ color: "black" }}
              onClick={Close}
            >
              <img src={Setting_pic} alt="" className="navhome" />
              <span className="fs-5">
              <FormattedMessage id="Settings" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
