import React, { useState, useEffect } from "react";
import Add from "../../assets/icon/add.png";
import axios from "axios";
import Source from "../../Source";
import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";
import { useRef } from "react";
import "./Belance.css";
import Updatemoney from "./Updatemoney";
import { useSelector, useDispatch } from 'react-redux';
import { addBelanceToCache, getBelances ,updateBelanceInCache} from "../Redux/belanceSlice";
import { getMoneys ,updateMoneyInCache} from "../Redux/moneysSlice";
import { getCustomers } from "../Redux/customerSlice";
import { getReports } from "../Redux/reportSlice";


export default function Belance({
  inputRef,
  belancem,
  setbelance,
  close,
  id,
  accountbelance,
  belance1,
  openBelance,
  setEditAccount,
  moneys,
  money,
  setmoney,
  customer,
  setcustomer,
  idprof,
  prof,
  setMoney
}) {
  // const dispatch = useDispatch();
  // const { belances, errorb } = useSelector((state) => state.belances);
  // const { moneys, errorm } = useSelector((state) => state.moneys);
  // const { customers, errorc } = useSelector((state) => state.customers);
 
  const belance = accountbelance;
  // const currentTime = new Date();
  // const currentHours = currentTime.getHours();
  // const currentMinutes = currentTime.getMinutes();
  // const currentYear = currentTime.getFullYear();
  // const currentMonth = (currentTime.getMonth() + 1).toString().padStart(2, "0");
  // const currentDay = currentTime.getDate();
  // const time = "" + currentHours + ":" + currentMinutes;
  // const date = `${currentYear}-${currentMonth}-${currentDay}`;
  const [addreport, setaddreport] = useState({
    user: localStorage.getItem("userTokenid"),
    // delete: "False",
    discription: "",
    amount: "",
    type: "deposite",
    account: 0,
    cash: 0,
    date: "",
  });
  const [moneytype, setmoneytype] = useState("");
  const [updatebelance, setupdatebelance] = useState({
    belance: 0,
    account: 1,
    type: 1,
  });
  const SendReport = () => {
    if (
      addreport.amount != 0 &&
      addreport.amount != null &&
      addreport.type != "" &&
      moneytype != ""
    ) {
      const filteredBelance = accountbelance.filter(
        (item) => item.type === Moneyid
      );
      if (filteredBelance.length === 0) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Something went wrong !",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      let be1 = parseInt(filteredBelance[0].belance);
      let amount = parseInt(addreport.amount);
      let total = 0;
      // if (addreport.type === "deposite") {
      //   total = amount + be1;
      //   filteredBelance[0]["belance"] = total;
      // } else {
      //   total = be1 - amount;
      //   filteredBelance[0]["belance"] = total;
      // }
      // setupdatebelance({
      //   ...updatebelance,
      //   type: parseInt(filteredBelance[0]["type"]),
      //   belance: parseInt(filteredBelance[0]["belance"]),
      //   account: parseInt(filteredBelance[0]["account"]),
      // });
      const uploadData = new FormData();
      let addRe={
      user_id: localStorage.getItem("userTokenid"),
      discription: "",
      amount: "",
      type: "deposite",
      account_id: 0,
      isdelete: 0,
      cash: 0,
      date_created: ""}
    addRe.discription=addreport.discription;
    addRe.amount=addreport.amount;
    addRe.type=addreport.type;
    addRe.account_id=addreport.account;
    addRe.cash=addreport.cash;
    let date =new Date();
    addRe.date_created=date.toISOString();
    // console.log(addRe);
      axios
        .post(`${Source.getAddress()}/api/report/`, addRe, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
          },
        })
        .then((response) => {
          setmoneytype('');
          setFormattedValue('');
          setaddreport({
            user: localStorage.getItem("userTokenid"),
            // delete: "False",
            discription: "",
            amount: "",
            type: "deposite",
            account: 0,
            cash: 0,
            date: "",
          });
          let add_cash = response.data.belance;
          let update_money = response.data.moneys;
          setbelance(
            belance.map((a) => (a.id === add_cash.id ? add_cash : a))
          );
          setshowbelance(
            showbelance.map((a) => (a.id === add_cash.id ? add_cash : a))
          );
          // dispatch(updateBelanceInCache(add_cash));
          // dispatch(updateMoneyInCache(update_money));
          setEditAccount(
            accountbelance.map((a) => (a.id === add_cash.id ? add_cash : a))
          )
          
          // const filteredMoney = money.filter(
          //   (item) => item.id === filteredBelance[0]["type"]
          // );
          // // money
          // let cash_primary = parseInt(filteredMoney[0]["cach"]);
          // let money_update = {
          //   cach: cash_primary,
          // };
          // if (addreport.type === "deposite") {
          //   money_update.cach += amount;
          // } else {
          //   money_update.cach -= amount;
          // }

          // const filteredMoney = money.filter(
          //   (item) => item.id === filteredBelance[0]["type"]
          // );
          // // money
          // let cash_primary = parseInt(filteredMoney[0]["cach"]);
          // let money_update = {
          //   cach: cash_primary,
          // };
          // uploadData.append("user", localStorage.getItem("userTokenid"));
          // uploadData.append("isdelete", "False");
          // uploadData.append("type", parseInt(filteredBelance[0]["type"]));
          // uploadData.append("belance", parseInt(filteredBelance[0]["belance"]));
          // uploadData.append("account", parseInt(filteredBelance[0]["account"]));
          // uploadData.append("ontransaction", "True");
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Add successfully!",
                    showConfirmButton: false,
                    timer: 600,
                  });         
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "something went wrong !",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "You must full amount money type and type inputs !",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // dispatch(getBelances());
    // dispatch(getMoneys());
    // dispatch(getReports());
  };

  const handlereport = (e) => {
    setaddreport({
      ...addreport,
      [e.target.name]: e.target.value,
      user: parseInt(localStorage.getItem("userTokenid")),
    });
  };
  const [Moneyid,setMoneyid]=useState('');
  const handleType = (e) => {
    const filteredBelance = belance.filter(
      (item) => item.moneyType === e.target.value
    );
    setMoneyid(filteredBelance[0].type);
    setmoneytype(e.target.value);
    setaddreport({
      ...addreport,
      account: filteredBelance[0].id,
    });
  };

  let Accountbelance = accountbelance;
  // const [money, setmoney] = useState(moneys);
  let valaidmoney = [];
  const [showbelance, setshowbelance] = useState([]);
  // console.log(money);
  // console.log(accountbelance);
  const algorithm = () => {
    // بررسی اینکه آیا money آرایه‌ای معتبر است
    if (Array.isArray(money) && money.length > 0) {
      const valaidmoney = [];
  
      money.forEach((el) => {
        // بررسی اینکه آیا el.id مقدار معتبر دارد
        if (el && el.id !== undefined && el.id !== null) {
          if (Array.isArray(accountbelance) && accountbelance.length > 0) {
            // بررسی اینکه آیا el.id در accountbelance وجود دارد
            const isExistInAccount = accountbelance.some(
              (element) => element.type_id === el.id
            );
  
            // اگر در accountbelance وجود نداشت، به valaidmoney اضافه شود
            if (!isExistInAccount) {
              valaidmoney.push(el);
            }
          } else {
            // اگر accountbelance خالی باشد، تمام مقادیر money اضافه شوند
            valaidmoney.push(el);
          }
        }
      });
  
      // به‌روزرسانی state تنها در صورتی که valaidmoney دارای داده باشد
      setshowbelance(valaidmoney.length > 0 ? valaidmoney : []);
    } else {
      console.warn("Invalid money array or empty array.");
    }
  };
  
    
  const [addmoneybelance, setmoneybelance] = useState({
    belance: 0,
    account: 0,
    type: 0,
    delete: "False",
    user: 0,
  });
  const handleAll = (e) => {
    setmoneybelance({
      ...addmoneybelance,
      [e.target.name]: e.target.value,
    });
  };
  // useEffect(() => {
  //   axios.get(Source.getAddress() + '/api/money', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 0,
  //     },
  //   }).then((res)=>{
  //     // console.log(res);
  //     setmoney(res.data);
  //     // setRecords(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
    // axios
    //   .get(Source.getAddress() + "/api/money/", {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("access")}`,
    //     },params: {
    //       delete: 0,
    //     }
    //   })
    //   .then((res) => {
    //     setmoney(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "error",
    //       title: "System can not give the money list !",
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //   });
  // }, []);

  const addmoney = (type_money) => {
    let add = {
      id: 0,
      account: 1,
      type: 1,
      user: 0,
      belance: 0,
      delete: "False",
      moneyType: "",
    };
    setmoneybelance({
      ...addmoneybelance,
      type: type_money.id,
    });
    const uploadData = new FormData();
    uploadData.append("isdelete", "False");
    uploadData.append("user", localStorage.getItem("userTokenid"));
    uploadData.append("type", type_money.id);
    uploadData.append("account", id);
    const date = new Date();
    let addbelance = {
      isdelete: 0,
      user_id: localStorage.getItem("userTokenid"),
      type_id: type_money.id,
      account_id: id,
      belance:"0",
      date_created:date.toISOString()
    };
    axios
      .post(Source.getAddress() + "/api/belance", addbelance, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        add = res.data.belance;
        setEditAccount([...accountbelance, add]);
        setshowbelance((pre) =>
          pre.filter((item) => item.id !== add.id)
        );
        // dispatch(addBelanceToCache(add));
        // let update_customer={
        //   ontransaction:1
        // }
        // uploadData.append("user", customer.user);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Updated successfully!",
                  showConfirmButton: false,
                  timer: 600,
                });         
        // uploadData.append("name", customer.name);
        // uploadData.append("ontransaction", "True");
       })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Something went wrong !",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const [formattedValue, setFormattedValue] = useState("");
  // const [unformattedValue, setUnformattedValue] = useState("");

  const handleChange = (e) => {
    let datetime = new Date();
    const jalaliDate12 = {
      year: datetime.getFullYear(),
      month: datetime.getMonth() + 1,
      day: datetime.getDay(),
    };
    const { year, month, day } = jalaliDate12;
    const t = new Date();
    const date = new Date();
    const isoString = date.toISOString();
    const formattedValue = e.target.value;
    const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");
    setFormattedValue(formattedValue);
    setaddreport({
      ...addreport,
      amount: unformattedValue,
      date: isoString,
    });
  };
  return (
    <div
      className={`container rounded-5 pe-0 ps-0 resB popup ${
        openBelance ? "show" : ""
      }`}
    >
      <div className="d-flex justify-content-end p-0 m-0">
        <button
          type="button"
          className="btn-close align-self-end p-3 m-1 mt-0 hover_btn"
          onClick={close}
          aria-label="Close"
        ></button>
      </div>
      <div
        className=" bg-white container mt-0 p-1 pt-0 col-lg-8 rounded-5"
        style={{ width: "94%" }}
      >
        <h1
          className="text-center rounded m-0 p-4 text-light mt-0"
          style={{ backgroundColor: "var(--bs-info)" }}
        >
          Availability
        </h1>
        <div className="balance-container row mt-4 p-4 pb-0 mb-0">
          {accountbelance &&
            accountbelance.map((row) => (
              <div className="col-12 col-md-3 mb-3" key={row.id}>
                <div
                  className="card border-0"
                  style={{ color: "white", backgroundColor: "#5394a1" }}
                >
                  <div className="card-body py-4">
                    <h5 className="mb-2 fw-bold text-capitalize">
                      {row.moneyType}
                    </h5>
                    <p className="mb-2 fw-bold">{row.belance} Available</p>
                  </div>
                </div>
              </div>
            ))}
          <div className="col-12 col-md-3 mb-3">
            <div
              className="card border-0"
              style={{ color: "white", backgroundColor: "#5394a1" }}
            >
              <div
                className="btn-group dropdown"
                style={{ color: "white", backgroundColor: "#5394a1" }}
              >
                <button
                  type="button"
                  onClick={() => algorithm()}
                  className="btn btn-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: "white", backgroundColor: "#5394a1" }}
                >
                  <p>Add Balance</p>
                  <img
                    src={Add}
                    alt="Add"
                    style={{ height: "40%", width: "20%" }}
                  />
                </button>
                <ul className="dropdown-menu pe-5">
                  {showbelance.length > 0 ? (
                    showbelance.map((row) => (
                      <li key={row.id}>
                        <button
                          onClick={() => {
                            addmoney(row);
                          }}
                          className="dropdown-item fw-bold"
                          type="button"
                        >
                          {row.name}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <button className="dropdown-item fw-bold" type="button">
                        Empty
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <form className="form-section col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent pt-0 mt-0 mb-0">
          <div className="col-12 col-md-4 m-2 mt-3 ps-2 p-0">
            <div className="form-floating">
              <textarea
                name="discription"
                ref={inputRef}
                onChange={(e) => {
                  handlereport(e);
                }}
                value={addreport.discription}
                className="form-control h-50 px-5"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
              ></textarea>
              <label htmlFor="floatingTextarea2">Description</label>
            </div>
          </div>
          <div className="col-12 col-md-2 m-2 mb-3 mt-3 p-0 px-3">
            <label for="price">Amount</label>
            <NumericFormat
              thousandSeparator={true}
              name="amount"
              className="form-control"
              value={formattedValue}
              placeholder="0"
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-2 m-2 mt-3 px-3">
            <label htmlFor="category">Money Type</label>
            <select
              name="type1"
              id="category"
              onChange={handleType}
              value={moneytype}
              className="form-select"
            >
              <option value="" disabled>
                Select
              </option>
              {accountbelance &&
                accountbelance.map((row) => (
                  <option key={row.id} value={row.moneyType}>
                    {row.moneyType}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-12 col-md-2 m-2 mt-3 px-3">
            <label htmlFor="category">Type</label>
            <select
              name="type"
              id="category"
              onChange={handlereport}
              value={addreport.type}
              className="form-select"
            >
              <option value="deposite">Deposite</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
          <div className="col-12 col-md-1 p-0 mt-3">
            <button
              onClick={SendReport}
              type="button"
              className="btn btn-success w-100 mt-4"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
