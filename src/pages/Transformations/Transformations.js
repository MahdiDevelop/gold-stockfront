import React, { useState, useEffect, useMemo ,useCallback } from "react";
import Datepicker from "../forms/Datepicker";
import Datepicker_start from "../forms/Datepicker_start";
import DataTable, { Alignment } from "react-data-table-component";
import Trash from "../../assets/icon/trash.png";
import ListBox from "../forms/ListBox";
import { useRef } from "react";
import AddTransformation from "./AddTransformation";
import ComboBox from "../forms/ComboBox";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import { Calendar } from "react-modern-calendar-datepicker";
import * as shamsi from "shamsi-date-converter";
import { NumericFormat } from "react-number-format";
import { utils } from "react-modern-calendar-datepicker";
import Datepicker_Customer from "../forms/Datepicker_customer";
import axios from "axios";
import Source from "../../Source";
import { useSelector, useDispatch } from "react-redux";
import { getReports } from "../Redux/reportSlice";
import { getBelances } from "../Redux/belanceSlice";
import Whatsupimg from "../../assets/icon/whatsup.png";
import Pencil from "../../assets/icon/pencil.png";
import EditTransformation from "./EditTransformation";
import { getCustomers } from "../Redux/customerSlice";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../../warrper";
import { Switch, FormControlLabel, CircularProgress, Box } from "@mui/material";
const formatNumber = (number) => {
  return number?.toLocaleString(); 
};
export default function Transformations({}) {
  const showAlert = useShowAlert(); 
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const [IsAll,setIsAll]=useState(false);
  const [search, setSearch] = useState();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [AddTransformationModal, setAddTransformationModal] = useState(false);
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [records, setRecords] = useState([]);
  const [EndDate, setEndDate] = useState();
  const [StartDate, setStartDate] = useState(moment());
  const [Date_Start, setDate_start] = useState(new Date().toISOString());
  const [Date_End, setDate_end] = useState();

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

      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      setDate_end(isoString);
    }
  };
  const WhatsAppButton = ({ phoneNumber = "", message }) => {
    const formattedMessage = encodeURIComponent(message);
    const whatsappAppLink = `whatsapp://send?phone=${phoneNumber}&text=${formattedMessage}`;

    window.location.href = whatsappAppLink;

  };
  const handlleWhatsupfrom = (tempRecord) => {
    if (tempRecord.from.whatsup === 1) {

      let selectedOptionFrom=tempRecord.from;
      let language = localStorage.getItem("language");

      let message = "";
      
      if (language === "en") {
        message = `Hello ${selectedOptionFrom.customer},\n💼 Your recent transaction has been successfully recorded in the system.\nType: ${
          tempRecord.from.amount > 0 ? "Withdraw" : "Deposit"
        } 💰\nAmount: ${
          formatNumber(tempRecord.from.amount) + " " + selectedOptionFrom.moneyType +((tempRecord.from.amount >=0) ?" 🟢" :' 🔴')
        } 💵\nCurrent Balance: ${
          formatNumber(tempRecord.belance.from.belance) + tempRecord.belance.from.belance>=0 ?"🟢" :'🔴'
        } 📊\nDescription: ${
          tempRecord.from.description || ""
        } ✍\nDate: ${date(
        tempRecord.from?.date || tempRecord.date_created
      )} 📅\nThank you for choosing our services!`;
      } else if (language === "pa") {
        message = `سلام ${selectedOptionFrom.customer} ګران،\n💼 ستاسو وروستۍ معامله په بریالیتوب سره سیسټم کې ثبت شوې ده.\nډول: ${
          tempRecord.from.amount > 0 ? "ایستل" : "جمع کول"
        } 💰\nمقدار: ${
          formatNumber(tempRecord.from.amount) + " " + selectedOptionFrom.moneyType+((tempRecord.from.amount >=0) ?" 🟢" :' 🔴')
        } 💵\nاوسنی بیلانس: ${
          formatNumber(tempRecord.belance.from.belance) + tempRecord.belance.from.belance>=0 ?"🟢" :'🔴'
        } 📊\nتفصیل: ${
          tempRecord.from.description || ""
        } ✍\nنیټه: ${date(
          tempRecord.from?.date || tempRecord.date_created
        )} 📅\nله موږ څخه د خدماتو اخیستلو لپاره مننه!`;
      } else if (language === "da") {
        message = `سلام ${selectedOptionFrom.customer} عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${
          tempRecord.from.amount > 0 ? "برداشت" : "واریز"
        } 💰\nمقدار: ${
          formatNumber(tempRecord.from.amount) + " " + selectedOptionFrom.moneyType+((tempRecord.from.amount >=0) ?" 🟢" :' 🔴')
        } 💵\nبیلانس فعلی: ${
          formatNumber(tempRecord.belance.from.belance) + tempRecord.belance.from.belance>=0 ?"🟢" :'🔴'
        } 📊\nشرح: ${
          tempRecord.from.description || ""
        } ✍\nتاریخ: ${date(
          tempRecord.from?.date || tempRecord.date_created
        )} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
      } else {
        message = "Language not supported!";
      }
      
      WhatsAppButton({
        phoneNumber: tempRecord.from.whatsup_number || "",
        message: message,
      });
    }
  };
  const handlleWhatsupto = (tempRecord) => {
    if (tempRecord.to.whatsup === 1) {
      let language = localStorage.getItem("language");
      let selectedOptionFrom=tempRecord.to;

      let message = "";
      
      if (language === "en") {
        message = `Hello ${selectedOptionFrom.customer},\n💼 Your recent transaction has been successfully recorded in the system.\nType: ${
          tempRecord.to.amount > 0 ? "Withdrawal" : "Deposit"
        } 💰\nAmount: ${
          formatNumber(tempRecord.to.amount) + " " + selectedOptionFrom.moneyType
        } 💵\nCurrent Balance: ${
          formatNumber(tempRecord.belance.to.belance)+ tempRecord.belance.to.belance>=0 ?"🟢" :'🔴'
        } 📊\nDescription: ${
          tempRecord.to.description || ""
        } ✍\nDate: ${date(
        tempRecord.from?.date || tempRecord.date_created
      )} 📅\nThank you for choosing our services!`;
      } else if (language === "pa") {
        message = `سلام ${selectedOptionFrom.customer} ګران،\n💼 ستاسو وروستۍ معامله په بریالیتوب سره سیسټم کې ثبت شوې ده.\nډول: ${
          tempRecord.to.amount > 0 ? "ایستل" : "جمع کول"
        } 💰\nمقدار: ${
          formatNumber(tempRecord.to.amount) + " " + selectedOptionFrom.moneyType
        } 💵\nاوسنی بیلانس: ${
          // tempRecord.belance.to.belance
          formatNumber(tempRecord.belance.to.belance)+  tempRecord.belance.to.belance>=0 ?"🟢" :'🔴'
        } 📊\nتفصیل: ${
          tempRecord.to.description || ""
        } ✍\nنیټه: ${date(
          tempRecord.from?.date || tempRecord.date_created
        )} 📅\nله موږ څخه د خدماتو اخیستلو لپاره مننه!`;
      } else if (language === "da") {
        message = `سلام ${selectedOptionFrom.customer} عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${
          tempRecord.to.amount > 0 ? "برداشت" : "واریز"
        } 💰\nمقدار: ${
          formatNumber(tempRecord.to.amount) + " " + selectedOptionFrom.moneyType
        } 💵\nبیلانس فعلی: ${
          formatNumber(tempRecord.belance.to.belance) + tempRecord.belance.to.belance>=0 ? "🟢" :'🔴'
        } 📊\nشرح: ${
          tempRecord.to.description || ""
        } ✍\nتاریخ: ${date(
          tempRecord.from?.date || tempRecord.date_created
        )} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
      } else {
        message = "Language not supported!";
      }

      WhatsAppButton({
        phoneNumber: tempRecord.to.whatsup_number || "",
        message: message,
      });
    }
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
  const handlleDelete = async (row) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      let com = "no";
      let deletet = {};
      if (row.com) {
        deletet = {
          from_account: row.from.account,
          from_amount: row.from.amount,
          from_id: row.from.id,
          to_account: row.to.account,
          to_amount: row.to.amount,
          to_id: row.to.id,
          com_account: row.com.account,
          com_amount: row.com.amount,
          com_id: row.com.id,
        };
        com = "ok";
      } else {
        deletet = {
          from_account: row.from.account,
          from_amount: row.from.amount,
          from_id: row.from.id,
          to_account: row.to.account,
          to_amount: row.to.amount,
          to_id: row.to.id,
        };
        com = "no";
      }
      axios
        .put(
          Source.getAddress() + "/api/transformations/" + row.from.id,
          deletet,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            params: { com: com, delete: "delete" },
          }
        )
        .then((res) => {
          showAlert({
            position: "center",
            icon: "success",
            title: "Transermation record successfully deleted!",
            showConfirmButton: false,
            timer: 600,
          });
          setRecords((prevRecords) =>
            prevRecords.filter((record) => record.from.id !== row.from.id)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      showAlert({
        position: "center",
        icon: "error",
        text: "Your Deposite record is safe :)",
        showConfirmButton: false,
        timer: 600,
      });
    }
  };

  // edit
  const [EditRow, setEditRow] = useState();
  const [EditModal, setEditModal] = useState(false);

  const [formattedValue, setFormattedValue] = useState({
    from_amount: null,
    from_balance: null,
    to_amount: null,
    to_balance: null,
    com_amount: null,
    com_balance: null,
  });
  const [Checkbox, setCheckbox] = useState({
    amount: false,
    Todescription: false,
    Cdescription: false,
  });
  const [Transformation, setTransformation] = useState({
    user_id: localStorage.getItem("userTokenid"),
    from_account_id: null,
    from_amount: 0,
    from_balance:0,
    from_description: null,
    to_account_id: null,
    to_amount: 0,
    to_balance:0,
    to_description: null,
    com_account_id: null,
    com_amount: 0,
    com_balance:0,
    com_description: null,
    date_creation: null,
  });
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOptionTo, setSelectedOptionTo] = useState();
  const [selectedOptionFrom, setSelectedOptionFrom] = useState();
  const [oldTransformation, setoldTransformation] = useState(0);
  const [oldCom, setOldCom] = useState("no");
  const handlleEdit = (row) => {
    setoldTransformation(row.from.id);
    setEditModal(true);
    setEditRow(row);
    setOldCom(row.com ? "ok" : "no");
    setFormattedValue({
      ...formattedValue,
      from_amount: row.from?.amount,
      from_balance: row.belance?.from,
      to_amount: row.to?.amount,
      to_balance: row.belance?.to,
      com_amount: row.com?.amount,
      com_balance: row?.com,
    });
    setCheckbox({
      amount: row.com ? true : false,
      Todescription: false,
      Cdescription: false,
    });
    console.log(row);
    setTransformation({
      ...Transformation,
      user_id: row.from.user,
      from_account_id: row.from.account,
      from_balance:row.belance.from.belance,
      from_amount: row.from.amount,
      from_description: row.from.discription,
      to_account_id: row.to.account,
      to_amount: row.to.amount,
      to_balance:row.belance.to.belance,
      to_description: row.to.discription,
      com_account_id: row.com?.account,
      com_balance:row?.belance?.com?.belance,
      com_amount: row.com?.amount,
      com_description: row.com?.discription,
      date_creation: row.from.date,
    });
    setSelectedOption({
      id: row.com?.account,
      account_name: row.com?.customer,
      whatsup_number: row.com?.whatsup_number,
      whatsup: row.com?.whatsup,
      belance: row.belance?.com,
      moneyType: row.com?.moneyType,
    });
    setSelectedOptionFrom({
      id: row.from.account,
      account_name: row.from.customer,
      whatsup_number: row.from?.whatsup_number,
      whatsup: row.from?.whatsup,
      belance: row.belance.from,
      moneyType: row.from.moneyType,
    });
    setSelectedOptionTo({
      id: row.to.account,
      account_name: row.to.customer,
      whatsup_number: row.to?.whatsup_number,
      whatsup: row.to?.whatsup,
      belance: row.belance.to,
      moneyType: row.to.moneyType,
    });
  };
  // end of edit
  const columnsDesktopsimple = [
    {
      name: <strong>From Account</strong>,
      selector: (row) => row.from.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },
    {
      name: <strong>From Amount</strong>,
      selector: (row) => formatNumber(row.from.amount),
    },
    {
      name: <strong>To Account</strong>,
      selector: (row) => row.to.customer,
    },
    {
      name: <strong className="w-50 text-center">To Amount</strong>,
      selector: (row) => formatNumber(row.to.amount),
      style: {
        textAlign: "center",
      },
    },
    {
      name: <strong className="w-50 text-center">Description</strong>,
      selector: (row) => row.from.discription,
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
    {
      name: <strong>Commission Account</strong>,
      selector: (row) => (row.com ? row.com.customer : "none"),
    },
    {
      name: <strong className="w-50 text-center">Commission Amount</strong>,
      selector: (row) => formatNumber(row.com ? row.com.amount : 0),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
    {
      name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.from?.date || row.from.date_created),

      style: {
        minWidth: "190px!important", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
      },
    },
  ];
  const PDcolumn = [
    {
      name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
          <FormattedMessage id="Date Created" />
        </strong>
      ),
      selector: (row) => date(row.from?.date || row.from?.date_created),

      style: {
        minWidth: "190px!important", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
      },
    },
    {
      name: (
        <strong className="w-50 text-center">
          <FormattedMessage id="Com Amount" />
        </strong>
      ),
      selector: (row) => (
        <span dir="ltr">{formatNumber(row.com ? row.com.amount : 0)}</span>
      ),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
  
    {
      name: (
        <strong>
          <FormattedMessage id="Commission Account" />
        </strong>
      ),
      selector: (row) => (row.com ? row.com.customer : "none"),
    },
    {
      name: (
        <strong className="w-50 text-center">
          <FormattedMessage id="Description" />
        </strong>
      ),
      selector: (row) => row.from?.discription,
      style: {
        textAlign: "center",
      },
    },
    {
      name: <strong>
<FormattedMessage id="Send MSG" />
      </strong>,
      cell: (row) => (
        <a onClick={() => handlleWhatsupto(row)}>
          <img
            src={Whatsupimg}
            alt="WhatsApp"
            className="whatsapp-icon"
            style={{ width: "2rem" }}
          />
        </a>
      ),
      style: {
        minWidth: "100px",
        maxWidth: "120px",
        textAlign: "center",
      },
    },
    {
      name: (
        <strong className="w-50 text-center">
          <FormattedMessage id="To Amount" />
        </strong>
      ),
       selector: (row) => (
        <span dir="ltr">{formatNumber(row.to?.amount)}</span>
      ),
      style: {
        textAlign: "center",
      },
    },
   
    {
      name: (
        <strong>
          <FormattedMessage id="To Account" />
        </strong>
      ),
      selector: (row) =>row.to?.customer,
    },
    {
      name: <strong>
<FormattedMessage id="Send MSG" />
      </strong>,
      cell: (row) => (
        <a onClick={() => handlleWhatsupfrom(row)}>
          <img
            src={Whatsupimg}
            alt="WhatsApp"
            className="whatsapp-icon"
            style={{ width: "2rem" }}
          />
        </a>
      ),
      style: {
        minWidth: "100px",
        maxWidth: "120px",
        textAlign: "center",
      },
    },
    {
      name: (
        <strong>
          <FormattedMessage id="From Amount" />
        </strong>
      ),
      
      selector: (row) => (
        <span dir="ltr">{formatNumber(row.from?.amount)}</span>
      ),
    },
 
    {
      name: (
        <strong>
          <FormattedMessage id="From Account" />
        </strong>
      ),
      selector: (row) => row.from?.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
    },
    {
      name: <strong className="ms-2">
          <FormattedMessage id="Edit" />
      </strong>,
      cell: (row) => (
        <a onClick={() => handlleEdit(row)}>
          <img
            src={Pencil}
            alt="Edit"
            className="edit-icon"
            style={{ width: "2rem" }}
          />
        </a>
      ),
      style: {
        minWidth: "80px",
        maxWidth: "80px",
        textAlign: "center",
      },
    },
  ];
  const columnsTablet = [
    {
      name: <strong>From Account</strong>,
      selector: (row) => row.to.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },
    {
      name: <strong>From Amount</strong>,
      selector: (row) => formatNumber(row.from.amount),
      //  sortable: true
    },
    
    {
      name: <strong>To Account</strong>,
      selector: (row) =>
        row.to.account ? row.to.account.account?.name : row.to?.account_name,
    },
    {
      name: <strong className="text-center">To Amount</strong>,
      selector: (row) => formatNumber(row.from.amount),
      style: {
        textAlign: "center",
      },
    },
    {
      name: <strong className="w-50 text-center">Description</strong>,
      selector: (row) => row.from.discription,
      style: {
        textAlign: "center",
      },
    },
    {
      name: <strong>Commission Account</strong>,
      selector: (row) => (row.com ? row.com.customer : "none"),
    },
    {
      name: <strong className="w-50 text-center">Commission Amount</strong>,
      selector: (row) => formatNumber(row.com ? row.com.amount : 0),
      style: {
        textAlign: "center",
      },
    },
    {
      name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.from?.date || row.from.date_created),
    },
  ];
  const columnsDesktop = [
    {
      name: <strong>From Account</strong>,
      selector: (row) => row.from.customer,
      style: {
        minWidth: "150px",
        maxWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: <strong>From Amount</strong>,
      selector: (row) =>
        formatNumber(row.from.amount) + " " + row.from.moneyType,
      style: {
        color: "red",
        minWidth: "150px",
        maxWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: <strong>Send Msg</strong>,
      cell: (row) => (
        <a onClick={() => handlleWhatsupfrom(row)}>
          <img
            src={Whatsupimg}
            alt="WhatsApp"
            className="whatsapp-icon"
            style={{ width: "2rem" }}
          />
        </a>
      ),
      style: {
        minWidth: "100px",
        maxWidth: "120px",
        textAlign: "center",
      },
    },
    {
      name: <strong>To Account</strong>,
      selector: (row) => row.to?.customer,
      style: {
        minWidth: "150px",
        maxWidth: "200px",
        textAlign: "left",
      },
    },
    {
      name: <strong>To Amount</strong>,
      selector: (row) => formatNumber(row.to?.amount) + " " + row.from.moneyType,
      style: {
        color: "green",
        minWidth: "120px",
        maxWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: <strong>Send Msg</strong>,
      cell: (row) => (
        <a onClick={() => handlleWhatsupto(row)}>
          <img
            src={Whatsupimg}
            alt="WhatsApp"
            className="whatsapp-icon"
            style={{ width: "2rem" }}
          />
        </a>
      ),
      style: {
        minWidth: "100px",
        maxWidth: "120px",
        textAlign: "center",
      },
    },
    {
      name: <strong>Description</strong>,
      selector: (row) => row.from.discription,
      style: {
        minWidth: "200px",
        maxWidth: "300px",
        textAlign: "center",
      },
    },
    {
      name: <strong>Commission Account</strong>,
      selector: (row) => (row.com ? row.com.customer : "none"),
      style: {
        minWidth: "150px",
        maxWidth: "200px",
        textAlign: "left",
      },
    },
    {
      name: <strong>Commission Amount</strong>,
      selector: (row) =>
        formatNumber(row.com ? row.com.amount : 0) + " " + row.from.moneyType,
      style: {
        minWidth: "100px",
        maxWidth: "120px",
        textAlign: "center",
      },
    },
    {
      name: <strong className="w-100">Date Created</strong>,
      selector: (row) => date(row.from?.date || row.from.date_created),
      style: {
        minWidth: "180px",
        maxWidth: "220px",
        textAlign: "center",
      },
    },
    {
      name: <strong className="ms-2">Edit</strong>,
      cell: (row) => (
        <a onClick={() => handlleEdit(row)}>
          <img
            src={Pencil}
            alt="Edit"
            className="edit-icon"
            style={{ width: "2rem" }}
          />
        </a>
      ),
      style: {
        minWidth: "80px",
        maxWidth: "80px",
        textAlign: "center",
      },
    },
  ];

  const columns = useMemo(() => {
    if (
      localStorage.getItem("language") === "pa" ||
      localStorage.getItem("language") === "da"
    ) {
      return PDcolumn;
    }
    if (isDesktop) {
      // else{
      return localStorage.getItem("userTokenname") === "admin"
        ? columnsDesktop
        : columnsDesktopsimple;
    }
    // }
    return columnsTablet;
  }, [isDesktop]);

  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(
        Source.getAddress() + "/api/transformations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            all:IsAll && "ok",
            user_id: selecteduser?.id,
            page: page,
            perPage: pageSize,
            isdelete: 0,
            StartDate: StartDate && Date_Start,
            EndDate: EndDate && Date_End,
            search: search?.length ? search : "false",
          },
        }
      );
      if (response.data.data.length>=1) {
        setRecords(response.data.data); // داده‌های صفحه جاری
        setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      } else {
        setRecords([]);
        setTotalRows(0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
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
    const [loadingMore, setLoadingMore] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const batchSize = 20;
  const fetchAllData = useCallback(async () => {
    setLoadingMore(true);
    try {
      const response = await axios.get(
        Source.getAddress() + "/api/transformations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            all: "ok",
            user_id: selecteduser?.id,
            isdelete: 0,
            StartDate: StartDate && Date_Start,
            EndDate: EndDate && Date_End,
            search: search?.length ? search : "false",
          },
        }
      );
      
      setAllRecords(response.data.data);
      setDisplayedRecords(response.data.data.slice(0, batchSize));
      setHasMore(response.data.data.length > batchSize);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching all data", error);
      setLoadingMore(false);
    }
  }, [selecteduser, StartDate, EndDate, search]);

  const loadMoreRecords = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const nextRecords = allRecords.slice(0, nextPage * batchSize);
      
      setDisplayedRecords(nextRecords);
      setPage(nextPage);
      setHasMore(nextRecords.length < allRecords.length);
      setLoadingMore(false);
    }, 500);
  };

  const fetchPaginatedData = async (page, pageSize) => {
    setLoadingMore(true);
    try {
      const response = await axios.get(
        Source.getAddress() + "/api/transformations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            user_id: selecteduser?.id,
            page: page,
            perPage: pageSize,
            isdelete: 0,
            StartDate: StartDate && Date_Start,
            EndDate: EndDate && Date_End,
            search: search?.length ? search : "false",
          },
        }
      );
      
      if (response.data.data.length >= 1) {
        setRecords(response.data.data);
        setTotalRows(response.data.total);
      } else {
        setRecords([]);
        setTotalRows(0);
      }
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching paginated data", error);
      setLoadingMore(false);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleScroll = useCallback(() => {
    if (!IsAll || loadingMore || !hasMore) return;
    
    const table = document.querySelector('.rdt_Table');
    if (!table) return;
    
    const { scrollTop, scrollHeight, clientHeight } = table;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    
    if (isNearBottom) {
      loadMoreRecords();
    }
  }, [IsAll, loadingMore, hasMore, loadMoreRecords]);

  useEffect(() => {
    const table = document.querySelector('.rdt_Table');
    if (table && IsAll) {
      table.addEventListener('scroll', handleScroll);
      return () => table.removeEventListener('scroll', handleScroll);
    }
  }, [IsAll, handleScroll]);

  useEffect(() => {
    if (IsAll) {
      fetchAllData();
    } else {
      fetchPaginatedData(currentPage, perPage);
    }
  }, [IsAll, currentPage, perPage, EndDate, StartDate, selecteduser, search, fetchAllData]);


  const CustomLoader = () => (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      <CircularProgress size={24} />
      <Box ml={2}>Loading more records...</Box>
    </Box>
  );

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage, EndDate, StartDate, selecteduser, search,IsAll]);
  const [optionsFrom, setOptionsFrom] = useState([]);
  const handleName = (e) => {
    setSearch(e.target.value);
  };
  const { formatMessage } = useIntl();
  return (
    <div
      dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className=" me-1 ms-1 mt-5 h-100"
      style={{ width: "99%" }}
      onClick={(e) => {
        if (
          e.target.className === "container mt-5 w-100 h-100" ||
          e.target.className ===
            "col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent"
        ) {
        }
      }}
    >
      <button
        type="submit"
        className="btn btn-info mb-1 p-1"
        style={{ width: "100px" }}
        onClick={() => {
          setAddTransformationModal(true);
        }}
      >
        <FormattedMessage id="Add"/>
      </button>
      <div
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Transformations"/>
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
            <FormControlLabel
              control={<Switch checked={IsAll} onChange={(e) => setIsAll(e.target.checked)} />}
              label={<FormattedMessage id="All" />}
              sx={{ minWidth: 120 }}
            />
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date}
              lebal={<FormattedMessage id="Date"/>}
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
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
  value={search}
  placeholder={formatMessage({ id: "Search" })}
  aria-label="Search"
/>
      </div>
      {/* <DataTable
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
      /> */}
      {IsAll ? (
        <DataTable
          columns={columns}
          data={displayedRecords}
          progressPending={loadingMore}
          striped
          responsive
          highlightOnHover
          noHeader
          progressComponent={<CustomLoader />}
          style={{
            height: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={records}
          progressPending={loadingMore}
          striped
          responsive
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          localization={localization}
        />
      )}
      <AddTransformation
        records={records}
        setRecords={setRecords}
        AddTransformationModal={AddTransformationModal}
        setOptionsFrom={setOptionsFrom}
        optionsFrom={optionsFrom}
        closeDialog={() => setAddTransformationModal(false)}
      />
      <EditTransformation
        oldCom={oldCom}
        setOldCom={setOldCom}
        Transformation={Transformation}
        setTransformation={setTransformation}
        Checkbox={Checkbox}
        setCheckbox={setCheckbox}
        formattedValue={formattedValue}
        setFormattedValue={setFormattedValue}
        selectedOptionFrom={selectedOptionFrom}
        selectedOptionTo={selectedOptionTo}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setSelectedOptionFrom={setSelectedOption}
        setSelectedOptionTo={setSelectedOptionTo}
        oldTransformation={oldTransformation}
        setoldTransformat={setoldTransformation}
        EditRow={EditRow}
        setEditModal={setEditRow}
        close={() => setEditModal(false)}
        records={records}
        setRecords={setRecords}
        AddTransformationModal={EditModal}
        setOptionsFrom={setOptionsFrom}
        optionsFrom={optionsFrom}
      />
    </div>
  );
}
