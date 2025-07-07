import React, { useEffect, useState, useRef,useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import DataTable from "react-data-table-component";
import Source from "../../Source";
import jalaali from "jalaali-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Multiselect from "multiselect-react-dropdown";
import { stringify } from "qs";
import moment from "moment-jalaali";
import { gregorianToJalali } from "shamsi-date-converter";
import "../Report/report.css";
import Datepicker from "../forms/Datepicker.js";
import Datepicker_Customer from ".././forms/Datepicker_customer";
import { InputDatePicker } from "jalaali-react-date-picker";
// import Swal from "sweetalert2";
import { showAlert } from "../../warrper.js";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers } from "../Redux/customerSlice";
import { getSettings } from "../Redux/settingSlice";
import { RotateLoader } from "react-spinners";
import html2pdf from "html2pdf.js";
import Combo_Customer from "../forms/Combo_Customer";
import ListBox from "../forms/ListBox";
import ShowProfit from "./ShowProfit.js";
import EditSell from "../Items/forms/EditSell.js";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
// import "jspdf-rtl";
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};
export default function BenefitReport() {
  // useEffect(() => {
  const dispatch = useDispatch();
  // const { customers, errorc, statusc } = useSelector(
    //   (state) => state.customers
    // );
    const showAlert = useShowAlert(); 
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const { users, statusu } = useSelector((state) => state.users);
  const [customer, setcustomers] = useState([]);
  const [accounts, setaccounts] = useState([]);
  const [selectedDayStart, setselectedDayStart] = useState();
  const [selectedDayEnd, setselectedDayEnd] = useState();
  const [Date_Start, setDate_Start] = useState("");
  const [Date_End, setDate_End] = useState();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
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
  const [addAccountModal, setAddAccountModal] = useState(false);
  useEffect(() => {
    if (statuss !== "succeeded" && !settings) {
      dispatch(getSettings());
      console.log("SETTINGS");
    }
  }, [dispatch, , settings, statuss]);
  useEffect(() => {
    if (settings?.length > 0) {
      setsettings(settings);
    }
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
      setDate_Start(isoString);
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
        jalaliDate.day+1,
        t.getHours(),
        t.getMinutes()
      );

      // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      setDate_End(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const [TrackProfite, setTrackProfite] = useState([]);
  const [selecteduser, setSelecteduser] = useState();
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
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const fetchAccounts = async (customerid) => {
    const token = localStorage.getItem("access");
    if (!token) return;
    const fetchWithToken = async (token) => {
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
  // const [Customer, setCustomer] = useState();
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

    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };
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

    if (settings.length === 0) {
      let settings1 = { language: "English" };
      axios
        .post(Source.getAddress() + "/api/settings", settings1)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (settings[0].date === "Persian") {
      formattedDate = convertToHijriShamsi(
        `${formattedDate}  ${formattedHours}:${formattedMinutes} ${ampm}`
      );
    }
    return `${formattedDate}`;
  };
  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );
    return `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;
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
  const generatePDF = () => {
    if (!customername) {
      alert("Please select a customer!");
      return;
    }
    const element = containerRef.current;

    // Configuration options for high-quality PDF rendering
    const options = {
      html2canvas: {
        scale: 4, // Increase the scale for higher resolution
        logging: false, // Optional: Disable logging for performance
        useCORS: true, // Ensure cross-origin images are captured correctly
        letterRendering: true, // Improve the rendering of letters and fonts
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Generate and save the PDF
    const imageUrl = settings[0]?.company_pic;

    if (imageUrl) {
      const fileName = imageUrl.split("/").pop(); // تقسیم رشته و گرفتن آخرین بخش
      const imageSrc = Source.getAddress() + "/api/getImage/" + fileName;
      // استفاده از html2pdf و اضافه کردن تصویر بعد از بارگذاری
      html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get("pdf")
        .then(function (pdf) {
          const pageWidth = pdf.internal.pageSize.width;
          const pageHeight = pdf.internal.pageSize.height;
          const imgWidth = 30;
          const imgHeight = 30;
          const x = pageWidth - imgWidth - 10; // 10 پیکسل فاصله از لبه راست
          const y = 35; // 10 پیکسل فاصله از لبه بالای صفحه
          pdf.addImage(imageSrc, "JPEG", x, y, imgWidth, imgHeight);
          pdf.save("report.pdf");
        });
    } else {
      html2pdf().from(element).set(options).save("report.pdf");
    }
  };

  // };       این کد کامل است شما تغییرات لازم را بیاورید

  const [dateinpage, setdateinpage] = useState(null);
  const [dateinpageend, setdateinpageend] = useState(null);
  const [customername, setcustomername] = useState("");
  const [BelanceAccount, setBelanceAccount] = useState([]);
  const Submit = async () => {
    try {
      const response = await axios.get(
        Source.getAddress() + "/api/benefitcontroller",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          //   params: {
          //     page: page,
          //     perPage: pageSize,
          //     isdelete: 0,
          //     StartDate:StartDate,
          //     EndDate: EndDate,
          //   },
        }
      );
      console.log(response);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };
  let previousAccountId = null;
  let No = 0;

  let currentBalance = 0;
  let accountTotalDeposit = 0;
  let accountTotalWithdraw = 0;
  const handleSeletecOption = (data) => {
    setCustomer(data);
    if (data) {
      fetchAccounts(data.id);
      console.log(data);
    }
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
      const response = await axios.get(
        Source.getAddress() + "/api/benefitcontroller",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            user_id: selecteduser.id,
            page: page,
            perPage: pageSize,
            isdelete: 0,
            StartDate: StartDate && Date_Start,
            EndDate: EndDate && Date_End,
          },
        }
      );
      console.log(response);
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
  }, [currentPage, perPage, EndDate, StartDate, selecteduser]);

  const columnsDesktop = [
    //   { name: <strong>No</strong>, selector: (row) => row.id },
    {
      name: <strong>Date</strong>,
      selector: (row) => date(row.date),
    },
    {
      name: <strong>Currency</strong>,
      selector: (row) => row.currency,
    },
    { name: <strong>Profit</strong>, selector: (row) => row.profit },
    {
      name: "Show",
      cell: (row) => (
        <button
          onClick={() => {
            setTrackProfite(row.details);
            setAddAccountModal(true);
          }}
          type="button"
          className="btn btn-outline-info rounded-4"
          style={{ fontSize: "0.9rem" }}
        >
          View
        </button>
      ),
    },
    //   { name: <strong>Added by</strong>, selector: (row) => row.user_name },
    //   {
    //     name: (
    //       <strong
    //         style={{
    //           textAlign: "center",
    //           backgroundColor: "transparent",
    //           width: "100%",
    //         }}
    //       >
    //         Delete
    //       </strong>
    //     ),
    //     selector: (row) => (
    //       <button
    //         className={`${row.ontransaction===1 ? "d-none" : ""}`}
    //         onClick={() => delete_report(row)}
    //         style={{
    //           border: "none",
    //           backgroundColor: "transparent",
    //           height: "100%",
    //         }}
    //       >
    //         <img
    //           height={"15%"}
    //           width={"15%"}
    //           src={Trash}
    //           style={{ backgroundColor: "transparent" }}
    //         />
    //       </button>
    //     ),
    //   },
  ];
  const PDcolumn=[
    {
      name:<strong><FormattedMessage id="Show"/></strong>,
      cell: (row) => (
        <button
          onClick={() => {
            setTrackProfite(row.details);
            setAddAccountModal(true);
          }}
          type="button"
          className="btn btn-outline-info rounded-4"
          style={{ fontSize: "0.9rem" }}
        >
          <FormattedMessage id="Veiw"/>
        </button>
      ),
    },
      { name: <strong><FormattedMessage id="Profit"/></strong>,
        selector: (row) => (
          <span dir="ltr">{formatNumber(row.profit)}</span>
        ),
      },
    {
      name: <strong><FormattedMessage id="Currency"/></strong>,
      selector: (row) => row.currency,
    },
    {
      name: <strong><FormattedMessage id="Date"/></strong>,
      selector: (row) => date(row.date),
    },
  ]
    const columns = useMemo(() => {
      if (
        localStorage.getItem("language") === "pa" ||
        localStorage.getItem("language") === "da"
      ) {
        return PDcolumn;
      }else{
       return columnsDesktop
      }
      // if (isDesktop) {
      //   return localStorage.getItem("userTokenname") === "admin"
      //     ? columnsDesktop
      //     : columnsDesktopsimple;
      // }
      // return columnsTablet;
    }, [isDesktop]);

  const [shopingcart, setShopingCart] = useState([]);
  const [Exesting, setExesting] = useState(false);
  const [AddSellModal, setAddSellModal] = useState(false);
  const [MoneyEdit, setMoneyEdit] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [EditSellModal, setEditSellModal] = useState(false);

  const ShowBill = (bill_id) => {
    console.log(bill_id);
    axios
      .get(Source.getAddress() + "/api/sell/" + bill_id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        setExesting(res.data.bill.accounts ? true : false);
        setEditSellModal(true);
        setMoneyEdit(res.data.money);
        setCustomer(res.data.bill);
        setShopingCart(res.data.sells);
      })
      .catch((er) => {
        showAlert({
          position: "top-end",
          icon: "error",
          title: "This bill number not found!",
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };
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
    <div
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className="w-100 h-100
  responsive-container"
    >
      <div className="pt-4 pb-4 h-100 ">
        {/* <button
          onClick={() => generatePDF()}
          type="button"
          className="btn btn-outline-success fw-bold mb-2"
        >
          <FormattedMessage id="Print Pdf"/>
        </button> */}
        <div
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="benefit report"/>
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date}
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
        {/* <input
  className="form-control m-2 mb-2 mt-4"
  style={{ width: "100%", maxWidth: "200px" }}
  type="search"
  onChange={handleName}
  value={search}
  placeholder={formatMessage({ id: "Search" })}
  aria-label="Search"
/> */}
<div></div>
      </div>
        <DataTable
          columns={columns}
          data={Records}
          //   onRowClicked={handleRowClick}
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
        <ShowProfit
          close={() => setAddAccountModal(false)}
          addAccountModal={addAccountModal}
          record={TrackProfite}
          ShowBill={ShowBill}
        />
        <EditSell
          Exesting={Exesting}
          setExesting={setExesting}
          records={[]}
          setRecords={() => {}}
          // settings={setttings}
          // setsettings={setsettings}
          AddSellModal={EditSellModal}
          close={(e) => setEditSellModal(false)}
          money={MoneyEdit}
          // setmoney={setMoneyEdit}
          moneys={[]}
          options1={[]}
          setOptions1={() => {}}
          customers={[]}
          Customer={Customer}
          setCustomer={setCustomer}
          shopingcart={shopingcart}
          setshopingcart={setShopingCart}
        />
      </div>
    </div>
  );
}
