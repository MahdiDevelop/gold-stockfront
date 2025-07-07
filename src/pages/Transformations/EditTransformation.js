import React, { useEffect, useMemo, useRef, useState } from "react";
// import Source from "../Source";
import axios from "axios";
// import Swal from "sweetalert2";
import { showAlert } from "../../warrper.js";
import ComboBoxT from "./ComboBoxT";
import Source from "../../Source";
import { NumericFormat } from "react-number-format";
import { useModel } from "react-model";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Datepicker_Customer from "../forms/Datepicker_customer";
import { useSelector, useDispatch } from "react-redux";
// import { useSelector, useDispatch } from 'react-redux';
import { getReports, updateReportInCache } from "../Redux/reportSlice.js";
import { getBelances, updateBelanceInCache } from "../Redux/belanceSlice.js";
import { getSettings } from "../Redux/settingSlice.js";
import Whatsupimg from "../../assets/icon/whatsup.png";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage, useIntl } from "react-intl";
import { useShowAlert } from "../../warrper";
export default function EditTransformation({
  AddTransformationModal,
  close,
  setOptionsFrom,
  optionsFrom,
  records,
  setRecords,
  //
  oldCom,
  setOldCom,
  Transformation,
  setTransformation,
  Checkbox,
  setCheckbox,
  formattedValue,
  setFormattedValue,
  selectedOptionFrom,
  selectedOptionTo,
  selectedOption,
  setSelectedOption,
  setSelectedOptionFrom,
  setSelectedOptionTo,
  oldTransformation,
  setoldTransformat,
}) {
  const showAlert = useShowAlert();
  const dispatch = useDispatch();
  const [tempRecordfrom, settempRecordfrom] = useState(null);
  const [tempRecordto, settempRecordto] = useState(null);

  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [Settings, Setsettings] = useState([]);
  const [ToOk, setToOk] = useState(false);
  useEffect(() => {
    if (statuss !== "succeeded" && !settings) {
      dispatch(getSettings());
    } else {
      Setsettings(settings);
    }
  }, []);

  // useEffect(() => {
  //   if (settings.length > 0) {
  //   }
  // }, [settings]);

  const handleform = (e) => {
    setTransformation({
      ...Transformation,
      [e.target.name]: e.target.value,
    });
    if (Checkbox.Todescription && Checkbox.Cdescription) {
      if (e.target.name === "from_description") {
        setTransformation({
          ...Transformation,
          to_description: e.target.value,
          com_description: e.target.value,
        });
      }
    } else if (Checkbox.Todescription) {
      if (e.target.name === "from_description") {
        setTransformation({
          ...Transformation,
          to_description: e.target.value,
        });
      }
    } else if (Checkbox.Cdescription) {
      if (e.target.name === "from_description") {
        setTransformation({
          ...Transformation,
          com_description: e.target.value,
        });
      }
    }
  };
  const handleChange = (e) => {
    // console.log(e.target.id);
    const formattedValue = e.target.value;
    // Remove the thousand separators (commas)
    const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");

    if (!Checkbox.amount) {
      setFormattedValue({
        ...formattedValue,
        to_amount: e.target.value,
        [e.target.id]: e.target.value,
      });
      setTransformation({
        ...Transformation,
        to_amount: unformattedValue,
        [e.target.id]: unformattedValue,
      });
    } else {
      setFormattedValue({
        ...formattedValue,
        [e.target.id]: e.target.value,
      });
      setTransformation({
        ...Transformation,
        [e.target.id]: unformattedValue,
      });
    }
  };
  //   const [formattedValue, setFormattedValue] = useState({
  //     from_amount: null,
  //     from_balance: null,
  //     to_amount: null,
  //     to_balance: null,
  //     com_amount: null,
  //     com_balance: null,
  //   });

  // from account
  const [searchQueryFrom, setSearchQueryFrom] = useState();

  // const [optionsFrom, setOptionsFrom] = useState();

  const [selectedDay, setSelectedDay] = useState(moment());
  const [EndDate, setEndDate] = useState(moment());
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
      setTransformation({
        ...Transformation,
        date_creation: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };

  const handleFrom = (e) => {
    axios
      .get(Source.getAddress() + "/api/commession", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: { money: e?.moneyId }, // ارسال پارامتر جستجو به سرور
      })
      .then((res) => {
        setSelectedOption(res.data);
        // console.log(res);
      })
      .catch((er) => {
        // console.log(er);
      });
    if (e) {
      const filter = optionsFrom.filter(
        (record) => record.type_id === e.type_id
      );
      setOptionsTo(filter);
      setOptions(filter);
      setTransformation({
        ...Transformation,
        from_balance: e.belance,
      });
      setFormattedValue({
        ...formattedValue,
        from_balance: e.belance,
      });
    }
  };
  const handleSearchFrom = async (query) => {
    if (query.length < 1) {
      setOptionsFrom([]);
      return;
    }
    try {
      const response = await axios.get(`${Source.getAddress()}/api/belance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: { query: query }, // ارسال پارامتر جستجو به سرور
      });
      setOptionsFrom(response.data);
      // const data = ;
      // // تبدیل داده‌ها به فرمت مناسب برای react-select
      // let formattedOptions = data;

      // if (formattedOptions && formattedOptions.length() === 0) {
      //   if (query) {
      //     // setAddItem({
      //     //   ...AddItem,
      //     //   temp_customer: query,
      //     // });
      //     setSelectedOptionFrom({ id: 0, name: query });
      //   }
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };
  const handleInputChangeFrom = (newValue) => {
    setToOk(true);
    setSearchQueryFrom(newValue); // بروزرسانی مقدار ورودی جستجو
    // handleSearchFrom(newValue); // ارسال درخواست جستجو به سرور
  };
  // to account
  const [searchQueryTo, setSearchQueryTo] = useState();
  const [optionsTo, setOptionsTo] = useState();
  const handleTo = (e) => {
    if (e) {
      setTransformation({
        ...Transformation,
        to_balance: e.belance,
      });
      setFormattedValue({
        ...formattedValue,
        to_balance_balance: e.belance,
      });
    }
  };
  // const handleSearchTo = async (query) => {
  //   if (query.length < 3) {
  //     setOptionsTo([]);
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(`${Source.getAddress()}/api/belance`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access")}`,
  //       },
  //       params: {
  //         query: query,
  //         money_id: selectedOptionFrom.type.id,
  //       }, // ارسال پارامتر جستجو به سرور
  //     });
  //     // console.log(query);
  //     const data = response.data;
  //     // console.log(response);
  //     // تبدیل داده‌ها به فرمت مناسب برای react-select
  //     let formattedOptions = data;
  //     setOptionsTo(formattedOptions);

  //     if (formattedOptions && formattedOptions.length() === 0) {
  //       if (query) {
  //         // setAddItem({
  //         //   ...AddItem,
  //         //   temp_customer: query,
  //         // });
  //         setSelectedOptionTo({ id: 0, name: query });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //   }
  // };
  const handleInputChangeTo = (newValue) => {
    setSearchQueryTo(newValue); // بروزرسانی مقدار ورودی جستجو
    // handleSearchTo(newValue); // ارسال درخواست جستجو به سرور
  };

  // comsion
  const [searchQuery, setSearchQuery] = useState();
  const [options, setOptions] = useState();
  const handle = (e) => {
    if (e) {
      setTransformation({
        ...Transformation,
        com_balance: e.belance,
      });
      setFormattedValue({
        ...formattedValue,
        from_balance: e.belance,
      });
    }
  };
  const handleSearch = async (query) => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }
    try {
      const response = await axios.get(`${Source.getAddress()}/api/belance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          query: query,
          money_id: selectedOptionFrom.type.id || "false",
        }, // ارسال پارامتر جستجو به سرور
      });
      console.log(query);
      const data = response.data;
      // console.log(response);
      // تبدیل داده‌ها به فرمت مناسب برای react-select
      let formattedOptions = data;
      setOptions(formattedOptions);

      if (formattedOptions && formattedOptions.length() === 0) {
        if (query) {
          // setAddItem({
          //   ...AddItem,
          //   temp_customer: query,
          // });
          setSelectedOption({ id: 0, name: query });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };
  const handleInputChange = (newValue) => {
    setSearchQuery(newValue); // بروزرسانی مقدار ورودی جستجو
    // handleSearch(newValue); // ارسال درخواست جستجو به سرور
  };
  // const dispatch = useDispatch();

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
  const handlleWhatsup = (tempRecord) => {
    if (tempRecord.whatsup === 1) {
      let language = localStorage.getItem("language");
      let tomessege;
      
      if (language === 'en') {
        tomessege = `Hello dear ${tempRecord.account_name},\n💼 Your recent transaction has been successfully registered in the system.\nType: ${"Deposit"} 💰\nAmount: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.from_amount >=0) ?" 🟢" :' 🔴')} 💵\nCurrent balance: ${tempRecord.belance + tempRecord.belance+ ((parseInt(tempRecordfrom.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')} 📊\nDescription: ${tempRecord.to_description || ""} ✍\nDate: ${tempRecord.msgdate} 📅\nThank you for choosing our services!`;
      } 
      else if (language === 'pa') {
        tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 ستاسو وروستی معامله په سیسټم کې په بریالیتوب ثبت شوې ده.\nډول: ${"واریز"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType +((tempRecord.from_amount >=0) ?" 🟢" :' 🔴')} 💵\nاوسنی بیلانس: ${tempRecord.belance + tempRecord.belance+ ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')} 📊\nشرح: ${tempRecord.to_description || ""} ✍\nنېټه: ${tempRecord.msgdate} 📅\زموږ د خدمتونو په انتخاب مننه!`;
      }
      else if (language === 'da') {
        tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 معامله اخیر شما در سیستم موفقانه ثبت گردید.\nنوع: ${"واریز"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.from_amount >=0) ?" 🟢" :' 🔴')} 💵\nبالانس فعلی: ${tempRecordfrom.belance + tempRecord.belance + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')} 📊\nتوضیحات: ${tempRecord.to_description || ""} ✍\nتاریخ: ${tempRecord.msgdate} 📅\nاز انتخاب خدمات ما متشکریم!`;
      }
      else {
        tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 معامله اخیر شما در سیستم موفقانه ثبت گردید.\nنوع: ${"واریز"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.from_amount >=0) ?" 🟢" :' 🔴')} 💵\nبالانس فعلی: ${tempRecordfrom.belance + tempRecord.belance + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')} 📊\nتوضیحات: ${tempRecord.to_description || ""} ✍\nتاریخ: ${tempRecord.msgdate} 📅\nاز انتخاب خدمات ما متشکریم!`;

        // Default to Persian if language not set or unknown
        // tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${"واریز"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType} 💵\nبیلانس فعلی: ${tempRecordfrom.belance + tempRecord.belance} 📊\nشرح: ${tempRecord.to_description || ""} ✍\nتاریخ: ${tempRecord.msgdate} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
      }
  
      console.log(tempRecord);
      WhatsAppButton({
        phoneNumber: tempRecord.whatsup_number || "",
        message: tomessege,
      });
    }
  };
  const handlleWhatsupfrom = (tempRecord) => {
    if (tempRecord.whatsup === 1) {
      let language = localStorage.getItem("language");
      let tomessege;
  
      if (language === 'en') {
        tomessege = `Hello dear ${tempRecord.account_name},\n💼 Your recent transaction has been successfully registered in the system.\nType: ${"Withdrawal"} 💰\nAmount: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 💵\nCurrent balance: ${tempRecordfrom.belance - tempRecord.belance} 📊\nDescription: ${tempRecord.to_description || ""} ✍\nDate: ${tempRecord.msgdate} 📅\nThank you for choosing our services!`;
      }
      else if (language === 'pa') {
        tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 ستاسو وروستی معامله په سیسټم کې په بریالیتوب ثبت شوې ده.\nډول: ${"تیریدل"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 💵\nاوسنی بیلانس: ${tempRecord.belance - tempRecord.belance((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 📊\nشرح: ${tempRecord.to_description || ""} ✍\nنېټه: ${tempRecord.msgdate} 📅\nزموږ د خدمتونو په انتخاب مننه!`;
      }
      else if (language === 'da') {
        tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 معامله اخیر شما در سیستم موفقانه ثبت گردید.\nنوع: ${"برداشت"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 💵\nبالانس فعلی: ${tempRecord.belance - tempRecord.belance((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 📊\nتوضیحات: ${tempRecord.to_description || ""} ✍\nتاریخ: ${tempRecord.msgdate} 📅\nاز انتخاب خدمات ما متشکریم!`;
      }
      else {
        // Default to Persian if language not set or unknown
        tomessege = `سلام ${tempRecord.account_name} عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${"برداشت"} 💰\nمقدار: ${tempRecord.to_amount + " " + tempRecord.moneyType+((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 💵\nبیلانس فعلی: ${tempRecord.belance - tempRecord.belance((tempRecord.to_amount >=0) ?" 🟢" :' 🔴')} 📊\nشرح: ${tempRecord.to_description || ""} ✍\nتاریخ: ${tempRecord.msgdate} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
      }
  
      console.log(tomessege);
      WhatsAppButton({
        phoneNumber: tempRecord.whatsup_number || "",
        message: tomessege,
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
  // const Sendmsg =()=>{
  //   if(!selectedOptionTo ||!Transformation.from_amount ){
  //     showAlert({
  //       position: "top-end",
  //       icon: "error",
  //       title: "You must select from account and to account!",
  //       showConfirmButton: false,
  //       timer: 1000,
  //     });
  //     return;
  //   }
  //   let tomessege = `سلام ${selectedOptionTo.account_name} عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${
  //     Transformation.to_amount > 0 ? "واریز" : "برداشت"
  //   } 💰\nمقدار: ${Transformation.to_amount + " " + selectedOptionTo.moneyType} 💵\nبیلانس فعلی: ${
  //     selectedOptionFrom.belance + selectedOptionTo.belance
  //   } 📊\nشرح: ${Transformation.to_description || ""} ✍\nتاریخ: ${selectedDay} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
  // console.log(tomessege);
  //   WhatsAppButton({
  //     phoneNumber: selectedOptionTo.whatsup_number || '',
  //     message: tomessege,
  //   });
  // }
  const Submit = () => {
    if (!selectedOptionFrom || !selectedOptionTo) {
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

    if (Checkbox.amount) {
      Transformation.com_account_id = selectedOption.id;
    }
    Transformation.from_account_id = selectedOptionFrom.id;
    Transformation.to_account_id = selectedOptionTo.id;
    Transformation._method='put';
    axios
      .post(
        Source.getAddress() + "/api/transformations/" + oldTransformation,
        Transformation,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            complete: Checkbox.amount ? "ok" : "no",
            old: oldCom,
            new: selectedOption?.id ? "ok" : "no",
          },
        }
      )
      .then((res) => {
        // console.log(selectedDay);
        let data = res.data;
        let add = res.data.bill;
        let d = date(selectedDay);
        let language = localStorage.getItem("language");

        let message = "";

        if (language === "en") {
          message = `Hello ${
            selectedOptionFrom.account_name
          },\n💼 Your recent transaction has been successfully recorded in the system.\nType: ${
            Transformation.from_amount > 0 ? "Withdraw" : "Deposit"
          } 💰\nAmount: ${
            Transformation.from_amount + " " + selectedOptionFrom.moneyType + ((Transformation.from_amount >=0) ?" 🟢" :' 🔴')
          } 💵\nCurrent Balance: ${
            selectedOptionFrom.belance - selectedOptionFrom.belance +((selectedOptionFrom.belance - selectedOptionFrom.from_amount >=0) ?"🟢" :'🔴')
          } 📊\nDescription: ${
            Transformation.from_description || ""
          } ✍\nDate: ${d} 📅\nThank you for choosing our services!`;
        } else if (language === "pa") {
          message = `سلام ${
            selectedOptionFrom.account_name 
          } ګران،\n💼 ستاسو وروستۍ معامله په بریالیتوب سره سیسټم کې ثبت شوې ده.\nډول: ${
            Transformation.from_amount > 0 ? "ایستل" : "جمع کول"  
          } 💰\nمقدار: ${
            Transformation.from_amount + " " + selectedOptionFrom.moneyType + ((Transformation.from_amount >=0) ?" 🟢" :' 🔴')
          } 💵\nاوسنی بیلانس: ${
            selectedOptionFrom.belance - selectedOptionFrom.belance +((selectedOptionFrom.belance - selectedOptionFrom.from_amount >=0) ?"🟢" :'🔴')
          } 📊\nتفصیل: ${
            Transformation.from_description || ""
          } ✍\nنیټه: ${d} 📅\nله موږ څخه د خدماتو اخیستلو لپاره مننه!`;
        } else if (language === "da") {
          message = `سلام ${
            selectedOptionFrom.account_name
          } عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${
            Transformation.from_amount > 0 ? "برداشت" : "واریز"
          } 💰\nمقدار: ${
            Transformation.from_amount + " " + selectedOptionFrom.moneyType + ((Transformation.from_amount >=0) ?" 🟢" :' 🔴')
          } 💵\nبیلانس فعلی: ${
            selectedOptionFrom.belance - selectedOptionFrom.belance +((selectedOptionFrom.belance - selectedOptionFrom.from_amount >=0) ?"🟢" :'🔴')
          } 📊\nشرح: ${
            Transformation.from_description || ""
          } ✍\nتاریخ: ${d} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
        } else {
          message = "Language not supported!";
        }
        if (selectedOptionFrom.whatsup === 1) {
          // console.log('hi')
          WhatsAppButton({
            phoneNumber: selectedOptionFrom.whatsup_number || "",
            message: message,
          });
        }
        settempRecordfrom({ ...selectedOptionFrom, ...Transformation });
        settempRecordto({ ...selectedOptionTo, msgdate: d, ...Transformation });
        if (Checkbox.amount) {
          let from = { customer: selectedOptionFrom.account_name };
          let to = { customer: selectedOptionTo.account_name };
          let com = { customer: selectedOption.account_name };
          add.from = { ...add.from, ...selectedOptionFrom, ...from };
          add.to = { ...add.to, ...selectedOptionTo, ...to };
          add.com = { ...add.com, ...selectedOption, ...com };
          setRecords((prevRecords) =>
            prevRecords.map((record) => {
              if (record.from.id === data.bill.from.transformation) {
                return { ...record, ...data.bill };
              }
              return record;
            })
          );
          setOptionsFrom((prevRecords) =>
            prevRecords.map((record) => {
              if (record.id === data.belancecom_report.id) {
                return { ...record, ...data.belancecom_report };
              } else if (record.id === data.belancefrom_report.id) {
                return { ...record, ...data.belancefrom_report };
              } else if (record.id === data.belanceto_report.id) {
                return { ...record, ...data.belanceto_report };
              }
              return record;
            })
          );
        } else {
          let from = { customer: selectedOptionFrom.account_name };
          let to = { customer: selectedOptionTo.account_name };
          add.from = { ...add.from, ...selectedOptionFrom, ...from };
          add.to = { ...add.to, ...selectedOptionTo, ...to };
          setRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.from.id === data.bill.from.transformation
                ? { ...record, ...data.bill }
                : record
            )
          );
          setOptionsFrom((prevRecords) =>
            prevRecords.map((record) => {
              if (record.id === data.belancefrom_report.id) {
                return { ...record, ...data.belancefrom_report };
              } else if (record.id === data.belanceto_report.id) {
                return { ...record, ...data.belanceto_report };
              }
              return record;
            })
          );
          setSelectedOption(null);
          setSelectedOptionFrom(null);
          setSelectedOptionTo(null);
        }
        showAlert({
          position: "top-end",
          icon: "success",
          title: <FormattedMessage id="Transformation has been updated!" />,
          showConfirmButton: false,
          timer: 1000,
        });

        setTransformation({
          user_id: localStorage.getItem("userTokenid"),
          from_account_id: null,
          from_amount: 0,
          from_description: null,
          to_account_id: null,
          to_amount: 0,
          to_description: null,
          com_account_id: null,
          com_amount: 0,
          com_description: null,
          date_creation: new Date().toISOString(),
        });

        setFormattedValue({
          from_amount: 0,
          from_balance: 0,
          to_amount: 0,
          to_balance: 0,
          com_amount: 0,
          com_balance: 0,
        });
        setCheckbox({
          amount: false,
          Todescription: false,
          Cdescription: false,
        });
        setSelectedOption(null);
        setSelectedOptionFrom(null);
        setSelectedOptionTo(null);
      })
      .catch((e) => {
        console.log(e);
        showAlert({
          position: "top-end",
          icon: "error",
          title: <FormattedMessage id="Something went wrong!" />,
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };

  // dispatch(getReports());
  // dispatch(getBelances());
  // console.log(optionsFrom);
  // console.log(Transformation);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Source.getAddress()}/api/belance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            query: searchQueryTo,
            money_id: selectedOptionFrom.money_id,
            do: "ok",
          }, // ارسال پارامتر جستجو به سرور
        });
        setOptionsTo(response.data);
        const data = response.data;
        // console.log(data);

        // if (data && data.length === 0) {
        //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
        // } else {
        //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedOptionFrom) {
      if (!searchQueryTo || searchQueryTo?.length < 3) {
        setOptionsFrom([]);
        return;
      } else {
        fetchData();
      }
    }
  }, [searchQueryTo]); // اضافه کردن searchQuery به وابستگی‌های useEffect

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Source.getAddress()}/api/belance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            query: searchQuery,
            money_id: selectedOptionFrom.money_id,
            do: "ok",
          }, // ارسال پارامتر جستجو به سرور
        });
        setOptions(response.data);
        const data = response.data;
        // console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // if(selectedOption){
    if (!searchQuery || searchQuery.length < 3) {
      setOptions([]);
      return;
      // }
    } else {
      fetchData();
    }
  }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect

  // dispatch(getReports());
  // dispatch(getBelances());
  // console.log(optionsFrom);
  useEffect(() => {
    // console.log(!searchQueryFrom );
    const fetchData = async () => {
      // Check if searchQueryFrom is not empty or only whitespace
      if (!searchQueryFrom || searchQueryFrom.length < 3) {
        setOptionsFrom([]); // Clear options if the search query is empty or just whitespace
        return;
      }

      try {
        const response = await axios.get(`${Source.getAddress()}/api/belance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: { query: searchQueryFrom, do: "ok" }, // ارسال پارامتر جستجو به سرور
        });

        const data = response.data;
        // console.log(data);
        setOptionsFrom(data); // ذخیره داده‌ها برای نمایش در لیست

        // if (data && data.length === 0) {
        //   setSelectedOptionFrom({ id: 0, name: searchQueryFrom });
        // } else {
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQueryFrom]); // اضافه کردن searchQueryFrom به وابستگی‌های useEffect
  const { formatMessage } = useIntl();
  return (
    <div
      className={`container rounded-5 popup ${
        Checkbox.amount ? "trnsformation" : "Ctrnsformation"
      } ${AddTransformationModal ? "show" : ""}`}
      style={{
        maxWidth: "70%",
        overflowX: "auto",
        overflowY: "auto",
        height: "80vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close p-2 m-1 mt-0 hover_btn"
          onClick={close}
          aria-label="Close"
        ></button>
      </div>
      <div className="p-1 rounded-5">
        <div className="row">
          <h1
            className="text-center rounded p-1 text-light"
            style={{ backgroundColor: "var(--bs-info)", width: "100%" ,fontSize:'1.8rem'}}
          >
            <FormattedMessage id="Edit" />{" "}
            <FormattedMessage id="Transformation" />
          </h1>

          <div
            className={`col-12 mt-2 ${
              Checkbox.amount ? "col-md-4" : "col-md-6"
            }`}
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          >
            <h3 style={{fontSize:'1rem'}}>
              <FormattedMessage id="From:" />
            </h3>
            <label className="fw-bold">
              <FormattedMessage id="Account Name" />
            </label>
            <ComboBoxT
              searchQuery={searchQueryFrom}
              setSearchQuery={setSearchQueryFrom}
              handleInputChange={handleInputChangeFrom}
              setSelectedOption={setSelectedOptionFrom}
              selectedOption={selectedOptionFrom}
              options={optionsFrom}
              Onsearch={handleFrom}
            />
            <label for="price" className="fw-bold mt-2">
              <FormattedMessage id="Amount" />
            </label>
            <NumericFormat
              // ref={inputRef}
              id="from_amount"
              // onKeyDown={handleKeyDown}
              thousandSeparator={true}
              // name="from_amount"
              className={`form-control ${
                Transformation.to_amount < 0 ? "text-success" : "text-danger"
              }`}
              value={formattedValue.from_amount}
              placeholder="0"
              onChange={handleChange}
              dir="ltr"
            />
            <label for="price" className="fw-bold mt-2">
              <FormattedMessage id="Remain Balance" />
            </label>
            <NumericFormat
              // ref={inputRef}
              // onKeyDown={handleKeyDown}
              readOnly={true}
              thousandSeparator={true}
              name="from_balance"
              className="form-control"
              value={
                parseInt(Transformation.from_balance) -
                parseInt(Transformation.from_amount)
              }
              placeholder="0"
              dir="ltr"
              // onChange={handleChange}
            />
            <label htmlFor="description" className="fw-bold mt-2">
              <FormattedMessage id="Description" />
            </label>
            <input
              //   onKeyDown={handleKeyDown}
              onChange={handleform}
              value={Transformation.from_description}
              type="text"
              name="from_description"
              // placeholder="Description"
              placeholder={formatMessage({ id: "Description" })}
              className="form-control fs-6 mb-3"
              style={{ width: "100%" }}
            />
            <div className="date-picker-container">
              <Datepicker_Customer
                default_value={EndDate}
                handle_date={handle_date}
                lebal={<FormattedMessage id="Date" />}
                setSelectedDay={setSelectedDay}
                selectedDay={selectedDay}
              ></Datepicker_Customer>
            </div>
          </div>
          <div
            className={`col-12 mt-2 ${
              Checkbox.amount ? "col-md-4" : "col-md-6"
            }`}
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          >
            <h3 style={{fontSize:'1rem'}}>
              <FormattedMessage id="To:" />
            </h3>
            <label className="fw-bold">
              <FormattedMessage id="Account Name" />
            </label>
            <ComboBoxT
              isEditable={!true}
              searchQuery={searchQueryTo}
              setSearchQuery={setSearchQueryTo}
              handleInputChange={handleInputChangeTo}
              // handleSearch={handleSearchTo}
              setSelectedOption={setSelectedOptionTo}
              selectedOption={selectedOptionTo}
              options={optionsTo}
              Onsearch={handleTo}
            />

            <label for="price" className="fw-bold mt-2">
              <FormattedMessage id="Amount" />
            </label>
            <div className="d-flex w-100" 
            >
              <div class="form-check form-switch ms-0 col-md-2 d-flex center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="amount"
                  name="amount"
                  checked={Checkbox.amount}
                  onChange={(e) =>
                    setCheckbox({ ...Checkbox, amount: e.target.checked })
                  }
                />
              </div>
              <div className="col-md-10">
                <NumericFormat
                  readOnly={!Checkbox.amount}
                  thousandSeparator={true}
                  id="to_amount"
                  // style={{ color: "red" }}
                  className={`form-control ${
                    Transformation.to_amount > 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                  value={formattedValue.to_amount}
                  placeholder="0"
                  onChange={handleChange}
                  dir="ltr"
                />
              </div>
            </div>
            <label for="price" className="fw-bold mt-2">
              <FormattedMessage id="Remain Balance" />
            </label>
            <NumericFormat
              // ref={inputRef}
              // onKeyDown={handleKeyDown}
              readOnly={true}
              thousandSeparator={true}
              name="to_balance"
              className="form-control"
              value={
                Transformation.to_balance !== 0
                  ? parseInt(Transformation.to_balance) +
                    parseInt(
                      Checkbox.amount
                        ? parseInt(Transformation.to_balance) +
                            parseInt(Transformation.to_amount)
                        : Transformation.from_amount
                    )
                  : null +
                    (Checkbox.amount
                      ? parseInt(
                          parseInt(Transformation.to_balance) +
                            parseInt(Transformation.to_amount)
                        )
                      : Transformation.from_amount)
              }
              placeholder="0"
              dir="ltr"
              // onChange={handleChange}
            />
            <label htmlFor="description" className="fw-bold mt-2">
              <FormattedMessage id="Description" />
            </label>
            <div className="d-flex w-100" style={{ marginBottom: "4.4rem" }}>
              <div class="form-check form-switch ms-0 col-md-2 d-flex center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="Tdescription"
                  name="Tdescription"
                  checked={Checkbox.Todescription}
                  onChange={(e) =>
                    setCheckbox({
                      ...Checkbox,
                      Todescription: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="col-md-10">
                <input
                  //   onKeyDown={handleKeyDown}
                  onChange={handleform}
                  value={Transformation.to_description}
                  readOnly={!Checkbox.Todescription}
                  type="text"
                  name="to_description"
                  // placeholder={`${<FormattedMessage id="Description"/>}`}
                  placeholder={formatMessage({ id: "Description" })}
                  className="form-control fs-6 mb-3"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
          {Checkbox.amount && (
            <div className="col-12 col-md-4 mt-2"
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
            >
              <h3 style={{fontSize:'1rem'}}>
                <FormattedMessage id="Comseion:" />
              </h3>
              <label className="fw-bold">
                <FormattedMessage id="Account Name" />{" "}
              </label>
              <ComboBoxT
                isEditable={!selectedOptionFrom ? true : false}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleInputChange={handleInputChange}
                // handleSearch={handleSearch}
                setSelectedOption={setSelectedOption}
                selectedOption={selectedOption}
                options={options}
                Onsearch={handle}
              />
              <label for="price" className="fw-bold mt-2">
                <FormattedMessage id="Amount" />
              </label>
              <NumericFormat
                // ref={inputRef}
                // onKeyDown={handleKeyDown}
                readOnly={true}
                thousandSeparator={true}
                name="com_amount"
                className={`form-control ${
                  Transformation.from_amount - Transformation.to_amount > 0
                    ? "text-success"
                    : "text-danger"
                }`}
                value={Transformation.from_amount - Transformation.to_amount}
                placeholder="0"
                dir="ltr"
                // onChange={handleChange}
                // readOnly={true}
              />
              <label for="price" className="fw-bold mt-2">
                <FormattedMessage id="Remain Balance" />
              </label>
              <NumericFormat
                // ref={inputRef}
                // onKeyDown={handleKeyDown}
                readOnly={true}
                thousandSeparator={true}
                name="com_balance"
                className="form-control"
                value={
                  parseInt(Transformation.com_balance) +
                  parseInt(Transformation.from_amount) -
                  parseInt(Transformation.to_amount)
                }
                dir="ltr"
                placeholder="0"
                // onChange={handleChange}
              />
              <label htmlFor="description" className="fw-bold mt-2">
                <FormattedMessage id="Description" />
              </label>
              <div className="d-flex w-100">
                <div class="form-check form-switch ms-0 col-md-2 d-flex center">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="Cdescription"
                    name="Cdescription"
                    value={Checkbox.Cdescription}
                    // readOnly={Checkbox.Cdescription}
                    checked={Checkbox.Cdescription}
                    onChange={(e) => {
                      setCheckbox({
                        ...Checkbox,
                        Cdescription: e.target.checked,
                      });
                    }}
                  />
                </div>
                <div className="col-md-10">
                  <input
                    //   onKeyDown={handleKeyDown}
                    onChange={handleform}
                    value={Transformation.com_description}
                    type="text"
                    name="com_description"
                    readOnly={!Checkbox.Cdescription}
                    // placeholder={`${<FormattedMessage id="Description"/>}`}
                    placeholder={formatMessage({ id: "Description" })}
                    className="form-control fs-6 mb-3"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="col-12 d-flex justify-content-center mt-2 mb-2">
            <button
              type="button"
              className="text-center btn btn-danger text-light me-2 ms-2"
              style={{ width: "100px" }}
              onClick={close}
            >
              <FormattedMessage id="Cancel" />
            </button>
            <button
              //   ref={buttonRef}
              type="button"
              className="text-center btn btn-success text-light ms-2"
              style={{ width: "100px" }}
              onClick={Submit}
            >
              <FormattedMessage id="Submit" />
            </button>
          </div>
          {tempRecordfrom && (
            <table className="table mt-1 mb-0" 
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
            >
              <thead>
                <tr>
                  <th scope="col">
                    {" "}
                    <FormattedMessage id="No" />{" "}
                  </th>
                  <th scope="col">
                    {" "}
                    <FormattedMessage id="Name" />
                  </th>
                  <th scope="col">
                    {" "}
                    <FormattedMessage id="Amount" />
                  </th>
                  <th scope="col">
                    {" "}
                    <FormattedMessage id="Whatsup" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>{tempRecordfrom.account_name}</td>
                  <td style={{ color: "red" }}>
                    {tempRecordfrom.from_amount + tempRecordfrom.moneyType}
                  </td>
                  <td>
                    <a onClick={() => handlleWhatsupfrom(tempRecordfrom)}>
                      <img
                        src={Whatsupimg}
                        alt="WhatsApp"
                        className="whatsapp-icon"
                        style={{ width: "3rem" }}
                      />
                    </a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>{tempRecordto.account_name}</td>
                  <td style={{ color: "green" }}>
                    {tempRecordto.to_amount + tempRecordto.moneyType}
                  </td>
                  <td>
                    <a onClick={() => handlleWhatsup(tempRecordto)}>
                      <img
                        src={Whatsupimg}
                        alt="WhatsApp"
                        className="whatsapp-icon"
                        style={{ width: "3rem" }}
                      />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
