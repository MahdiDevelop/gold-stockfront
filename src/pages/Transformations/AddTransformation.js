import React, { useEffect, useMemo, useRef, useState } from "react";
// import Source from "../Source";
import axios from "axios";
// import Swal from "sweetalert2";
// import { showAlert } from "../../warrper.js";
import ComboBoxT from "./ComboBoxT";
import ComboBoxTo from "./ComboBoxTo";
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
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};
export default function AddTransformation({
  AddTransformationModal,
  closeDialog,
  setOptionsFrom,
  optionsFrom,
  records,
  setRecords,
}) {

  const showAlert = useShowAlert();
  const dispatch = useDispatch();
  const [tempRecordfrom, settempRecordfrom] = useState(null);
  const [tempRecordto, settempRecordto] = useState(null);

  const [Checkbox, setCheckbox] = useState({
    amount: false,
    Todescription: false,
    Cdescription: false,
  });
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [Settings, Setsettings] = useState([]);
  // console.log(settings);
  useEffect(() => {
    if (statuss !== "succeeded" && settings.length > 0) {
      dispatch(getSettings());
    }
  }, []);

  useEffect(() => {
    if (settings.length > 0) {
      Setsettings(settings);
    }
  }, [settings]);

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
  const [formattedValue, setFormattedValue] = useState({
    from_amount: null,
    from_balance: null,
    to_amount: null,
    to_balance: null,
    com_amount: null,
    com_balance: null,
  });

  //
  const [Transformation, setTransformation] = useState({
    user_id: localStorage.getItem("userTokenid"),
    from_account_id: '',
    from_amount: 0,
    from_description: '',
    to_account_id: '',
    to_amount: 0,
    to_description: '',
    com_account_id: '',
    com_amount: 0,
    com_description: '',
    date_creation: new Date().toISOString(),
  });

  // from account
  const [searchQueryFrom, setSearchQueryFrom] = useState();
  const [selectedOptionFrom, setSelectedOptionFrom] = useState();

  // const [optionsFrom, setOptionsFrom] = useState();
  const [msgDescription,setmsgDescription]=useState(false);
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

  // const handleFrom = (e) => {
  //   if (e) {
  //     const filter = optionsFrom.filter(
  //       (record) => record.type_id === e.type_id
  //     );
  //     setOptionsTo(filter);
  //     setOptions(filter);
  //     setTransformation({
  //       ...Transformation,
  //       from_balance: e.belance,
  //     });
  //     setFormattedValue({
  //       ...formattedValue,
  //       from_balance: e.belance,
  //     });
  //   }
  // };
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
      // setOptionsFrom(response.data);
      const data = response.data;
      // console.log(data);
      // تبدیل داده‌ها به فرمت مناسب برای react-select
      let formattedOptions = data;

      if (formattedOptions && formattedOptions.length() === 0) {
        if (query) {
          // setAddItem({
          //   ...AddItem,
          //   temp_customer: query,
          // });
          setSelectedOptionFrom({ id: 0, name: query });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };

  const handleInputChangeFrom = (newValue) => {
    setSearchQueryFrom(newValue); // بروزرسانی مقدار ورودی جستجو
    // handleSearchFrom(newValue); // ارسال درخواست جستجو به سرور
  };
  // to account
  const [searchQueryTo, setSearchQueryTo] = useState();
  const [selectedOptionTo, setSelectedOptionTo] = useState();
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
  // console.log(searchQuery);
  const [selectedOption, setSelectedOption] = useState();
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
      // console.log(query);
      const data = response.data;
      // console.log(response);
      // تبدیل داده‌ها به فرمت مناسب برای react-select
      let formattedOptions = data;
      setOptions(formattedOptions);

      // if (formattedOptions && formattedOptions.length() === 0) {
      //   if (query) {
      //     // setAddItem({
      //     //   ...AddItem,
      //     //   temp_customer: query,
      //     // });
      //     setSelectedOption({ id: 0, name: query });
      //   }
      // }
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
    // console.log(tempRecord);
    if (tempRecord.whatsup === 1) {
      let tomessege = "not avilable";
      if (localStorage.getItem("language") === "en") {
        tomessege = `Dear ${
          tempRecord.account_name
        },\n💼 Your recent transaction has been successfully recorded in the system.\nType: ${"Deposit"} 💰${
          parseInt(tempRecord.serial) > 0
            ? "\nSerial: " + (parseInt(tempRecord.serial) + 1) + "🔖"
            : ""
        }\nAmount: ${
          formatNumber(tempRecord.to_amount) + " " + tempRecord.moneyType +' 🟢'
        } 💵\nCurrent Balance: ${
          formatNumber(parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount))+ ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')
        } 📊\nDescription: ${msgDescription ? tempRecord.to_description||"" :   tempRecord.from_description || ""} ✍\nDate: ${date(
          tempRecord.date_creation
        )} 📅\nThank you for choosing our services!`;
      } else if (localStorage.getItem("language") === "pa") {
        tomessege = `ګرانو ${
          tempRecord.account_name
        },\n💼 ستاسو وروستي معامله په برياليتوب سره په سیستم کي ثبت سوه.\nډول: ${"واریز"} 💰${
          parseInt(tempRecord.serial) > 0
            ? "\nسریال نمبر: " + (parseInt(tempRecord.serial) + 1) + "🔖"
            : ""
        }\nمقدار: ${
          formatNumber(tempRecord.to_amount) + " " + tempRecord.moneyType+((tempRecord.from_amount >=0) ?" 🟢" :' 🔴')
        } 💵\nاوسني بیلانس: ${
          formatNumber(parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount)) + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')
        } 📊\nتفصیل: ${msgDescription ? (tempRecord.to_description||"") :  ( tempRecord.from_description || "")} ✍\nنېټه: ${date(
          tempRecord.date_creation
        )} 📅\nزموږ د خدمتونو د انتخاب له امله مننه!`;
      } else {
        tomessege = `سلام ${
          tempRecord.account_name
        } عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${"واریز"} 💰 ${
          parseInt(tempRecord.serial) !== 0 ?
          ("\nسریال نمبر: " + (parseInt(tempRecord.serial) + 1) + "🔖") : ""
        }\nمقدار: ${
          formatNumber(tempRecord.to_amount) + " " + tempRecord.moneyType+((tempRecord.from_amount >=0) ?" 🟢" :' 🔴')
        } 💵\nبیلانس فعلی: ${
          formatNumber(parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount)) + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')
        } 📊\nشرح: ${msgDescription ? tempRecord.to_description||"" :   tempRecord.from_description || ""} ✍\nتاریخ: ${date(
          tempRecord.date_creation
        )} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
      }
      // console.log(tempRecord);
      WhatsAppButton({
        phoneNumber: tempRecord.whatsup_number || "",
        message: tomessege,
      });
    }
  };
  // console.log(tempRecordfrom);
  const handlleWhatsupfrom = (tempRecord) => {
    // console.log(tempRecord);
    if (tempRecord.whatsup === 1) {
      let tomessege = "";
      if (localStorage.getItem("language") === "da") {
        tomessege = `سلام ${
          tempRecord.account_name
        } عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${"برداشت"} 💰${
          parseInt(tempRecord.serial) > 0
            ? "\nسریال نمبر: " + (parseInt(tempRecord.serial) + 1) + "🔖"
            : ""
        }\nمقدار: ${
          formatNumber(tempRecord.to_amount) + " " + tempRecord.moneyType+' 🔴'
        } 💵\nبیلانس فعلی: ${
          formatNumber(parseInt(tempRecord.belance) - parseInt(tempRecord.to_amount)) + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')
          // tempRecord.belance - parseInt(tempRecord.to_amount) + (tempRecord.belance - parseInt(tempRecord.from_amount) >=0) ?"🟢" :'🔴'
          // parseInt(tempRecord.belance) 
        } 📊\nشرح: ${tempRecord.to_description || ""} ✍\nتاریخ: ${date(
          tempRecord.date_creation
        )} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
      } else if (localStorage.getItem("language") === "en") {
        tomessege = `Dear ${tempRecord.account_name},
        💼 Your recent transaction has been successfully recorded in the system.
        Type: ${"Deposit"} 💰${
          parseInt(tempRecord.serial) > 0
            ? "\nSerial: " + (parseInt(tempRecord.serialTo) + 1) + "🔖"
            : ""
        }
        Amount: ${formatNumber(tempRecord.to_amount) + " " + tempRecord.moneyType+' 🔴'} 💵
        Current Balance: ${
          formatNumber(parseInt(tempRecord.belance) - parseInt(tempRecord.to_amount)) + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')
                } 📊
        Description: ${tempRecord.to_description || ""} ✍
        Date: ${date(tempRecord.date_creation)} 📅
        Thank you for choosing our services!`;
      } else {
        tomessege = `ګرانو ${tempRecord.account_name},
💼 ستاسو وروستي معامله په بریالیتوب سره په سیستم کي ثبت سوه.
ډول: ${"واریز"} 💰
${
  parseInt(tempRecord.serial) > 0
    ? "\nسریال نمبر: " + (parseInt(tempRecord.serial) + 1) + "🔖"
    : ""
}
مقدار: ${formatNumber(tempRecord.to_amount) + " " + tempRecord.moneyType+' 🔴'} 💵
اوسني بیلانس: ${
          // parseInt(tempRecord.belance) + parseInt(tempRecord.from_amount)+ (parseInt(tempRecord.belance) - parseInt(tempRecord.from_amount) >=0) ?"🟢" :'🔴'
          formatNumber(parseInt(tempRecord.belance) - parseInt(tempRecord.to_amount)) + ((parseInt(tempRecord.belance) + parseInt(tempRecord.to_amount) >=0) ?"🟢" :'🔴')
        } 📊
          تفصیل: ${tempRecord.to_description || ""} ✍
          نېټه: ${date(tempRecord.date_creation)} 📅
          زموږ د خدمتونو د انتخاب له امله مننه!`;
      }
      WhatsAppButton({
        phoneNumber: tempRecord.whatsup_number || "",
        message: tomessege,
      });
    }
  };
  // console.log(localStorage.getItem("date"));
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
    if (!selectedOptionFrom || !selectedOptionTo ) {
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
    let fromselection=selectedOptionFrom;
    setSelectedOptionFrom(null);
    setmsgDescription(Checkbox.Todescription);
    // console.log(Transformation);
    axios
      .post(Source.getAddress() + "/api/transformations", Transformation, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: { complete: Checkbox.amount ? "ok" : "no",checkto:Checkbox.Todescription ? 'ok':'no',checkco:Checkbox.Cdescription ? 'ok':'no' },
      })
      .then((res) => {
        let data = res.data;
        let add = res.data.bill;
        let d = date(selectedDay);
        let language = localStorage.getItem("language");
        let message = "";
        if (language === "en") {
          message = `Hello ${
            fromselection.account_name
          },\n💼 Your recent transaction has been successfully recorded in the system.\nType: ${
             "Withdraw" 
          } 
    💰${
          parseInt(selectedOptionTo.serial) > 0
            ? "\nSerial: " + (parseInt(selectedOptionTo.serial) + 1) + "🔖"
            : ""
        }\nAmount: ${
      formatNumber(Transformation.from_amount) + " " + fromselection.moneyType +  ' 🔴'
    } 💵
    \nCurrent Balance: ${
      formatNumber(fromselection.belance - Transformation.from_amount) + ((fromselection.belance - Transformation.from_amount >=0) ?"🟢" :'🔴')
    } 📊\nDescription: ${
            Transformation.from_description || ""
          } ✍\nDate: ${d} 📅\nThank you for choosing our services!`;
        } else if (language === "pa") {
          message = `سلام ${
            fromselection.account_name
          } ګران،\n💼 ستاسو وروستۍ معامله په بریالیتوب سره سیسټم کې ثبت شوې ده.\nډول: ${
             "ایستل" 
          } 

    💰${
      parseInt(selectedOptionTo.serial) > 0
        ? "\nسریال نمبر: " + (parseInt(selectedOptionTo.serial) + 1) + "🔖"
        : ""
    }\nمقدار: ${
      formatNumber(Transformation.from_amount) + " " + fromselection.moneyType +' 🔴'
    } 💵\nاوسنی بیلانس: ${
      formatNumber(fromselection.belance - Transformation.from_amount) +((fromselection.belance - Transformation.from_amount >=0) ?"🟢" :'🔴')
          } 📊\nتفصیل: ${
            Transformation.from_description || ""
          } ✍\nنیټه: ${d} 📅\nله موږ څخه د خدماتو اخیستلو لپاره مننه!`;
        } else if (language === "da") {
          message = `سلام ${
            fromselection.account_name
          } عزیز،\n💼 معامله اخیر شما با موفقیت در سیستم ثبت شده است.\nنوع: ${
               "برداشت" 
          }
  💰     ${
            parseInt(selectedOptionTo.serial) > 0
              ? "\nسریال نمبر: " + (parseInt(selectedOptionTo.serial) + 1) + "🔖"
              : ""
          }\nمقدار: ${
            formatNumber(Transformation.from_amount) + " " + fromselection.moneyType +' 🔴'
          } 💵\nبیلانس فعلی: ${
            formatNumber(fromselection.belance - Transformation.from_amount) + ((fromselection.belance - Transformation.from_amount >=0) ?"🟢" :'🔴')
          } 📊\nشرح: ${
            Transformation.from_description || ""
          } ✍\nتاریخ: ${d} 📅\nاز انتخاب خدمات ما سپاسگزاریم!`;
        } else {
          message = "Language not supported!";
        } // console.log(from);
        if (fromselection.whatsup === 1) {
          // console.log('hi')
          WhatsAppButton({
            phoneNumber: fromselection.whatsup_number || "",
            message: message,
          });
        }
        else if(selectedOptionTo.whatsup===1){
          let data= { ...selectedOptionTo,...description, msgdate: d, ...Transformation };
          handlleWhatsup(data);
        }
        // console.log(selectedOptionTo);
        let messageTo = {
          serialTo : selectedOptionTo.serial
        };
        let description={
          from_description: Transformation.from_description,
        }

        settempRecordfrom({ ...fromselection,...messageTo, ...Transformation });
        settempRecordto({ ...selectedOptionTo,...description, msgdate: d, ...Transformation });
        // if(selectedOptionTo.whatsup==='1'){
        // showAlert({
        //   title: "آیا پیام دوم برای گیرنده ارسال شود؟",
        //   icon: "question",
        //   showCancelButton: true,
        //   confirmButtonText: "بلی",
        //   cancelButtonText: "خیر",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //   }
        // });
        if (Checkbox.amount) {
          let belancefrom={from:{belance:fromselection.belance}}
          let belanceto={to:{belance:selectedOptionTo.belance}}
          let belancecom={com:{belance:selectedOption.belance}}
          let from = { customer: fromselection.account_name };
          let to = { customer: selectedOptionTo.account_name };
          let com = { customer: selectedOption.account_name };
          add.from = { ...add.from, ...from, ...fromselection };
          add.to = { ...add.to, ...selectedOptionTo, ...to };
          add.com = { ...add.com, ...selectedOption, ...com };
          add.belance={...belancecom,...belancefrom,...belanceto};
          setRecords([add, ...records]);
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
          let belancefrom={from:{belance:fromselection.belance}}
          let belanceto={to:{belance:selectedOptionTo.belance}}
          let from = { customer: fromselection.account_name };
          let to = { customer: selectedOptionTo.account_name };
          add.from = { ...add.from, ...from, ...fromselection };
          add.to = { ...add.to, ...selectedOptionTo, ...to };
          add.belance={...belancefrom,...belanceto};
          setRecords([add, ...records]);
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
        }
        setSelectedOption(null);
        setSelectedOptionFrom(null);
        setSelectedOptionTo(null);

        showAlert({
          position: "top-end",
          icon: "success",
          title: "Transformation has been created!",
          showConfirmButton: false,
          timer: 1000,
        });

        setTransformation({
          user_id: localStorage.getItem("userTokenid"),
          from_account_id: '',
          from_amount: '',
          from_description: '',
          to_account_id: '',
          to_amount: '',
          to_description: '',
          com_account_id: '',
          com_amount: '',
          com_description: '',
          date_creation: new Date().toISOString(),
        });

        setFormattedValue({
          from_amount: '',
          from_balance: '',
          to_amount: '',
          to_balance: '',
          com_amount: '',
          com_balance: '',
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
        // console.log(e);
        showAlert({
          position: "top-end",
          icon: "error",
          title: "Something went wrong!",
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };
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
  // console.log(selectedOption);
  const { formatMessage } = useIntl();
  const close=()=>{
    settempRecordfrom('');
    settempRecordto('');
    closeDialog();
    setSelectedOption(null);
    setSelectedOptionFrom(null);
    setSelectedOptionTo(null);
    setTransformation({
      user_id: localStorage.getItem("userTokenid"),
      from_account_id: null,
      from_amount: null,
      from_description: null,
      to_account_id: null,
      to_amount: null,
      to_description: null,
      com_account_id: null,
      com_amount: null,
      com_description: null,
      date_creation: new Date().toISOString(),
    });

    setFormattedValue({
      from_amount: null,
      from_balance: null,
      to_amount: null,
      to_balance: null,
      com_amount: null,
      com_balance: null,
    });
    setCheckbox({
      amount: false,
      Todescription: false,
      Cdescription: false,
    });
    setSelectedOption(null);
    setSelectedOptionFrom(null);
    setSelectedOptionTo(null);
    setmsgDescription(false);
  }
  return (
    <div
    className={`container rounded-5 popup ${
      Checkbox.amount ? "trnsformation" : "Ctrnsformation"
    } ${AddTransformationModal ? "show" : ""}`}
    style={{
      // maxWidth: "70%",
      overflowX: "auto",
      overflowY: "auto",
      height: "80vh",
      backgroundColor: "#f8f9fa",
      padding: "15px",
      fontSize: "0.9rem"
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
          className="text-center rounded p-3 text-light"
          style={{ 
            backgroundColor: "var(--bs-info)", 
            width: "100%",
            fontSize: "1.5rem"
          }}
        >
          <FormattedMessage id="Add" />{" "}
          <FormattedMessage id="Transformation" />
        </h1>
  
        <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          className={`col-12 mt-1 ${
            Checkbox.amount ? "col-md-4" : "col-md-6"
          }`}
        >
          <h3 style={{ fontSize: "1.1rem" }}>
            <FormattedMessage id="From:" />
          </h3>
          <label className="fw-bold" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Account Name" />
          </label>
          <ComboBoxTo
            searchQuery={searchQueryFrom}
            setSearchQuery={setSearchQueryFrom}
            handleInputChange={handleInputChangeFrom}
            setSelectedOption={setSelectedOptionFrom}
            selectedOption={selectedOptionFrom}
            options={optionsFrom}
            Onsearch={setSelectedOption}
            // style={{ fontSize: "0.9rem" }}
          />
          <label htmlFor="price" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Amount" />
          </label>
          <NumericFormat
            id="from_amount"
            thousandSeparator={true}
            className={`form-control ${
              Transformation.to_amount < 0 ? "text-success" : "text-danger"
            }`}
            value={formattedValue.from_amount}
            placeholder="0"
            onChange={handleChange}
            dir="ltr"
            // style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
          />
          <label htmlFor="price" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Remain Balance" />
          </label>
          <NumericFormat
            readOnly={true}
            thousandSeparator={true}
            name="from_balance"
            className="form-control"
            value={
              parseInt(selectedOptionFrom?.belance) -
              parseInt(Transformation.from_amount)
            }
            placeholder="0"
            dir="ltr"
            // style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
          />
          <label htmlFor="description" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Description" />
          </label>
          <input
            onChange={handleform}
            value={Transformation.from_description}
            type="text"
            name="from_description"
            placeholder={formatMessage({ id: "Description" })}
            className="form-control mb-2 "
            style={{ 
              width: "100%",
              // fontSize: "0.85rem",
              // padding: "0.3rem 0.5rem"
            }}
          />
          <div className="date-picker-container">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date}
              lebal={<FormattedMessage id="Date" />}
              setSelectedDay={setSelectedDay}
              selectedDay={selectedDay}
              // style={{ fontSize: "0.85rem" }}
            ></Datepicker_Customer>
          </div>
        </div>
        <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          className={`col-12 mt-1 ${
            Checkbox.amount ? "col-md-4" : "col-md-6"
          }`}
        >
          <h3 style={{ fontSize: "1.1rem" }}>
            <FormattedMessage id="To:" />
          </h3>
          <label className="fw-bold" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Account Name" />
          </label>
          <ComboBoxT
            isEditable={!selectedOptionFrom ? true : false}
            searchQuery={searchQueryTo}
            setSearchQuery={setSearchQueryTo}
            handleInputChange={handleInputChangeTo}
            setSelectedOption={setSelectedOptionTo}
            selectedOption={selectedOptionTo}
            options={optionsTo}
            Onsearch={handleTo}
            // style={{ fontSize: "0.9rem" }}
          />
          <label htmlFor="price" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Amount" />
          </label>
          <div className="d-flex w-100">
            <div className="form-check form-switch ms-0 col-md-2 d-flex center">
              <input
                className="form-check-input"
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
                className={`form-control ${
                  Transformation.to_amount > 0
                    ? "text-success"
                    : "text-danger"
                }`}
                value={formattedValue.to_amount}
                placeholder="0"
                onChange={handleChange}
                dir="ltr"
                // style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
              />
            </div>
          </div>
          <label htmlFor="price" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Remain Balance" />
          </label>
          <NumericFormat
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
                : 0 +
                  (Checkbox.amount
                    ? parseInt(
                        parseInt(Transformation.to_balance) +
                          parseInt(Transformation.to_amount)
                      )
                    : Transformation.from_amount)
            }
            placeholder="0"
            dir="ltr"
            // style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
          />
          <label htmlFor="description" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
            <FormattedMessage id="Description" />
          </label>
          <div className="d-flex w-100" style={{ marginBottom: "3rem" }}>
            <div className="form-check form-switch ms-0 col-md-2 d-flex center">
              <input
                className="form-check-input"
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
                onChange={handleform}
                value={Transformation.to_description}
                readOnly={!Checkbox.Todescription}
                type="text"
                name="to_description"
                placeholder={formatMessage({ id: "Description" })}
                className="form-control mb-2"
                style={{ 
                  width: "100%",
                  // fontSize: "0.85rem",
                  // padding: "0.3rem 0.5rem"
                }}
              />
            </div>
          </div>
        </div>
        {Checkbox.amount && (
          <div
            className="col-12 col-md-4 mt-1"
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          >
            <h3 style={{ fontSize: "1.1rem" }}>
              <FormattedMessage id="Comseion:" />
            </h3>
            <label className="fw-bold" style={{ fontSize: "0.9rem" }}>
              <FormattedMessage id="Account Name" />
            </label>
            <ComboBoxT
              isEditable={!selectedOptionFrom ? true : false}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleInputChange={handleInputChange}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              options={options}
              Onsearch={handle}
              // style={{ fontSize: "0.9rem" }}
            />
            <label htmlFor="price" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
              <FormattedMessage id="Amount" />
            </label>
            <NumericFormat
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
              // style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
            />
            <label htmlFor="price" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
              <FormattedMessage id="Remain Balance" />
            </label>
            <NumericFormat
              readOnly={true}
              thousandSeparator={true}
              name="com_balance"
              className="form-control"
              value={
                parseInt(selectedOption?.belance) +
                parseInt(Transformation.from_amount) -
                parseInt(Transformation.to_amount)
              }
              placeholder="0"
              dir="ltr"
              // style={{ fontSize: "0.85rem"}}
            />
            <label htmlFor="description" className="fw-bold mt-2" style={{ fontSize: "0.9rem" }}>
              <FormattedMessage id="Description" />
            </label>
            <div className="d-flex w-100">
              <div className="form-check form-switch ms-0 col-md-2 d-flex center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Cdescription"
                  name="Cdescription"
                  value={Checkbox.Cdescription}
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
                  onChange={handleform}
                  value={Transformation.com_description}
                  type="text"
                  name="com_description"
                  readOnly={!Checkbox.Cdescription}
                  placeholder={formatMessage({ id: "Description" })}
                  className="form-control mb-2"
                  style={{ 
                    width: "100%",
                    // fontSize: "0.85rem",
                    // padding: "0.3rem 0.5rem"
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="col-12 d-flex justify-content-center mt-3 mb-3">
          <button
            type="button"
            className="text-center btn btn-danger text-light me-2 ms-2"
            style={{ 
              width: "120px",
            }}
            onClick={close}
          >
            <FormattedMessage id="Cancel" />
          </button>
          <button
            type="button"
            className="text-center btn btn-success text-light ms-2"
            style={{ 
              width: "120px",
            }}
            onClick={Submit}
          >
            <FormattedMessage id="Submit" />
          </button>
        </div>
  
        {tempRecordfrom && (
          <table
            className="table mt-1 mb-0 small"
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          >
            <thead>
              <tr>
                <th scope="col">
                  <FormattedMessage id="No" />
                </th>
                <th scope="col">
                  <FormattedMessage id="Name" />
                </th>
                <th scope="col">
                  <FormattedMessage id="Amount" />
                </th>
                <th scope="col">
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
                      // className="whatsapp-icon"
                      // style={{ width: "2rem!important" ,maxWidth:'2rem!important' }}
                      style={{ width: "2.5rem" }}

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
                      style={{ width: "2.5rem" }}
                    />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
    {/* <style jsx>{`
    @media (max-width: 768px) {
      .container {
        max-width: 100% !important;
        overflow-x: auto;
      }
    }
    
    .form-control, 
    .table,
    .table th,
    .table td,
    .NumericFormat,
    input,
    .btn {
      font-size: 0.85rem !important;
    }
    
    .form-control {
      padding: 0.3rem 0.5rem !important;
      height: auto !important;
    }
    
    .table {
      font-size: 0.8rem !important;
    }
    
    .btn {
      padding: 0.25rem 0.5rem !important;
    }
    
    label {
      font-size: 0.9rem !important;
    }
  `}</style> */}
  </div>
  );
}
