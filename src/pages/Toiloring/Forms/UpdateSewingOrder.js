import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useShowAlert  } from "../../../warrper";
import Combo_stock from "./Combo";
import Combo_Customer from "../../forms/Combo_Customer";
import jalaali from "jalaali-js";
import Datepicker_Customer from "../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import { FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { NumericFormat} from "react-number-format";
import Swal from "sweetalert2";
import { ChevronDown, Plus, Trash2 } from 'lucide-react'; // Import آیکون‌های lucide
import {
//   Box,
  Button,
//   Grid,
//   InputAdornment,
TableContainer,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import {
  Box,
  Grid,
//   TextField,
  Divider,
//   Paper,
  InputAdornment
} from '@mui/material';
import {
  Shirt,
  DollarSign,
  CalendarDays,
  FileText,
  User,
  Scissors,
  Ruler
} from 'lucide-react';
import Source from '../../../Source';

import { FormattedMessage,useIntl } from "react-intl";
import { motion, AnimatePresence } from 'framer-motion';
import Additem from "../../Items/forms/AddItem";
import { addTailorToCache } from "../../Redux/tailorSlice";
import { useDispatch } from "react-redux";


const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};

const UpdateSewingOrder = ({show=true,close={close},moneys,setmoneys,options1,optionT,setOptionT,setOption1,addItem,records,setRecords,
   setAddItem,form, setForm,shoppingCart, setShoppingCart,selectedOption, setSelectedOption,selectedOptionT, setSelectedOptionT,  searchQueryD, setSearchQueryD,selectedOptionD, setSelectedOptionD,DesignTailor, setDesignTailor,c_ok=false,s_ok=false
   }) => {
  const [searchQueryT, setSearchQueryT] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const dispatch = useDispatch();
  const handleSearchD = async (query) => {
    if (query) {
    // console.log(query);
            setForm({
              ...form,
              d_name: query,
              d_id:0
            });
            setSelectedOptionD({ id: 0, name: query });
          }
  };
   const handleInputChangeD = (newValue) => {
    // setExestQty(newValue && newValue.qty);
    setSearchQueryD(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearchD(newValue); // ارسال درخواست جستجو به سرور
  };
  const [selectedOption1, setSelectedOption1] = useState();
  const [StartDate, setStartDate] = useState(moment());
      const [EndDate, setEndDate] = useState("");
      const [EndDateE, setEndDateE] = useState(null);
        const handleChangeinput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
    const handleSearchT = async (query) => {
    if (query) {
    // console.log(query);
            setForm({
              ...form,
              tailor_name: query,
              tailor_id:0
            });
            setSelectedOptionT({ id: 0, name: query });
          }
  };
   const handleSearch1 = async (query) => {
  };
    const algorithmT = (e) => {
    setSelectedOptionT(e);
    if (e) {
      setForm({
        ...form,
        tailor_id: e.id,
        tailor_name: e.name,
      });
    }
  };
   const algorithm1 = (e) => {
    setSelectedOption1(e);
    if (e) {
      setAddItem({
        ...addItem,
        item_id: e.id,
        name: e.name,
      });
    }
  };
      const handleInputChange1 = (newValue) => {
    setSearchQuery1(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearch1(newValue); // ارسال درخواست جستجو به سرور
  };
    const handleInputChangeT = (newValue) => {
    setSearchQueryT(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearchT(newValue); // ارسال درخواست جستجو به سرور
  };
      const handle_date_start = (jalaliDate) => {
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
        setForm({
            ...form,
            s_date: isoString,
        });
        }
      };
        const [Date_End, setDate_end] = useState();
        const [Date_Start, setDate_start] = useState();
      
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
            setForm({
                ...form,
                e_date: isoString,
            });
          }
        };
    const [options, setOptions] = useState([]);
    const showAlert = useShowAlert(); 
      const [selectedOptionmoney, setSelectedOptionmoney] = useState({ name: "" });
          const algorithmmoney = (e) => {
    if (e) {
      setForm({
        ...form,
        money: e.id,
      });
    }
  };

      const handleSearch = async (query) => {
    
          if (query) {
            setForm({
              ...form,
              c_name: query,
              c_id:0
            });
            setSelectedOption({ id: 0, name: query });
          }
  };
const handleInputChange = (newValue) => {
    setSearchQuery(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearch(newValue); // ارسال درخواست جستجو به سرور
  };
  const SubmitEvent = (e) => {
    e.preventDefault();
    let customer=selectedOption;
    let tailor=selectedOptionT;
    let item_t=selectedOption1;
      form.arr=shoppingCart;
      form.money_id=1;
      form.total_f_p=totalAmount;
      form.user_id=localStorage.getItem("userTokenid");
      form._method="PUT";
      axios
        .post(Source.getAddress() + "/api/fabricsbill/"+form.id, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          let add=form;
          add.sells=shoppingCart;
          add.tailor=selectedOptionT;
          add.account=selectedOption;
          add.user={name:localStorage.getItem("userToken")};
             setRecords(prevRecords =>
              prevRecords.map(record =>
                record.id === form.id? { ...record, ...form} : record
              ));
          
                        if(selectedOptionT?.id===0 || !selectedOptionT){
                          dispatch(addTailorToCache(res.data.tailor));
                          setOptionT([...optionT,res.data.tailor]);
                        }else if(selectedOptionT?.id!==0){
                          setOptionT([...optionT,selectedOptionT]);
                          dispatch(addTailorToCache(selectedOptionT));
                        }
                        if(selectedOptionD?.id===0||!selectedOptionD){
                          add.design=res.data.design;
                          setDesignTailor([...DesignTailor,add.design]);
                        }else if(selectedOptionD?.id===0){
                          add.design=selectedOptionD;
                          setDesignTailor([...DesignTailor,selectedOptionD]);
                        }

          showAlert({
            position: "top-end",
            icon: "success",
            title: <FormattedMessage id="Your record has been updated!" />,
            showConfirmButton: false,
            timer: 1000,
          });
          const pendingMessages = {
  da: {
    title: "📌 پیام از خیاطی",
    greeting: `سلام ${selectedOption.name} عزیز! 👋`,
    total: `💎 مبلغ کل: ${form.t_amount} افغانی`,
    paid: `✅ پرداخت شده: ${form.p_amount} افغانی`,
    remaining: `⏳ باقی‌مانده: ${form.d_amount} افغانی`,
    dates: `📅 تاریخ شروع: ${form.s_date || '-'}\n📅 تاریخ تحویل: ${form.e_date || '-'}`,
    status: "⏳ سفارش شما در انتظار پردازش است. به زودی فرآیند دوخت آغاز خواهد شد.",
    thanks: "🙏 سپاس از اعتماد شما!"
  },
  pa: {
    title: "📌 د خیاطی څخه پیام",
    greeting: `سلام ${selectedOption.name} عزیز! 👋`,
    total: `💎 ټوله پیسې: ${form.t_amount} افغانی`,
    paid: `✅ تادیه شوی: ${form.p_amount} افغانی`,
    remaining: `⏳ پاتې پیسې: ${form.d_amount} افغانی`,
    dates: `📅 د شروع نیټه: ${form.s_date || '-'}\n📅 د تحویل نیټه: ${form.e_date || '-'}`,
    status: "⏳ ستاسو امر په تمه کې دی. به زودی به د تیارۍ پروسه پیل شي.",
    thanks: "🙏 ستاسو د اعتماد مننه!"
  },
  en: {
    title: "📌 Message from Tailor",
    greeting: `Hello ${selectedOption.name}! 👋`,
    total: `💎 Total amount: ${form.t_amount} AFN`,
    paid: `✅ Paid: ${form.p_amount} AFN`,
    remaining: `⏳ Remaining: ${form.d_amount} AFN`,
    dates: `📅 Start date: ${form.s_date || '-'}\n📅 Delivery date: ${form.e_date || '-'}`,
    status: "⏳ Your order is pending processing. The stitching process will begin soon.",
    thanks: "🙏 Thank you for your trust!"
  }
};

// نحوه استفاده:
const lang = localStorage.getItem("language") || "en";
const { title, greeting, total, paid, remaining, dates, status, thanks } = pendingMessages[lang];
const fullMessage = `${title}\n\n${greeting}\n\n${total}\n${paid}\n${remaining}\n\n${dates}\n${status}\n${thanks}`;

WhatsAppButton({
  phoneNumber: selectedOption.whatsup_number || "",
  message: fullMessage,
});
        })
        .catch((err) => {
          console.log(err);
          showAlert({
            position: "top-end",
            icon: "error",
            title:  <FormattedMessage id="You must enter the customer name!" />,
            showConfirmButton: false,
            timer: 1000,
          });
        });
  }
 const AddAccountModal = (name) => {
    let add = { name: name,
      user_id:localStorage.getItem('userTokenid')
     };
    axios
      .post(Source.getAddress() + "/api/customers", add, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        setSelectedOption(res.data.customer);
        setOptions([res.data.customer,...options]);
        showAlert({
          position: "top-end",
          icon: "success",
          title: "Customer has been created!",
          showConfirmButton: false,
          timer: 1000,
        });
        
        // dispatch(addCustomerToCache(res.data.customer))
        
      })
      .catch((err) => {
        // console.log(err);
        showAlert({
          position: "top-end",
          icon: "error",
          title: "Sosmething went wrong!",
          showConfirmButton: false,
          timer: 1000,
        });
      });
      // dispatch(getCustomers());
  };
  const [searchQuery, setSearchQuery] = useState("");

const handleCheckboxChange = (event) => {
  const { name, checked } = event.target;
  setForm((prev) => ({
    ...prev,
    [name]: checked ? 1 : 0,
  }));
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Source.getAddress()}/api/customers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: { query:searchQuery ,do:'ok'}, // ارسال پارامتر جستجو به سرور
        });
        // setSelectedOption(response.data);
        const data = response.data;
        setOptions(data);
  
        // if (data && data.length === 0) {
        //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
        // } else {
        //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if(searchQuery){
      if (!searchQuery || searchQuery?.length < 3) {
        setOptions([]);
        return;
      }else{
    // if (Exesting) {
        fetchData();}
    //   }
    }
  }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect
  const formatPhone = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const algorithm = (e) => {
    setSelectedOption(e);
    if (e) {
      setForm({
        ...form,
        c_id: e.id,
      });
    }
  };
    const intl = useIntl();
  // const [shoppingCart, setShoppingCart] = useState([]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setAddItem((prev) => ({ ...prev, [name]: value }));
  };

  const addToTable = () => {
  if (!selectedOption1) {
    showAlert({
      position: "top-end",
      icon: "error",
      title: <FormattedMessage id="Please select an item and fill the quantity and price!" />,
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  // const itemInOptions = options1.find(item => item.id === addItem.id);
  const remainingQty = parseFloat(selectedOption1|| 0) - parseFloat(addItem.qty);
  if (remainingQty < 0) {
    showAlert({
      position: "top-end",
      icon: "warning",
      title: <FormattedMessage id="Insufficient quantity in stock!" />,
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  const existingIndex = shoppingCart.findIndex((item) => item.item_id === addItem.id);
  if (existingIndex !== -1) {
    const updatedCart = [...shoppingCart];
    // updatedCart[existingIndex].purchase_price=
      // updatedCart[existingIndex].purchase_price =
      //   parseFloat(updatedCart[existingIndex].purchase_price) + parseFloat(addItem.purchase_price);
    updatedCart[existingIndex].total_price+=parseFloat(addItem.qty)*parseFloat(updatedCart[existingIndex].purchase_price);
    updatedCart[existingIndex].qty =
      parseFloat(updatedCart[existingIndex].qty) + parseFloat(addItem.qty);
    setShoppingCart(updatedCart);
  } else {
  //   const totalprice=parseFloat(itemInOptions.purchase_price||0)*(parseFloat(addItem.qty)/100);
  // addItem.total_price=totalprice;
    addItem.total_price=parseFloat(addItem.qty)*parseFloat(addItem.purchase_price);
    setShoppingCart(prev => [...prev, addItem]);
  }

  setOption1(
    options1.map((item) =>
      item.id === addItem.id
        ? {
            ...item,
            qty: Math.max(0, parseFloat(item.qty) - parseFloat(addItem.qty)),
          }
        : item
    )
  );
  // به‌روزرسانی موجودی options1 (qty)

  setSelectedOption1(null);
  setAddItem({ id: '', name: '', qty:'', purchase_price: '', description: '' });
};


  const deleteItem = (row) => {
    setShoppingCart((prev) => prev.filter((item) => item.id !== row.id));
  };
  const [totalAmount, setTotalAmount] = useState(0);
// محاسبه totalAmount
useEffect(() => {
  const t_fee = parseFloat(form.t_fee) || 0;
  const shoppingCartTotal = (shoppingCart || []).reduce((sum, item) => {
    const itemPrice = parseFloat(item.qty)*parseFloat(item.purchase_price)|| 0;
    return sum + itemPrice;
  }, 0);
  const calculatedTotal = (t_fee * parseInt(form.amount_cloths)) + shoppingCartTotal;
  setTotalAmount(calculatedTotal);
  setForm(prev => ({
    ...prev,
    t_amount: calculatedTotal,
    d_amount: calculatedTotal - (parseFloat(prev.p_amount) || 0)
  }));
}, [form.t_fee, form.t_amount, form.p_amount,form.amount_cloths,shoppingCart.length]);
   const currentLanguage = localStorage.getItem("language") || 'en';
const handleChangeSize = (e) => {
  const { name, value } = e.target;
  // فقط اجازه دو رقم اعشار را بده
  if (!/^(\d+(\.\d{0,2})?)?$/.test(value)) return;
  setForm((prev) => ({ ...prev, [name]: value }));
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
const complete=()=>{
  // if(!form.tailor_id){
  // showAlert({
  //         position: "top-end",
  //         icon: "error",
  //         title:  <FormattedMessage id="Please select a tailor!" />,
  //         showConfirmButton: false,
  //         timer: 1000,
  //       });
  //       return;
  // }
  form._method="put";
  form.complete=1;
  form.com_date=new Date();
      axios
        .post(Source.getAddress() + "/api/fabricsbill/"+form.id,form , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params:{
            update:'ok'
          }
        })
        .then((res) => {
          form.complete=1;
        setRecords(records.map((a) => (a.id === form.id ? form : a))); 
const messages = {
  da: {
    title: "📌 پیام از خیاطی",
    greeting: `سلام ${selectedOption.name} عزیز! 👋`,
    total: `💎 مبلغ کل: ${form.t_amount} افغانی`,
    paid: `✅ پرداخت شده: ${form.p_amount} افغانی`,
    remaining: `⏳ باقی‌مانده: ${form.d_amount} افغانی`,
    dates: `📅 تاریخ شروع: ${form.s_date||'-'}\n📅 تاریخ تحویل: ${form.e_date||'-'}`,
    ready: "🧵 لباس شما آماده است، لطفاً برای تحویل مراجعه کنید.",
    thanks: "🙏 سپاس از اعتماد شما!",
  },
  pa: {
    title: "📌 د خیاطی څخه پیام",
    greeting: `سلام ${selectedOption.name} عزیز! 👋`,
    total: `💎 ټوله پیسې: ${form.t_amount} افغانی`,
    paid: `✅ تادیه شوی: ${form.p_amount} افغانی`,
    remaining: `⏳ پاتې پیسې: ${form.d_amount} افغانی`,
    dates: `📅 د شروع نیټه: ${form.s_date||'-'}\n📅 د تحویل نیټه: ${form.e_date||'-'}`,
    ready: "🧵 ستاسو جامه تیار ده، مهرباني وکړئ د تحویل لپاره تشریف راوړئ.",
    thanks: "🙏 ستاسو د اعتماد مننه!",
  },
  en: {
    title: "📌 Message from Tailor",
    greeting: `Hello ${selectedOption.name}! 👋`,
    total: `💎 Total amount: ${form.t_amount} AFN`,
    paid: `✅ Paid: ${form.p_amount} AFN`,
    remaining: `⏳ Remaining: ${form.d_amount} AFN`,
    dates: `📅 Start date: ${form.s_date||'-'}\n📅 Delivery date: ${form.e_date||'-'}`,
    ready: "🧵 Your clothes are ready! Please visit us to collect your order.",
    thanks: "🙏 Thank you for your trust!",
  },
};

  const { title, greeting, total, paid, remaining, dates,ready, thanks } = messages[localStorage.getItem("language")];
  const fullMessage = `${title}\n\n${greeting}\n\n${total}\n${paid}\n${remaining}\n\n${dates}\n${ready}\n${thanks}`;
  WhatsAppButton({
       phoneNumber: selectedOption.whatsup_number || "",
        message: fullMessage,
  });
          showAlert({
            position: "top-end",
            icon: "success",
            title: <FormattedMessage id="Your record has been updated!" />,
            showConfirmButton: false,
            timer: 1000,
          });
        })
        .catch((err) => {
        console.log(err);
          showAlert({
            position: "top-end",
            icon: "error",
            title:  <FormattedMessage id="You must enter the customer name!" />,
            showConfirmButton: false,
            timer: 1000,
          });
        });
}

const send=(row,debite=false)=>{
      row.surrendered=1;
      row._method="put";
      row.sur_date=new Date();
        axios
          .post(Source.getAddress() + "/api/fabricsbill/"+form.id,row, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            params:{
              update:'ok',
              debite:debite&&'ok',
              customer_id:form.c_id,
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
  greeting: `سلام ${form.account.name} گرامی! 👋`,
  total: `💎 مجموع مبلغ: ${form.t_amount} افغانی`,
  paid: `✅ مقدار پرداخت‌شده: ${form.p_amount||0} افغانی`,
  remaining: `⏳ باقیمانده: ${form.d_amount||0} افغانی`,
  dates: `📅 تاریخ آغاز: ${form.s_date || '-'}\n📅 تاریخ سپردن لباس: ${form.e_date || '-'}`,
  status: "📦 فرمایش شما تسلیم داده شده است. امیدواریم از کار ما راضی بوده باشید.",
  thanks: "🙏 سپاس‌گزاریم از اعتماد شما!"
},
  pa: {
    title: "📌 د خیاطی څخه پیام",
    greeting: `سلام ${selectedOption.name} عزیز! 👋`,
    total: `💎 ټوله پیسې: ${form.t_amount} افغانی`,
    paid: `✅ تادیه شوی: ${form.p_amount} افغانی`,
    remaining: `⏳ پاتې پیسې: ${form.d_amount} افغانی`,
    dates: `📅 د شروع نیټه: ${form.s_date || '-'}\n📅 د تحویل نیټه: ${form.e_date || '-'}`,
    status: "📦 ستاسو امر تسلیم شو. هیله کوو چې له خپله پیرود څخه راضي یاست.",
    thanks: "🙏 ستاسو د اعتماد مننه!"
  },
  en: {
    title: "📌 Message from Tailor",
    greeting: `Hello ${selectedOption.name}! 👋`,
    total: `💎 Total amount: ${form.t_amount} AFN`,
    paid: `✅ Paid: ${form.p_amount} AFN`,
    remaining: `⏳ Remaining: ${form.d_amount} AFN`,
    dates: `📅 Start date: ${form.s_date || '-'}\n📅 Delivery date: ${form.e_date || '-'}`,
    status: "📦 Your order has been delivered. We hope you're satisfied with your purchase.",
    thanks: "🙏 Thank you for your trust!"
  }
};

const lang = localStorage.getItem("language") || "en";
const { title, greeting, total, paid, remaining, dates, status, thanks } = deliveredMessages[lang];
const fullMessage = `${title}\n\n${greeting}\n\n${total}\n${paid}\n${remaining}\n\n${dates}\n${status}\n${thanks}`;

WhatsAppButton({
  phoneNumber:selectedOption.whatsup_number || "",
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


const surrendered = async ()=>{
let row={
  surrendered:1
}
  if(form.t_amount - form.p_amount>0){
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
                  cancelButtonText: intl.formatMessage({id:"Cancel"})
                  ,
                  reverseButtons: true,
         });
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
      const algorithmD = (e) => {
    setSelectedOptionD(e);
    if (e) {
      setForm({
        ...form,
        d_id: e.id,
        d_name: e.name,
      });
    }
  };

const measurementFields = [
  { name: 'shirt', label: 'Shirt Size' },
  { name: 'sleeve', label: 'Sleeve' },
  { name: 'shoulder', label: 'Shoulder' },
  { name: 'collar', label: 'Collar' },
  { name: 'Belly', label: 'Belly' },
  { name: 'pant', label: 'Pant' },
  { name: 'cuff', label: 'Cuff' },
  { name: 'skirt', label: 'Skirt' },
  { name: 'wpant', label: 'widthpant' },
  { name: 'wsleeve', label: 'widthsleeve' },
];


const generateTailorInvoicePDF = (data) => {
    // Language detection (default: Dari if not set)
    const lang = localStorage.getItem('language') || 'fa';
    
    // Translation dictionary
    const translations = {
        en: {
            title: "Tailor Invoice",
            customerName: "Customer Name",
            date: "Date",
            whatsapp: "WhatsApp Number",
            description: "Description",
            status: "Status",
            tailor: "Tailor",
            surrendered: "Delivered",
            completed: "Completed",
            inProgress: "In Progress",
            pending: "Pending",
            clothDetails: "Garment Details",
            part: "Part",
            measurement: "Measurement",
            fabricUsage: "Fabric Usage",
            no: "No.",
            quantity: "Quantity",
            price: "Price",
            total: "Total",
            noUsage: "No usage recorded",
            paymentDetails: "Payment Details",
            payable: "Payable Amount",
            paid: "Paid Amount",
            remaining: "Remaining Amount",
            thanks: "Thank you for choosing us!",
            enablePopup: "Please enable browser popups.",
            meter: "meter",
            afghani: "AFN",
            yes: "Yes",
            no: "No",
            has: "Has",
            notHas: "Doesn't have",
            unknown: "Unknown",
            shirtLength: "Shirt Length",
            pant: "Pant",
            skirt: "Skirt",
            sleeve: "Sleeve",
            shoulder: "Shoulder",
            collar: "Collar",
            cuff: "Cuff",
            belly: "Side",
            wpant: "Pant Width",
            wsleeve: "Sleeve Width",
            squareSkirt: "Square Skirt",
            circleSkirt: "Circle Skirt",
            frontPocket: "Shirt Pocket",
            pocketPant: "Pant Pocket",
            cuffSleeve: "Sleeve Cuff",
            twoPocket: "Two Pockets",
            sleeveType: {
                duble_qot: "Double Qot Gull",
                gull_astin: "Cuff Sleeve",
                default: "Pub Gull"
            },
            neckType: {
                ful_b: "Full Collar",
                cuff_b: "Cuff Collar",
                default: "Standard Collar"
            },
            design: "Design"
        },
        da: {
            title: "فاکتور خیاطی",
            customerName: "نام مشتری",
            date: "تاریخ",
            whatsapp: "شماره واتساپ",
            description: "توضیحات",
            status: "حالت",
            tailor: "خیاط",
            surrendered: "تسلیم شده",
            completed: "تکمیل شده",
            inProgress: "در جریان است",
            pending: "در انتظار نوبت است",
            clothDetails: "جزئیات لباس",
            part: "قسمت",
            measurement: "مقدار",
            fabricUsage: "مصرف پارچه",
            no: "شماره",
            quantity: "اندازه",
            price: "قیمت",
            total: "مجموع قیمت",
            noUsage: "هیچ استفاده‌ای ثبت نشده است",
            paymentDetails: "مقدار پرداخت",
            payable: "مقدار قابل پرداخت",
            paid: "مقدار پرداخت‌شده",
            remaining: "باقیمانده",
            thanks: "تشکر از انتخاب ما!",
            enablePopup: "لطفاً پاپ‌آپ مرورگر را فعال نمایید.",
            meter: "متر",
            afghani: "افغانی",
            yes: "بله",
            no: "نخیر",
            has: "دارد",
            notHas: "ندارد",
            unknown: "نامشخص",
            shirtLength: "قد پیراهن",
            pant: "تنبان",
            skirt: "دامن",
            sleeve: "آستین",
            shoulder: "شانه",
            collar: "یخن",
            cuff: "پاچه",
            belly: "بغل",
            wpant: "بر تنبان",
            wsleeve: "بر آستین",
            squareSkirt: "دامن چهارکنج",
            circleSkirt: "دامن گرد",
            frontPocket: "جیب قمیص",
            pocketPant: "جیب پتلون",
            cuffSleeve: "کف آستین",
            twoPocket: "دو جیب",
            sleeveType: {
                duble_qot: "دبل قات گول",
                gull_astin: "آستین کف دار",
                default: "پام گول"
            },
            neckType: {
                ful_b: "فول بین",
                cuff_b: "کف بین",
                default: "چپه یخن"
            },
            design: "دیزاین"
        },
        pa: {
            title: "د خياط فاکتور",
            customerName: "د مشتری نوم",
            date: "نېټه",
            whatsapp: "د واتساپ شمېره",
            description: "تفصيل",
            status: "حالت",
            tailor: "خياط",
            surrendered: "سپارل شوی",
            completed: "بشپړ شوی",
            inProgress: "په جریان کې دی",
            pending: "د نوبت په انتظار کې دی",
            clothDetails: "د جامو توضیحات",
            part: "برخه",
            measurement: "مقدار",
            fabricUsage: "د پارچې مصرف",
            no: "شمېره",
            quantity: "کچه",
            price: "قیمت",
            total: "ټول قیمت",
            noUsage: "هیڅ مصرف ثبت شوی ندی",
            paymentDetails: "د پرداخت مقدار",
            payable: "د پرداخت وړ مقدار",
            paid: "تادیه شوی مقدار",
            remaining: "پاتې مقدار",
            thanks: "زموږ د انتخاب مننه!",
            enablePopup: "مهرباني وکړئ د براوزر پاپ اپ فعال کړئ.",
            meter: "متر",
            afghani: "افغانۍ",
            yes: "هو",
            no: "نه",
            has: "لري",
            notHas: "نه لري",
            unknown: "نامعلوم",
            shirtLength: "د کميس اوږدوالی",
            pant: "پتلون",
            skirt: "دامن",
            sleeve: "آستین",
            shoulder: "اوږه",
            collar: "غاړه",
            cuff: "پاچه",
            belly: "اړخ",
            wpant: "د پتلون پلنوالی",
            wsleeve: "د آستین پلنوالی",
            squareSkirt: "څلور ګونی دامن",
            circleSkirt: "ګرد دامن",
            frontPocket: "د کميس جیب",
            pocketPant: "د پتلون جیب",
            cuffSleeve: "د آستین کف",
            twoPocket: "دوه جیبونه",
            sleeveType: {
                duble_qot: "دبل قات",
                gull_astin: "ګول آستین",
                default: "پام"
            },
            neckType: {
                ful_b: "فول بین",
                cuff_b: "کف بین",
                default: "معیاري غاړه"
            },
            design: "ډیزاین"
        }
    };

    const t = translations[lang];
    const formattedDate = moment(data.s_date).format(lang === 'en' ? "YYYY/MM/DD - HH:mm" : "jYYYY/jMM/jDD - HH:mm");

    const getStatusLabel = (row) => {
        if (row.surrendered === 1) {
            return { label: t.surrendered, bgColor: "#4caf50", textColor: "white" };
        } else if (row.complete === 1) {
            return { label: t.completed, bgColor: "#ff9800", textColor: "white" };
        } else if (row.tailor_id) {
            return { label: t.inProgress, bgColor: "#2196f3", textColor: "white" };
        } else {
            return { label: t.pending, bgColor: "#BF3131", textColor: "white" };
        }
    };

    const getBooleanText = (value) => value ? t.yes : t.no;
    const getHasText = (value) => value ? t.has : t.notHas;

    const sellsHTML = (data.sells && data.sells.length > 0)
        ? data.sells.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.qty} ${t.meter}</td>
                <td>${formatNumber(item.purchase_price)} ${t.afghani}</td>
                <td>${formatNumber(parseFloat(item.purchase_price)*parseFloat(item.qty)) || "-"} ${t.afghani}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="4">${t.noUsage}</td></tr>`;

    const invoiceHTML = `
    <html>
        <head>
            <title>${t.title}</title>
            <style>
                @page { size: A4; margin: 1.5cm; }
                body { 
                    font-family: Tahoma, sans-serif; 
                    font-size: 12px; 
                    direction: ${lang === 'en' ? 'ltr' : 'rtl'}; 
                    margin: 0; 
                    padding: 0; 
                }
                .container { padding: 10px; }
                .header, .footer { text-align: center; margin-bottom: 10px; }
                .header h1 { margin: 5px 0; font-size: 18px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
                th, td { border: 1px solid #333; padding: 5px; text-align: center; }
                th { background: #0b69ff; color: white; }
                .section-title { font-size: 13px; font-weight: bold; margin: 10px 0 5px 0; }
                .tables-container { display: flex; gap: 10px; flex-wrap: wrap; }
                .table-wrapper { flex: 1 1 48%; }
                .two-column { 
                    display: flex; 
                    justify-content: space-between; 
                    gap: 20px; 
                    direction: ${lang === 'en' ? 'ltr' : 'rtl'}; 
                    margin-bottom: 20px;
                }
                .two-column .col { flex: 1; min-width: 150px; }
                @media print { .tables-container { page-break-inside: avoid; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${t.title}</h1>
                </div>
                <div class="two-column">
                    <div class="col">
                        <p><strong>${t.customerName}:</strong> ${data.account.name}</p>
                        <p><strong>${t.date}:</strong> ${formattedDate}</p>
                        <p><strong>${t.whatsapp}:</strong> ${data.account.whatsup_number || t.notHas}</p>
                        <p><strong>${t.description}:</strong> ${data.description || t.notHas}</p>
                    </div>
                    <div class="col">
                        <p><strong>${t.status}:</strong> ${getStatusLabel(data).label}</p>
                        <p><strong>${t.tailor}:</strong> ${data?.tailor?.name || t.pending}</p>
                    </div>
                </div>
                <div class="tables-container">
                    <div class="table-wrapper">
                        <div class="section-title">${t.clothDetails}</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>${t.part}</th>
                                    <th>${t.measurement}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>${t.shirtLength}</td><td>${data.shirt || '-'}</td></tr>
                                <tr><td>${t.pant}</td><td>${data.pant || '-'}</td></tr>
                                <tr><td>${t.skirt}</td><td>${data.skirt || '-'}</td></tr>
                                <tr><td>${t.sleeve}</td><td>${data.sleeve || '-'}</td></tr>
                                <tr><td>${t.shoulder}</td><td>${data.shoulder || '-'}</td></tr>
                                <tr><td>${t.collar}</td><td>${data.collar || '-'}</td></tr>
                                <tr><td>${t.cuff}</td><td>${data.cuff || '-'}</td></tr>
                                <tr><td>${t.belly}</td><td>${data.Belly || '-'}</td></tr>
                                <tr><td>${t.wpant}</td><td>${data.wpant || '-'}</td></tr>
                                <tr><td>${t.wsleeve}</td><td>${data.wsleeve || '-'}</td></tr>
                                <tr><td>${t.squareSkirt}</td><td>${getBooleanText(data.squareSkirt)}</td></tr>
                                <tr><td>${t.circleSkirt}</td><td>${getBooleanText(data.circleSkirt)}</td></tr>
                                <tr><td>${t.frontPocket}</td><td>${getHasText(data.frontPocket)}</td></tr>
                                <tr><td>${t.pocketPant}</td><td>${getHasText(data.pocketPant)}</td></tr>
                                <tr><td>${t.twoPocket}</td><td>${getHasText(data.twoPocket)}</td></tr>
                                <tr><td>${t.sleeveType.default}</td><td>${data?.sleeveType ? (t.sleeveType[data.sleeveType] || t.sleeveType.default) : t.unknown}</td></tr>
                                <tr><td>${t.neckType.default}</td><td>${data?.neckType ? (t.neckType[data.neckType] || t.neckType.default) : t.unknown}</td></tr>
                                <tr><td>${t.design}</td><td>${data?.design?.name || t.unknown}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table-wrapper">
                        <div class="section-title">${t.fabricUsage}</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>${t.no}</th>
                                    <th>${t.quantity}</th>
                                    <th>${t.price}</th>
                                    <th>${t.total}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sellsHTML}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="section-title">${t.paymentDetails}</div>
                <table>
                    <tbody>
                        <tr><td>${t.payable}</td><td>${formatNumber(data.t_amount || 0)} ${t.afghani}</td></tr>
                        <tr><td>${t.paid}</td><td>${formatNumber(data.p_amount || 0)} ${t.afghani}</td></tr>
                        <tr><td>${t.remaining}</td><td>${formatNumber(data.d_amount || 0)} ${t.afghani}</td></tr>
                    </tbody>
                </table>
                <div class="footer">
                    <p>${t.thanks}</p>
                </div>
            </div>
        </body>
    </html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
    } else {
        alert(t.enablePopup);
    }
};

   return (
    <AnimatePresence backgroundColor="rgba(0, 0, 0, 0)">
      <style>
        {`
          .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
        `}
      </style>
      {show && (
        <motion.div
          backgroundColor="rgba(0, 0, 0, 0)"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            top: '0%',
            left: '0%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
          }}
        >
          <Paper
            className="custom-scroll"
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              maxWidth: '90%',
              width: 800,
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
              backgroundColor: 'white',
            }}
          >
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn-close h-25 p-3 mt-0 hover_btn"
                onClick={close}
                aria-label={intl.formatMessage({ id: 'Close' })}
              ></button>
            </div>
            <h1 className="text-center rounded text-light" style={{ 
              backgroundColor: "var(--bs-info)", 
              width: "100%",
              fontSize: '1rem',
              padding: '0.5rem',
            }}>
              <FormattedMessage id="Update Order" />
            </h1>
            <form dir={currentLanguage === 'en' ? 'ltr' : 'rtl'}>
              {/* Dependent Information Section */}
              <Box mb={3}>
                <Typography color="primary" variant="subtitle1" fontWeight="bold">
                  <FormattedMessage id="Dependent Information" />
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Combo_stock
                      name={<FormattedMessage id="Add Customer" />}
                      setAddAccountModal={AddAccountModal}
                      searchQuery={searchQuery}
                      handleInputChange={handleInputChange}
                      setSelectedOption={algorithm}
                      selectedOption={selectedOption}
                      options={options}
                      Onsearch={algorithm}
                      compactMode={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="c_id"
                      label={<FormattedMessage id="WhatsApp Number" />}
                      value={selectedOption?.id === 0 ? formatPhone(form.c_whatsupp) : formatPhone(selectedOption?.whatsup_number)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\s/g, '');
                        handleChange({ target: { name: 'c_whatsupp', value: rawValue } });
                      }}
                      type="text"
                      className="main-color"
                      fullWidth
                      size="small"
                      dir="ltr"
                      InputProps={{
                        readOnly: selectedOption?.id !== 0,
                        startAdornment: (
                          <InputAdornment position="start">
                            <span>+93</span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                      <NumericFormat
                        thousandSeparator=","
                        displayType="input"
                        name="amount_cloths"
                        value={form.amount_cloths}
                        customInput={TextField}
                        dir="ltr"
                        type="text"
                        fullWidth
                        size="small"
                        label={<FormattedMessage id="Amount of cloths" />}
                        handleChange={handleChange}
                        onValueChange={(values) => {
                                              handleChange({ target: { name:'amount_cloths', value: values.value } });
                                            }}
                        // InputProps={{
                        //   startAdornment: (
                        //     <InputAdornment position="start">AFG</InputAdornment>
                        //   ),
                        // }}
                      />
                    </Grid>
                </Grid>
              </Box>
              {/* Measurement Specifications Section */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  <FormattedMessage id="Measurement Specifications" />
                </Typography>
                <Divider sx={{ my: 1 }} />
        <Grid container spacing={2}>
             {measurementFields.map(({ name, label }) => (
               <Grid item xs={12} sm={6} md={3} key={name}>
                 <NumericFormat
                   customInput={TextField}
                   name={name}
                   label={<FormattedMessage id={label} />}
                   value={form[name]}
                   onValueChange={({ floatValue }) => {
                     const value = floatValue?.toFixed(2) ?? '';
                     handleChange({ target: { name, value } });
                   }}
                   thousandSeparator=","
                   decimalScale={1}
                   fixedDecimalScale
                   allowNegative={false}
                   fullWidth
                   size="small"
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <Ruler size={16} />
                       </InputAdornment>
                     ),
                   }}
                 />
               </Grid>
             ))}
            <Grid item xs={12} sm={6} md={3}>
               <FormControl fullWidth size="small">
                 <InputLabel><FormattedMessage id="Sleeve Type" /></InputLabel>
                 <Select
                   name="sleeveType"
                   value={options.sleeveType}
                   label={<FormattedMessage id="Sleeve Type" />}
                   onChange={handleChangeinput}>
                   <MenuItem value="gull_a"><FormattedMessage id="gull_astin" /></MenuItem>
                   <MenuItem value="duble_qot"><FormattedMessage id="double_qot" /></MenuItem>
                   <MenuItem value="pum"><FormattedMessage id="pum" /></MenuItem>
                 </Select>
               </FormControl>
             </Grid>
       
             <Grid item xs={12} sm={6} md={3}>
               <FormControl fullWidth size="small">
                 <InputLabel><FormattedMessage id="Neck Type" /></InputLabel>
                 <Select
                   name="neckType"
                   value={options.neckType}
                   label={<FormattedMessage id="Neck Type" />}
                   onChange={handleChangeinput}>
                   <MenuItem value="ful_b"><FormattedMessage id="FullBin" /></MenuItem>
                   <MenuItem value="cuff_b"><FormattedMessage id="CuffBin" /></MenuItem>
                   <MenuItem value="t"><FormattedMessage id="T" /></MenuItem>
                 </Select>
               </FormControl>
             </Grid>
           </Grid>
           <Divider sx={{ my: 3 }} />
       <Grid container spacing={2} alignItems="flex-start">
         {/* چک‌باکس‌ها در ستون اول */}
          {/* Combo_stock در ستون دوم */}
         <Grid item xs={12} md={4}>
           <Combo_stock
             label={<FormattedMessage id="Design" />}
             searchQuery={searchQueryD}
             setSearchQuery={setSearchQueryD}
             handleInputChange={handleInputChangeD}
             handleSearch={handleSearchD}
             setSelectedOption={algorithmD}
             Onsearch={algorithmD}
             selectedOption={selectedOptionD}
             options={DesignTailor}
             compactMode={true}
           />
         </Grid>
         <Grid item xs={12} md={8}>
           <FormGroup row sx={{ gap: 2 }}>
             <FormControlLabel
         control={
           <Checkbox
             checked={form.squareSkirt === 1}
             onChange={handleCheckboxChange}
             name="squareSkirt"
           />
         }
         label={<FormattedMessage id="Square Skirt" />}
       />       
       <FormControlLabel
         control={
           <Checkbox
             checked={form.circleSkirt === 1}
             onChange={handleCheckboxChange}
             name="circleSkirt"
           />
         }
         label={<FormattedMessage id="Circle Skirt" />}
       />
       
       <FormControlLabel
         control={
           <Checkbox
             checked={form.pocketPant === 1}
             onChange={handleCheckboxChange}
             name="pocketPant"
           />
         }
         label={<FormattedMessage id="Pocket Pant" />}
       />
       <FormControlLabel
         control={
           <Checkbox
             checked={form.twoPocket === 1}
             onChange={handleCheckboxChange}
             name="twoPocket"
           />
         }
         label={<FormattedMessage id="Two Pocket" />}
       />
       <FormControlLabel
         control={
           <Checkbox
             checked={form.frontPocket === 1}
             onChange={handleCheckboxChange}
             name="frontPocket"
           />
         }
         label={<FormattedMessage id="Front Pocket" />}
       />
       {/* <FormControlLabel
         control={
           <Checkbox
             checked={form.cuffSleeve === 1}
             onChange={handleCheckboxChange}
             name="cuffSleeve"
           />
         }
         label={<FormattedMessage id="Cuff Sleeve" />}
       /> */}
           </FormGroup>
         </Grid>
       </Grid>
              </Box>
              {/* Additional Details Section */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  <FormattedMessage id="Additional Details" />
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={2}>
                  {[
                    { name: 'h_patch', label: 'Front Design' },
                    { name: 'patch', label: 'Back Design' },
                    { name: 'button', label: 'Button Type' },
                  ].map(({ name, label }) => (
                    <Grid item xs={12} sm={4} key={name}>
                      <TextField
                        name={name}
                        label={<FormattedMessage id={label} />}
                        value={form[name]}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label={<FormattedMessage id="Description" />}
                      value={form.description}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* Fabrics Section */}
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                  <Typography component="span">
                    <FormattedMessage id="Fabrics Section" />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box p={2} component={Paper}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Combo_stock
                          searchQuery={searchQuery1}
                          setSearchQuery={setSearchQuery1}
                          handleInputChange={handleInputChange1}
                          handleSearch={handleSearch1}
                          setSelectedOption={algorithm1}
                          selectedOption={selectedOption1}
                          options={options1}
                          compactMode={true}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <NumericFormat
                          name="qty"
                          label={intl.formatMessage({ id: 'M' })}
                          type="number"
                          fullWidth
                          size="small"
                          value={addItem?.qty}
                          type="number"
                          fullWidth
                          size="small"
                          onValueChange={(values) => {
                            handleItemChange({ 
                              target: { 
                                name: "qty", 
                                value: values.value.replace(/,/g, '') // حذف تمام کاماها
                              }
                            });
                          }}
                            thousandSeparator=","
                            decimalSeparator="."
                            displayType="input"
                            customInput={TextField}
                            dir="ltr"
                            type="text"
                            fullWidth
                            size="small"
                            className="text-danger"
                       />
                      </Grid>
                      <Grid item xs={12} md={3}>
                      <NumericFormat
                          name="purchase_price"
                          label={intl.formatMessage({ id: 'Price_per_meter' })}
                          type="number"
                          fullWidth
                          size="small"
                          value={addItem.purchase_price}
                          // onChange={handleItemChange}
                          onValueChange={(values) => {
                            // ارسال مقدار بدون فرمت به تابع handleItemChange
                            handleItemChange({ 
                              target: { 
                                name: "purchase_price", 
                                value: values.value.replace(/,/g, '') // حذف تمام کاماها
                              }
                            });
                          }}
                          InputProps={{ startAdornment: <InputAdornment position="start">AFG</InputAdornment> }}
                      
                            thousandSeparator=","
                            decimalSeparator="."
                            // decimalScale={2} // این خط دو رقم اعشاری را محدود می‌کند
                            displayType="input"
                            customInput={TextField}
                            dir="ltr"
                            // onValueChange={(values) => {
                            //   handleChange({ target: { name, value: values.value } });
                            // }}
                            type="text"
                            fullWidth
                            size="small"
                            className="text-danger"
                       />
                      </Grid>
                      <Grid item xs={12} md={3}>

                        <NumericFormat
                            // value={value}
                          value={addItem.purchase_price * addItem.qty}
                          label={intl.formatMessage({ id: 'Total Amount' })}
                            thousandSeparator=","
                            decimalSeparator="."
                            // decimalScale={2} // این خط دو رقم اعشاری را محدود می‌کند
                            fixedDecimalScale={true} // همیشه دو رقم اعشاری نمایش داده شود
                            displayType="input"
                            customInput={TextField}
                            dir="ltr"
                            type="text"
                            fullWidth
                            size="small"
                            className="text-danger"
                          inputProps={{ readOnly: true }}
                          InputProps={{ startAdornment: <InputAdornment position="start">AFG</InputAdornment> }}
                       />
                      </Grid>
                      <Grid item xs={6} md={3}> 
                        <NumericFormat
                          value={parseFloat(selectedOption1?.qty) - ((parseFloat(addItem.qty))||0)}
                          label={intl.formatMessage({ id: 'Existing' })}
                          thousandSeparator=","
                            decimalSeparator="."
                            fixedDecimalScale={true} // همیشه دو رقم اعشاری نمایش داده شود
                            displayType="input"
                            customInput={TextField}
                            dir="ltr"
                            type="text"
                            fullWidth
                            size="small"
                            className="text-danger"
                          inputProps={{ readOnly: true }}
                          InputProps={{ startAdornment: <InputAdornment position="start">M</InputAdornment> }}
                       />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="description"
                          label={intl.formatMessage({ id: 'Description' })}
                          fullWidth
                          size="small"
                          value={addItem.description}
                          onChange={handleItemChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button
                          onClick={addToTable}
                          variant="contained"
                          color="success"
                          fullWidth
                          startIcon={<Plus size={20} />}
                        >
                          <FormattedMessage id="Add Item" />
                        </Button>
                      </Grid>
                    </Grid>
                    <Box mt={4}>
                      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                        <Table size="small" sx={{ minWidth: 600 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell><FormattedMessage id="ID" /></TableCell>
                              <TableCell><FormattedMessage id="Name" /></TableCell>
                              <TableCell><FormattedMessage id="M" /></TableCell>
                              <TableCell><FormattedMessage id="Price" /></TableCell>
                              <TableCell><FormattedMessage id="Description" /></TableCell>
                              <TableCell><FormattedMessage id="Total Price" /></TableCell>
                              <TableCell><FormattedMessage id="Delete" /></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {shoppingCart?.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.item_id}</TableCell>
                                <TableCell>{row.name || row.stock?.type.name}</TableCell>
                                <TableCell>{formatNumber (row.qty)}</TableCell>
                                <TableCell>{formatNumber(row.purchase_price)}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{formatNumber(parseFloat(row.purchase_price)*parseFloat(row.qty))}</TableCell>
                                <TableCell>
                                  <Button color="error" onClick={() => deleteItem(row)}>
                                    <Trash2 size={20} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
{/* Payment Information Section */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  <FormattedMessage id="Payment and Date Information" />
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={2}>
                  {[
                    { name: 't_fee', label: 'Sewing Fee' },
                    { name: 'p_amount', label: 'Paid Amount' },
                    { name: 'd_amount', label: 'Debt' },
                    { name: 't_amount', label: 'Total Amount' },
                  ].map(({ name, label }) => {
                    const t_fee = parseInt(form['t_fee']) || 0;
                    const p_amount = parseInt(form['p_amount']) || 0;
                    const t_amount = parseInt(form['t_amount']) || 0;
                    let value: number | string = form[name] || '';
                    if (name === 'd_amount') {
                      value = t_amount - p_amount;
                    } else if (name === 't_amount') {
                      value =form.t_amount;
                    }
                    return (
                      <Grid item xs={12} sm={3} key={name}>
                        <NumericFormat
                          value={value}
                          thousandSeparator=","
                          displayType="input"
                          customInput={TextField}
                          dir="ltr"
                          name={name}
                          label={<FormattedMessage id={label} />}
                          onValueChange={(values) => {
                            handleChange({ target: { name, value: values.value } });
                          }}
                          type="text"
                          fullWidth
                          size="small"
                          className="text-danger"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">AFG</InputAdornment>,
                            readOnly: name === 'd_amount' || name === 't_amount',
                            style: {
                              color: name === 't_amount' ? 'blue' : name === 'p_amount' ? 'green' : 'red',
                            },
                          }}
                        />
                      </Grid>
                    );
                  })}
                  <Grid item xs={12} sm={4}>
                    <Combo_stock
                      label={<FormattedMessage id="Tailor" />}
                      searchQuery={searchQueryT}
                      setSearchQuery={setSearchQueryT}
                      handleInputChange={handleInputChangeT}
                      handleSearch={handleSearchT}
                      setSelectedOption={algorithmT}
                      Onsearch={algorithmT}
                      selectedOption={selectedOptionT}
                      options={optionT}
                      compactMode={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Datepicker_Customer
                      default_value={StartDate}
                      handle_date={handle_date_start}
                      lebal={<FormattedMessage id="Start" />}
                      setSelectedDay={setStartDate}
                      selectedDay={StartDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Datepicker_Customer
                      default_value={EndDate}
                      handle_date={handle_date_end}
                      lebal={<FormattedMessage id="End" />}
                      setSelectedDay={setEndDate}
                      selectedDay={EndDate}
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* Action Buttons */}
                <Box textAlign="center">
                  <Button
    variant="contained"
    onClick={() => generateTailorInvoicePDF(form, localStorage.getItem('language'))}
    sx={{
      backgroundColor: '#6d4c41', // قهوه‌ای تیره (رنگ چاپ)
      '&:hover': { backgroundColor: '#5d4037' },
      margin: '1rem',
    }}
    size="large"
  >
    <FormattedMessage id="Print" />
  </Button>
  {/* تحویل داده شد - موفقیت‌آمیز */}
  {s_ok && 
   (<Button
    variant="contained"
    onClick={surrendered}
    sx={{
      backgroundColor: '#4caf50', // سبز موفقیت
      '&:hover': { backgroundColor: '#388e3c' },
      margin: '1rem',
    }}
    size="large"
  >
    <FormattedMessage id="Surrendered" />
  </Button>)
}
  {/* کامل شده - رنگ آبی آرام و مثبت */}
  {
    c_ok&&(
    <Button
    variant="contained"
    onClick={complete}
    sx={{
      backgroundColor: '#2196f3', // آبی معمولی
      '&:hover': { backgroundColor: '#1976d2' },
      margin: '1rem',
    }}
    size="large"
  >
    <FormattedMessage id="complete" />
  </Button>)
}
  {/* ارسال فرم - تأکیدی و آبی تیره */}
  <Button
    variant="contained"
    onClick={SubmitEvent}
    sx={{
      backgroundColor: '#1976d2', // آبی تیره (اکشن)
      '&:hover': { backgroundColor: '#0d47a1' },
      margin: '1rem',
    }}
    type="submit"
    size="large"
  >
    <FormattedMessage id="Submit" />
  </Button>

  {/* انصراف - قرمز هشدار */}
  <Button
    variant="contained"
    onClick={close}
    sx={{
      backgroundColor: '#f44336', // قرمز هشدار
      '&:hover': { backgroundColor: '#d32f2f' },
      margin: '1rem',
    }}
    size="large"
  >
    <FormattedMessage id="Cancel" />
  </Button>

  {/* چاپ فاکتور - ثانویه اما مهم */}
</Box>

            </form>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default UpdateSewingOrder;
