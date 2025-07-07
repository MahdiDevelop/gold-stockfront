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
import html2pdf from "html2pdf.js";

const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with thousand separators
};

export default function Credit() {
  
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
          isdelete: 0,
          type: "credit",
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
const generatePDF = () => {
//   const intl = useIntl();
  const itemsPerPage = 30;
//   const totalPages = records?.length / itemsPerPage || 1;
  const totalPages = Math.ceil(records?.length / itemsPerPage) || 1;

  // توابع کمکی
//   const formatNumber = (num) => {
//     return  format(num);
//   };
//   const date = (dateString) => {
//     return new Date(dateString).toLocaleDateString('fa-IR');
//   };

  // آدرس تصویر شرکت
  const imageUrl = settings[0]?.company_pic;
  let imageSrc = "";
  if (imageUrl) {
    const fileName = imageUrl.split("/").pop();
    imageSrc = Source.getAddress() + "/api/getImage/" + fileName;
  }
  const isLTR = localStorage.getItem("language") === "en";
  // تولید HTML برای هر صفحه
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    const pageRecords = records?.slice(i * itemsPerPage, (i + 1) * itemsPerPage) || [];
    
    pages.push(`
   <div class="${i < totalPages - 1 ? 'page-break' : ''}" style="padding: 4mm; width: 210mm; height: auto; box-sizing: border-box;"
        dir="${isLTR ? 'ltr' : 'rtl'}"
   >
      <h1 style="text-align: center; margin: 0 0 20px 0; padding: 20px; color: white; font-weight: bold; background-color: #17a2b8;">
          ${intl.formatMessage({ id: 'debit.report' })}
        </h1>
        <div style="display: flex; justify-content: space-between; font-family: iransans; padding: 10px;">
          <div style="margin-top: 10px;"
        dir="${isLTR ? 'ltr' : 'rtl'}"
          >
            <p style="font-weight: bold;">
              ${intl.formatMessage({ id: 'Company Name' })}: ${settings[0]?.company_name || "-"}
            </p>
            <p style="font-weight: bold;">
              ${intl.formatMessage({ id: 'Address' })}: ${settings[0]?.address || "-"}
            </p>
            <p style="font-weight: bold;"
        dir="${isLTR ? 'ltr' : 'rtl'}"
            >
              ${intl.formatMessage({ id: 'Phone' })}: ${settings[0]?.phone || "-"}
            </p>
          </div>
          <div style="margin-top: 10px;"
        dir="${isLTR ? 'ltr' : 'rtl'}"
          >
            <p style="font-weight: bold;">
              ${intl.formatMessage({ id: 'Email' })}: ${settings[0]?.email || "-"}
            </p>
            <p style="font-weight: bold;">
              ${intl.formatMessage({ id: 'Description' })}: ${settings[0]?.description || "-"}
            </p>
          </div>
          <div style="width: 150px; height: 150px; border: 2px solid aliceblue; overflow: hidden;">
            <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="Profile"/>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; margin-top: 20px;"
        dir="${isLTR ? 'ltr' : 'rtl'}"
        >
          <thead>
            <tr style="background-color: #f0f0f5; font-weight: bold;">
              <th style="border: 1px solid #ddd; padding: 8px;">${intl.formatMessage({ id: 'No' })}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${intl.formatMessage({ id: 'Account Name' })}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${intl.formatMessage({ id: 'Currency' })}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${intl.formatMessage({ id: 'Amount' })}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${intl.formatMessage({ id: 'Date Created' })}</th>
            </tr>
          </thead>
          <tbody>
            ${pageRecords.map((row, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${(i * itemsPerPage) + index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${row.account_name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${row.moneyType}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${formatNumber(row.belance)}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${date(row.date_created)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${i < totalPages - 1 ? `
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            ${intl.formatMessage({ id: 'page.continue' })}
          </div>
        ` : ''}
      </div>
    `);
  }

  const reportHTML = `
    <div id="table-to-print">
      <style>
        @media print {
          body, html {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      </style>
      ${pages.join('')}
    </div>
  `;

  const element = document.createElement("div");
  element.innerHTML = reportHTML;
  document.body.appendChild(element);

  const options = {
    margin: 0,
    filename: `${intl.formatMessage({ id: 'customer.report' })}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: { 
      unit: "mm", 
      format: "a4", 
      orientation: "portrait",
      hotfixes: ["px_scaling"] 
    },
  };

  html2pdf()
    .from(element)
    .set(options)
    .save()
    .finally(() => {
      document.body.removeChild(element);
    });
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
        <button
                        onClick={()=>generatePDF()}
                        type="submit"
                        className="btn btn-info mb-1 p-1 text-white"
                        // style={{ width: "100px" }}
                      >
                        <FormattedMessage id="Print Pdf" />
                      </button>
      <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="credit.report"/>
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