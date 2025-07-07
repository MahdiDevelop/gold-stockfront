import React, { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Add from "../assets/icon/add.png";
import Belance from "./forms/Belance";
import Add_belance from "./Add_belance.js";
import AddAccount from "../pages/AddAccount.js";
import Trash from "../assets/icon/trash.png";
import Source from "../Source";
import Swal from "sweetalert2";
import { showAlert } from "../warrper.js";
import { gregorianToJalali } from "shamsi-date-converter";
import { useSelector, useDispatch } from "react-redux";
import { getBelances } from "./Redux/belanceSlice";
import { getMoneys } from "./Redux/moneysSlice.js";
import { getCustomers } from "./Redux/customerSlice";
import Edit_account from "./forms/Edit_account.js";
import ListBox from "./forms/ListBox.js";
import Datepicker_Customer from "./forms/Datepicker_customer";
import jalaali from "jalaali-js";
import moment from "moment-jalaali";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../warrper";
const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with thousand separators
};

export default function Account({ user, }) {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  // const { belances, errorb ,statusb} = useSelector((state) => state.belances);
  // const { moneys, errorm ,statusm} = useSelector((state) => state.moneys);
  // const { customer, errorc ,statusc} = useSelector((state) => state.customers);
  //  useEffect(() => {
  //    // بررسی و بارگذاری `belances`
  //    if (!statusb ) {
  //      dispatch(getBelances());
  //    }

  //    // بررسی و بارگذاری `moneys`
  //    if (!statusm  ) {
  //      dispatch(getMoneys());
  //    }

  //    // بررسی و بارگذاری `customers`
  //    if (!statusc) {
  //      dispatch(getCustomers());
  //    }
  //  }, [dispatch, statusb, belances,customer,moneys,statusc, statusm]);
  const [money, setmoney] = useState([]);
  // const [customers,setcustomers]=useState(customers);
  const [accounts, setAccounts] = useState([]);
  //   useEffect(() => {
  //     axios.get(Source.getAddress() + '/api/customers', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //       },params: {
  //         delete: 'False',
  //       },
  //     }).then((res)=>{
  //       setcustomers(res.data);
  //     }).catch((err)=>{
  //       console.log(err);
  //     });

  //   },[]);
  // useEffect(()=>{
  // axios.get(Source.getAddress() + '/api/money', {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //   },params: {
  //     delete: 'False',
  //   },
  // }).then((res)=>{
  //   console.log(res);
  //   setmoney(res.data);
  // }).catch((err)=>{
  //   console.log(err);
  // });
  // },[]);

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
        selector: (row) => date(row.date_created),
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
    // new
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
      </strong>, selector: (row) => row.user_name },
    {
      name: <strong dir="">
        <FormattedMessage id="Balance" />
      </strong>,
      
      selector: (row) => (
        <span dir="ltr">{formatNumber(row.belance)}</span>
      ),
    },

    { name: <strong><FormattedMessage id="Currency" />
</strong>, selector: (row) => row.moneyType },

    {
      name: <strong><FormattedMessage id="Date Created" />
</strong>,
      selector: (row) => date(row.date_created),
    },
    
    {
      name: <strong><FormattedMessage id="Customer Name" />
</strong>,
      selector: (row) => row.account_name,
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
  // useEffect(()=>{
  //  axios.get(Source.getAddress() + '/api/belance', {
  //    headers: {
  //      'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //    },params: {
  //      delete: 'False',
  //    },
  //  }).then((res)=>{
  //    setAccounts(res.data);
  //    setRecords(res.data);
  //  }).catch((err)=>{
  //    console.log(err);
  //  });
  // },[]);
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

  const res = useMemo(() => window.innerWidth > 768, []);

  // useEffect(() => {
  //   setRecords(accounts);
  // }, [accounts]);

  const handleRowClick = (row) => {
    if (!checkBelanceResult[row.id]) {
      OnRowClick();
      setSelectedOption({ name: row.account_name, account: row.account });
      setnmoney({ name: row.moneyType, moneyid: row.moneyid });
      setEditFull(row);
      setEditbelance({
        ...editbelance,
        account: row.account,
        type: row.type,
        belance: row.belance,
        date_created: row.date_created,
        user: row.user,
        isdelete: row.isdelete,
      });
      setEditAccountModal(true);
      const find = records.filter((p) => p.account === row.account);
      let moneys = [];
      for (let i = 0; i < money.length; i++) {
        const res = find.find((r) => r.type === money[i].id);
        if (!res) {
          moneys.push(money[i]);
        }
      }
      moneys.push({ name: row.moneyType, moneyid: row.moneyid });
      setSmeony(moneys);
    }
  };

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
  // const [data, setData] = useState([]);
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
      const response = await axios.get(Source.getAddress() + "/api/belance", {
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
        _method:"put"
      };
      // row.isdelete = 1;
      axios
        .post(
          Source.getAddress() + "/api/belance/" + `${row.id}`,
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
  useEffect(() => {
    inputRef.current.select();
  }, [addAccountModal]);
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
  return (
    <div
      className="w-100 h-100"
      onClick={(e) => {
        if (e.target.className === "w-100 h-100") {
          setAddAccountModal(false);
        }
      }}
    >
      <div className="container mt-5 p-0"
                        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      >
        <button
          onClick={() => {
            OnRowClick();
            setAddAccountModal(true);
          }}
          type="submit"
          className="btn btn-info mb-1 p-1"
          style={{ width: "100px", color: "white" }}
        >
          <FormattedMessage id="Add" />
        </button>
        <div
        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Accounts"/>
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
        {openBelance && (
          <Belance
            close={() => setOpenBelance(false)}
            id={id}
            accountbelance={editAccount}
          />
        )}
        <Add_belance
          // options={customers}
          // setOptions={setcustomers}
          // customers={customers}
          accounts={accounts}
          setAccounts={setAccounts}
          close={() => setAddAccountModal(false)}
          addAccountModal={addAccountModal}
          records={records}
          setRecords={setRecords}
          money={money}
          settings={settings}
          setAddcustomerModal={setAddcustomerModal}
        />
        <Edit_account
          smoney={smoney}
          setsmeony={setSmeony}
          add={add}
          setadd={setAdd}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          nmoney={nmoney}
          setnmoney={setnmoney}
          Editefull={editFull}
          setEditeFull={setEditFull}
          bbelance={editbelance}
          setbbelance={setEditbelance}
          // customers={customers}
          accounts={accounts}
          setAccounts={setAccounts}
          close={() => setEditAccountModal(false)}
          addAccountModal={editAccountModal}
          records={records}
          setRecords={setRecords}
          money={money}
          settings={settings}
        />
        <AddAccount
          // loading={loading}
          // setLoading={setLoading}
          inputRef={inputRef}
          close={() => setAddcustomerModal(false)}
          addAccountModal={AddcustomerModal}
          records={records}
          setRecords={setRecords}
        />
      </div>
    </div>
  );
}
