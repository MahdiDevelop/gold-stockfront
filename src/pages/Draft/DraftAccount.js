import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Recover from "../../assets/icon/recover.png";
import Trash from "../../assets/icon/trash.png";
import Source from "../../Source";
import Swal from "sweetalert2";
import { gregorianToJalali } from "shamsi-date-converter";
import { showAlert } from "../../warrper";
import Datepicker_Customer from "../forms/Datepicker_customer";
import jalaali from "jalaali-js";
import moment from "moment-jalaali";
import { useSelector, useDispatch } from "react-redux";
import ListBox from "../forms/ListBox";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../../warrper";
const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with thousand separators
};

export default function DraftAccount({ user,  customers, money }) {
  
  const showAlert = useShowAlert(); 
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
  const [accounts, setAccounts] = useState([]);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // useEffect(() => {
  //   axios
  //     .get(Source.getAddress() + "/api/customers/", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access")}`,
  //       },
  //       params: {
  //         delete: "False",
  //       },
  //     })
  //     .then((res) => {
  //       setAccounts(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const res = useMemo(() => window.innerWidth > 768, []);
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
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          isdelete: 1,
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

  const date = (d) => {
    const date = new Date(d);
    let formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    if (settings[0].date === "Persian") {
      formattedDate = convertToHijriShamsi(
        `${formattedDate}  ${formattedHours}:${formattedMinutes} ${ampm}`
      );
    }
    return `${formattedDate}  ${formattedHours}:${formattedMinutes} ${ampm}`;
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

  const PDcolumn = [
    { name: <strong><FormattedMessage id="ID"/>
</strong>, selector: (row) => row.id },
    {
      name: <strong><FormattedMessage id="Customer"/></strong>,
      selector: (row) => row.account_name,
    },
    {
      name: <strong><FormattedMessage id="Date Created"/></strong>,
      selector: (row) => date(row.date_created),
    },
    { name: <strong><FormattedMessage id="Currency"/></strong>, selector: (row) => row.moneyType },
    {
      name: <strong><FormattedMessage id="Amount"/></strong>,
      selector: (row) => formatNumber(row.belance),
    },
    { name: <strong><FormattedMessage id="Added By"/></strong>, selector: (row) => row.user_name },
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
            height={"20%"}
            width={"20%"}
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
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
          <FormattedMessage id="Delete"/>
        </strong>
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
            height={"15%"}
            width={"15%"}
            src={Trash}
            style={{ backgroundColor: "transparent" }}
          />
        </button>
      ),
    },
  ];

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
    { name: "belance", selector: (row) => row.belance, sortable: true },
  ];
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
      axios
        .post(Source.getAddress() + "/api/belance/" + `${row.id}/`, {
        _method:"delete"
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          }, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        })
        .then((res) => {
          showAlert({
            position: "top-end",
            icon: "success",
            // title: "Updated successfully !",
                                    // title: <FormattedMessage id="record successfully deleted!"/>,
            title: <FormattedMessage id="Restored successfully!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
          setRecords(records.filter((a) => a.id !== row.id));
        })
        .catch((err) => {
          console.log(err);
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "Something went wrong !",
                        // title: <FormattedMessage id="Something went wrong!"/>,            
                                                title: <FormattedMessage id="Something went wrong!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        // title: "Cancelled",
        // text: "Your imaginary file is safe :)",
                // text: <FormattedMessage id="Your record is safe :)"/>,
                title:intl.formatMessage({id:"Cancelled"}),
                text:intl.formatMessage({id:"Your record is safe :)"}),        icon: "error",
      });
    }
  };

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
      // confirmButtonText: intl.formatMessage({id:"Yes, delete it!"})
      confirmButtonText: intl.formatMessage({id:"Yes, restore it!"})
      ,
      cancelButtonText: intl.formatMessage({id:"No, cancel!"})
      ,
      reverseButtons: true,
});

    if (result.isConfirmed) {
      let belance_delete = {
        // account: row.account,
        // type: row.type,
        // belance: row.belance,
        // date_created: row.date_created,
        // user: row.user,
        _method:"put",
        isdelete: 0,
      };
      // row.isdelete = 1;
      axios
        .post(
          Source.getAddress() + "/api/belance/" + `${row.id}/`,
          belance_delete,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            }, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          }
        )
        .then((res) => {
          showAlert({
            position: "top-end",
            icon: "success",
            // title: <FormattedMessage id="Restored successfully!"/>,
                              title:<FormattedMessage id="Restored successfully!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
          setRecords(records.filter((a) => a.id !== row.id));
        })
        .catch((err) => {
          console.log(err);
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "Something went wrong !",
            // title: <FormattedMessage id="Something went wrong!"/>,            
                              title:<FormattedMessage id="Something went wrong!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        // title: "Cancelled",
        // text: "Your imaginary file is safe :)",
                // text: <FormattedMessage id="Your record is safe :)"/>,
                title:intl.formatMessage({id:"Cancelled"}),
                text:intl.formatMessage({id:"Your record is safe :)"}),
                icon: "error",
      });
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
    <div className="w-100 h-100">
      <div className="container mt-5 p-0">
      <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Draft Accounts"/>
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
                  localization={localization} // ارسال ترجمه‌ها      
          columns={columns}
          data={records}
          striped
          responsive
          highlightOnHover
          pagination
          progressPending={loading}
          paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
          paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
          onChangePage={handlePageChange} // تغییر صفحه
        />
      </div>
    </div>
  );
}