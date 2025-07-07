import React, { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Add from "../../assets/icon/add.png";
// import Belance from "./forms/Belance";
// import Add_belance from "./Add_belance.js";
// import AddAccount from "../pages/AddAccount.js";
import Trash from "../../assets/icon/trash.png";
import Source from "../../Source";
import Swal from "sweetalert2";
// import { showAlert } from "../warrper.js";
import { gregorianToJalali } from "shamsi-date-converter";
import { useSelector, useDispatch } from "react-redux";
// import { getBelances } from "./Redux/belanceSlice";
// import { getMoneys } from "./Redux/moneysSlice.js";
// import { getCustomers } from "./Redux/customerSlice";
// import Edit_account from "./forms/Edit_account.js";
import ListBox from "../forms/ListBox.js";
import Datepicker_Customer from "../forms/Datepicker_customer";
import jalaali from "jalaali-js";
import moment from "moment-jalaali";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../../warrper";
import AddExpense from "./AddExpense.js";
import UpdateExpense from "./UpdateExpense.js";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';



const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};

export default function Expenses() {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  const [formattedValue, setFormattedValue]=useState("");
  const [AddExpenseModel,setAddExpenseModel]=useState(false);
  const [money, setmoney] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [AddExpenseData,setAddExpenseData]=useState({});
  const [selectedDay, setSelectedDay] = useState(); 
  const { settings, statuss } = useSelector((state) => state.settings);
      const [selecteduser, setSelecteduser] = useState();
      const { users, statusu } = useSelector((state) => state.users);
      const [namesearch, setnameSearch] = useState();
        const [Date_Start, setDate_start] = useState();
        const [Date_End, setDate_end] = useState();
        const [StartDate,setStartDate]=useState();
        const [EndDate,setEndDate]=useState();
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
          }
        };
        const handle_date_end = (jalaliDate) => {
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
            setDate_end(isoString);
          }
        };
        const handleName = (e) => {
          setnameSearch(e.target.value);
      };  
  const [records, setRecords] = useState([]);

  
  const [belance, setBelance] = useState([]);
  const [openBelance, setOpenBelance] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [id, setId] = useState("");
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [editAccountModal, setEditAccountModal] = useState(false);
  const [isBelanceEmpty, setIsBelanceEmpty] = useState(false);
  const [checkBelanceResult, setCheckBelanceResult] = useState({});
  const [selectedOption, setSelectedOption] = useState();
  const [nmoney, setnmoney] = useState(null);
  const [smoney, setSmeony] = useState([]);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const columnsDesktop = [
      { name: <strong>Account ID</strong>, selector: (row) => row.id },
      {
        name: <strong>Customer Name</strong>,
        selector: (row) => row.account_name,
      },
      {
        name: <strong>Date Created</strong>,
        // selector: (row) => date(row.date_created),
      selector: (row) => row.date ? date(row.date) :"-",
      },
      { name: <strong>Money Type</strong>, selector: (row) => row.moneyType },
      {
        name: <strong>Balance</strong>,
        selector: (row) =>formatNumber(row.belance),
      },
      { name: <strong>Added by</strong>, selector: (row) => row.user_name },
      {
        name: (
          <strong
            style={{
              textAlign: "center",
              backgroundColor: "transparent",
              width: "100%",
            }}
          >
            Delete
          </strong>
        ),
        selector: (row) => (
          <button
            className={`${row.ontransaction===1 ? "d-none" : ""}`}
            onClick={() => delete_report(row)}
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
              style={{ backgroundColor: "transparent" }}
            />
          </button>
        ),
      },
    ];
    
  const PDcolumn=[
    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
<FormattedMessage id="Delete" />
        </strong>
      ),
      selector: (row) => (
        <button
          className={`${row.ontransaction===1 ? "d-none" : ""}`}
          onClick={() => delete_report(row)}
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
            style={{ backgroundColor: "transparent" }}
          />
        </button>
      ),
    },
    { name: <strong>
      <FormattedMessage id="Added By" />
      </strong>, selector: (row) => row.user?.name },
    {
      name: <strong>
        <FormattedMessage id="Amount" />
      </strong>,
      selector: (row) =>formatNumber(row.amount),
    },

    { name: <strong><FormattedMessage id="Currency" />
    </strong>, selector: (row) => row?.money?.name},

    {
      name: <strong><FormattedMessage id="Date Created" />
    </strong>,
      selector: (row) => row.date ? date(row.date) :"-",
    },
    {
        name: <strong><FormattedMessage id="Description" />
      </strong>,
        selector: (row) => row.description,
      }, 
    {
      name: <strong><FormattedMessage id="Expense Type" />
    </strong>,
      selector: (row) => row?.category?.name,
    },
    { name: <strong><FormattedMessage id="ID" />
    </strong>, selector: (row) => row.id },

  ];

  const [editbelance, setEditbelance] = useState({
    account: null,
    type: null,
    belance: 0,
    date_created: "",
    user: null,
    isdelete: false,
  });
  const [add, setAdd] = useState({
    id: 0,
    account: 0,
    type: 0,
    account_name: "",
    belance: 0,
    date_created: "",
    moneyType: "",
    account_name: "",
    moneyId: 0,
    user: 0,
    user_name: "",
    isdelete: false,
  });
  const [editFull, setEditFull] = useState({});
  const [EditModel,setEditModel]=useState(false);
  const res = useMemo(() => window.innerWidth > 768, []);
    const [selectedOptionmoney, setSelectedOptionmoney] = useState({ name: "" });
  const handleRowClick = (row) => {
    setSelectedDay(moment(row.date));
    setSelectedOptionmoney(row.money);
     setSelectedOption1(row.category);
    getcustomer();
    setAddExpenseData(row);
    setEditModel(true);
    setFormattedValue(row.amount);
    // if (!checkBelanceResult[row.id]) {
    //   OnRowClick();
    //   setSelectedOption({ name: row.account_name, account: row.account });
    //   setnmoney({ name: row.moneyType, moneyid: row.moneyid });
    //   setEditFull(row);
    //   setEditbelance({
    //     ...editbelance,
    //     account: row.account,
    //     type: row.type,
    //     belance: row.belance,
    //     date_created: row.date_created,
    //     user: row.user,
    //     isdelete: row.isdelete,
    //   });
    //   setEditAccountModal(true);
    //   const find = records.filter((p) => p.account === row.account);
    //   let moneys = [];
    //   for (let i = 0; i < money.length; i++) {
    //     const res = find.find((r) => r.type === money[i].id);
    //     if (!res) {
    //       moneys.push(money[i]);
    //     }
    //   }
    //   moneys.push({ name: row.moneyType, moneyid: row.moneyid });
    //   setSmeony(moneys);
    // }
  };


  const flattenData = (dataArray) => {
    return dataArray.map(item => ({
      // فیلدهای سطح اول
      id: item.id,
      amount: item.amount,
      description: item.description,
      date: item.date || '-', // جایگزینی null با '-'
      created_at: item.created_at,
      
      // فیلدهای تودرتو - category
      'category.id': item.category?.id || '-',
      'category.name': item.category?.name || '-',
      
      // فیلدهای تودرتو - money
      'money.id': item.money?.id || '-',
      'money.name': item.money?.name || '-',
      'money.ontransaction': item.money?.ontransaction || '-',
      
      // فیلدهای تودرتو - user
      'user.id': item.user?.id || '-',
      'user.name': item.user?.name || '-',
      'user.category': item.user?.category || '-'
    }));
  };

  const exportToExcel = (originalData) => {
    const flatData = flattenData(originalData);
    
    // تبدیل هدرها به فارسی
    const persianMappedData = flatData.map(item => ({
      'شناسه': item.id,
      'مبلغ': item.amount,
      'توضیحات': item.description,
      'تاریخ': item.date,
      'تاریخ ایجاد': item.created_at,
      'دسته‌بندی (ID)': item['category.id'],
      'نام دسته‌بندی': item['category.name'],
      'ارز (ID)': item['money.id'],
      'نام ارز': item['money.name'],
      'وضعیت تراکنش': item['money.ontransaction'],
      'کاربر (ID)': item['user.id'],
      'نام کاربر': item['user.name'],
      'نوع کاربر': item['user.category']
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(persianMappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'هزینه‌ها');
    
    // تنظیم عرض ستون‌ها
    worksheet['!cols'] = [
      { width: 10 }, { width: 15 }, { width: 20 },
      { width: 15 }, { width: 20 }, { width: 15 },
      { width: 20 }, { width: 10 }, { width: 15 },
      { width: 20 }, { width: 10 }, { width: 20 },
      { width: 15 }
    ];
    
    XLSX.writeFile(workbook, 'هزینه_ها.xlsx');
  };

  // const exportToExcel = (data, fileName = 'خروجی.xlsx') => {
  //   // تبدیل آرایه آبجکت‌ها به یک شیت اکسل
  //   const worksheet = XLSX.utils.json_to_sheet(data);
    
  //   // ایجاد یک Workbook جدید و اضافه کردن شیت
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
  //   // دانلود فایل
  //   XLSX.writeFile(workbook, fileName);
  // };
  
  const date = (d) => {
    const date = moment.utc(d); // تبدیل تاریخ بدون در نظر گرفتن تایم زون
    let formattedDate = `${date.year()}-${String(date.month() + 1).padStart(2, "0")}-${String(date.date()).padStart(2, "0")}`;
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
    const newData = accounts.filter((row) => {
      if (typeof row.account_name === "string") {
        return (
          row.account_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          row.moneyType.toLowerCase().includes(e.target.value.toLowerCase())
        );
      }
      return false;
    });
    setRecords(newData);
  };
  
  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );
    return `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;
  };
 

  const columnsTablet = [
    {
      name: "account_name",
      selector: (row) => row.account_name,
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => row.date_created,
      sortable: true,
    },
    { name: "moneyType", selector: (row) => row.moneyType, sortable: true },
    { name: "Balance", selector: (row) =>formatNumber(row.belance), sortable: true },
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
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page); // برو به صفحه جدید
  };

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress() + "/api/expense", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          user_id: selecteduser?.id ? selecteduser.id : 1,
          page: page,
          perPage: pageSize,
          isdelete: 0,
          StartDate: StartDate&& Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
        },
      });
      console.log(response.data);
      setAccounts(response.data.data);
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage,EndDate, StartDate, selecteduser,namesearch]);
    const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها

  const delete_report = async (row) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    const result = await swalWithBootstrapButtons.fire({
        title:intl.formatMessage({id:"Are you sure?"})
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
      let belance_delete = {
        isdelete: 1,
        _method:"put",
        delete:"ok"
      };
      // row.isdelete = 1;
      axios
        .post(
          Source.getAddress() + "/api/expense/" + `${row.id}`,
          belance_delete,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            }, // Add the access token here
          }
        )
        .then((res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: intl.formatMessage({id:"record successfully deleted!"}),
            showConfirmButton: false,
            timer: 1000,
          });
          setRecords((prev)=> prev.filter((a) => a.id !== row.id));
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: intl.formatMessage({id:"Something went wrong!"}),            
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        // title: "Cancelled",
        title: intl.formatMessage({id:"Cancelled"}),
        // text: "Your imaginary file is safe :)",
                text: intl.formatMessage({id:"Your record is safe :)"}),
        icon: "error",
      });
    }
  };
  const [AddcustomerModal, setAddcustomerModal] = useState(false);
  const inputRef = useRef(null);
//   useEffect(() => {
//     inputRef.current.select();
//   }, [addAccountModal]);
  const OnRowClick = () => {
    axios
      .get(Source.getAddress() + "/api/money", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          delete: "False",
        },
      })
      .then((res) => {
        console.log(res);
        setmoney(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
      const [Type,setType]=useState([]);
      const[selectedOption1, setSelectedOption1]=useState({});
  const getcustomer = () => {
    if(Type.length===0){
      axios
        .get(Source.getAddress() + "/api/expense/category", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          // params: {
          //   // delete: "False",
          // },
        })
        .then((res) => {
          setType(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }   
    if(money.length===0){
        axios
          .get(Source.getAddress() + "/api/money", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            params: {
              delete: "False",
            },
          })
          .then((res) => {
            setmoney(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    const HandleExport= async ()=> {
      try {
        const response = await axios.get(Source.getAddress() + "/api/expense", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            // user_id: selecteduser?.id ? selecteduser.id : 1,
            // page: page,
            // perPage: pageSize,
            isdelete: 0,
            all:'ok'
            // StartDate: StartDate&& Date_Start,
            // EndDate: EndDate && Date_End,
            // search: namesearch?.length ? namesearch : 'false',
          },
        });

        exportToExcel(response.data, 'Expenses.xlsx'); // نام فایل اکسل
        // console.log(response.data);
        // setAccounts(response.data.data);
        // setRecords(response.data.data); // داده‌های صفحه جاری
        // setTotalRows(response.data.total); // تعداد کل ردیف‌ها
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }
  return (
    <div
      className="w-100 h-100"
      onClick={(e) => {
        if (e.target.className === "w-100 h-100") {
            setAddExpenseModel(false);
        }
      }}
    >
      <div className="container mt-5 p-0"
                        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      >
        <button
          onClick={() => {
            OnRowClick();
            getcustomer();
            setAddExpenseModel(true);
          }}
          type="submit"
          className="btn btn-info mb-1 p-1 mx-1"
          style={{ width: "100px", color: "white" }}
        >
          <FormattedMessage id="Add" />
        </button>
        <button
          onClick={() => {
            HandleExport();
          }}
          type="submit"
          className="btn btn-success mb-1 p-1"
          style={{ width: "100px", color: "white" }}
        >
          <FormattedMessage id="Export Excel" />
        </button>
        <div
        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Expenses"/>
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
          columns={columns}
          data={records}
          onRowClicked={handleRowClick}
          striped
          responsive
          progressPending={loading}
          // responsive
          highlightOnHover
          pagination
          paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
          paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
          onChangePage={handlePageChange} // تغییر صفحه
          // onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه
          localization={localization} // ارسال ترجمه‌ها      

        />
      </div>
      <AddExpense options={Type} setOptions={setType} AddExpenseModel={ AddExpenseModel} close={()=>setAddExpenseModel(false)} OptionsMoney={money} records={records} setRecords={setRecords} setAddExpenseModel={setAddExpenseModel}/>
      <UpdateExpense setOptions={setType}   selectedOptionmoney={selectedOptionmoney} setSelectedOptionmoney={setSelectedOptionmoney} OptionsMoney={money} formattedValue={formattedValue}  setFormattedValue={setFormattedValue}
       selectedOption={selectedOption1} setSelectedOption={setSelectedOption1} options={Type} AddExpenseData={AddExpenseData} setAddExpenseData={setAddExpenseData} records={records} setRecords={setRecords} AddExpenseModel={EditModel} close={()=>setEditModel(false)} selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
    </div>
  );
}
