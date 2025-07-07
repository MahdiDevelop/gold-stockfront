import React, { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { gregorianToJalali } from "shamsi-date-converter";
// import { gregorianToJalali } from "shamsi-date-converter";
import Swal from "sweetalert2";
import { showAlert } from "../warrper";
import Trash from "../assets/icon/trash.png";
import axios from "axios";
import AccountEdit from "./CustomersEdit";
import jalaali from "jalaali-js";
import Add from "../assets/icon/add.png";
import Belance from "./forms/Belance";
import AddAccount from "./AddAccount";
import Source from "../Source";
import Datepicker_Customer from "./forms/Datepicker_customer";
import ListBox from "./forms/ListBox";
import Profile from "../assets/icon/profile.png";
import IdNational from "../assets/icon/national_id.png";
import { getReports } from "./Redux/reportSlice";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers } from "./Redux/customerSlice";
import { getBelances, updateBelanceInCache } from "./Redux/belanceSlice";
import { getMoneys } from "./Redux/moneysSlice";
import { getSettings } from "./Redux/settingSlice";
import moment from "moment-jalaali";
import { FormattedMessage, useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../warrper";
// import { useIntl } from "react-intl";

export default function Customers({ date1, user, setting, setsettting }) {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  const columnsDesktop = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name: "Photo",
      cell: (row) => (
        <img
          src={
            row.hasOwnProperty("profile_picture") &&
            row.profile_picture !== null
              ? row.profile_picture
              : Profile
          }
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      style: {
        width: "1px",
        minWidth: "1px",
      },
      sortable: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Father Name", selector: (row) => row.father_name, sortable: true },
    {
      name: "Date Created",
      selector: (row) => date(row.date_created),
    },
    { name: "Address", selector: (row) => row.addresss, sortable: true },
    { name: "Phone", selector: (row) => row.phone_number, sortable: true },
    { name: "Whatsup", selector: (row) => row.whatsup_number, sortable: true },
    {
      name: "National Id Number",
      selector: (row) => row.national_id_number,
      sortable: true,
    },
    // {
    //   name: "Belance",
    //   cell: (row) => (
    //     <button
    //       onClick={() => handleViewBelance(row)}
    //       type="button"
    //       className="btn btn-outline-info rounded-4"
    //       style={{ fontSize: "0.9rem" }}
    //     >
    //       View
    //     </button>
    //   ),
    // },
    {
      name: "Added by ",
      selector: (row) => row.user.name,
      sortable: true,
    },
    {
      name: (
        <p
          style={{
            margin: "auto auto",
            textAlign: "center",
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
          Delete
        </p>
      ),
      selector: (row) => (
        <button
          className={`${row.ontransaction ? "d-none" : ""}`}
          onClick={() => delete_report(row)}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"25%"}
            width={"25%"}
            src={Trash}
            style={{ backgroundColor: "transparent" }}
          />
        </button>
      ),
    },
  ];
  //   const { belances, errorb, statusb } = useSelector((state) => state.belances);
  // const { moneys, errorm, statusm } = useSelector((state) => state.moneys);
  // const { customers, errorc, statusc } = useSelector((state) => state.customers);
  // const { settings, errors, statuss } = useSelector((state) => state.settings);
  // const [setting,setsetting] = useState(settings);
  // useEffect(() => {
  //   // بررسی و بارگذاری `belances`
  //   // if (!statusb && belances) {
  //   //   dispatch(getBelances());
  //   // }

  //   // // بررسی و بارگذاری `moneys`
  //   // if (!statusm && moneys) {
  //   //   dispatch(getMoneys());
  //   // }

  //   // بررسی و بارگذاری `customers`
  //   if (!statusc  && customers.lenght > 0) {
  //     dispatch(getCustomers());
  //   }

  //   // if(!statuss && settings) {
  //   //   dispatch(getSettings());
  //   // }
  // }, []);
  // dispatch(getSettings());
  // console.log(settings);

  // dispatch(getCustomers());
  // let user1=user;

  const { settings, statuss } = useSelector((state) => state.settings);
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const [namesearch, setnameSearch] = useState();
  const [Date_Start, setDate_start] = useState();
  const [Date_End, setDate_end] = useState();
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const handle_date_start = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      let isoDateString;
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      setDate_start(isoString);
    } else {
      setDate_start(null);
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

  const [money, setMoney] = useState([]);
  const [moneyb, setmoneyb] = useState([]);
  const [belance, setbelance] = useState([]);
  const [accounts, setAccounts] = useState();
  const [records, setRecords] = useState();
  const [openBelance, setOpenBelance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  // console.log(records);
  const PDcolumn = [
    {
      name: (
        <p
          style={{
            margin: "auto auto",
            textAlign: "center",
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
          <FormattedMessage id="Delete" />
        </p>
      ),
      selector: (row) => (
        <button
          className={`${row.ontransaction ? "d-none" : ""}`}
          onClick={() => delete_report(row)}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"25%"}
            width={"25%"}
            src={Trash}
            style={{ backgroundColor: "transparent" }}
          />
        </button>
      ),
    },
    {
      name: <FormattedMessage id="Add By" />,
      selector: (row) => row.user.name,
      sortable: true,
    },
    {
      name:<FormattedMessage id="National Id Number" />,
      selector: (row) => row.national_id_number,
      sortable: true,
    },

    {
      name: <FormattedMessage id="Whatsup" />,
      selector: (row) => row.whatsup_number,
      sortable: true,
    },

    { name: <FormattedMessage id="Phone" />, selector: (row) => row.phone_number, sortable: true },

    { name: <FormattedMessage id="Address" />, selector: (row) => row.addresss, sortable: true },

    {
      name: <FormattedMessage id="Date Created" />,
      selector: (row) => date(row.date_created),
    },

    {
      name: <FormattedMessage id="Father Name" />,
      selector: (row) => row.father_name,
      sortable: true,
    },

    { name: <FormattedMessage id="Name" />, selector: (row) => row.name, sortable: true },

    {
      name: <FormattedMessage id="Photo" />,
      cell: (row) => (
        <img
          src={
            row.hasOwnProperty("profile_picture") &&
            row.profile_picture !== null
              ? row.profile_picture
              : Profile
          }
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      style: {
        width: "1px",
        minWidth: "1px",
      },
      sortable: true,
    },

    {
      name: <FormattedMessage id="ID" />,
      selector: (row) => row.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
  ];
  const [editAccount1, setEditAccount1] = useState({
    id: 0,
    isdelete: 0,
    user: 0,
    name: "",
    date_created: "",
    father_name: "",
    national_id_number: "",
    phone_number: "",
    whatsup_number: 0,
    addresss: "",
    profile_picture: "",
    national_id_picture: "",
    whatsapp: 1,
  });
  const [id, setId] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const [addAccountModal, setAddAccountModal] = useState(false);
  // const [res,setres]=useState(false);
  // const res = useMemo((result) => {
  //   if (window.innerWidth > 768) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // });

  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/belance', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 0,
  //     },
  //   }).then((res)=>{
  //     // console.log(res);
  //     setbelance(res.data);
  //   }).catch((err)=>{
  //   });
  // },[])
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/customers', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 0,
  //     },
  //   }).then((res)=>{
  //     setAccounts(res.data);
  //     setRecords(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  //   axios.get(Source.getAddress() + '/api/money', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 0,
  //
  //   }).then((res)=>{
  //     // console.log(res);
  //     setMoney(res.data);
  //     // setRecords(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  // axios.get(Source.getAddress() + '/api/belance', {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //   },params: {
  //     delete: 0,
  //   },
  // }).then((res)=>{
  //   setbelance(res.data);
  // }).catch((err)=>{
  // });
  // },[]);
  //   useEffect(() => {

  //   },[]);
  //    (()=>{

  //  },[]);
  // console.log(records);
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress() + "/api/customers", {
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
        },
      });
      setAccounts(response.data.data);
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

  const handleRowClick = (row) => {
    setOpenBelance(false);
    setEditAccount1(row);
    setEdit(true);
    inputRef1.current.select();
    setAddAccountModal(false);
  };
  const [customer, setcustomer] = useState({
    national_id_picture: "",
    profile_picture: "",
    national_id_number: "",
    isdelete: 0,
    user: "",
    address: "",
    whatsup_number: "",
    name: "",
    father_name: "",
    phone_number: "",
    // ontransaction:'True'
  });
  const [prof, setprof] = useState();
  const [idprof, setidprof] = useState();
  const handleViewBelance = (row) => {
    handleViewMoney();
    inputRefbelance.current.select();
    const fetchAndSetImage = async (url, setImage) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = url.substring(url.lastIndexOf("/") + 1);
        const file = new File([blob], filename, {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        setImage(file);
      } catch (error) {
        console.error("Error converting URL to File:", error);
      }
    };
    if (row.profile_picture) {
      fetchAndSetImage(row.profile_picture, setprof);
    } else {
      setprof("");
    }
    if (row.national_id_picture) {
      fetchAndSetImage(row.national_id_picture, setidprof);
    } else {
      setidprof("");
    }
    setcustomer(row);
    setEdit(false);
    const filteredBelance = belance.filter(
      (item) => item.account_id === row.id
    );
    setEditAccount(filteredBelance);
    setId(row.id);
    setOpenBelance(true);
    setAddAccountModal(false);
  };

  // const [records, setRecords] = useState(rows);

  const convertToHijriShamsi = (gregorianDate) => {
    // Convert Gregorian date to Hijri Shamsi
    // const gregorianDate = "2000-11-11";
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );

    const hijriShamsiDate = `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;

    return hijriShamsiDate;
  };
  const handleFilter = (e) => {
    const newData = accounts.filter((row) => {
      if (typeof row.name === "string") {
        return row.name.toLowerCase().includes(e.target.value.toLowerCase());
      }
      return false;
    });
    setRecords(newData);
  };
  const [ProfilePicture, setProfilePicture] = useState();
  const [national_id_picture, setNationalIdPicture] = useState();
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const delete_report = async (row) => {
  
    const fetchAndSetImage = async (url, setImage) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = url.substring(url.lastIndexOf("/") + 1);
        const file = new File([blob], filename, {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        setImage(file);
      } catch (error) {
        console.error("Error converting URL to File:", error);
      }
    };
  
    if (row.profile_picture && typeof row.profile_picture === "string") {
      // fetchAndSetImage(row.profile_picture, setProfilePicture);
    }
    if (row.national_id_picture && typeof row.national_id_picture === "string") {
      fetchAndSetImage(row.national_id_picture, setNationalIdPicture);
    }
  
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    const result = await swalWithBootstrapButtons.fire({
      title: intl.formatMessage({ id: "Are you sure?" }), // استفاده از useIntl برای ترجمه
      text: intl.formatMessage({ id: "You won't be able to revert this!" }), // استفاده از useIntl برای ترجمه
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: "Yes, delete it!" }), // استفاده از useIntl برای ترجمه
      cancelButtonText: intl.formatMessage({ id: "No, cancel!" }), // استفاده از useIntl برای ترجمه
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      const uploadData = new FormData();
      uploadData.append('_method','put')
      uploadData.append("isdelete", 1);
  
      axios.post(Source.getAddress() + "/api/customers/" + `${row.id}`,uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
        .then((res) => {
          setRecords(records.filter((a) => a.id !== row.id));
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: intl.formatMessage({ id: "record successfully deleted!" }), // استفاده از useIntl برای ترجمه
            showConfirmButton: false,
            timer: 1000,
          });
        })
        .catch((error) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: intl.formatMessage({ id: "Something went wrong!" }), // استفاده از useIntl برای ترجمه
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: intl.formatMessage({ id: "Cancelled" }), // استفاده از useIntl برای ترجمه
        text: intl.formatMessage({ id: "Your record is safe :)" }), // استفاده از useIntl برای ترجمه
        icon: "error",
      });
    }
  };
  const handleViewMoney = () => {
    axios
      .get(Source.getAddress() + "/api/money", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          delete: 0,
        },
      })
      .then((res) => {
        // console.log(res);
        setMoney(res.data);
        setmoneyb(res.data);
        // setRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAddAccount = () => {
    setEdit(false);
    setAddAccountModal(true);
    setOpenBelance(false);
    inputRef.current.select();
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

    return `${formattedDate}`;
  };

  const inputRefbelance = useRef(null); // Create a ref for the input field

  const columnsTablet = [
    {
      name: "Photo",
      cell: (row) => (
        <img
          src={row.profile_picture === null ? Profile : row.profile_picture}
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      sortable: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    // {
    //   name: "Belance",
    //   cell: (row) => (
    //     <button
    //       onClick={() => {
    //         handleViewBelance(row);
    //       }}
    //       type="button"
    //       className="btn btn-outline-info rounded-4"
    //       style={{ fontSize: "0.9rem" }}
    //     >
    //       View
    //     </button>
    //   ),
    // },
  ];
  const [select_user, setselect_user] = useState("");
  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = accounts.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
    } else {
      setRecords(accounts);
    }
    setselect_user(e.target.value);
  };
  const inputRef = useRef(null);
  const inputRef1 = useRef(null);
  // dispatch(getCustomers());
  const { formatMessage } = useIntl();
  const localization = {
    pagination: {
      rowsPerPage: <FormattedMessage id="rowsPerPage" />, // مثلا: "تعداد ردیف‌ها"
      previous: <FormattedMessage id="previous" />, // مثلا: "قبلی"
      next: <FormattedMessage id="next" />, // مثلا: "بعدی"
      page: <FormattedMessage id="page" />, // مثلا: "صفحه"
    },  
    // شما می‌توانید تنظیمات بیشتر برای متون مورد نظر اضافه کنید.
  };
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
        : columnsDesktop;
    }
    return columnsTablet;
  }, [isDesktop]);
  return (
    <div
      className={`h-100 w-100 ${
        setting[0].language === "Persian" && "iransans"
      }`}
      onClick={(e) => {
        if (
          e.target.className == "container mt-5" ||
          e.target.className == "main" ||
          e.target.className == "h-100 w-100"
        ) {
          setOpenBelance(false);
          setEdit(false);
          setAddAccountModal(false);
        } else {
        }
      }}
    >
      <div 
                  dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className="container mt-5" style={{ height: "100%" }}>
        <button
          onClick={handleAddAccount}
          type="submit"
          className="btn btn-info mb-1 p-1"
          style={{ width: "100px" }}
        >
          <FormattedMessage id="Add" />
        </button>
        <div
        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Customers"/>
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
          // title="Customers"
          columns={columns}
          data={records}
          onRowClicked={handleRowClick}
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
        />
        {
          <AccountEdit
            loading={loading}
            setLoading={setLoading}
            inputRef={inputRef1}
            close={() => setEdit(false)}
            account={editAccount1}
            setAccount={setEditAccount1}
            // records={records}
            // setRecords={setRecords}
            edit={edit}
            records={records}
            setRecords={setRecords}
          />
        }
        <Belance
          setMoney={setMoney}
          inputRef={inputRefbelance}
          belancem={belance}
          setbelance={setbelance}
          prof={prof}
          idprof={idprof}
          customer={customer}
          setcustomer={setcustomer}
          // money={money}
          money={moneyb}
          setmoney={setmoneyb}
          loading={loading}
          setLoading={setLoading}
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
          setEditAccount={setEditAccount}
          openBelance={openBelance}
          setOpenBelance={setOpenBelance}
        />
        {
          <AddAccount
            loading={loading}
            setLoading={setLoading}
            inputRef={inputRef}
            close={() => setAddAccountModal(false)}
            addAccountModal={addAccountModal}
            records={records}
            setRecords={setRecords}
          />
        }
      </div>
    </div>
  );
}
