import React, { useState, useEffect, useMemo } from "react";
import { gregorianToJalali } from "shamsi-date-converter";
import Alert from "./forms/Alert";
import Datepicker from "./forms/Datepicker";
import Datepicker_Customer from "./forms/Datepicker_customer";
import Datepicker_start from "./forms/Datepicker_start";
import DataTable from "react-data-table-component";
import axios from "axios";
import AccountEdit from "./CustomersEdit";
import Add from "../assets/icon/add.png";
import Trash from "../assets/icon/trash.png";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Belance from "./forms/Belance";
import AddAccount from "./AddAccount";
import ComboBox from "./forms/ComboBox";
import Source from "../Source";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import { NumericFormat } from "react-number-format";
import Edit_ThirdDepttable from "./forms/Edit_ThirdDepttable";
import { Calendar } from "react-modern-calendar-datepicker";
import * as shamsi from "shamsi-date-converter";
// import DatePicker from "react-modern-calendar-datepicker";
import { utils } from "react-modern-calendar-datepicker";
import { FormattedMessage,useIntl } from "react-intl";
import ComboBoxDeposite from "./Transformations/ComboBoxDeposite";
import ListBox from "./forms/ListBox";
import { useShowAlert  } from "../warrper";
// import { FormattedMessage,useIntl } from "react-intl";

const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with thousand separators
};

export default function ThirdDeptDtable({
  // deposite,
  belance,
  Cash,
  user,
  // settings,
  setCash,
  setbelance,
  accounts,
  setAccounts,
  money,
  setMoney,
}) {
  const showAlert=useShowAlert();
  const { settings, statuss } = useSelector((state) => state.settings);
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const [namesearch, setnameSearch] = useState();
  const [Date_Start, setDate_start] = useState();
  const [Date_End, setDate_end] = useState();
  const { formatMessage } = useIntl();
  const handle_date_start = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );

      // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setDate_start(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handle_date_end = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );

      // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setDate_end(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handleName = (e) => {
    setnameSearch(e.target.value);
  };
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };
  const buttonRef = useRef(null);
  const inputRef = useRef(null); // Create a ref for the input field
  const [deposite, setdeposite] = useState();
  console.log(localStorage.getItem("cashid"));
  // const [cachid, setcachid] = useState("");
  // let cach = 0;
  // useEffect(() => {
    // cach = localStorage.getItem("cashid");
    
  //   const startDate = new Date(); // Start date
  //   const endDate = new Date(); // End date
  //   startDate.setDate(startDate.getDate() - 30);
  //   endDate.setDate(endDate.getDate() + 1);
  //   let cash = [];
  //   if (localStorage.getItem("cashid")) {
      // axios
      //   .get(Source.getAddress() + "/api/report/", {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
      //       // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
      //     },
      //     params: {
      //       startDate: startDate,
      //       endDate: endDate,
      //       moneyid: cach,
      //       delete: "False",
      //     },
      //   })
      //   .then((res) => {
      //     setdeposite(res.data); // This will contain filtered data from the server
      //   })
      //   .catch((err) => {
      //     // console.error("Error getting report:", err);
      //   });
  //   }
  // }, [setdeposite]);

  let name = [];
  const [selectedDay, setSelectedDay] = useState(moment());
  const [open, setopen] = useState(true);
  const [alert, setalert] = useState(false);
  const [records, setRecords] = useState();
  const persianToday = utils("fa").getToday();
  const [Ddate, setDdate] = useState(null);
  const [de_id, setde_id] = useState(0);
  const [report_delete, Setreport_delete] = useState({
    account: 15,
    date: "2024-05-15T15:41:44.888608Z",
    amount: 0,
    discription: "",
    type: "deposite",
    cash: 0,
    delete: "True",
  });
  const delete_report = async (row) => {
    setOpenEdit(false);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: intl.formatMessage({id:"Are you sure?"})
              ,
              text:intl.formatMessage({id:"You won't be able to revert this!"})
              ,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: intl.formatMessage({id:"Yes, delete it!"})
              ,
              cancelButtonText: intl.formatMessage({id:"No, cancel!"})
              ,
              reverseButtons: true,
  });

    if (result.isConfirmed) {
      let update = {
        isdelete: 1,
      };

      axios
        .put(Source.getAddress() + `/api/report/${row.id}`, update, {
          params: { type: "delete" },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          },
        })
        .then((res) => {
          Swal.fire({
            position: "center",
            icon: "success",
            // title: "Deposite record successfully deleted !",
            title: 
            `Deposit ${intl.formatMessage({id:"record successfully deleted!"})}`
            ,
            showConfirmButton: false,
            timer: 600,
          });
          // console.log(e);
          setRecords((prevRecords) =>
            prevRecords.filter((record) => record.id !== row.id)
          );
          // setCash((prevCash) =>
          //   prevCash.map((a) =>
          //     a.id === res.data.moneys.id ? res.data.moneys : a
          //   ));
          setbelance((prevBelance) =>
            prevBelance.map((a) =>
              a.id === res.data.belance.id ? res.data.belance : a
            )
          );
          // dispatch(updateBelanceInCache(res.data.belance));
          // dispatch(updateReportInCache(res.data.report_belance));
          // dispatch(updateMoneyInCache(res.data.moneys));
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: intl.formatMessage({id:"Deposite record not deleted!"})
            ,
            showConfirmButton: false,
            timer: 600,
          });
        });
      // } catch (err) {
      // }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        position: "center",
        icon: "error",
        text:intl.formatMessage({id:"Your record is safe :)"}) ,
        showConfirmButton: false,
        timer: 600,
      });
    }
  };

  const [moneytype, setmoneytype] = useState(0);

  const [idbelance, setidbelance] = useState(0);
  const [selectedBelance, setselectedBelance] = useState({
    id: 0,
    account_name: "",
    moneyType: "",
    account: 0,
    moneyId: 0,
    user: 0,
    type: 0,
    belance: 0,
    date_created: "",
  });
  const [openBelance, setOpenBelance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [id, setId] = useState("");
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [username, setusername] = useState("");
  const [moneyname, setmoneyname] = useState("");
  const [AddDeposite, setAddDeposite] = useState({
    user: 0,
    discription: "",
    amount: 0,
    date: new Date().toISOString(),
    account: 0,
    type: "deposite",
    cash: 0,
    delete: "False",
  });
  const filterDeposite = () => {
    // console.log(StartDate);    2024-05-29
    const startDate = new Date(
      `${StartDate.year}-${StartDate.month}-${StartDate.day}`
    ); // Start date
    const endDate = new Date(`${EndDate.year}-${EndDate.month}-${EndDate.day}`); // End date
    endDate.setDate(endDate.getDate() + 1);
    const type = "deposite";
    axios
      .get(Source.getAddress() + "/api/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },
        params: {
          startDate: startDate,
          endDate: endDate,
          delete: "False",
          moneyid: localStorage.getItem("cashid"),
        },
      })
      .then((res) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Deposite Table filterd successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setRecords(res.data); // This will contain filtered data from the server
        // console.log(res.data);
      })
      .catch((err) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Something went wrong !",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const primaryw = () => {
    // const record= Cash.filter((item)=>{item.id==moneytype});
    if (selectedBelance.belance === "0") {
      return -parseInt(AddDeposite.amount);
    } else {
      let money = parseInt(AddDeposite.amount);
      let primar = parseInt(selectedBelance.belance);
      let sum = primar - money;
      return sum;
    }
  };

  const updatemoneyw = () => {
    const record = Cash.find((item) => item.id === moneytype);
    if (record) {
      let money = parseInt(AddDeposite.amount);
      let primmoney = parseInt(record.cach);
      let sum = primmoney - money;
      return { name: record.name, cash: sum, user: record.user };
    } else {
      // Handle the case when record is undefined
      return { name: "", cash: 0 };
    }
  };

  const primary = () => {
    if (selectedBelance.belance === "0") {
      return AddDeposite.amount;
    } else {
      let primar = parseInt(selectedBelance.belance);
      primar += parseInt(AddDeposite.amount);
      return primar;
    }
  };
  const updatemoney = () => {
    console.log(moneytype);
    const record = Cash.find((item) => item.id === moneytype);
    if (record) {
      let money = parseInt(AddDeposite.amount);
      let primmoney = parseInt(record.cach);
      let sum = primmoney + money;
      return { name: record.name, cash: sum, user: record.user };
    } else {
      // Handle the case when record is undefined
      return { name: "", cash: 0 };
    }
  };

  const SumbitReport = () => {
    // dispatch(getReports());
    // dispatch(getBelances());
    // dispatch(getMoneys());
    if (AddDeposite.amount !== 0 && AddDeposite.account !== 0) {
      // let dd = new Date();
      // const pri = primary();
      // const moneyinsert = updatemoney();
      // const uploadDatamoney ={
      //   "cach":parseInt(moneyinsert.cash),
      //   "ontransaction":1
      // }
      // const uploadData = {
      //   belance:String(pri),
      //   ontransaction:1
      // }
      let add_deposite = {
        user_id: localStorage.getItem("userTokenid"),
        discription: "",
        amount: 0,
        date_created: null,
        account_id: 0,
        type: "deposite",
        cash: 0,
        // isdelete: 0,
      };

      // add_deposite.user_id = AddDeposite.user;
      add_deposite.amount = AddDeposite.amount;
      add_deposite.discription = AddDeposite.discription;
      add_deposite.date_created = AddDeposite.date;
      add_deposite.account_id = AddDeposite.account;
      add_deposite.type = AddDeposite.type;
      // add_deposite.cash = moneyinsert.cash;
      const date = new Date();
      const isoString = date.toISOString();
      add_deposite.isdelete = 0;
      let submitdeposite = AddDeposite;
      setAddDeposite({
        user_id: localStorage.getItem("userTokenid"),
        discription: "",
        amount: "",
        date: isoString,
        account_id: 0,
        type: "deposite",
        cash: 0,
        // isdelete: 0,
      });
      axios
        .post(`${Source.getAddress()}/api/report`, add_deposite, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          },
        })
        .then((response) => {
          let add = {
            id: 0,
            user_name: "",
            moneyType: "",
            customer: "",
            user_id: 0,
            discription: "",
            amount: 0,
            date_created: null,
            account_id: 0,
            type: "deposite",
            cash: 0,
            // isdelete: 0,
            account_id: 0,
            moneyId: 0,
          };
          add.id = response.data.report;

          add.account = submitdeposite.account;
          add.user_id = localStorage.getItem("userTokenid");
          add.discription = submitdeposite.discription;
          add.amount = submitdeposite.amount;
          add.date = submitdeposite.date;
          add.account = submitdeposite.account;
          add.type = submitdeposite.type;
          // add.cash = moneyinsert.cash;
          // add.isdelete = AddDeposite.isdelete;
          add.customer = username;
          add.user_name = localStorage.getItem("userToken");
          add.moneyType = moneyname;
          setRecords([add, ...records]);
          showAlert({
            position: "top-end",
            icon: "success",
            title: <FormattedMessage id="Your record has been added!" />,
            showConfirmButton: false,
            timer: 1000,
          });
          setSelectedOption("");
          // setAddDeposite({
          //   ...AddDeposite,
          //   user: 0,
          //   discription: "",
          //   amount: 0,
          //   date: isoString,
          //   account: 0,
          //   type: "deposite",
          //   cash: 0,
          //   // isdelete: "False",
          // });
          setFormattedValue("");
          setSelectedDay(moment());
          let add_cash = response.data.belance;
          // add_cash.id = selectedBelance.id;
          // add_cash.account_name = selectedBelance.account_name;
          // add_cash.moneyId = selectedBelance.moneyId;
          // add_cash.moneyType = selectedBelance.moneyType;
          // add_cash.account = selectedBelance.account;
          // add_cash.type = selectedBelance.type;
          // add_cash.belance = pri;
          // add_cash.date_created = selectedBelance.date_created;
          // add_cash.user = selectedBelance.user;
          setbelance(belance.map((a) => (a.id === add_cash.id ? add_cash : a)));
          // dispatch(updateBelanceInCache(add_cash));
          // dispatch(updateReportInCache(response.data.report_belance));
          let update_money = response.data.moneys;
          // update_money.name = moneyinsert.name;
          // update_money.id = moneytype;
          // update_money.cach = moneyinsert.cash;
          // update_money.user = moneyinsert.user;
          // setCash(
          //   Cash.map((a) => (a.id === update_money.id ? update_money : a))
          // );
          // dispatch(updateMoneyInCache(update_money));
          // fetch(Source.getAddress() + "/api/belance/" + `${idbelance}/`, {
        })
        .catch((error) => {
          console.log(error);
          showAlert({
            position: "top-end",
            icon: "error",
            title: <FormattedMessage id="Not working ,please try again!" />
            ,
            showConfirmButton: false,
            timer: 1500,
          });
        });

      // console.log(AddDeposite);
    } else {
      // setError(true);
      showAlert({
        position: "top-end",
        icon: "error",
        title: <FormattedMessage id="You must fill Customer name and Amount input!" />,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const convertToKabulTime = (dateStr) => {
    const dateObj = new Date(dateStr);

    // Set the time zone to Kabul (UTC+4:30)
    dateObj.setMinutes(dateObj.getMinutes() + 540); // Kabul is UTC+4:30

    // Format the date object into the desired string format
    const formattedDateStr = dateObj.toISOString().slice(0, 16);

    return formattedDateStr;
  };
  const handle_date = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );

      // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setAddDeposite({
        ...AddDeposite,
        date: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handle_start1 = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setStartDate(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handle_end1 = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setEndDate(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handleDeposite = (e) => {
    // console.log(formattedDate);
    setAddDeposite({
      ...AddDeposite,
      [e.target.name]: e.target.value,
      user: localStorage.getItem("userTokenid"),
    });
  };

  const [Popup, setPopup] = useState(false);
  const res = useMemo((result) => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });
  // useEffect(() => {
  //   // setRecords(deposite);
  //   let news = new Date();
  //   let mmm = news.toISOString().slice(0, 16);
  //   let to = convertToKabulTime(mmm);
  //   const jalaliDate1 = jalaali.toJalaali(
  //     news.getFullYear(),
  //     news.getMonth() + 1,
  //     news.getDate()
  //   );

  //   news.setDate(news.getDate() - 1);
  //   const jalaliDate = jalaali.toJalaali(
  //     news.getFullYear(),
  //     news.getMonth() + 1,
  //     news.getDate()
  //   );

  //   if (settings[0].date === "Persian") {
  //     setStartDate(
  //       moment({
  //         day: jalaliDate1.jd,
  //         month: jalaliDate1.jm,
  //         year: jalaliDate1.jy,
  //       })
  //     );
  //     setEndDate(
  //       moment({
  //         day: jalaliDate.jd,
  //         month: jalaliDate.jm,
  //         year: jalaliDate.jy,
  //       })
  //     );
  //   } else {
  //     setStartDate(
  //       moment({
  //         day: String(news.getDate()).padStart(2, "0"),
  //         month: String(news.getMonth() + 1).padStart(2, "0"),
  //         year: news.getFullYear(),
  //       })
  //     );
  //     setEndDate(moment(news));
  //   }
  // }, [deposite]);

  // useEffect(() => {
  //   let datetime = new Date();
  //   const jalaliDate12 = {
  //     year: datetime.getFullYear(),
  //     month: datetime.getMonth() + 1,
  //     day: datetime.getDay(),
  //   };
  //   const { year, month, day } = jalaliDate12;
  //   // Create the ISO date string
  //   const t = new Date();
  //   const date = new Date();
  //   // let m=moment();
  //   const isoString = date.toISOString();

  //   setAddDeposite({
  //     ...AddDeposite,
  //     date: isoString,
  //   });
  // }, [setAddDeposite]);

  const handleRowClick = (row) => {
    setEditAccount(row);
    setEdit(true);
  };
  const date = (d) => {
    const date = new Date(d);

    let formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    let aa = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    if (settings[0].date === "Persian") {
      aa = hours >= 12 ? "ق.ظ" : "ب.ظ";
      formattedDate = convertToHijriShamsi(
        `${formattedDate}  ${formattedHours}:${formattedMinutes} ${ampm}`
      );
    }
    return `${formattedDate}  ${formattedHours}:${formattedMinutes} ${aa}`;
  };

  const handleViewBelance = (row) => {
    const filteredBelance = belance.filter((item) => item.account === row.id);
    setEditAccount(filteredBelance);
    setId(row.id);
    setOpenBelance(true);
  };

  // const [records, setRecords] = useState(rows);

  const handleFilter = (e) => {
    // console.log(accounts);
    const newData = deposite.filter((row) => {
      if (typeof row.customer === "string") {
        return row.customer
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      }
      return false;
    });
    setRecords(newData);
  };
  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );

    const hijriShamsiDate = `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;

    return hijriShamsiDate;
  };
  const columnsDesktopsimple = [
    {
      name: <strong style={{ width: "1px" }}>ID</strong>,
      selector: (row) => row.id,
      //  sortable: true
      style: {
        width: "1px",
        minWidth: "10px",
      },
    },

    {
      name: <strong>Customer Name</strong>,
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "200px", width: "200px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // Width: '600px',    // Set a specific width
      },
      // sortable: true,
    },
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },
    {
      name: <strong>Money Type</strong>,
      selector: (row) => row.moneyType,
      //  sortable: true
    },
    {
      name: <strong className="w-50 text-center">Amount</strong>,
      selector: (row) => row.amount,
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
    {
      name: <strong>Description</strong>,
      selector: (row) => row.discription,
    },
    {
      name: <strong>Cash Belance</strong>,
      selector: (row) => row.cash,
    },
  ];

  const ShowDeposit = (type) => {
    return (
      <p
        className={`text-capitalize position-static p-2 mb-0 ${
          type === "deposite" ? "bg-success" : "bg-danger"
        } rounded text-light text-center `}
        style={{ width: "75px" }}
      >
        <FormattedMessage id={type}/>
      </p>
    );
  };
const PDcolumn = [
    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
          <FormattedMessage id="Delete" />
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            delete_report(row);
            // setEdit(row);
            // setUpdate(true);
            // seTtitle('Edit Type Money');
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"15%"}
            width={"15%"}
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
    {
      name: (
        <strong>
          <FormattedMessage id="Add By" />
        </strong>
      ),
      selector: (row) => row.user_name,
    },

    {
      name: (
        <strong>
          <FormattedMessage id="Description" />
        </strong>
      ),
      selector: (row) => row.discription,
    },
    {
      name: <strong>
          <FormattedMessage id="Transaction" /></strong>,
      selector: (row) => ShowDeposit(row.type),
    },
    {
      name: (
        <strong className="w-50 text-center">
          {" "}
          <FormattedMessage id="Amount" />
        </strong>
      ),
      selector: (row) => formatNumber(row.amount),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },

    {
      name: (
        <strong>
          {" "}
          <FormattedMessage id="Currency" />
        </strong>
      ),
      selector: (row) => row.moneyType,
      //  sortable: true
    },
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "200px", width: "200px" }}
        >
          <FormattedMessage id="Date Created" />
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // Width: '600px',    // Set a specific width
      },
      // sortable: true,
    },

    {
      name: (
        <strong>
          {" "}
          <FormattedMessage id="Customer Name" />
        </strong>
      ),
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },

    {
      name: (
        <strong style={{ width: "1px" }}>
          <FormattedMessage id="ID" />
        </strong>
      ),
      selector: (row) => row.id,
      //  sortable: true
      style: {
        width: "1px",
        minWidth: "10px",
      },
    },
  ];
  const columnsDesktop = [
    {
      name: <strong style={{ width: "1px" }}>ID</strong>,
      selector: (row) => row.id,
      style: {
        width: "1px",
        minWidth: "10px",
      },
    },

    {
      name: <strong>Customer Name</strong>,
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
    },
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "200px", width: "200px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // Width: '600px',    // Set a specific width
      },
      // sortable: true,
    },
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },
    {
      name: <strong>Money Type</strong>,
      selector: (row) => row.moneyType,
      //  sortable: true
    },
    {
      name: <strong className="w-50 text-center">Amount</strong>,
      selector: (row) => formatNumber(row.amount),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
    {
      name: <strong>Transaction</strong>,
      selector: (row) => ShowDeposit(row.type),
    },
    {
      name: <strong>Description</strong>,
      selector: (row) => row.discription,
    },
    // {
    //   name: <strong>Cash Belance</strong>,
    //   selector: (row) => row.cash,
    // },
    {
      name: <strong>Added by </strong>,
      selector: (row) => row.user_name,
    },
    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
          Delete
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            delete_report(row);
            // setEdit(row);
            // setUpdate(true);
            // seTtitle('Edit Type Money');
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"15%"}
            width={"15%"}
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
  ];

  const columnsTablet = [
    // { name: "Id", selector: (row) => row.id, sortable: true },
    { name: "account_name", selector: (row) => row.customer, sortable: true },
    // {
    //   name: "Date Created",
    //   selector: (row) => row.date_created,
    //   sortable: true,
    // },
    { name: "moneyType", selector: (row) => row.moneyType, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    // { name: "discription", selector: (row) => row.discription, sortable: true },
    // {
    //   name: <strong>Cach Belance</strong>,
    //   selector: (row) => row.cash,
    // },
    ,
  ];
  const [value, setValue] = useState("");
  const onChange = (row) => {
    setPopup(true);
    setValue(row.target.value);
  };

  const Onsearch = (row) => {
    // This gives you the ISO string in UTC
    // setIsoDate(isoString);

    if (row) {
      setmoneyname(row.moneyType);
      setusername(row.account_name);
      setmoneytype(row.moneyId);
      setidbelance(row.id);
      setselectedBelance((prevState) => ({
        ...prevState,
        id: row.id,
        moneyId: row.moneyId,
        user: row.user,
        moneyType: row.moneyType,
        account: row.account,
        account_name: row.account_name,
        type: row.type,
        belance: row.belance, // Assuming 'belance' is correct, it seems like a typo
        date_created: row.date_created,
      }));
      let belanceName = row.account_name + " " + row.moneyType;
      setAddDeposite({
        ...AddDeposite,
        account: row.id,
        // date:isoString,
      });
      setPopup(false);
      // console.log(belanceName)
      setValue(belanceName);
      // console.log('s  earch ',row);
    }
  };
  const [select_user, setselect_user] = useState("");
  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = deposite.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
    } else {
      setRecords(deposite);
    }
    setselect_user(e.target.value);
  };
  // console.log(AddDeposite)
  const [selectedOption, setSelectedOption] = useState();
  const [formattedValue, setFormattedValue] = useState("");

  const handleChange = (e) => {
    const formattedValue = e.target.value;
    // Remove the thousand separators (commas)
    const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");
    setFormattedValue(formattedValue);
    setAddDeposite({
      ...AddDeposite,
      amount: unformattedValue,
      user: localStorage.getItem("userTokenid"),
    });
  };

  useEffect(() => {
    const inputElement = document.querySelector(".form-control"); // Use the class or other selector
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus(); // Focus the input field
        inputElement.select(); // Select the text in the input field
      }, 0);
    }
  }, []);
  const Hanlderef = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (filterRef.current) {
        filterRef.current.click(); // Programmatically click the button
      }
    }
  };
  const filterRef = useRef(null);
  const [selectedDayE, setSelectedDayE] = useState();

  const [Diversity, setDiversity] = useState();
  const [account, setAccount] = useState();
  const [selectedOption1, setSelectedOption1] = useState();
  const [EditDeposit, setEditDeposit] = useState({
    id: 0,
    account: 0,
    date: "",
    amount: 0,
    discription: "",
    type: "",
    customer: "",
    moneyType: "",
    cash: 0,
    delete: false,
    user: 0,
    user_name: "",
    moneyid: 0,
  });
  const editeRef = useRef(null);
  const [type,settype]=useState({name:'withdraw'});
  const [primarytype,setprimarytype]=useState();
  const handleshow = (row) => {
    setprimarytype(row.type);
    // editeRef.current.select();
    settype({ name: row.type,label:row.type});

    setAccount(row.account);
    setSelectedDayE(moment(row.date));
    let edit = {
      account_name: row.customer,
      moneyType: row.moneyType,
    };
    setSelectedOption1(edit);
    setDiversity(row.amount);
    let news;
    try {
      news = new Date(row.date);
      if (isNaN(news.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      // console.error('Invalid date format:', row.date);
      return;
    }
    news.setDate(news.getDate());

    const jalaliDate = jalaali.toJalaali(
      news.getFullYear(),
      news.getMonth() + 1,
      news.getDate()
    );
    const gregorianMoment = moment(news);
    setSelectedDayE(gregorianMoment);
    setEditDeposit(row);
    setOpenEdit(true);
  };
  const [OpenEdit, setOpenEdit] = useState(false);
  const [EndDateE, setEndDateE] = useState(null);




  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه

  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios
      .get(Source.getAddress() + "/api/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },
        params: {
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          delete: 0,
          StartDate: StartDate && Date_Start,
          EndDate: EndDate && Date_End,
          moneyid: localStorage.getItem("cashid"),
          search: namesearch?.length ? namesearch : "false",
          type:"all",

        },
      })
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage, EndDate, StartDate, selecteduser, namesearch]);

  // مدیریت تغییر صفحه
  const handlePageChange = page => {
    setCurrentPage(page); // برو به صفحه جدید
  };

    const [SearchQueryTo, setSearchQueryTo] = useState();
  const handleInputChangeTo = (newValue) => {
    setSearchQueryTo(newValue); // بروزرسانی مقدار ورودی جستجو
    // handleSearchTo(newValue); // ارسال درخواست جستجو به سرور
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Source.getAddress()}/api/belance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: { query: SearchQueryTo, do: "ok" }, // ارسال پارامتر جستجو به سرور
        });
        setbelance(response.data);
        const data = response.data;
        console.log(data);

        // if (data && data.length === 0) {
        //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
        // } else {
        //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // if(selectedOption){
    if (!SearchQueryTo || SearchQueryTo.length < 3) {
      setbelance([]);
      return;
    } else {
      fetchData();
    }
    // }
  }, [SearchQueryTo]);
  return (
    <div
      className="container mt-5 w-100 h-100"
      onClick={(e) => {
        if (
          e.target.className === "container mt-5 w-100 h-100" ||
          e.target.className ===
            "col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent"
        ) {
          setPopup(false);
        }
      }}
    >
      <a
        href="/cash"
        type="button"
        class="btn btn-info px-4"
        style={{ color: "white" }}
      >
                    <FormattedMessage id="Back in cash" />
      </a>
      <form class="row w-100 rounded-3 m-3 p-1 bg-transparent"
                dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      >
        <div class="col-lg-2 col-md-3 col-sm-6 m-1 mt-3">
        <label for="category">
            <FormattedMessage id="Customer" />
          </label>
          <ComboBoxDeposite
            searchQuery={SearchQueryTo}
            setSearchQuery={setSearchQueryTo}
            handleInputChange={handleInputChangeTo}
            // handleSearch={handleSearchTo}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
            options={belance}
            Onsearch={Onsearch}
          />
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6 m-0 mb-3 mt-3 ms-3 p-0 pe-4">
          <label for="price">            <FormattedMessage id="Amount" />          </label>
          <NumericFormat
            ref={inputRef}
            onKeyDown={handleKeyDown}
            thousandSeparator={true}
            name="amount"
            className="form-control"
            value={formattedValue}
            placeholder="0"
            onChange={handleChange}
          />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12 m-2 mt-3 ps-2 p-0 pe-3">
          <div class="form-floating">
            <textarea
              onKeyDown={handleKeyDown}
              name="discription"
              class="form-control h-50"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              value={AddDeposite.discription}
              onChange={handleDeposite}
            ></textarea>
            <label for="floatingTextarea2">            <FormattedMessage id="Description" />            </label>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12  mt-3 ps-3 p-0">
          
          <label htmlFor="category">
          <FormattedMessage id="Type" />
          </label>
          <select
            name="type"
            id="category"
            value={AddDeposite.type}
            onChange={handleDeposite}
            className="form-select"
            style={{ width: "70%", fontWeight: "normal", fontSize: "15px" }}
          >
            <option selected  value="deposite">
            <FormattedMessage id="Deposit" />
            </option>
            <option value="withdraw">
            <FormattedMessage id="Withdraw" />
            </option>
          </select>
        </div>
        <div
          class="col-lg-1 col-md-3 col-sm-6 p-0 ps-0 ms-0"
          style={{ marginTop: "2.3rem" }}
        >
          <button
            onClick={() => {
              SumbitReport();
            }}
            ref={buttonRef}
            type="button"
            class="btn btn-success w-100"
          >
                        <FormattedMessage id="Add" />
          </button>
        </div>
      </form>

      <div
                dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Deposite"/>
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date_start}
              lebal={<FormattedMessage id="Start"/>}
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
            ></Datepicker_Customer>
          </div>
          <div className="mb-1 mt-1 mb-lg-0 me-lg-2">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date_end}
              lebal={<FormattedMessage id="End"/>}
              setSelectedDay={setEndDate}
              selectedDay={EndDate}
            ></Datepicker_Customer>
          </div>
          <ListBox
            options={users}
            selectedOption={selecteduser}
            setSelectedOption={setSelecteduser}
          />
        </div>
        <input
  className="form-control m-2 mb-2 mt-4"
  style={{ width: "100%", maxWidth: "200px" }}
  type="search"
  onChange={handleName}
  value={namesearch}
  placeholder={formatMessage({ id: "Search" })}
  aria-label="Search"
/>
      </div>
      <Edit_ThirdDepttable
        // useRef1={editeRef}
        primarytype={primarytype}
        setprimarytype={setprimarytype}
        type={type}
        settype={settype}
        setSelectedOption={setSelectedOption1}
        selectedOption={selectedOption1}
        money={money}
        accounts={accounts}
        setAccounts={setAccounts}
        records={records}
        setRecords={setRecords}
        handleKeyDown={handleKeyDown}
        setCash={setCash}
        Cash={Cash}
        belance={belance}
        setbelance={setbelance}
        account={account}
        setAccount={setAccount}
        Diversity={Diversity}
        setDiversity={setDiversity}
        selectedDay={selectedDayE}
        setselectedDay={setSelectedDayE}
        EndDate={EndDateE}
        Edit_Deposit={EditDeposit}
        setEditDeposit={setEditDeposit}
        settings={settings}
        handle_date={handle_date}
        // lebal={"Date"}
        setSelectedDay={setSelectedDayE}
        open={OpenEdit}
        closeEdit={() => setOpenEdit(false)}
      />

      {/* <DataTable
        // title="Customers"
        columns={
          res
            ? localStorage.getItem("userTokenname") === "admin"
              ? columnsDesktop
              : columnsDesktopsimple
            : columnsTablet
        }
        data={records}
        onRowClicked={handleshow}
        striped
        responsive
        highlightOnHover
        pagination
        // noHeader
        // noTableHead
      /> */}

    <DataTable
      // title="Server Side Data Table"
      onRowClicked={handleshow}
      columns={
        res
          ? localStorage.getItem("userTokenname") === "admin"
            ? localStorage.getItem('language')=='da'? PDcolumn : columnsDesktop
            : columnsDesktopsimple
          : columnsTablet
      }

      data={records}
      progressPending={loading}
      striped
        responsive
        highlightOnHover
      pagination
      paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
      paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
      onChangePage={handlePageChange} // تغییر صفحه
      onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه
    />




      {edit && (
        <AccountEdit
          close={() => setEdit(false)}
          account={editAccount}
          setAccount={setEditAccount}
        />
      )}

      {/* <img style={{height:'6%',width:'6%'}} className="p-0" src={Add}/> */}
      {openBelance && (
        <Belance
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
        />
      )}
      {addAccountModal && (
        <AddAccount close={() => setAddAccountModal(false)} />
      )}
      {alert && <Alert />}
    </div>
  );
}
