import React, { useState, useEffect, useMemo } from "react";
import { gregorianToJalali } from "shamsi-date-converter";
import Swal from "sweetalert2";
import Alert from "./forms/Alert";
import Datepicker from "./forms/Datepicker";
import Datepicker_Customer from "./forms/Datepicker_customer";
import Datepicker_start from "./forms/Datepicker_start";
import DataTable from "react-data-table-component";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import AccountEdit from "./CustomersEdit";
import Add from "../assets/icon/add.png";
import Trash from "../assets/icon/trash.png";
import { useRef } from "react";
import Belance from "./forms/Belance";
import AddAccount from "./AddAccount";
import ComboBox from "./forms/ComboBox";
import Source from "../Source";
import { showAlert } from "../warrper";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Edit_deposite from "./Edit_deposite";
import { Calendar } from "react-modern-calendar-datepicker";
import * as shamsi from "shamsi-date-converter";
// import DatePicker from "react-modern-calendar-datepicker";
import { NumericFormat } from "react-number-format";
import { utils } from "react-modern-calendar-datepicker";
import { getReports, updateReportInCache } from "./Redux/reportSlice";
import { useSelector, useDispatch } from "react-redux";
import { getBelances, updateBelanceInCache } from "./Redux/belanceSlice";
import { getMoneys, updateMoneyInCache } from "./Redux/moneysSlice";
import { getCustomers } from "./Redux/customerSlice";
import ComboBoxDeposite from "./Transformations/ComboBoxDeposite";
import ListBox from "./forms/ListBox";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../warrper";
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};

export default function Deposite({
  user,
  // settings
}) {
  const showAlert = useShowAlert(); 
  // const dispatch = useDispatch();
  // const { belances, errorb, statusb } = useSelector((state) => state.belances);
  // const { moneys, errorm, statusm } = useSelector((state) => state.moneys);
  // const { customers, errorc, statusc } = useSelector((state) => state.customers);
  // console.log(belances);
  // dispatch(getBelances());
  // useEffect(() => {
  //   // بررسی و بارگذاری `belances`
  //   // console.log(belances);
  //   if (!statusb && !belances) {
  //     console.log('hi')
  //   }

  //   // // بررسی و بارگذاری `moneys`
  //   // if (statusm === 'idle' && !moneys) {
  //   //   dispatch(getMoneys());
  //   // }

  //   // // بررسی و بارگذاری `customers`
  //   // if (statusc === 'idle' && !customers) {
  //   //   dispatch(getCustomers());
  //   // }
  // }, [dispatch, statusb]);
  // console.log(statusb);
  // console.log(belances);
  // dispatch(getBelances());
  // console.log(belances);

  // const [money,setmoney]=useState(moneys);
  // const [Cash,setCash]=useState(moneys);
  const { settings, statuss } = useSelector((state) => state.settings);
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const [namesearch, setnameSearch] = useState();
  const [Date_Start, setDate_start] = useState();
  const [Date_End, setDate_end] = useState();
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

  const [belance, setbelance] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [deposite, setdeposite] = useState([]);
  const [selectedDay, setSelectedDay] = useState(moment());
  const [open, setopen] = useState(true);
  const [alert, setalert] = useState(false);
  const [records, setRecords] = useState([]);
  const persianToday = utils("fa").getToday();
  const [Ddate, setDdate] = useState(null);
  const [de_id, setde_id] = useState(0);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [EditDeposit, setEditDeposit] = useState({
    id: 2,
    account: 0,
    date: "",
    amount: 0,
    discription: "",
    type: "",
    customer: "",
    moneyType: "",
    cash: 0,
    // isdelete: false,
    user_id: localStorage.getItem("userTokenid"),
    user_name: "",
    moneyid: 0,
  });
  const [cashreport, setcashreport] = useState(0);
  const [report_delete, Setreport_delete] = useState({
    account: 15,
    date: "2024-05-15T15:41:44.888608Z",
    amount: 0,
    discription: "",
    type: "deposite",
    cash: 0,
    // isdelete: "True",
  });
  // const data = useSelector((state) => state.data.data); // داده‌ها
  // const status = useSelector((state) => state.data.status); // وضعیت بارگذاری
  // const error = useSelector((state) => state.data.error); // خطا
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها

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
      const uploadData = new FormData();
      uploadData.append("_method", "PUT");
      uploadData.append("isdelete",1);
      
      axios
        .post(Source.getAddress() + `/api/report/${row.id}`, uploadData, {
          params: { type: "delete" },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          },
        })
        .then((res) => {
          // console.log(res);
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
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: intl.formatMessage({id:"Somethin went wrong!"})
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
console.log(localStorage.getItem('access'));
  const [moneytype, setmoneytype] = useState(0);
  const [EndDateE, setEndDateE] = useState(null);
  const [idbelance, setidbelance] = useState(0);
  const [selectedBelance, setselectedBelance] = useState({
    id: 0,
    account_name: "",
    moneyType: "",
    account_id: 0,
    moneyId: 0,
    user_id: 0,
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
  const [search, setsearch] = useState("false");
  const [AddDeposite, setAddDeposite] = useState({
    user_id: localStorage.getItem("userTokenid"),
    discription: "",
    amount: "",
    date: new Date().toISOString(),
    account_id: 0,
    type: "deposite",
    cash: 0,
    // isdelete: 0,
  });
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه

  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress() + "/api/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          delete: 0,
          StartDate: StartDate && Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : "false",
          type: "deposite",
        },
      });
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage, EndDate, StartDate, selecteduser, namesearch]);

  // مدیریت تغییر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  const filterDeposite = () => {};
  // const primary = () => {
  //   if (selectedBelance.belance === "0") {
  //     return parseInt(AddDeposite.amount);
  //   } else {
  //     let primar = parseInt(selectedBelance.belance);
  //     primar += parseInt(AddDeposite.amount);
  //     return parseInt(primar);
  //   }
  // };
  // const updatemoney = () => {
  //   const record = Cash.find((item) => item.id === moneytype);
  //   if (record) {
  //     let money = parseInt(AddDeposite.amount);
  //     let primmoney = parseInt(record.cach);
  //     let sum = primmoney + money;
  //     return { name: record.name, cash: sum, user: record.user };
  //   } else {
  //     return { name: "", cash: 0 };
  //   }
  // };
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
  const handleDeposite = (e) => {
    setAddDeposite({
      ...AddDeposite,
      [e.target.name]: e.target.value,
      user: localStorage.getItem("userTokenid"),
    });
  };

  const [Popup, setPopup] = useState(false);
  // const [Settings, setSettings] = useState([]);
  const res = useMemo((result) => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/money', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 0,
  //     },
  //   }).then((res)=>{
  //     setmoney(res.data);
  //     setCash(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  // },[]);
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/belance', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },
  //   params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     console.log('hi')
  //     setbelance(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  //  },[]);

  // useEffect(() => {
  //   axios.get(Source.getAddress() + '/api/customers', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     setAccounts(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });

  // },[]);

  // useEffect(() => {

  //   const startDate = new Date();
  //   const endDate = new Date();
  //   startDate.setDate(startDate.getDate() - 30);
  //   endDate.setDate(endDate.getDate() + 1);
  //   axios.get(Source.getAddress() + '/api/report', {
  //   headers:{
  //     Authorization: `Bearer ${localStorage.getItem('access')}`,
  //   },
  //   // params: {
  //   //   delete:'False',
  //   //   startDate: startDate.toISOString(),
  //   //   endDate: endDate.toISOString(),
  //   //   type:'deposite'
  //   // },
  //   }).then((res)=>{
  //   console.log(res);
  //   // setRecords(res.data);
  //   setdeposite(res.data);
  //   }).catch((err)=>{
  //   console.log(err);
  //   })

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
  // }, []);

  const handleRowClick = (row) => {
    setEditAccount(row);
    setEdit(true);
  };
  const date = (d) => {
    const date = moment.utc(d); // تبدیل تاریخ بدون در نظر گرفتن تایم زون
    let formattedDate = `${date.year()}-${String(date.month() + 1).padStart(
      2,
      "0"
    )}-${String(date.date()).padStart(2, "0")}`;
    const hours = date.hours();
    const minutes = date.minutes();
    const ampm = hours >= 12 ? "pm" : "am";
    let aa = ampm;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    if (settings[0].date === "Persian") {
      moment.locale("fa"); // تنظیم لوکال به فارسی
      aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
      formattedDate = moment.utc(d).format("jYYYY-jMM-jDD");
    } else {
      moment.locale("en");
    }

    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };

  const handleViewBelance = (row) => {
    const filteredBelance = belance.filter((item) => item.account === row.id);
    setEditAccount(filteredBelance);
    setId(row.id);
    setOpenBelance(true);
  };

  const handleFilter = (e) => {
    // console.log(accounts);
    // const newData = deposite.filter((row) => {
    //   if (typeof row.customer === "string") {
    //     if (
    //       row.customer.toLowerCase().includes(e.target.value.toLowerCase()) ||
    //       row.moneyType.toLowerCase().includes(e.target.value.toLowerCase()) ||
    //       row.amount === e.target.value
    //     ) {
    //       return row.customer;
    //     }
    //   }
    //   return false;
    // });
    // setRecords(newData);
    setsearch(e.target.value.toLowerCase());
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
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "190px!important", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // margin:'0px'
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
      name: <strong>Description</strong>,
      selector: (row) => row.discription,
    },
    {
      name: <strong>Cash Belance</strong>,
      selector: (row) => formatNumber(row.cash),
    },
  ];

  const columnsDesktop = [
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
      selector: (row) => formatNumber(row.amount),
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
    // {
    //   name: <strong>Cash Belance</strong>,
    //   selector: (row) => formatNumber(row.cash),
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
  const PDcolumn = [
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },

    // {
    //   name: <strong>Cash Belance</strong>,
    //   selector: (row) => formatNumber(row.cash),
    // },
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
          {" "}
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
      name: (
        <strong className="w-50 text-center">
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
  const columnsTablet = [
    // { name: "Id", selector: (row) => row.id, sortable: true },
    {
      name: <strong>Customer</strong>,
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: <strong>Money Type</strong>,
      selector: (row) => row.moneyType,
      sortable: true,
    },
    {
      name: <strong>Amount</strong>,
      selector: (row) => row.amount,
    },
    // {
    //   name: "Date Created",
    //   selector: (row) => date(row.date),
    //   sortable: true,
    // },
    // { name: "belance", selector: (row) => row.belance, sortable: true },
    // { name: "discription", selector: (row) => row.discription, sortable: true },
    ,
  ];
  const [value, setValue] = useState("");
  const onChange = (row) => {
    setPopup(true);
    setValue(row.target.value);
  };

  const Onsearch = (row) => {
    setSearchQueryTo(row);
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
        user_id: row.user,
        moneyType: row.moneyType,
        account_id: row.account,
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

  const buttonRef = useRef(null);
  const filterRef = useRef(null);

  const [selectedDayE, setSelectedDayE] = useState();

  const [Diversity, setDiversity] = useState();
  const [account, setAccount] = useState();
  const editeRef = useRef(null);
  const handleshow = (row) => {
    console.log(row);
    setOpenEdit(true);
    editeRef.current.select();
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
    // EditDeposit.account_id=row.account;
    // console.log(row);
  };
  const handle_date = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      setAddDeposite({
        ...AddDeposite,
        date: isoString,
      });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };
  const Hanlderef = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (filterRef.current) {
        filterRef.current.click(); // Programmatically click the button
      }
    }
  };

  const inputRef = useRef(null); // Create a ref for the input field

  useEffect(() => {
    const inputElement = document.querySelector(".form-control"); // Use the class or other selector
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus(); // Focus the input field
        inputElement.select(); // Select the text in the input field
      }, 0);
    }
  }, []);

  // useEffect(() => {

  // }, [Edit_Deposit.date, settings, setEndDate]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = useMemo(() => {
    if (
      localStorage.getItem("language") === "pa" ||
      localStorage.getItem("language") === "da"
    ) {
      return PDcolumn.reverse();
    }
    if (isDesktop) {
      return localStorage.getItem("userTokenname") === "admin"
        ? columnsDesktop
        : columnsDesktopsimple;
    }
    return columnsTablet;
  }, [isDesktop]);
  const [selectedOption1, setSelectedOption1] = useState();
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
  }, [SearchQueryTo]); // اضافه کردن searchQuery به وابستگی‌های useEffect
  const { formatMessage } = useIntl();
  const localization = {
    pagination: {
        
        rowsPerPage:<FormattedMessage id="AddrowsPerPage"/> , // مثلا: "تعداد ردیف‌ها"
      previous: <FormattedMessage id="previous"/>, // مثلا: "قبلی"
      next: <FormattedMessage id="next"/>, // مثلا: "بعدی"
      page: <FormattedMessage id="page"/>, // مثلا: "صفحه"
    },
    // شما می‌توانید تنظیمات بیشتر برای متون مورد نظر اضافه کنید.
  };
  const customStyles = {
    // headRow: {
    //   style: {
    //     backgroundColor: '#f8f9fa', // رنگ پس‌زمینه هدر
        // fontWeight: 'bold', // ضخامت فونت
        // fontSize: '16px', // اندازه فونت
    //     borderBottom: '2px solid #dee2e6', // خط پایین هدر
    //   },
    // },
    headCells: {
      style: {
        fontWeight: 'bold', // ضخامت فونت // اندازه فونت
        },
    },
  };
  return (
    <div
      className="container mt-5 w-100 h-100"
      onClick={(e) => {
        if (
          e.target.className === "container mt-5 w-100 h-100" ||
          e.target.className ===
            "col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent"
        ) {
          setOpenEdit(false);
          setPopup(false);
        }
      }}
    >
      <form 
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      class="row w-100 rounded-3 m-3 p-1 bg-transparent">
        <div class="col-lg-2 col-md-3 col-sm-6 m-1 mt-3" 
        >
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
          <label for="price">
            <FormattedMessage id="Amount" />
          </label>
          <NumericFormat
            ref={inputRef}
            onKeyDown={handleKeyDown}
            thousandSeparator={true}
            name="amount"
            className="form-control h-50"
            value={formattedValue}
            placeholder="0"
            onChange={handleChange}
          />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12 m-2 mt-3 ps-2 p-0 pe-3">
          <div class="form-floating">
            <textarea
              onKeyDown={handleKeyDown}
              value={AddDeposite.discription}
              onChange={handleDeposite}
              name="discription"
              class="form-control h-50"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
            ></textarea>
            <label for="floatingTextarea2">
              <FormattedMessage id="Description" />
            </label>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12  mt-3 ps-3 p-0">
          <Datepicker_Customer
            onKeyDown={handleKeyDown}
            default_value={EndDate}
            settings={settings}
            handle_date={handle_date}
            lebal={<FormattedMessage id="Date" />}
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
          ></Datepicker_Customer>
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
      <DataTable
        // title="Server Side Data Table"
        onRowClicked={handleshow}
        columns={columns}
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
        localization={localization} // ارسال ترجمه‌ها
        customStyles={customStyles}       
      />
      <Edit_deposite
        useRef1={editeRef}
        setSelectedOption={setSelectedOption1}
        selectedOption={selectedOption1}
        // money={money}
        // accounts={accounts}
        // setAccounts={setAccounts}
        records={records}
        setRecords={setRecords}
        handleKeyDown={handleKeyDown}
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
      {/* {edit && (
        <AccountEdit
          close={() => setEdit(false)}
          account={editAccount}
          setAccount={setEditAccount}
        />
      )} */}

      {/* <img style={{height:'6%',width:'6%'}} className="p-0" src={Add}/> */}
      {/* {(
        <Belance
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
        />
      )} */}
      {addAccountModal && (
        <AddAccount close={() => setAddAccountModal(false)} />
      )}
      {alert && <Alert />}
    </div>
  );
}
