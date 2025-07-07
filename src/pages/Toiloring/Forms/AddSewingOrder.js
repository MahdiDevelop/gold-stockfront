import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useShowAlert  } from "../../../warrper";
import Combo_stock from "./Combo";
import Combo_Customer from "../../forms/Combo_Customer";
import jalaali from "jalaali-js";
import Datepicker_Customer from "../../forms/Datepicker_customer";
import moment from "moment-jalaali";
// import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import { NumericFormat} from "react-number-format";
// import Combo_stock from "../../forms/Combo_Customer";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ChevronDown, Plus, Trash2 } from 'lucide-react'; // Import آیکون‌های lucide
import {
//   Box,
  Button,
//   Grid,
//   InputAdornment,
FormControlLabel,
Checkbox,
TableContainer,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip, // اضافه کردن این خط
  IconButton, // اضافه کردن این خط
  Pagination, // اضافه کردن این خط
  Paper,  FormGroup,
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
import { useSelector, useDispatch } from "react-redux";
import { addTailorToCache } from "../../Redux/tailorSlice";


const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};

const AddSewingOrder = ({show,close={close},moneys,setmoneys,options1,optionT,setOptionT,setOption1,records,setRecords,
DesignTailor, setDesignTailor}) => {
  const [searchQueryT, setSearchQueryT] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQueryD, setSearchQueryD] = useState("");
  const dispatch = useDispatch();
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [selectedOption1, setSelectedOption1] = useState();
  const [selectedOptionT, setSelectedOptionT] = useState();
  const [selectedOptionD, setSelectedOptionD] = useState();
  const [form, setForm] = React.useState({
    shirt: '',
    sleeve: '',
    shoulder: '',
    collar: '',
    Belly: '',
    pant: '',
    cuff: '',
    skirt: '',
    h_patch: '',
    patch: '',
    button: '',
    description: '',
    t_amount: '',
    p_amount: '',
    d_amount: '',
    s_date: new Date().toISOString(),
    e_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    money_id: '',
    c_id: '',
    c_name:"",
    c_whatsupp:"",
    tailor_id:-1,
    tailor_name:'',
    d_name:'',
    d_id:'',
    wpant: '',
    wsleeve: '',
    neckType: '',
    sleeveType:'',
    isdelete:0,
  squareSkirt: 0,
  circleSkirt: 0,
  pocketPant: 0,
  twoPocket: 0,
  frontPocket: 0,
  amount_cloths:1,
  cuffSleeve: 0,
  user_id:localStorage.getItem("userTokenid")
  });
  // console.log( new Date(new Date().setDate(new Date().getDate() + 5)).toISOString());
  const [addItem, setAddItem] = useState({
    id: '',
    name: '',
    qty: '',
    purchase_price: '',
    description: '',
  });
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
  const [StartDate, setStartDate] = useState(moment());
      const [EndDate, setEndDate] = useState(moment( moment().add(5, 'days').format('YYYY-MM-DD')));
      const [EndDateE, setEndDateE] = useState(null);
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
   const handleSearch1 = async (query) => {
  };
  // const handleSearchD = async (query) => {
  // };
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
   const algorithm1 = (e) => {
    setSelectedOption1(e);
    if (e) {
      setAddItem({
        ...addItem,
        id: e.id,
        name: e.name,
      });
    }
  };
      const handleInputChange1 = (newValue) => {
    // setExestQty(newValue && newValue.qty);
    setSearchQuery1(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearch1(newValue); // ارسال درخواست جستجو به سرور
  };
    const handleInputChangeD = (newValue) => {
    // setExestQty(newValue && newValue.qty);
    setSearchQueryD(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearchD(newValue); // ارسال درخواست جستجو به سرور
  };
    const handleInputChangeT = (newValue) => {

    // setExestQty(newValue && newValue.qty);
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
    
          // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
          const isoString = date.toISOString(); // This gives you the ISO string in UTC
          // setIsoDate(isoString);
        //   setDate_start(isoString);
        setForm({
            ...form,
            s_date: isoString,
        });
          // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
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
      
            // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
            const isoString = date.toISOString(); // This gives you the ISO string in UTC
            // setIsoDate(isoString);
            // setDate_end(isoString);
            setForm({
                ...form,
                e_date: isoString,
            });
            // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
          }
        };
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
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
    
        // if (!Exesting) {
      // if (query.length < 1) {
      //   // برای جلوگیری از ارسال درخواست بیش از حد، درخواست فقط اگر ورودی بیشتر از 2 حرف باشد ارسال شود
      //   setOptions([]);
      //   return;
      // }
      // try {
        // setOptions(customers);

        // const response = await axios.get(
        //   `${Source.getAddress()}/api/customers`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("access")}`,
        //     },
        //     params: { query: query }, // ارسال پارامتر جستجو به سرور
        //   }
        // );
        // //   console.log(query);
        // const data = response.data;
        // // تبدیل داده‌ها به فرمت مناسب برای react-select
        // let formattedOptions = data;
        // setOptions(customers);
        // if (formattedOptions.length() === 0) {
          if (query) {
            setForm({
              ...form,
              c_name: query,
              c_id:0
            });
            setSelectedOption({ id: 0, name: query });
          }
        // }
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // } finally {
      // }
    // }
  };
const handleInputChange = (newValue) => {
    setSearchQuery(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearch(newValue); // ارسال درخواست جستجو به سرور
  };
  const SubmitEvent = (e) => {
    if (!(selectedOption?.name?.length >1)) {
    showAlert({
      position: "top-end",
      icon: "error",
      title: <FormattedMessage id="Please select write customer name!" />,
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
    let customer=selectedOption;
    let tailor=selectedOptionT;
    let item_t=selectedOption1;
    if(shoppingCart.length!==0)
    { form.arr=shoppingCart;}
      form.money_id=1;
      form.total_f_p=totalAmount;
      form.user_id=localStorage.getItem("userTokenid");
      axios
        .post(Source.getAddress() + "/api/fabricsbill", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          let add=form;
          add.id=res.data.id;
          add.c_id=res.data.c_id;
          add.d_id=res.data.d_id;
          add.sells=shoppingCart;
          if(selectedOptionD?.id===0||!selectedOptionD){
            add.design=res.data.design;
            setDesignTailor([...DesignTailor,add.design]);
          }else if(selectedOptionD?.id===0){
            add.design=selectedOptionD;
            setDesignTailor([...DesignTailor,selectedOptionD]);
          }
          add.tailor=selectedOptionT;
          add.account=selectedOption;
          add.user={name:localStorage.getItem("userToken")};
          add.tailor_id=res.data.t_id;
          if(e){
            generateTailorInvoicePDF(add);
          }else{
            const pendingMessages = {
  da: {
  title: "📌 پیام از خیاطی",
  greeting: `سلام ${selectedOption.name} گرامی! 👋`,
  total: `💎 مجموع مبلغ: ${form.t_amount||0} افغانی`,
  paid: `✅ مبلغ پرداخت‌شده: ${form.p_amount||0} افغانی`,
  remaining: `⏳ مبلغ باقیمانده: ${form.d_amount||0} افغانی`,
  dates: `📅 تاریخ آغاز: ${form.s_date || '-'}\n📅 تاریخ سپردن لباس: ${form.e_date || '-'}`,
  status: "⏳ فرمایش شما در نوبت آماده‌سازی قرار دارد. روند دوخت به زودی آغاز می‌گردد.",
  thanks: "🙏 سپاس‌گزاریم از اعتماد شما!"
},
  pa: {
    title: "📌 د خیاطی څخه پیام",
    greeting: `سلام ${selectedOption.name} عزیز! 👋`,
    total: `💎 ټوله پیسې: ${form.t_amount||0} افغانی`,
    paid: `✅ تادیه شوی: ${form.p_amount||0} افغانی`,
    remaining: `⏳ پاتې پیسې: ${form.d_amount||0} افغانی`,
    dates: `📅 د شروع نیټه: ${form.s_date || '-'}\n📅 د تحویل نیټه: ${form.e_date || '-'}`,
    status: "⏳ ستاسو امر په تمه کې دی. به زودی به د تیارۍ پروسه پیل شي.",
    thanks: "🙏 ستاسو د اعتماد مننه!"
  },
  en: {
    title: "📌 Message from Tailor",
    greeting: `Hello ${selectedOption.name}! 👋`,
    total: `💎 Total amount: ${form.t_amount||0} AFN`,
    paid: `✅ Paid: ${form.p_amount||0} AFN`,
    remaining: `⏳ Remaining: ${form.d_amount||0} AFN`,
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
          }
          setRecords([add, ...records]);  
          setOrders((prev)=>[add,...prev]);
          setForm({
shirt: '',
    sleeve: '',
    shoulder: '',
    collar: '',
    Belly: '',
    pant: '',
    cuff: '',
    skirt: '',
    h_patch: '',
    patch: '',
    button: '',
    description: '',
    t_amount: '',
    p_amount: '',
    d_amount: '',
    s_date: new Date().toISOString(),
    e_date: '',
    money_id: '',
    c_id: '',
    c_name:"",
    c_whatsupp:"",
    tailor_id:-1,
    tailor_name:'',
    d_name:'',
    d_id:'',
    wpant: '',
    wsleeve: '',
    neckType: '',
    sleeveType:'',
    isdelete:0,
      squareSkirt: 0,
  circleSkirt: 0,
  pocketPant: 0,
  twoPocket: 0,
  frontPocket: 0,
  cuffSleeve: 0,
    user_id:localStorage.getItem("userTokenid")});
          setSelectedOptionT(null);
          setSelectedOptionD(null);
          showAlert({
            position: "top-end",
            icon: "success",
            title: <FormattedMessage id="Your record has been added!" />,
            showConfirmButton: false,
            timer: 1000,
          });
        })
        .catch((err) => {
          console.log(err);
          // if(err){
            
          // }
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "Something went wrong!",
                    title:  <FormattedMessage id="Something went wrong!" />
            ,
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
          params: { query:searchQuery ,do:'ok',fabrics:'ok'}, // ارسال پارامتر جستجو به سرور
        });
        // setSelectedOption(response.data);
        const data = response.data;
        setOptions((pre)=>data);
        // console.log(response);
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
      setOrders(e.fabrics);
      setForm({
        ...form,
        c_id: e.id,
      });
    }
    else{
      setOrders([]);
    }
  };
    const intl = useIntl();
  const [shoppingCart, setShoppingCart] = useState([]);

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
  const itemInOptions = options1.find(item => item.id === addItem.id);
  const remainingQty = parseFloat(itemInOptions?.qty || 0) - parseFloat(addItem.qty);
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
  const existingIndex = shoppingCart.findIndex((item) => item.id === addItem.id);
  if (existingIndex !== -1) {
    const updatedCart = [...shoppingCart];
    updatedCart[existingIndex].total_price+=parseFloat(addItem.qty)*parseFloat(updatedCart[existingIndex].purchase_price);
    updatedCart[existingIndex].qty =
      parseFloat(updatedCart[existingIndex].qty) + parseFloat(addItem.qty);

    setShoppingCart(updatedCart);
  } else {
  //   const totalprice=parseFloat(itemInOptions.purchase_price||0)*(parseFloat(addItem.qty));
  // addItem.total_price=totalprice;
addItem.item_id=addItem.id;
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
  console.log("print not")
  const t_fee = parseFloat(form.t_fee) || 0;
  const t_amount = parseInt(form.t_amount) || 0;
  const p_amount = parseFloat(form.p_amount) || 0;

  const shoppingCartTotal = shoppingCart.reduce((sum, item) => {
    const itemPrice = parseFloat(item.total_price) || 0;
    return sum + itemPrice;
  }, 0);
  const calculatedTotal = (t_fee * parseInt(form.amount_cloths) ) +shoppingCartTotal;
  setTotalAmount(calculatedTotal);
  setForm(prev => ({
    ...prev,
    t_amount: calculatedTotal, // ⚠️ Consider renaming this if it’s not really “amount”
    d_amount: calculatedTotal - p_amount
  }));

}, [form.t_fee, form.t_amount, form.p_amount,form.amount_cloths,shoppingCart.length]);

   const currentLanguage = localStorage.getItem("language") || 'en';
   const handleChangeSize = (e) => {
  const { name, value } = e.target;

  // فقط اجازه دو رقم اعشار را بده
  if (!/^(\d+(\.\d{0,2})?)?$/.test(value)) return;

  setForm((prev) => ({ ...prev, [name]: value }));
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
const [orders, setOrders] = useState([]);
const handleCheckboxChange = (event) => {
  const { name, checked } = event.target;
  setForm((prev) => ({
    ...prev,
    [name]: checked ? 1 : 0,
  }));
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


  const handleChangeinput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            // padding: '1rem',
          }}
        >
        <Box  display={{ xs: 'block', sm: 'flex' ,height:'70vh'}} 
        >
          <Paper
            className="custom-scroll"
            elevation={3}
            sx={{
              flex:2,
              height:'90vh',
              padding: 3,
              borderRadius: 2,
              maxWidth: '90%',
              width: 800,
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
              margin:"1rem",
              backgroundColor: 'white'
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
                  <FormattedMessage id="sewingor" />
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
      value={
        selectedOption?.id === 0
          ? formatPhone(form.c_whatsupp)
          : formatPhone(selectedOption?.whatsup_number)
      }
      onChange={(e) => {
        const rawValue = e.target.value.replace(/\s/g, '');
        handleChange({
          target: { name: 'c_whatsupp', value: rawValue },
        });
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
    />
  </Grid>
</Grid>
              </Box>
              {/* Measurement Specifications Section */}
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
      <FormattedMessage id="Measurement Specifications" />
    </Typography>

    <Divider sx={{ mb: 3 }} />

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
            decimalScale={2}
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
            onChange={handleChangeinput}
          >
            <MenuItem value="gull_astin"><FormattedMessage id="Cuff Sleeve" /></MenuItem>
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
            onChange={handleChangeinput}
          >
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
    </FormGroup>
  </Grid>
</Grid>
  </Paper>
              {/* Additional Details Section */}
              <Box mb={3} mt={3}>
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
              <Accordion >
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
                        {/* <TextField
                          name="qty"
                          label={intl.formatMessage({ id: 'CM' })}
                          type="number"
                          fullWidth
                          size="small"
                          value={addItem?.qty}
                          onChange={handleItemChange}
                        /> */}
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
                            {shoppingCart.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{formatNumber(row.qty)}</TableCell>
                                <TableCell>{formatNumber(row.purchase_price)}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{formatNumber (row.total_price)}</TableCell>
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
              <Box mb={3} mt={3}>
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
                    // const shoppingCartTotal = Array.isArray(shoppingCart)
                    //   ? shoppingCart.reduce((sum, item) => sum + (parseInt(item.purchase_price) || 0), 0)
                    //   : 0;
                    let value: number | string = form[name] || '';
                    if (name === 'd_amount') {
                      value = t_amount - p_amount;
                    } else if (name === 't_amount') {
                      value =totalAmount;
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
                            readOnly: name === 'd_amount'|| name === 't_amount',
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
    onClick={()=>SubmitEvent(true)}
    size="large"
    sx={{
      backgroundColor: '#6d4c41', // قهوه‌ای تیره
      '&:hover': { backgroundColor: '#5d4037' },
      color: '#fff',
      fontWeight: 'bold',
      textTransform: 'none',
      borderRadius: '8px',
      padding: '0.6rem 2rem',
      marginX:'0.5rem',
    }}
  >
    <FormattedMessage id="Print And Save" />
  </Button>

  {/* دکمه ارسال */}
  <Button
    variant="contained"
    onClick={()=>SubmitEvent(false)}
    // type="submit"
    size="large"
    sx={{
      backgroundColor: '#1976d2', // آبی رسمی
      '&:hover': { backgroundColor: '#1565c0' },
      color: '#fff',
      fontWeight: 'bold',
      textTransform: 'none',
      borderRadius: '8px',
      padding: '0.6rem 2rem',
      marginX:'0.5rem',

    }}
  >
    <FormattedMessage id="Submit" />
  </Button>

  {/* دکمه لغو */}
  <Button
    variant="contained"
    onClick={close}
    size="large"
    sx={{
      backgroundColor: '#f44336', // قرمز هشدار
      '&:hover': { backgroundColor: '#d32f2f' },
      color: '#fff',
      fontWeight: 'bold',
      textTransform: 'none',
      borderRadius: '8px',
      padding: '0.6rem 2rem',
      marginX:'0.5rem',
    }}
  >
    <FormattedMessage id="Cancel" />
  </Button>

              </Box>
            </form>
          </Paper>
          {/* <Box sx={{ }}> */}
   <Paper className="custom-scroll"
  elevation={3}
  sx={{
    flex: 1,
    margin: "1rem",
    padding: 3,
    borderRadius: 2,
    maxWidth: '90%',
    width: "65%",
    height: '90vh',
    backgroundColor: 'white',
    width: {
    xs: '100%',
    md: '80%'
  },
  }}>

  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
      maxHeight: {
    xs: '40vh',
    md: '60vh'
  },
  }}>
    <Typography variant="h6" component="div">
      <FormattedMessage id="orderListTitle" />
    </Typography>
  </Box>
  <TableContainer
    sx={{
      maxHeight: '60vh',
      overflowY: 'auto',
      overflow: 'auto',
    }}>
    <Table size="small" stickyHeader>
  <TableHead>
    <TableRow>
      <TableCell><FormattedMessage id="totalAmount" /></TableCell>
      <TableCell><FormattedMessage id="paidAmount" /></TableCell>
      <TableCell><FormattedMessage id="remaintAmount" /></TableCell>
      <TableCell><FormattedMessage id="date" /></TableCell>
      <TableCell><FormattedMessage id="state" /></TableCell>
      <TableCell><FormattedMessage id="use" /></TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {orders.map((order) => {
      let label, bgColor, textColor;
      if (order.surrendered === 1) {
        label = <FormattedMessage id="status.surrendered" />;
        bgColor = "#4caf50"; // سبز
        textColor = "#fff";
      } else if (order.complete === 1) {
        label = <FormattedMessage id="status.complete" />;
        bgColor = "#ff9800"; // نارنجی
        textColor = "#fff";
      } else if (order.tailor_id) {
        label = <FormattedMessage id="status.durring" />;
        bgColor = "#2196f3"; // آبی
        textColor = "#fff";
      } else {
        label = <FormattedMessage id="status.waiting" />;
        bgColor = "#BF3131"; // خاکستری
        textColor = "#fff";
      }

      return (
        <TableRow key={order.id} hover>
          <TableCell>{formatNumber(order.t_amount)}</TableCell>
          <TableCell>{formatNumber(order.p_amount)}</TableCell>
          <TableCell>{formatNumber(order.d_amount)}</TableCell>
          <TableCell>{Daterow(order.s_date)}</TableCell>
          <TableCell>
            <Chip
              label={label}
              size="small"
              sx={{
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: 500
              }}
            />
          </TableCell>
          <TableCell>
            <Button onClick={() => {
              setForm(order)
              setSelectedOptionD(order.design);
              setSelectedOptionT(order.tailor);
              }} color="primary">
              <Plus size={18} />
            </Button>
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
</Table>
  </TableContainer>
</Paper>
  </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSewingOrder;
