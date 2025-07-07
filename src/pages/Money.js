import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Source from "../Source";
import Trash from "../assets/icon/trash.png";
import pencil from "../assets/icon/pencil.png";
import AddMoney from "./forms/AddMoney";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import { showAlert } from "../warrper";
import UpdateMoney from "./forms/Updatemoney";
import "./forms/money.css";
import { useSelector, useDispatch } from "react-redux";
import { batchActions } from "redux-batched-actions";
import Datepicker_Customer from "./forms/Datepicker_customer";
import jalaali from "jalaali-js";
import { addBelanceToCache, addMultipleDataToCache, getBelances } from "./Redux/belanceSlice";
import { addMoneyToCache, addProductToServer, getMoneys } from "./Redux/moneysSlice";
import { getCustomers } from "./Redux/customerSlice";
import { getReports } from "./Redux/reportSlice";
import { getItems } from "./Redux/itemSlice";
import { persistor } from "./Redux/store"; // persistor را وارد کنید
import { FormattedMessage, useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert } from "../warrper";

export default function Money({ user, settings }) {
  const dispatch = useDispatch();
  const intl = useIntl();
  const showAlert = useShowAlert();

  const [money, setMoney] = useState([]);
  const [record, setRecords] = useState([]);
  const [exchange, setExchange] = useState([]);
  const [isNewExchange, setIsNewExchange] = useState(true);
  const [Date_End, setDate_end] = useState(new Date().toISOString().slice(0, 10));
  const [EndDate, setEndDate] = useState(null);
  const [add, setAdd] = useState(false);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(false);
  const [select_user, setSelect_user] = useState("");
const [edit,setEdit]=useState({name:''});  
const [money1,setmoney]=useState({name:''});

// ریفرنس‌های مورد نیاز
  const inputRef = useRef(null);
  const updateRef = useRef(null);

  // دریافت لیست ارزها
  useEffect(() => {
    axios
      .get(Source.getAddress() + "/api/money", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: { delete: "0",daily:'ok' },
      })
      .then((res) => {
        setMoney(res.data);
        setRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // دریافت نرخ ارز از سرور
  useEffect(() => {
    axios
      .get(Source.getAddress() + "/api/rate", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: { date:Date_End },
      })
      .then((res) => {
        console.log("Rate response:", res);
        if (res.data) {
          setIsNewExchange(true);
          // اگر هیچ نرخ از سرور دریافت نشد، از اطلاعات record استفاده می‌کنیم
          if (record.length > 0) {
            setExchange(record.map((row,idx) => ({ money_id: row.id, from_amount: res.data[idx]?.money_id===row.id ? res.data[idx].from_amount : 0 })));
          }else{
            setExchange(record.map((row) => ({ money_id: row.id, from_amount: 0 })));
          }
        } else {
          setExchange(res.data);
          setIsNewExchange(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [EndDate, record]);

  // تابع حذف ارز
  const Delete = async (row) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    const result = await swalWithBootstrapButtons.fire({
      title: intl.formatMessage({ id: "Are you sure?" }),
      text: intl.formatMessage({ id: "You won't be able to revert this!" }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: "Yes, delete it!" }),
      cancelButtonText: intl.formatMessage({ id: "No, cancel!" }),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const deleterow = { existense: 1, _method: "put" };
      axios
        .post(Source.getAddress() + "/api/money/" + row.id, deleterow, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: intl.formatMessage({ id: "record successfully deleted!" }),
            showConfirmButton: false,
            timer: 600,
          });
          setRecords(record.filter((a) => a.id !== row.id));
        })
        .catch((err) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: intl.formatMessage({ id: "Something went wrong!" }),
            showConfirmButton: false,
            timer: 600,
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: intl.formatMessage({ id: "Cancelled" }),
        text: intl.formatMessage({ id: "Your record is safe :)" }),
        icon: "error",
      });
    }
  };

  // تابع افزودن ارز
  const Addmoney = async (Money) => {
    Money.user_id=localStorage.getItem('userTokenid');
    try {
      const response = await axios.post(
        `${Source.getAddress()}/api/money`,
        Money,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: { delete: 0 },
        }
      );

      // به‌روزرسانی state ارزها
      setmoney({name:""});  
      setMoney([response.data.money, ...money]);
      setRecords([response.data.money, ...money]);
      showAlert({
        position: "top-end",
        icon: "success",
        title: intl.formatMessage({ id: "Your record has been added!" }),
        showConfirmButton: false,
        timer: 1500,
      });
      // پاکسازی فرم ورودی
      setAdd(false);
    } catch (error) {
      console.error("Error details:", error);
      showAlert({
        position: "top-end",
        icon: "error",
        title: intl.formatMessage({ id: "Not working ,please try again!" }),
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // تغییر کاربر بر اساس انتخاب
  const ChangeUser = (e) => {
    const value = e.target.value;
    if (value !== "all users") {
      const newData = money.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
    } else {
      setRecords(money);
    }
    setSelect_user(value);
  };

  // تابع تغییر مقدار در NumericFormat به همراه اندیس ردیف
  const handleChange = (e, idx) => {
    const formattedValue = e.target.value;
    const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");
    
    setExchange(prev => {
      // Make sure prev is an array before trying to spread it
      if (!Array.isArray(prev)) {
        return prev; // or return a default array if appropriate
      }
      
      const newExchange = [...prev];
      if (newExchange[idx]) {
        newExchange[idx] = {
          ...newExchange[idx],
          from_amount: unformattedValue
        };
      }
      return newExchange;
    });
  };
  // تبدیل تاریخ جلالی به میلادی و تنظیم Date_End
  const handle_date_end = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      // ایجاد یک شیء تاریخ بدون ساعت و دقیقه
      const date = new Date(year, month - 1, day+1);
      // استخراج فرمت YYYY-MM-DD از تاریخ
      const isoDate = date.toISOString().slice(0, 10);
      setDate_end(isoDate);
    }
  };
  

  // ارسال یا به‌روزرسانی نرخ ارز
  const submit = () => {
    const dataToSend = {
      date: Date_End,
      rates: exchange,
      user_id:localStorage.getItem('userTokenid')
    };
    // اگر داده‌های اولیه جدید باشند
    if (isNewExchange) {
      axios
        .post(Source.getAddress() + "/api/rate", dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          showAlert({
            position: "top-end",
            icon: "success",
            title: "Settings updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          showAlert({
            position: "top-end",
            icon: "error",
            title: "Something went wrong!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      // به‌روزرسانی نرخ، افزودن متد _method برای ارسال PUT
      axios
        .post(Source.getAddress() + "/api/rate", dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          showAlert({
            position: "top-end",
            icon: "success",
            title: "Settings updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          showAlert({
            position: "top-end",
            icon: "error",
            title: "Something went wrong!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };
console.log(exchange);  
  return (
    <div
      dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className={`continer w-100 h-100 English ${"iransans"}`}
      onClick={(e) => {
        if (
          e.target.className === "continer w-100 h-100" ||
          e.target.className === "me-auto ms-auto pt-4 pb-4 h-100 w-50"
        ) {
          setAdd(false);
          setUpdate(false);
          setError(false);
        }
      }}
    >
      <div className="row">
        <div className="col-12 col-md-6 pt-4 pb-4">
          <button
            onClick={() => {
              setAdd(true);
              setUpdate(false);
              inputRef.current.select();
              // عنوان دکمه به صورت ثابت باقی می‌ماند
            }}
            type="button"
            className="btn btn-info text-white col m-1 mt-2 ps-2 pe-2 fs-6"
          >
            <FormattedMessage id="Add Currency" />
          </button>
          <div className="d-flex w-100 h-100 m-auto justify-content-between">
            <div
            class="card card-body m-auto mt-3"
            style={{ borderTop: "5px solid #4a5cf2" }}
          >
            <h1 class="text-center rounded m-0 mb-2 p-4 text-light fw-bold bg-info">
              <FormattedMessage id="Table of Currency" />
            </h1>
            <div className="d-flex w-100 h-100 m-auto justify-content-between">
              {/* <select
              id=""
              name="gender"
              onChange={ChangeUser}
              class="form-select h-50 m-auto mb-2"
              style={{ width: "20%" }}
              value={select_user}
            >
              <option value={"all users"} selected>
                All Users
              </option>
              {user.map((item) => (
                <option value={item.name} selected>
                  {item.name}
                </option>
              ))}
            </select> */}
            </div>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table
                style={{
                  minWidth: "350px",
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px 8px", width: "1%" }}>
                      <FormattedMessage id="No" />
                    </th>
                    <th style={{ padding: "12px 8px", width: "3%" }}>
                      <FormattedMessage id="Name" />
                    </th>
                    <th style={{ padding: "12px 8px", width: "3%" }}>
                      <FormattedMessage id="Added By" />
                    </th>
                    <th style={{ padding: "12px 8px", width: "3%" }}>
                      <FormattedMessage id="Delete" />
                    </th>
                    <th style={{ padding: "12px 8px", width: "3%" }}>
                      <FormattedMessage id="Edit" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {record &&
                    record.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid #dee2e6",
                          ":hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                        }}
                      >
                        <td style={{ padding: "12px 8px" }}>{row.id}</td>
                        <td style={{ padding: "12px 8px" }}>{row.name}</td>
                        <td style={{ padding: "12px 8px", width: "5%" }}>
                          {row.user_name}
                        </td>
                        <td style={{ padding: "12px 8px", width: "5%" }}>
                          {!row.ontransaction && (
                            <button
                              style={{
                                border: "none",
                                background: "transparent",
                                padding: "8px",
                                cursor: "pointer",
                                borderRadius: "4px",
                                ":hover": {
                                  backgroundColor: "rgba(0,0,0,0.05)",
                                },
                              }}
                              onClick={() => Delete(row)}
                            >
                              <img
                                style={{
                                  height: "24px",
                                  width: "24px",
                                  "@media (max-width: 768px)": {
                                    height: "32px",
                                    width: "32px",
                                  },
                                }}
                                src={Trash}
                                alt="Delete"
                              />
                            </button>
                          )}
                        </td>
                        <td style={{ padding: "12px 8px", width: "5%" }}>
                          {!row.ontransaction && (
                            <button
                              style={{
                                border: "none",
                                background: "transparent",
                                padding: "8px",
                                cursor: "pointer",
                                borderRadius: "4px",
                                ":hover": {
                                  backgroundColor: "rgba(0,0,0,0.05)",
                                },
                              }}
                              onClick={() => {
                                setUpdate(true);
                                setEdit(row);
                              }}
                            >
                              <img
                                style={{
                                  height: "24px",
                                  width: "24px",
                                  "@media (max-width: 768px)": {
                                    height: "32px",
                                    width: "32px",
                                  },
                                }}
                                src={pencil}
                                alt="Delete"
                              />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {
              <UpdateMoney
                setRecords={setRecords}
                record={record}
                updateRef={updateRef}
                update={update}
                setAdd={setUpdate}
                money={edit}
                setmoney={setEdit}
              />
            }
            {
              <AddMoney
                inputRef={inputRef}
                add={add}
                setError={setError}
                title={'Add Money'}
                setAdd={setAdd}
                error={error}
                Addmoney={Addmoney}
                setmoney={setmoney}
                money={money1}
              />
            }
          </div>
              {/* نمونه استفاده از فیلتر کاربر */}
              {/* <select
                name="user"
                onChange={ChangeUser}
                className="form-select h-50 m-auto mb-2"
                style={{ width: "20%" }}
                value={select_user}
              >
                <option value="all users">All Users</option>
                {user.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select> */}
            </div>
        </div>
        
        <div className="col-12 col-md-6 pt-4 pb-4">
          <Datepicker_Customer
            default_value={EndDate}
            handle_date={handle_date_end}
            lebal={<FormattedMessage id="End" />}
            setSelectedDay={setEndDate}
            selectedDay={EndDate}
          />
          <div
            className="card card-body m-auto"
            style={{ borderTop: "5px solid #4a5cf2" }}
          >
            <h1 className="text-center rounded m-0 mb-2 p-4 text-light fw-bold bg-info">
              <FormattedMessage id="Daily Rate" />
            </h1>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table
                style={{
                  minWidth: "300px",
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px 8px", width: "5%" }}>
                      <FormattedMessage id="No" />
                    </th>
                    <th style={{ padding: "12px 8px", width: "5%" }}>
                      <FormattedMessage id="Currency" />
                    </th>
                    <th style={{ padding: "12px 8px", width: "5%" }}>
                      <FormattedMessage id="To" />{"  "} {record[record?.length-1]?.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {record &&
                    record.map((row, idx) => (
                      
                     row.id!==1 && <tr key={row.id} 
                      style={{
                        borderBottom: "1px solid #dee2e6",
                        ":hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                      }}
                      >
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>
                          <NumericFormat
                            thousandSeparator={true}
                            id="to_amount"
                            className="from-control"
                            value={
                              exchange && exchange[idx]
                                ? exchange[idx].from_amount
                                : ""
                            }
                            style={{ width: "9rem",margin:".2rem" }}
                            placeholder="0"
                            onChange={(e) => handleChange(e, idx)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <button
                onClick={submit}
                type="button"
                className="btn btn-success text-white col m-1 mt-1 ps-2 pe-2 fs-6"
              >
                <FormattedMessage id="update table from amount" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
