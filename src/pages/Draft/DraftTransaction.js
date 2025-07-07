import React, { useState, useEffect, useMemo } from "react";
import Datepicker from "../forms/Datepicker";
import DataTable from "react-data-table-component";
import axios from "axios";
import { showAlert } from "../../warrper";
import AccountEdit from "../CustomersEdit";
// import Add from '../assets/icon/add.png';
import Belance from "../forms/Belance";
import AddAccount from "../AddAccount";
import { gregorianToJalali } from "shamsi-date-converter";
import Source from "../../Source";
import Swal from "sweetalert2";
import Recover from "../../assets/icon/recover.png";
import Trash from "../../assets/icon/trash.png";
import moment from "moment-jalaali";
import { useRef } from "react";
// import ComboBoxDeposite from "./Transformations/ComboBoxDeposite";
// import ListBox from "./forms/ListBox";
import ListBox from "../forms/ListBox";
import Datepicker_Customer from "../forms/Datepicker_customer";
import { useSelector, useDispatch } from 'react-redux';
import jalaali from "jalaali-js";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
// import { useShowAlert  } from "../warrper";
import { useShowAlert  } from "../../warrper";


const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};

export default function DraftTransaction({
  user,
  // settings,
}) {
  const showAlert = useShowAlert(); 
  const [value, setValue] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const { settings, statuss } = useSelector((state) => state.settings);
   const [selecteduser, setSelecteduser] = useState();
    const { users, statusu } = useSelector((state) => state.users);
    const [namesearch, setnameSearch] = useState();
    // const [EndDate, setEndDate] = useState();
    //   const [StartDate, setStartDate] = useState();
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



  const [Cash,setCash]=useState([]);
  const [belance,setbelance]=useState([]);
  const [withdraw,setwithdraw]=useState([]);

  let cash = [];
  // cash = Cash;

  
  // useEffect(()=>{
  //   const startDate = new Date();
  //   const endDate = new Date();
  //   startDate.setDate(startDate.getDate() - 30);
  //   endDate.setDate(endDate.getDate() + 1);
  // axios.get(Source.getAddress() + '/api/report/', {
  //   headers:{
  //     Authorization: `Bearer ${localStorage.getItem('access')}`,
  //   },
  //   params: {
  //     delete:1,
  //     startDate: startDate.toISOString(),
  //     endDate: endDate.toISOString(), 
  //   },
  // }).then((res)=>{
  //   setRecords(res.data);
  //   setwithdraw(res.data);
  // }).catch((res)=>{
  //   console.log(res);
  // });
  // });
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/belance/', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     setbelance(res.data);
  //     name = res.data;
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  //  },[]); 
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
      const response = await axios.get(Source.getAddress()+'/api/report', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        params: {
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          delete: 0,StartDate: StartDate&& Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
         type:"all"
        },
      });
      setRecords(response.data.data); // داده‌های صفحه جاری
      setwithdraw(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
      setLoading(false);
    }
  };

  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage, EndDate, StartDate, selecteduser,namesearch]);

  //  useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/money/', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     setCash(res.data);
  //     cash=res.data;
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  // },[]);
  
  
  // name = belance;
  const [moneytype, setmoneytype] = useState(0);
  const [money1, setmoney] = useState({ name: "", cach: 0 });
  const [records, setRecords] = useState([]);
  const [openBelance, setOpenBelance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [id, setId] = useState("");
  const [idbelance, setidbelance] = useState(0);
  const [Popup, setPopup] = useState(false);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [RotateResotore, setRotateResotore] = useState(false);
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها

  const delete_restore = async (row) => {
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
              confirmButtonText: intl.formatMessage({id:"Yes, restore it!"})
              ,
              cancelButtonText: intl.formatMessage({id:"No, cancel!"})
              ,
              reverseButtons: true,
     });

     row._method="put";

    if (result.isConfirmed) {
      try {
        await axios.post(
          Source.getAddress() + `/api/report/${row.id}`,
          row,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
              // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
            },
            params:{type:'restore'}
          }
        );
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== row.id)
        );
        showAlert({
                 position: "center",
                 icon: "success",
                //  title: `${row.type} record successfully restored!`,
                          // title: <FormattedMessage id="Restored successfully!"/>,
                                            title:<FormattedMessage id="Restored successfully!"/>,
                 showConfirmButton: false,
                 timer: 600,
               });
      } catch (err) {
        // console.log('Error:', err);
        swalWithBootstrapButtons.fire({
          title: "Error",
          // text: "There was an error restoring your file.",
                                            // title: <FormattedMessage id="Something went wrong!"/>,            
                                                      title:intl.formatMessage({id:"Something went wrong!"}),
                                            
          icon: "error",
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        // text: "Your imaginary file is safe :)",
                                // text: <FormattedMessage id="Your record is safe :)"/>,
                                title:intl.formatMessage({id:"Cancelled"}),
                                text:intl.formatMessage({id:"Your record is safe :)"}),
        icon: "error",
      });
    }
  };
  const onChange = (row) => {
    setPopup(true);
    setValue(row.target.value);
  };
  const [selectedBelance, setselectedBelance] = useState({
    account: 0,
    type: 0,
    belance: 0,
    date_created: "",
  });

  const filterDeposite = () => {
    // console.log(StartDate);
    const startDate = new Date(
      `${StartDate.year}-${StartDate.month}-${StartDate.day}`
    ); // Start date
    const endDate = new Date(`${EndDate.year}-${EndDate.month}-${EndDate.day}`); // End date
    endDate.setDate(endDate.getDate() + 2);
    const type = "withdraw";
    axios
      .get(Source.getAddress() + "/api/report/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },
        params: {
          startDate: startDate,
          endDate: endDate,
          delete: "True",
        },
      })
      .then((res) => {
        showAlert({
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
        showAlert({
          position: "top-end",
          icon: "error",
          title: "Something went wrong !",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const handleDeposite = (e) => {
    setAddDeposite({
      ...AddDeposite,
      [e.target.name]: e.target.value,
    });
  };
  const Onsearch = (row) => {
    setmoneytype(row.moneyId);
    setidbelance(row.id);
    setselectedBelance((prevState) => ({
      ...prevState,
      account: row.account,
      type: row.type,
      belance: row.belance, // Assuming 'belance' is correct, it seems like a typo
      date_created: row.date_created,
    }));
    let belanceName = row.account_name + " " + row.moneyType;
    setAddDeposite({
      ...AddDeposite,
      account: row.id,
    });
    setPopup(false);
    // console.log(belanceName)
    setValue(belanceName);
    // console.log('s  earch ',row);
  };

  const [AddDeposite, setAddDeposite] = useState({
    description: "",
    amount: 0,
    date: null,
    account: 0,
    type: "withdraw",
    cash: 0,
  });
  const delete_report = async (row) => {
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
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.post(
          `${Source.getAddress()}/api/report/${row.id}`,{  _method: 'delete'},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== row.id)
        );
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Record successfully Deleted",
                                  title: <FormattedMessage id="record successfully deleted!"/>,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        try {
          const refreshToken = localStorage.getItem("refresh");
          const refreshResponse = await axios.post(
            `${Source.getAddress()}api/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          // Save the new access token
          localStorage.setItem("access", refreshResponse.data.access);
          // Retry the delete request with the new access token
          const retryResponse = await axios.post(
            `${Source.getAddress()}api/report/${row.id}/`,
            {
          _method:"put"
            }
            ,
            {
              headers: {
                Authorization: `Bearer ${refreshResponse.data.access}`,
              },
            }
          );
          showAlert({
            position: "center",
            icon: "success",
            // title: "Record successfully deleted !",
            title: <FormattedMessage id="record successfully deleted!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
          // console.log('Report deleted successfully after refreshing token:', retryResponse.data);
        } catch (refreshError) {
          // console.error('Failed to refresh token:', refreshError);
          swalWithBootstrapButtons.fire({
            title: "Error",
            // text: "There was an error deleting your file.",
                        title: <FormattedMessage id="Something went wrong!"/>,
            icon: "error",
          });
        }
        // } else {
        //   // console.error('Error deleting report:', error);
        // }
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        // text: "Your imaginary file is safe :)",
        text: <FormattedMessage id="Your record is safe :)"/>,
        icon: "error",
      });
    }
  };

  const primary = useMemo(() => {
    // const record= Cash.filter((item)=>{item.id==moneytype});
    if (selectedBelance.belance === "0") {
      return -parseInt(AddDeposite.amount);
    } else {
      let primar = parseInt(selectedBelance.belance);
      primar -= parseInt(AddDeposite.amount);
      return primar;
    }
  });

  const updatemoney = useMemo(() => {
    const record = cash.find((item) => item.id === moneytype);
    if (record) {
      let money = parseInt(AddDeposite.amount);
      let primmoney = parseInt(record.cach);
      let sum = primmoney - money;
      setAddDeposite({
        ...AddDeposite,
        cash: sum,
      });
      return { name: record.name, cash: sum };
    } else {
      // Handle the case when record is undefined
      return { name: "", cash: 0 };
    }
  }, [Cash, moneytype, AddDeposite.amount]);

  // const Now_date=new Date();
  // console.log(now_date);
  const [addreport, setaddreport] = useState({
    discription: "",
    amount: 0,
    date: "",
    // type: '',
    account: 0,
    // money:'',
  });

  const handlereport = (e) => {
    setaddreport({
      ...addreport,
      [e.target.name]: e.target.value,
    });
  };

  // const [res,setres]=useState(false);
  // console.log(withdraw)
  const res = useMemo((result) => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });
  const convertToKabulTime = (dateStr) => {
    const dateObj = new Date(dateStr);
    dateObj.setMinutes(dateObj.getMinutes() + 540); // Kabul is UTC+4:30
    const formattedDateStr = dateObj.toISOString().slice(0, 16);
    return formattedDateStr;
  };
  // useEffect(() => {
  //   let datetime = new Date();
  //   const jalaliDate12 = {
  //     year: datetime.getFullYear(),
  //     month: datetime.getMonth() + 1,
  //     day: datetime.getDay(),
  //   };
  //   const { year, month, day } = jalaliDate12;
  //   const t = new Date();
  //   const date = new Date();
  //   const isoString = date.toISOString();
  //   const fetchAccounts = async () => {
  //     const token = localStorage.getItem("access");
  //     if (!token) return;
  //     const fetchWithToken = async (token) => {
  //       const startDate = new Date();
  //       const endDate = new Date();
  //       startDate.setDate(startDate.getDate() - 10);
  //       endDate.setDate(endDate.getDate() + 10);
  //       try {
  //         const response = await axios.get(
  //           Source.getAddress() + "/api/report/",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //             params: {
  //               startDate: startDate.toISOString(),
  //               endDate: endDate.toISOString(),
  //               delete: "True",
  //             },
  //           }
  //         );
  //         setRecords(response.data);
  //       } catch (error) {
  //         if (error.response && error.response.status === 401) {
  //           const refreshToken = localStorage.getItem("refresh");
  //           if (!refreshToken) return;

  //           try {
  //             const refreshResponse = await axios.post(
  //               Source.getAddress() + "/api/token/refresh/",
  //               {
  //                 refresh: refreshToken,
  //               }
  //             );
  //             const newAccessToken = refreshResponse.data.access;
  //             localStorage.setItem("access", newAccessToken);
  //             await fetchWithToken(newAccessToken);
  //           } catch (refreshError) {
  //             console.error("Error refreshing access token:", refreshError);
  //           }
  //         } else {
  //           console.error("Error fetching accounts:", error);
  //         }
  //       }
  //     };

  //     await fetchWithToken(token);
  //   };
  //   fetchAccounts();
  //   // setRecords();
  //   let news = new Date();
  //   let mmm = news.toISOString().slice(0, 16);
  //   // let to = convertToKabulTime(mmm);
  //   setAddDeposite({
  //     ...AddDeposite,
  //     date: isoString,
  //     user: localStorage.getItem("userTokenid"),
  //   });
  //   setEndDate(
  //     `${news.getFullYear()}-${String(news.getMonth() + 1).padStart(
  //       2,
  //       "0"
  //     )}-${String(news.getDate()).padStart(2, "0")}`
  //   );
  //   news.setDate(news.getDate() - 1);
  //   setStartDate(
  //     `${news.getFullYear()}-${String(news.getMonth() + 1).padStart(
  //       2,
  //       "0"
  //     )}-${String(news.getDate()).padStart(2, "0")}`
  //   );
  // }, [withdraw]);

  const handleRowClick = (row) => {
    setEditAccount(row);
    setEdit(true);
  };
  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );

    const hijriShamsiDate = `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;

    return hijriShamsiDate;
  };
  const date = (d) => {
      const date = new Date(d);
  
      let formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      let aa = ampm;
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      if (settings[0].date === "Persian") {
        moment.locale("fa"); // تنظیم لوکال به فارسی
        aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
        formattedDate = moment(d).format("jYYYY-jMM-jDD");
      } else {
        moment.locale("en"); // تنظیم لوکال به انگلیسی
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
    const newData = withdraw.filter((row) => {
      if (typeof row.customer === "string") {
        if (
          row.customer.toLowerCase().includes(e.target.value.toLowerCase()) ||
          row.moneyType.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return row.customer;
        }
      }
      return false;
    });
    setRecords(newData);
  };

  const ShowDeposit = (type) => {
    return (
      <p
        className={`text-capitalize position-static p-2 mb-0 ${
          type === "deposite" ? "bg-success" : type==='withdraw' ? "bg-danger" : "bg-primary"
          // if(type==='deposite') return "bg-success"
          // else if(type==='withdraw')'bg-danger'
          // else "bg-primary"
        } rounded text-light text-center `}
        style={{ width: "75px" }}
      >
        {type}
      </p>
    );
  };

  const PDcolumn = [
    {
      name: <strong><FormattedMessage id="ID"/></strong>,
      selector: (row) => row.id,
      //  sortable: true
    },

    {
      name: <strong><FormattedMessage id="Customer Name"/></strong>,
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },
    {
      name: <strong><FormattedMessage id="Transactions"/></strong>,
      selector: (row) => ShowDeposit(row.type),
    },
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "200px", width: "200px" }}
        >
          <FormattedMessage id="Date Created"/>
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
      },
      // sortable: true,
    },
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },
    {
      name: <strong>          <FormattedMessage id="Currency"/>
</strong>,
      selector: (row) => row.moneyType,
      //  sortable: true
    },
    {
      name: <strong>          <FormattedMessage id="Amount"/></strong>,
      selector: (row) => formatNumber(row.amount),
      //  sortable: true
    },
    {
      name: <strong>          <FormattedMessage id="Description"/></strong>,
      selector: (row) => row.discription,
    },
    // {
    //   name: <strong>Cash Belance</strong>,
    //   selector: (row) => formatNumber(row.cash),
    // },
    {
      name: <strong>          <FormattedMessage id="Added By"/></strong>,
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
          <FormattedMessage id="Restore"/>
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            delete_restore(row);
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          {row.cach}
          <img
            height={"30%"}
            width={"30%"}
            src={Recover}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
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
                    <FormattedMessage id="Delete"/>
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            delete_report(row);
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"22%"}
            width={"22%"}
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
    {
      name: "Date Created",
      selector: (row) => row.date_created,
      sortable: true,
    },
    { name: "moneyType", selector: (row) => row.moneyType, sortable: true },
    { name: "belance", selector: (row) => row.belance, sortable: true },
  ];
      const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const columns = useMemo(() => {
      let selectedColumns;
    
      if (
        localStorage.getItem("language") === "pa" ||
        localStorage.getItem("language") === "da"
      ) {
        selectedColumns = [...PDcolumn]; // معکوس کردن ستون‌ها
      }else{
        selectedColumns=PDcolumn;
      }
      return selectedColumns;
    }, [isDesktop]);
  const [select_user, setselect_user] = useState("");
  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = withdraw.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
      console.log(e.target.value);
    } else {
      setRecords(withdraw);
    }
    setselect_user(e.target.value);
  };

  const filterRef = useRef(null);

  const Hanlderef = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (filterRef.current) {
        filterRef.current.click(); // Programmatically click the button
      }
    }
  };
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
  return (
    <div className="container mt-5">
      <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Draft Transactions"/></h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date_start}
              lebal={          <FormattedMessage id="Start"/>              }
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
            ></Datepicker_Customer>
          </div>
          <div className="mb-1 mt-1 mb-lg-0 me-lg-2">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date_end}
              lebal={          <FormattedMessage id="End"/>              }
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
                localization={localization} // ارسال ترجمه‌ها      

        columns={columns}
        data={records}
        onRowClicked={handleRowClick}
        striped
        responsive
        highlightOnHover
        pagination
      />
      {edit && (
        <AccountEdit
          close={() => setEdit(false)}
          account={editAccount}
          setAccount={setEditAccount}
        />
      )}
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
    </div>
  );
}
