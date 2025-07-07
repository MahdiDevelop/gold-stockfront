import axios from "axios";
import React, { useEffect, useState,useMemo } from "react";
import DataTable from "react-data-table-component";
import Source from "../../Source";
// import AddPurchase from "./forms/AddPurchase";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import Add_customer from "../AddAccount";
import Add_belance from "../Add_belance";
import Trash from "../../assets/icon/trash.png";
import pencil from "../../assets/icon/pencil.png";
import Surrendered_pic from "../../assets/icon/surrendered_pic.svg";
// import EditSell from "./forms/EditSell";
// import EditPurchase from "./forms/EditPurchase";
import { useSelector, useDispatch } from "react-redux";
import { getMoneys } from "../Redux/moneysSlice";
import { getItemFromCache, getItems } from "../Redux/itemSlice";
import { getSettings } from "../Redux/settingSlice";
import { getCustomers } from "../Redux/customerSlice";
import { getStocks } from "../Redux/stockSlice";
import jalaali from "jalaali-js";
import ListBox from "../forms/ListBox";
import Datepicker_Customer from "../forms/Datepicker_customer";
import { showAlert } from "../../warrper";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../../warrper";
import AddSewingOrder from "./Forms/AddSewingOrder";
import UpdateSewingOrder from "./Forms/UpdateSewingOrder";
import Updatemoney from "../forms/Updatemoney";
import {Chip } from '@mui/material';
import { getTailors } from "../Redux/tailorSlice";

export default function Surrendered() {
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const { tailors, statusTailors } = useSelector((state) => state.tailors);
  const [selectedstate,setSelectedstate]=useState();
  const [state,setState]=useState([
    // {id:1,name:<FormattedMessage id="status.durring" />},
    // {id:2,name:<FormattedMessage id="status.waiting" />},
    {id:3,name:<FormattedMessage id='status.complete' />},
    {id:4,name: <FormattedMessage id='status.surrendered'/>},
  ])
  const [optionsItem,setOptionItem] = useState();
  const [namesearch, setnameSearch] = useState();
  const [Date_Start, setDate_start] = useState();
  const [Date_End, setDate_end] = useState();
  const [seletedtailor,setSeletedtailor]=useState();
    const [searchQueryD, setSearchQueryD] = useState("");
  const [StartDate, setStartDate] = useState();
const [selectedOptionD, setSelectedOptionD] = useState();
  const [EndDate, setEndDate] = useState();
      const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
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
 const [addItem, setAddItem]=useState({
   id: '',
    name: '',
    qty: '',
    purchase_price: '',
    description: '',
    });
  const [form, setForm]=useState({
    id: '',
    name: '',
    qty: '',
    purchase_price: '',
    description: '',
  });
  const [shoppingCart, setShoppingCart] = useState([]);
    const [selectedOption, setSelectedOption] = useState(); 
const [selectedOptionT, setSelectedOptionT]=useState();
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
  const WhatsAppButton = ({ phoneNumber = "", message }) => {
    const formattedMessage = encodeURIComponent(message);
    const whatsappAppLink = `whatsapp://send?phone=${phoneNumber}&text=${formattedMessage}`;

    // لینک پیش‌فرض وب واتساپ در صورتی که پروتکل whatsapp:// کار نکند
    // const whatsappWebLink = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;

    // تلاش برای باز کردن اپلیکیشن واتساپ
    window.location.href = whatsappAppLink;

    // اگر لینک بالا اجرا نشد، بعد از 2 ثانیه واتساپ وب باز شود
    // setTimeout(() => {
    //   window.open(whatsappWebLink, "_blank");
    // }, 2000);
  };
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [options, setOptions] = useState([]);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [AddPurchaseModal, setAddPurchaseModal] = useState(false);
  const [stock, setstock] = useState([]);
  const [belance, setbelance] = useState();
  const [AddBalanceModal, setAddBalanceModal] = useState(false);
  const [EditSellModal, setEditSellModal] = useState(false);
  const [MoneyEdit, setMoneyEdit] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [shopingcart, setShopingCart] = useState([]);
  const [Exesting, setExesting] = useState(false);
  const [tailor,settailor]=useState([]);
  const [DesignTailor,setDesignTailor]=useState([]);
  const showAlert = useShowAlert(); 
  const send=(row,debite=false)=>{
      row.surrendered=1;
      row._method="put";
      row.sur_date=new Date();
        axios
          .post(Source.getAddress() + "/api/fabricsbill/"+row.id,row, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            params:{
              update:'ok',
              debite:debite&&'ok',
              customer_id:row.c_id,
              amount:parseInt(row.p_amount||0)-parseInt(row.t_amount||0)
            }
          })
          .then((res) => {
            const update={...row,surrendered:1}
          setRecords((prev)=>prev.map((a) => (a.id === row.id ? update : a))); 
            showAlert({
              position: "top-end",
              icon: "success",
              title: <FormattedMessage id="Your record has been updated!" />,
              showConfirmButton: false,
              timer: 1000,
            });
const deliveredMessages = {
da: {
  title: "📌 پیام از خیاطی",
  greeting: `سلام ${row.account.name} گرامی! 👋`,
  total: `💎 مجموع مبلغ: ${row.t_amount} افغانی`,
  paid: `✅ مقدار پرداخت‌شده: ${row.p_amount||0} افغانی`,
  remaining: `⏳ باقیمانده: ${row.d_amount||0} افغانی`,
  dates: `📅 تاریخ آغاز: ${row.s_date || '-'}\n📅 تاریخ سپردن لباس: ${form.e_date || '-'}`,
  status: "📦 فرمایش شما تسلیم داده شده است. امیدواریم از کار ما راضی بوده باشید.",
  thanks: "🙏 سپاس‌گزاریم از اعتماد شما!"
}
,
  pa: {
    title: "📌 د خیاطی څخه پیام",
    greeting: `سلام ${row.account.name} عزیز! 👋`,
    total: `💎 ټوله پیسې: ${row.t_amount||0} افغانی`,
    paid: `✅ تادیه شوی: ${row.p_amount||0} افغانی`,
    remaining: `⏳ پاتې پیسې: ${row.d_amount||0} افغانی`,
    dates: `📅 د شروع نیټه: ${row.s_date || '-'}\n📅 د تحویل نیټه: ${row.e_date || '-'}`,
    status: "📦 ستاسو امر تسلیم شو. هیله کوو چې له خپله پیرود څخه راضي یاست.",
    thanks: "🙏 ستاسو د اعتماد مننه!"
  },
  en: {
    title: "📌 Message from Tailor",
    greeting: `Hello ${row.account.name||0}! 👋`,
    total: `💎 Total amount: ${row.t_amount||0} AFN`,
    paid: `✅ Paid: ${row.p_amount||0} AFN`,
    remaining: `⏳ Remaining: ${row.d_amount||0} AFN`,
    dates: `📅 Start date: ${row.s_date || '-'}\n📅 Delivery date: ${row.e_date || '-'}`,
    status: "📦 Your order has been delivered. We hope you're satisfied with your purchase.",
    thanks: "🙏 Thank you for your trust!"
  }
};

const lang = localStorage.getItem("language") || "en";
const { title, greeting, total, paid, remaining, dates, status, thanks } = deliveredMessages[lang];
const fullMessage = `${title}\n\n${greeting}\n\n${total}\n${paid}\n${remaining}\n\n${dates}\n${status}\n${thanks}`;

WhatsAppButton({
  phoneNumber: row.account.whatsup_number || "",
  message: fullMessage,
});
          })
          .catch((err) => {
            console.log(err);
            showAlert({
              position: "top-end",
              icon: "error",
              title:  <FormattedMessage id="Something went wrong!" />,
              showConfirmButton: false,
              timer: 1000,
            });
          });
  }
  const surrendered = async (row)=>{
  if(row.t_amount - row.p_amount>0){
      const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
          const result = await swalWithBootstrapButtons.fire({
          title: intl.formatMessage({id:"Do you wanna add in debit account?"})
                  ,
                  text:intl.formatMessage({id:"For this customer we will create debit account!"})
                  ,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: intl.formatMessage({id:"Yes"})
                  ,
                  cancelButtonText: intl.formatMessage({id:"No"})
                  ,
                  reverseButtons: true,
         });
        row._method="put";
        if (result.isConfirmed) {
          send(row,true);   
         }
         else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            title:intl.formatMessage({id:"Cancelled"}),
            text:intl.formatMessage({id:"Not add a debit account :)"}),
            icon: "error",
          });
        }}
        else{
          send(row);
        }
  }
  const getcustomer = () => {
          axios
        .get(`${Source.getAddress()}/api/item`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            query: "ok",
          },
        })
        .then((res) => {
          setOptionItem(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    // }
  if(tailor.length===0){
     axios
        .get(`${Source.getAddress()}/api/tailor`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            // query: "ok",
          },
        })
        .then((res) => {
          // console.log(res.data);
          settailor(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      }
      if(DesignTailor.length===0){
        axios
        .get(`${Source.getAddress()}/api/desingtailor`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            // query: "ok",
          },
        })
        .then((res) => {
          // console.log(res.data);
          setDesignTailor(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      }
  // }
  };
  const [setting, setsettings] = useState(settings);
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const [addbalance, setaddbalance] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [money, setmoney] = useState([]);
  const [UpdateModel,setUpdateModel]=useState(false);
  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress() + "/api/fabricsbill", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {  
          tailor:seletedtailor?.id,
          state:selectedstate?.id||'surrendered',
          // side_state:selectedstate?.id,
          user_id: selecteduser?.id , 
          page: page,
          perPage: pageSize,
          StartDate: StartDate&& Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
          delete: 0,
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
  }, [currentPage, perPage,EndDate, StartDate, selecteduser,namesearch,selectedstate,seletedtailor]);

  // مدیریت تغییر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها

  const deleteRecord = async (row) => {
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
          Source.getAddress() + "/api/fabricsbill/" + `${row.id}`,
          belance_delete,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            }, // Add the access token here
            params: {  
          delete:'ok'
        },
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

  const PDcolumn = [
    {
      name:
      <FormattedMessage id="No" />
      ,
      selector: (row) => row.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name:           <FormattedMessage id="Name" />      ,
      selector: (row) =>
        row.account?.name,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
                    <FormattedMessage id="Start Date" />
        </strong>
      ),
      selector: (row) => row.s_date ? date(row.s_date) :'-',
    },
    {
      name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
                    <FormattedMessage id="End Date" />
        </strong>
      ),
      // selector: (row) => date(row.e_date),
      selector: (row) => row.e_date ? date(row.e_date) :'-',
    },
    { name:           <FormattedMessage id="Total Amount" />
      , selector: (row) => row.t_amount, sortable: true },
    {
      name:           <FormattedMessage id="Paid Amount" />      ,
      selector: (row) => row.p_amount,
      sortable: true,
    },
    {
      name:           <FormattedMessage id="Remain Amount" />      ,
      selector: (row) => row.d_amount,
      sortable: true,
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
                            <FormattedMessage id="Add" />
                </strong>
              ),
              selector: (row) => (
                <button
                  onClick={() => {
                  surrendered(row);
                  }}
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    height: "100%",
                  }}
                >
                  <img
                    height={"20%"}
                    width={"20%"}
                    src={Surrendered_pic}
                    style={{ backgroundColor: "tranceparent" }}
                  />
                </button>
              ),
            },
    // { name: "Add By", selector: (row) => row.bill.user.name, sortable: true },
{
  name: (
    <strong
      style={{
        textAlign: "center",
        backgroundColor: "transparent",
        width: "100%",
        display: "block",
      }}
    >
      <FormattedMessage id="State" />
    </strong>
  ),
  selector: (row) => {
    let label, bgColor, textColor;

    if (row.surrendered === 1) {
      label = <FormattedMessage id="status.surrendered" />;
      bgColor = "#4caf50"; // سبز (موفقیت)
      textColor = "white";
    } else if (row.complete === 1) {
      label = <FormattedMessage id="status.complete" />;
      bgColor = "#ff9800"; // نارنجی (هشدار)
      textColor = "white";
    } else if (row.tailor_id) {
      label = <FormattedMessage id="status.durring" />;
      bgColor = "#2196f3"; // آبی (در حال انجام)
      textColor = "white";
    } else {
      label = <FormattedMessage id="status.waiting" />;
      bgColor = "#BF3131"; // خاکستری (در انتظار)
      textColor = "white";
    }

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          width: "120px",               // اندازه ثابت
          justifyContent: "center",     // متن وسط‌چین
          display: "flex",
          backgroundColor: bgColor,     // رنگ زمینه بر اساس وضعیت
          color: textColor,             // رنگ متن
          borderRadius: "16px",
        }}
      />
    );
  },
  width: "150px", // اختیاری: عرض ستون
},{
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
          <FormattedMessage id="Show" />
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={(e) => {
            setForm(row);
            setShoppingCart(row.sells);
            getcustomer();
            setSelectedOptionD(row.design);
            setSelectedOption(row.account);
            setSelectedOptionT(row.tailor);
            setUpdateModel(true);
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
            src={pencil}
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
                    <FormattedMessage id="Delete" />
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            deleteRecord(row);
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"20%"}
            width={"20%"}
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
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
    if (localStorage.getItem("date") === "Persian") {
      moment.locale("fa"); // تنظیم لوکال به فارسی
      aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
      formattedDate = moment(d).format("jYYYY-jMM-jDD");
    } else {
      moment.locale("en"); // تنظیم لوکال به انگلیسی
    }

    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };
  const [addcusotmer, setaddcustomer] = useState([]);
  const [addbelance, setaddbelance] = useState([]);
  // useEffect(() => {
  //   fetchData(currentPage, perPage);
  // }, [currentPage, perPage]);
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
    <div className={`w-100 ${"iransans"}`}>
      <div className="m-auto mt-5 m-5" style={{ height: "100%", width: "99%" }}>
        <div
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Sewing Order"/>
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
           <ListBox
           all={'All Tailors'}
            options={tailors}
            selectedOption={seletedtailor}
            setSelectedOption={setSeletedtailor}
          />
           <ListBox
           all={'All States'}
            options={state}
            selectedOption={selectedstate}
            setSelectedOption={setSelectedstate}
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
          progressPending={loading}
          striped
          responsive
          highlightOnHover
          pagination
          paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
          paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
          onChangePage={handlePageChange} // تغییر صفحه
          onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه
          customStyles={{
            headCells: {
              style: {
                display: "flex",
                minWidth: "100px", // تنظیم اندازه عنوان‌ها
                maxWidth: "100px",
                width: "10px",
                margin: "0px",
                fontWeight: "bold",
              },
            },
            cells: {
              style: {
                minWidth: "100px", // تنظیم اندازه داده‌ها
                maxWidth: "150px",
                width: "150px",
              },
            },
          }}
        />
        {/* {
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
        moneyp={money}
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
        } */}
        {/* <AddPurchase
          customers={accounts}
          setsettings={setsettings}
          settings={setting}
          belance={belance}
          records={records}
          setRecords={setRecords}
          options1={stock}
          moneys={money}
          AddItemModal={AddPurchaseModal}
          close={() => setAddPurchaseModal(false)}
          setAddAccountModal={setAddAccountModal}
          setAddBalanceModal={setAddBalanceModal}
        />
        <Add_belance
          // customers={customers}
          accounts={belance}
          setAccounts={setbelance}
          close={() => setAddBalanceModal(false)}
          addAccountModal={AddBalanceModal}
          records={belance}
          setRecords={setbelance}
          money={money}
          // settings={settings}
          setAddcustomerModal={setAddAccountModal}
        />
        {
          <Add_customer
            // loading={loading}
            // setLoading={setLoading}
            // inputRef={inputRef}
            close={() => setAddAccountModal(false)}
            addAccountModal={addAccountModal}
            records={addcusotmer}
            setRecords={setaddcustomer}
          />
        }
        <EditPurchase
          Exesting={Exesting}
          setExesting={setExesting}
          records={records}
          setRecords={setRecords}
          AddItemModal={EditSellModal}
          close={(e) => setEditSellModal(false)}
          money={MoneyEdit}
          setmoney={setMoneyEdit}
          moneys={money}
          Customer={Customer}
          setCustomer={setCustomer}
          shopingcart={shopingcart}
          setshopingcart={setShopingCart}
          options1={stock}
          setOptions1={setstock}
        /> */}
        <AddSewingOrder optionT={tailor} setOptionT={settailor} show={AddPurchaseModal} close={()=>setAddPurchaseModal(false)} moneys={money} setmoneys={setmoney} options1={optionsItem} setOption1={setOptionItem} records={records} setRecords={setRecords} DesignTailor={DesignTailor} setDesignTailor={setDesignTailor}/>
        <UpdateSewingOrder optionT={tailor} setOptionT={settailor} show={UpdateModel} close={()=>setUpdateModel(false)} moneys={money} setmoneys={setmoney} options1={optionsItem} setOption1={setOptionItem} form={form} setForm={setForm} addItem={addItem} setAddItem={setAddItem} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} s_ok={true}
          selectedOption={selectedOption} setSelectedOption={setSelectedOption} selectedOptionT={selectedOptionT} setSelectedOptionT={setSelectedOptionT} records={records} setRecords={setRecords} DesignTailor={DesignTailor} setDesignTailor={setDesignTailor}   searchQueryD={searchQueryD} setSearchQueryD={setSearchQueryD}  selectedOptionD={selectedOptionD} setSelectedOptionD={setSelectedOptionT}
          />
      </div>
    </div>
  );
}
