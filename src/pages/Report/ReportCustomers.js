import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import Source from "../../Source";
import jalaali from "jalaali-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Multiselect from "multiselect-react-dropdown";
import { stringify } from "qs";
import moment from "moment-jalaali";
import "../Report/report.css";
// import Datepicker_customer from "../forms/Datepicker_customer";
import Datepicker_Customer from ".././forms/Datepicker_customer";
import { InputDatePicker } from "jalaali-react-date-picker";
// import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers } from "../Redux/customerSlice";
import { getSettings } from "../Redux/settingSlice";
import { RotateLoader } from "react-spinners";
import html2pdf from "html2pdf.js";
import Combo_Customer from "../forms/Combo_Customer";
import { FormattedMessage ,useIntl} from "react-intl";
import { useShowAlert } from "../../warrper";
// import "jspdf-rtl";
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};
export default function ReportCustomers() {
  const dispatch = useDispatch();
  const showAlert = useShowAlert();
  const { settings, errors, statuss } = useSelector((state) => state.settings);

  const [customer, setcustomers] = useState([]);
  const [accounts, setaccounts] = useState([]);
  const [selectedDayStart, setselectedDayStart] = useState();
  const [selectedDayEnd, setselectedDayEnd] = useState();
  const [Date_Start, setDate_Start] = useState();
  const [Date_End, setDate_End] = useState();
  const [Records, setRecords] = useState([]);
  const [setting, setsettings] = useState([
    {
      name: "",
      email: "",
      phone: "",
      address: "",
      description: "",
    },
  ]);
  const [Settings, Setsettings] = useState([]);
  const [searchQuery, setSearchQuery] = useState();

  useEffect(() => {
    // بررسی و بارگذاری `belances`
    // if (!statusb && belances?.lenght ===0) {
    //   dispatch(getBelances());
    // }

    // // بررسی و بارگذاری `moneys`
    // if (!statusm && moneys?.lenght ===0) {
    //   dispatch(getMoneys());
    // }

    // بررسی و بارگذاری `customers`
    // if (statusc != "succeeded" && !customers) {
    //   dispatch(getCustomers());
    //   console.log('customer');
    // }
    if (statuss !== "succeeded" && !settings) {
      dispatch(getSettings());
      console.log("SETTINGS");
    }
  }, [dispatch, , settings, statuss]);
  useEffect(() => {
    if (settings?.length > 0) {
      setsettings(settings);
    }
    // if (customers?.length > 0) {
    //   setcustomers(customers);
    // }
  }, [settings]);
  const handleDateChangeStart = (date) => {
    setselectedDayStart(date);
    if (date) {
      const handl = {
        year: date._a[0],
        month: date._a[1] + 1,
        day: date._a[2],
      };
      handle_date(handl);
    }
  };
  const handleDateChangeEnd = (date) => {
    setselectedDayEnd(date);
    if (date) {
      const handl = {
        year: date._a[0],
        month: date._a[1] + 1,
        day: date._a[2],
      };
      handle_dateEnd(handl);
    }
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
      // setAddDeposite({
      //   ...AddDeposite,
      //   date: isoString,
      // });
      setDate_Start(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handle_dateEnd = (jalaliDate) => {
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
      // setAddDeposite({
      //   ...AddDeposite,
      //   date: isoString,
      // });
      setDate_End(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValues(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedValues(selectedList);
  };

  const [selectedValues, setSelectedValues] = useState([]);
  const [Belance, setBelance] = useState([]);

  //   const fetchCustomers = async () => {
  //     const token = localStorage.getItem("access");
  //     if (!token) return;
  //     const fetchWithToken = async (token) => {
  //       try {
  //         const response = await axios.get(
  //           Source.getAddress() + "/api/customers",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //             params: {
  //               delete: "False",
  //             },
  //           }
  //         );
  //         setcustomers(response.data);
  //       } catch (error) {
  //         if (error.response && error.response.status === 401) {
  //           const refreshToken = localStorage.getItem("refresh");
  //           if (!refreshToken) return;

  //           try {
  //             const refreshResponse = await axios.post(
  //               Source.getAddress() + "/api/token/refresh",
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
  //   const fetchSettings = async () => {
  //     try {
  //       const sett = await axios.get(Source.getAddress() + '/api/settings', {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('access')}`,
  //         },
  //       });
  //       setsettings(sett.data);
  //     } catch (error) {
  //       console.error('Error fetching settings:', error);
  //     }
  //   };
  //   fetchSettings();
  //   fetchCustomers();
  // }, []);
  // console.log(accounts);
  const fetchAccounts = async (customerid) => {
    const token = localStorage.getItem("access");
    if (!token) return;
    const fetchWithToken = async (token) => {
      // console.log(customerid);
      // console.log(selectedDayStart);
      try {
        const res = await axios.get(Source.getAddress() + "/api/belance", {
          params: {
            delete: "False",
            CustomerId: customerid,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setaccounts(res.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const refreshToken = localStorage.getItem("refresh");
          if (!refreshToken) return;

          try {
            const refreshResponse = await axios.post(
              Source.getAddress() + "/api/token/refresh",
              {
                refresh: refreshToken,
              }
            );
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem("access", newAccessToken);
            await fetchWithToken(newAccessToken);
          } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
          }
        } else {
          console.error("Error fetching accounts:", error);
        }
      }
    };

    await fetchWithToken(token);
  };
  const [Customer, setCustomer] = useState();
  const [Report, SetReport] = useState([]);
  const handleCustomer = (data) => {
    setSearchQuery(data);
  };
  const Daterow = (d) => {
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

    return `${formattedDate}`;
  };
  const dateform = (d) => {
    const date = new Date(d);

    let formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (settings[0].date === "Persian") {
      moment.locale("fa"); // تنظیم لوکال به فارسی
      formattedDate = moment(d).format("jYYYY-jMM-jDD");
    } else {
      moment.locale("en"); // تنظیم لوکال به انگلیسی
    }
    return `${formattedDate}`;
  };
  // import jsPDF from 'jspdf';
  // import 'jspdf-autotable';

  let img = null;
  function fetchImageAndConvertToBase64(imageUrl) {
    fetch(Source.getAddress() + "/api/getImageBase64/" + imageUrl)
      .then((response) => response.json()) // واکشی داده‌ها از API
      .then((data) => {
        img = data.image;
        console.log(data.image);
      })
      .catch((error) => console.error("Error fetching image:", error));
  }
  // فراخوانی تابع با آدرس تصویر
  // console.log(customers);
  const containerRef = useRef();
  // const generatePDF = () => {
  //   if (!customername) {
  //     alert("Please select a customer!");
  //     return;
  //   }
  //   const element = containerRef.current;

  //   // Configuration options for high-quality PDF rendering
  //   const options = {
  //     html2canvas: {
  //       scale: 4,  // Increase the scale for higher resolution
  //       logging: false, // Optional: Disable logging for performance
  //       useCORS: true, // Ensure cross-origin images are captured correctly
  //       letterRendering: true,  // Improve the rendering of letters and fonts
  //     },
  //     jsPDF: {
  //       unit: "mm",
  //       format: "a4",
  //       orientation: "portrait",
  //     },
  //   };

  //   // Generate and save the PDF
  //   const imageUrl = settings[0]?.company_pic;

  //       if (imageUrl) {
  //     const fileName = imageUrl.split("/").pop(); // تقسیم رشته و گرفتن آخرین بخش
  //     const imageSrc = Source.getAddress() + "/api/getImage/" + fileName;
  //     // استفاده از html2pdf و اضافه کردن تصویر بعد از بارگذاری
  //     html2pdf()
  //       .from(element)
  //     .set(options)
  //       .toPdf()
  //       .get('pdf')
  //       .then(function (pdf) {
  //         const pageWidth = pdf.internal.pageSize.width;
  //         const pageHeight = pdf.internal.pageSize.height;
  //         const imgWidth = 30;
  //         const imgHeight = 30;
  //         const x = pageWidth - imgWidth - 10; // 10 پیکسل فاصله از لبه راست
  //         const y = 35; // 10 پیکسل فاصله از لبه بالای صفحه
  //         pdf.addImage(imageSrc, 'JPEG', x, y, imgWidth, imgHeight);
  //         pdf.save("report.pdf");
  //       });
  //   } else {
  //     html2pdf()
  //     .from(element)
  //     .set(options)
  //     .save("report.pdf");
  //   }

  // // In buttom is the style without in any html tage

  //   // ایجاد یک عنصر HTML برای محتوا
  //   // const imageUrl = settings[0]?.company_pic;
  //   // let pdfContent = `
  //   //   <div style="text-align: center; font-size: 18px; font-weight: bold; background-color: #4682B4; color: white; padding: 10px;">
  //   //   Report Cach Customer
  //   //   </div>
  //   //   <div style="font-size: 12px; padding: 10px;">
  //   //     <p>Company Name: ${setting[0]?.company_name || "N/A"}</p>
  //   //     <p>Address: ${setting[0]?.address || "N/A"}</p>
  //   //     <p>Phone: ${setting[0]?.phone || "N/A"}</p>
  //   //     <p>Email: ${setting[0]?.email || "N/A"}</p>
  //   //     <p>Customer: ${customername} from ${dateinpage ? dateform(dateinpage) : ""} To ${dateinpageend ? dateform(dateinpageend) : ""}</p>
  //   //   </div>
  //   // `;

  //   // // اضافه کردن جدول به محتوا
  //   // let tableContent = `
  //   // <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #000;">
  //   // <thead style="background-color: #007bff; color: white;">
  //   //   <tr>
  //   //     <th style="border: 1px solid #000; padding: 8px;">No</th>
  //   //     <th style="border: 1px solid #000; padding: 8px;">Description</th>
  //   //     <th style="border: 1px solid #000; padding: 8px;">Date</th>
  //   //     <th style="border: 1px solid #000; padding: 8px;">Currency</th>
  //   //     <th style="border: 1px solid #000; padding: 8px;">Deposit</th>
  //   //     <th style="border: 1px solid #000; padding: 8px;">Withdraw</th>
  //   //     <th style="border: 1px solid #000; padding: 8px;">Balance</th>
  //   //   </tr>
  //   // </thead>
  //   //     <tbody>
  //   // `;

  //   // let currentBalance = 0;
  //   // let No = 0;
  //   // let previousAccountId = null;
  //   // let accountTotalDeposit = 0;
  //   // let accountTotalWithdraw = 0;

  //   // Records.forEach((row, index) => {
  //   //   let firstBalance = 0;
  //   //   BelanceAccount.forEach(element => {
  //   //     if (element.account_id === row.account_id) {
  //   //       firstBalance = parseInt(element.total);
  //   //     }
  //   //   });

  //   //   if (firstBalance !== 0) {
  //   //     tableContent += `
  //   //       <tr>
  //   //         <td >${No}</td>
  //   //         <td style="border: 1px solid #000; padding: 8px;">This is from previous transactions!</td>
  //   //         <td style="border: 1px solid #000; padding: 8px;">${Daterow(row.date_created)}</td>
  //   //         <td style="border: 1px solid #000; padding: 8px;">${row.account.type.name}</td>
  //   //         <td style="color: green; border: 1px solid #000; padding: 8px;">${firstBalance > 0 ? firstBalance : "0"}</td>
  //   //         <td style="color: red; border: 1px solid #000; padding: 8px;">${firstBalance < 0 ? firstBalance : "0"}</td>
  //   //         <td style="border: 1px solid #000; padding: 8px;">${currentBalance}</td>
  //   //       </tr>
  //   //     `;
  //   //   }

  //   //   if (row.account.id !== previousAccountId) {
  //   //     currentBalance = (Belance.find((account) => account.id === row.account_id).balance || 0);
  //   //     previousAccountId = row.account.id;
  //   //     No = 1;
  //   //     accountTotalDeposit = 0;
  //   //     accountTotalWithdraw = 0;
  //   //   } else {
  //   //     No += 1;
  //   //   }

  //   //   if (row.type === "deposite") {
  //   //     currentBalance += parseInt(row.amount);
  //   //     accountTotalDeposit += parseInt(row.amount);
  //   //   } else if (row.type === "withdraw") {
  //   //     currentBalance -= parseInt(row.amount);
  //   //     accountTotalWithdraw += parseInt(row.amount);
  //   //   }

  //   //   tableContent += `
  //   //     <tr>
  //   //       <td style="border: 1px solid #000; padding: 8px;">${No}</td>
  //   //       <td style="border: 1px solid #000; padding: 8px;">${row?.description}</td>
  //   //       <td style="border: 1px solid #000; padding: 8px;">${Daterow(row.date_created)}</td>
  //   //       <td style="border: 1px solid #000; padding: 8px;">${row.account.type.name}</td>
  //   //       <td style="color: green; border: 1px solid #000; padding: 8px;">${row.type === "deposite" ? row.amount : "0"}</td>
  //   //       <td style="color: red; border: 1px solid #000; padding: 8px;">${row.type === "withdraw" ? row.amount : "0"}</td>
  //   //       <td style="border: 1px solid #000; padding: 8px;" >${currentBalance + firstBalance}</td>
  //   //     </tr>
  //   //   `;

  //   //   if (
  //   //     index === Records.length - 1 ||
  //   //     Records[index + 1].account_id !== row.account_id
  //   //   ) {
  //   //     tableContent += `
  //   //       <tr>
  //   //         <td colspan="4" style="border: 1px solid #000; padding: 8px;">Total for Account ${row.account.type.name}</td>
  //   //         <td style="color: green; border: 1px solid #000; padding: 8px;">${accountTotalDeposit + (firstBalance > 0 && firstBalance)}</td>
  //   //         <td style="color: red; border: 1px solid #000; padding: 8px;">${accountTotalWithdraw + (firstBalance < 0 && Math.abs(firstBalance))}</td>
  //   //         <td style="border: 1px solid #000; padding: 8px;">${currentBalance}</td>
  //   //       </tr>
  //   //     `;
  //   //   }
  //   // });

  //   // tableContent += `</tbody></table>`;
  //   // pdfContent += tableContent;

  //   // // استفاده از html2pdf برای تبدیل HTML به PDF
  //   // const element = document.createElement('div');
  //   // element.innerHTML = pdfContent; // افزودن محتوای HTML به عنصر

  //   // if (imageUrl) {
  //   //   const fileName = imageUrl.split("/").pop(); // تقسیم رشته و گرفتن آخرین بخش
  //   //   const imageSrc = Source.getAddress() + "/api/getImage/" + fileName;

  //   //   // استفاده از html2pdf و اضافه کردن تصویر بعد از بارگذاری
  //   //   html2pdf()
  //   //     .from(element)
  //   //     .toPdf()
  //   //     .get('pdf')
  //   //     .then(function (pdf) {
  //   //       const pageWidth = pdf.internal.pageSize.width;
  //   //       const pageHeight = pdf.internal.pageSize.height;
  //   //       const imgWidth = 30;
  //   //       const imgHeight = 30;
  //   //       const x = pageWidth - imgWidth - 10; // 10 پیکسل فاصله از لبه راست
  //   //       const y = 20; // 10 پیکسل فاصله از لبه بالای صفحه
  //   //       pdf.addImage(imageSrc, 'JPEG', x, y, imgWidth, imgHeight);
  //   //       pdf.save("report.pdf");
  //   //     });
  //   // } else {
  //   //   html2pdf().from(element).save("report.pdf");
  //   // }
  // };

  // };       این کد کامل است شما تغییرات لازم را بیاورید

  // تابع برای تولید PDF
    const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
    const generatePDF = () => {
      const imageUrl = settings[0]?.company_pic;
      let imageSrc = "";
      const isLTR = localStorage.getItem("language") === "en";
      if (imageUrl) {
        const fileName = imageUrl.split("/").pop();
        imageSrc = Source.getAddress() + "/api/getImage/" + fileName;
      }
      
      const reportHTML = `
        <div id="table-to-print" style="padding: 20px; border: 1px solid #ccc; border-top: 5px solid #4a5cf2; background-color: white;">
          <style>
            @media print {
              body {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .page-break {
                page-break-after: always;
                break-after: page;
              }
              .avoid-break {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              thead {
                display: table-header-group;
              }
              tfoot {
                display: table-footer-group;
              }
              tr {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              .table-container {
                page-break-inside: auto;
              }
            }
          </style>
          <h1 style="text-align: center; margin: 0 0 20px 0; padding: 20px; color: white; font-weight: bold; background-color: #17a2b8;">
            ${settings[0]?.company_name || "-"}
          </h1>
          <div style="display: flex; justify-content: space-between; font-family: iransans; padding: 10px;" dir="${isLTR ? 'ltr' : 'rtl'}">
            <div style="margin-top: 10px;" dir="${isLTR ? 'ltr' : 'rtl'}">
              <p style="font-weight: bold;">
                ${intl.formatMessage({ id: 'Address' })}: ${settings[0]?.address || "-"}
              </p>
              <p style="font-weight: bold;" dir="${isLTR ? 'ltr' : 'rtl'}">
                ${intl.formatMessage({ id: 'Phone' })}: ${settings[0]?.phone || "-"}
              </p>
              <p style="font-weight: bold;">
                ${intl.formatMessage({ id: 'Customer' })}: ${customername && customername}   ${dateinpage ? intl.formatMessage({ id: 'From' }):""}${dateinpage ? dateform(dateinpage) : ""} 
                ${dateinpageend ? intl.formatMessage({ id: 'To' }):""}${dateinpageend ? dateform(dateinpageend) : ""}
              </p>
            </div>
            <div style="margin-top: 10px;" dir="${isLTR ? 'ltr' : 'rtl'}">
              <p style="font-weight: bold;">
                ${intl.formatMessage({ id: 'Address' })}: ${settings[0]?.address || "-"}
              </p>
              <p style="font-weight: bold;">
                ${intl.formatMessage({ id: 'Date Print' })}: ${Daterow(new Date().toISOString()) || "-"}
              </p>
            </div>
            <div style="width: 150px; height: 150px; border: 2px solid aliceblue; overflow: hidden;">
              <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="Profile"/>
            </div>
          </div>
          <div style="overflow-x: auto;" class="table-container">
            <table style="width: 100%; border-collapse: collapse; text-align: center;"
             dir="${isLTR ? 'ltr' : 'rtl'}"
            >
              <thead>
                <tr style="background-color: #f0f0f5; font-weight: bold;">
                  <th style="border: 1px solid #ddd; padding: 10px;">${intl.formatMessage({ id: 'No' })}</th>
                  <th style="border: 1px solid #ddd; padding: 10px;">${intl.formatMessage({ id: 'Date' })}</th>
                  <th style="border: 1px solid #ddd; padding: 10px;">${intl.formatMessage({ id: 'Description' })}</th>
                  <th style="border: 1px solid #ddd; padding: 10px;">${intl.formatMessage({ id: 'Currency' })}</th>
                  <th style="border: 1px solid #ddd; padding: 10px; color: green;">${intl.formatMessage({ id: 'Deposit' })}</th>
                  <th style="border: 1px solid #ddd; padding: 10px; color: red;">${intl.formatMessage({ id: 'Withdraw' })}</th>
                  <th style="border: 1px solid #ddd; padding: 10px;">${intl.formatMessage({ id: 'Balance' })}</th>
                </tr>
              </thead>
              <tbody>
                ${Records?.map((row, index) => {
                  let firstBalance = 0;
                  BelanceAccount.forEach((element) => {
                    if (element.account_id === row.account_id) {
                      firstBalance = parseInt(element.total);
                    }
                  });
    
                  let isNewAccount = row.account.id !== previousAccountId;
                  if (isNewAccount) {
                    currentBalancep = 0;
                    previousAccountId = row.account.id;
                    No = 1;
                    accountTotalDepositp = 0;
                    accountTotalWithdraw = 0;
                  } else {
                    No += 1;
                  }
    
                  let deposit = 0, withdraw = 0;
                  if (["deposite", "to", "com"].includes(row.type)) {
                    deposit = parseInt(row.amount);
                    currentBalancep += deposit;
                    accountTotalDepositp += deposit;
                  } else if (["withdraw", "from"].includes(row.type)) {
                    withdraw = parseInt(row.amount);
                    currentBalancep -= withdraw;
                    accountTotalWithdrawp += withdraw;
                  }
    
                  let isLastTransaction = index === Records.length - 1 || Records[index + 1]?.account_id !== row.account_id;
    
                  return `
                    ${firstBalance !== 0 ? `
                      <tr class="avoid-break">
                        <td style="border: 1px solid #ddd; padding: 10px;">0</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${Daterow(Date_Start)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${intl.formatMessage({ id: 'table.previousBalance' })}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${row.account.type.name}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; color: green;"><span dir="ltr">${firstBalance > 0 ? firstBalance : "0"}</span></td>
                        <td style="border: 1px solid #ddd; padding: 10px; color: red;"><span dir="ltr">${firstBalance < 0 ? Math.abs(firstBalance) : "0"}</span></td>
                        <td style="border: 1px solid #ddd; padding: 10px;"><span dir="ltr">${formatNumber(firstBalance)}</span></td>
                      </tr>` : ""}
                    <tr class="avoid-break">
                      <td style="border: 1px solid #ddd; padding: 10px;">${No}</td>
                      <td style="border: 1px solid #ddd; padding: 10px;">${Daterow(row.date_created)}</td>
                      <td style="border: 1px solid #ddd; padding: 10px;">${row.discription !== null ? row.discription : '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 10px;">${row.account.type.name}</td>
                      <td style="border: 1px solid #ddd; padding: 10px; color: green;"><span dir="ltr">${formatNumber(deposit)}</span></td>
                      <td style="border: 1px solid #ddd; padding: 10px; color: red;"><span dir="ltr">${formatNumber(withdraw)}</span></td>
                      <td style="border: 1px solid #ddd; padding: 10px;"><span dir="ltr">${formatNumber(currentBalancep + firstBalance)}</span></td>
                    </tr>
                    ${isLastTransaction ? `
                      <tr style="background-color: #f0f0f5; font-weight: bold;" class="avoid-break">
                        <td colspan="4" style="border: 1px solid #ddd; padding: 10px;">
                          <strong><span dir="ltr">${intl.formatMessage({ id: 'Total' })} ${row.account.type.name}</span></strong>
                        </td>
                        <td style="border: 1px solid #ddd; padding: 10px; color: green;">
                          <strong><span dir="ltr">${formatNumber(accountTotalDepositp + (firstBalance > 0 ? firstBalance : 0))}</span></strong>
                        </td>
                        <td style="border: 1px solid #ddd; padding: 10px; color: red;">
                          <strong><span dir="ltr">${formatNumber(accountTotalWithdrawp + (firstBalance < 0 ? Math.abs(firstBalance) : 0))}</span></strong>
                        </td>
                        <td style="border: 1px solid #ddd; padding: 10px;">
                          <strong><span dir="ltr">${formatNumber(currentBalancep + firstBalance)}</span></strong>
                        </td>
                      </tr>
                      ${(index < Records.length - 1) ? '<tr class="page-break"><td colspan="7"></td></tr>' : ''}
                    ` : ""}
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    
      const element = document.createElement("div");
      element.innerHTML = reportHTML;
      document.body.appendChild(element);
    
      const options = {
        margin: 10,
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: setting[0]?.company_pic?.includes("http"),
          logging: false,
          onclone: (clonedDoc) => {
            clonedDoc.getElementById("table-to-print").classList.add("desktop-mode");
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
    
      html2pdf()
        .from(element)
        .set(options)
        .save()
        .then(() => document.body.removeChild(element));
    };
  

  // فراخوانی تابع برای تولید PDF
  // generatePDF();
  const [dateinpage, setdateinpage] = useState(null);
  const [dateinpageend, setdateinpageend] = useState(null);
  const [customername, setcustomername] = useState("");
  const [BelanceAccount, setBelanceAccount] = useState([]);
  const Submit = () => {
    if(selectedValues.length===0){
      showAlert({
        position: "top-end",
        icon: "error",
        title: (
          <FormattedMessage id="You must select currency!" />
        ),
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (!Customer) {
      showAlert({
        position: "top-end",
        icon: "error",
        title: (
          <FormattedMessage id="You must select from account and to account!" />
        ),
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    // console.log(Customer);
    let values = selectedValues;
    const searchaccount = selectedValues.map((element) => element.id).join(",");
    console.log(Date_Start || Date_End ? "true": "false");
    axios
      .get(Source.getAddress() + "/api/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          // Customerid: Customer.id,
          AccountId: searchaccount,
          startDate: Date_Start,
          endDate: Date_End,
          report: "true",
          unlimite: Date_Start || Date_End ? "true": "false" ,
        },
        paramsSerializer: (params) =>
          stringify(params, { arrayFormat: "brackets" }),
      })
      .then((res) => {
        console.log(res);
        selectedDayEnd && setdateinpageend(selectedDayEnd);
        selectedDayStart && setdateinpage(selectedDayStart);
        setcustomername(Customer.name);
        setaccounts([]);
        setCustomer("");
        setselectedDayEnd(null);
        setselectedDayStart(null);
        setBelance(values);
        let belance = [];
        selectedValues.forEach((element) => {
          let add = {
            id: element.id,
            belance: parseInt(element.belance),
          };
          belance.push(add);
        });
        setSelectedValues([]);
        setBelance(belance);
        if (Date_Start || Date_End) {
          setBelanceAccount(res.data.total);
          setRecords(res.data.data);
        } else {
          setRecords(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let previousAccountId = null;
  let No = 0;
  let currentBalancep = 0;
  let accountTotalDepositp = 0;
  let accountTotalWithdrawp = 0;
  let currentBalance = 0;
  let accountTotalDeposit = 0;
  let accountTotalWithdraw = 0;
  let flag=true;
  let firstbelance = 0;
  // console.log(localStorage.getItem("date"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${Source.getAddress()}/api/customers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            params: { query: searchQuery, do: "ok" }, // ارسال پارامتر جستجو به سرور
          }
        );
        // setSelectedOption(response.data);
        const data = response.data;
        setcustomers(data);
        // console.log('useeffect');

        // if (data && data.length === 0) {
        //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
        // } else {
        //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!searchQuery || searchQuery?.length < 3) {
      setcustomers([]);
      return;
    } else {
      fetchData();
    }
  }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect
  const handleSeletecOption = (data) => {
    setCustomer(data);
    if (data) {
      fetchAccounts(data.id);
      // console.log(data);
    }
  };
  return (
    <div className="w-100 h-100 responsive-container"
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
    >
      {/* English iransans */}
      <div className="pt-4 pb-4 h-100">
        <button
          onClick={() => generatePDF()}
          type="button"
          className="btn btn-outline-success fw-bold mb-2"
        >
          <FormattedMessage id="Print Pdf" />
        </button>
        <div
          className="rounded-3 px-4 p-1 mb-2"
          style={{
            boxShadow:
              "2px 2px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 2px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="mt-3 ">
            <FormattedMessage id="Create Report From A Customer" />
          </h2>
          <div className="row mb-3 mt-1">
            <div className="col-12 col-sm-6 mb-3">
              <label>
                <FormattedMessage id="Customer Name" />
              </label>
              <Combo_Customer
                name={<FormattedMessage id="Customer" />}
                setAddAccountModal={() => console.log()}
                type={false}
                searchQuery={searchQuery}
                handleInputChange={handleCustomer}
                setSelectedOption={handleSeletecOption}
                selectedOption={Customer}
                options={customer}
              />
            </div>
            <div className="col-12 col-sm-6 mb-3">
              <label>
                <FormattedMessage id="Currency" />
              </label>
              <Multiselect
                className="bg-white"
                options={accounts}
                selectedValues={selectedValues}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue="moneyType"
              />
            </div>
            <div className="col-12 col-sm-6 mb-3">
              <label>
                <FormattedMessage id="Start Date" />
              </label>
              <InputDatePicker
                className="fw-normal"
                value={selectedDayStart}
                onChange={handleDateChangeStart}
                inputPlaceholder={
                  settings[0].date === "Persian"
                    ? "تاریخ را وارد کنید"
                    : "Enter the date"
                }
                locale={settings[0].date === "Persian" ? "fa" : "en"}
                colorPrimary="#0fbcf9"
                maximumDate={{ year: 9999, month: 12, day: 31 }}
                minimumDate={{ year: 1, month: 1, day: 1 }}
              />
            </div>
            <div className="col-12 col-sm-6 mb-3">
              <label>
                <FormattedMessage id="End Date" />
              </label>
              <InputDatePicker
                className="fw-normal"
                value={selectedDayEnd}
                onChange={handleDateChangeEnd}
                inputPlaceholder={
                  settings[0].date === "Persian"
                    ? "تاریخ را وارد کنید"
                    : "Enter the date"
                }
                locale={settings[0].date === "Persian" ? "fa" : "en"}
                colorPrimary="#0fbcf9"
                maximumDate={{ year: 9999, month: 12, day: 31 }}
                minimumDate={{ year: 1, month: 1, day: 1 }}
              />
            </div>
            <div className="col-12">
              <button
                onClick={() => Submit()}
                type="button"
                className="btn btn-success p-1"
                style={{ width: "100%", maxWidth: "8rem" }} // Full width on small screens, max width on larger
              >
                <FormattedMessage id="Add" />
              </button>
            </div>
          </div>
        </div>
        <div
          ref={containerRef}
          id="table-to-print w-s-100"
          className="card card-body m-auto"
          style={{ borderTop: "5px solid #4a5cf2" }}
        >
          <h1 className="text-center rounded m-0 mb-2 p-4 text-light fw-bold bg-info " style={{width:"100%"}}>
            <FormattedMessage id="Report Customer" />
          </h1>
          <div className="ps-2 d-flex flex-column flex-sm-row justify-content-between iransans">
            <div className="mt-3">
              <div className="m-2">
                <p className="fw-bold">
                  <FormattedMessage id="Company Name" />:{" "}
                  {setting[0]?.company_name || null}{" "}
                </p>
                <p className="fw-bold">
                  <FormattedMessage id="Address" />:{" "}
                  {setting[0]?.address || null}{" "}
                </p>
                <p className="fw-bold">
                  <FormattedMessage id="Phone" />: {setting[0]?.phone || null}
                </p>
                <p className="fw-bold">
                  <FormattedMessage id="Customer" />:{" "}
                  {customername && customername} {selectedDayStart && <FormattedMessage id="From" />}{" "}
                  {dateinpage && dateform(dateinpage)} {selectedDayEnd &&  <FormattedMessage id="To" />}{" "}
                  {dateinpageend && dateform(dateinpageend)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="fw-bold">
                <FormattedMessage id="Email" />: {setting[0]?.email || null}
              </p>
              <p className="fw-bold">
                <FormattedMessage id="Description" />:{" "}
                {setting[0]?.description || null}
              </p>
            </div>
            <div className="me-2" style={{ width: "150px", height: "150px" }}>
              <img
                className="td_img rounded"
                src={setting[0]?.company_pic || null}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  outline: "2px solid aliceblue",
                }}
                alt="Profile"
              />
            </div>
          </div>
          {/* Responsive Table */}
          <div className="table-responsive">
            <table className="table-custom table-custom-light table-custom-striped table-custom-hover">
              <thead>
                <tr>
                  <th scope="col">
                    <FormattedMessage id="No" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="Date" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="Description" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="Currency" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="Deposit" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="Withdraw" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="Balance" />
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {Records &&
                  Records.map((row, index) => {
                    BelanceAccount.forEach((element) => {
                      if (element.account_id === row.account_id && flag) {
                        firstbelance = parseInt(element.total);
                        flag=false;
                      }
                    });
                    if (row.account.id !== previousAccountId) {
                      currentBalance = 0;
                      previousAccountId = row.account.id;
                      No = 1;
                      accountTotalDeposit = 0;
                      accountTotalWithdraw = 0;
                    } else {
                      No += 1;
                    }
                    if (row.type === "deposite") {
                      currentBalance += parseInt(row.amount);
                      accountTotalDeposit += parseInt(row.amount);
                    } else if (row.type === "withdraw") {
                      currentBalance -= parseInt(row.amount);
                      accountTotalWithdraw += parseInt(row.amount);
                    } else if (row.type === "from") {
                      currentBalance -= parseInt(row.amount);
                      accountTotalWithdraw += parseInt(row.amount);
                    } else if (row.type === "to") {
                      currentBalance += parseInt(row.amount);
                      accountTotalDeposit += parseInt(row.amount);
                    } else if (row.type === "com") {
                      currentBalance += parseInt(row.amount);
                      accountTotalDeposit += parseInt(row.amount);
                    }
                    const isLastTransactionForAccount =
                      index === Records.length - 1 ||
                      Records[index + 1]?.account_id !== row.account_id;
                      flag=isLastTransactionForAccount;
                    return (
                      <React.Fragment key={index}>
                        {!flag && BelanceAccount.length!==0  && (
                          <tr className={`${No % 2 !== 0 && "striped"}`}>
                            <th scope="row">{No}</th>
                            <td>{Daterow(Date_Start)}</td>
                            <td>
                              <FormattedMessage id="This is the value for prev transactions" />
                            </td>
                            <td>{row.account.type.name}</td>
                            <td dir="ltr" style={{ color: "green" }}>
                              {firstbelance > 0 ? formatNumber(firstbelance) : "0"}
                            </td>
                            <td dir="ltr" style={{ color: "red" }}>
                              {firstbelance <= 0 ? formatNumber(firstbelance) : "0"}
                            </td>
                            <td dir="ltr">{formatNumber(firstbelance)}</td>
                          </tr>
                        )
                        }
                        <tr className={`${No % 2 !== 0 && "striped"}`}>
                          <th scope="row">{No}</th>
                          <td>{Daterow(row.date_created)}</td>
                          <td>{row.discription}</td>
                          <td>{row.account.type.name}</td>
                          <td  style={{ color: "green" }}>
                            <span dir="ltr">
                              {row.type === "deposite" ||
                            row.type === "to" ||
                            row.type === "com"
                              ? formatNumber(row.amount)
                              : "0"}
                              </span>
                          </td>
                          <td  style={{ color: "red" }}>
                            <span>
                            {row.type === "withdraw" || row.type === "from"
                              ? formatNumber(row.amount)
                              : "0"}
                            </span>
                          </td>
                          <td >
                            <span dir="ltr">
                            {formatNumber(currentBalance + firstbelance)}
                            </span>
                            
                            </td>
                        </tr>
                        {isLastTransactionForAccount && (
                          <tr
                            className="table-summary"
                            style={{
                              backgroundColor: "#f0f0f5",
                              fontWeight: "bold",
                            }}
                          >
                            <td colSpan="4">
                              <strong>
                              <FormattedMessage id="This is the value for prev transactions" /> {row.account.type.name}
                              </strong>
                            </td>
                            <td style={{ color: "green" }}>
                              <strong dir="ltr">
                                {formatNumber(accountTotalDeposit +
                                  (firstbelance > 0 && firstbelance))}
                              </strong>
                            </td>
                            <td style={{ color: "red" }}>
                              <strong dir="ltr">
                                {formatNumber(accountTotalWithdraw +
                                  (firstbelance < 0 && Math.abs(firstbelance)))}
                              </strong>
                            </td>
                            <td>
                              <strong dir="ltr">{formatNumber(currentBalance + firstbelance)}</strong>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
