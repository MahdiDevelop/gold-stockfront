import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Source from "../../../Source";
import axios from "axios";
import Datepicker_Customer from "../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Combo_stock from "../../forms/Combo_Customer";
import Combo_stockps from "../../psbox/Combo_Customer";
import Combo_Customer from "../../psbox/Combo_Customer";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../../../warrper";

// React
import { useSelector } from 'react-redux';

// MUI components
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';

import { Plus, SunDim, Trash2, X } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

export default function AddPurchase({
  settings,
  setsettings,
  AddItemModal,
  close,
  options1,
  records,
  setRecords,
  belance,
  moneys,
  setAddBalanceModal,
  
}) {
  const showAlert = useShowAlert(); 
  const { sidebars } = useSelector((state) => state.sidebars);
    const { formatMessage } = useIntl();
    const [selectedDay, setSelectedDay] = useState(moment());
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOption1, setSelectedOption1] = useState();
  const [EndDate, setEndDate] = useState(moment());
  const [account, setaccount] = useState(false);
  const [ExestQty,setExestQty] = useState(0);
  const [update, setupdate] = useState({ id: 0, belance: 0 });
  const [selectedOptionAccount, setSelectedOptionAccount] = useState([]);
  
  const [AddItem, setAddItem] = useState({
    stocks_id: "",
    qty: null,
    weight: null,
    dateInsert: new Date().toISOString(),
    rate: null,
    user_id: localStorage.getItem("userTokenid"),
    purchase_price:null,
    description: "",
    sell_price: null,
    expiry_date: new Date().toISOString(),
    accounts_id: "",
    money: "",
    stock: { name: "" },
    e_id: 1,
  });
  const [shopingcart, setshopingcart] = useState([]);
  const [TotalAmount, setTotalAmount] = useState(0);


  const Onsearch = (e) => {
    if (e) {
      setupdate({
        ...update,
        id: e.id,
      });
      setAddItem({
        ...AddItem,
        money: e.type_id,
      });
    }
  };
  const algorithm = (e) => {
    if (e) {
      setAddItem({
        ...AddItem,
        accounts_id: e.id,
      });
    }
  };
  const algorithm1 = (e) => {
    setSelectedOption1(e);
    if (e) {
      setAddItem({
        ...AddItem,
        stocks_id: e.id,
        stock: e,
      });
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
      setAddItem({
        ...AddItem,
        dateInsert: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
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
    if (localStorage.getItem("date") === "Persian") {
      moment.locale("fa"); // تنظیم لوکال به فارسی
      aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
      formattedDate = moment(d).format("jYYYY-jMM-jDD");
    } else {
      moment.locale("en"); // تنظیم لوکال به انگلیسی
    }

    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };

  const capitalizeWords = (text) => {
    return text
      .toLowerCase() // همه حروف را کوچک کنید
      .split(" ") // متن را به آرایه‌ای از کلمات تقسیم کنید
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // حروف اول هر کلمه را بزرگ کنید
      .join(" "); // کلمات را به هم وصل کنید
  };

  const generateInvoicePDF = (id) => {
    // Function to format date (with Persian date support)
    const dateObj = new Date(selectedDay);
    let formattedDate = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
    ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let aa = ampm;

    if (settings[0].date === "Persian") {
        moment.locale("fa");
        formattedDate = moment(selectedDay).format("jYYYY/jMM/jDD");
    } else {
        moment.locale("en");
    }
    formattedDate = `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;

    // Get the company image URL
    const imageUrl = settings[0]?.company_pic;
    let imageSrc = "";
    if (imageUrl) {
        const fileName = imageUrl.split("/").pop();
        imageSrc = Source.getAddress() + "/api/getImage/" + fileName;
    }

    // Generate the HTML content
    const invoiceHTML = `
    <html>
        <head>
            <title>Invoice</title>
            <style>
                body {
                    font-family: Helvetica, sans-serif;
                    font-size: 12px;
                }

                .invoice-container {
                    width: 210mm;
                    height: auto;
                    padding: 10mm;
                    box-sizing: border-box;
                    background: #fff;
                }

                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .invoice-details {
                    margin-bottom: 15px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #000;
                }

                th,
                td {
                    border: 1px solid #000;
                    padding: 5px;
                    text-align: left;
                }

                th {
                    background-color: rgb(11, 105, 255);
                    color: #fff;
                    font-size: 12px;
                }

                td {
                    font-size: 12px;
                    color: #000;
                }

                .amount-details {
                    text-align: right;
                    margin-bottom: 20px;
                }

                .footer {
                    text-align: center;
                }

                .logo {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 30mm;
                }

                .even-row {
                    background-color: #f5f5f5;
                }

                .odd-row {
                    background-color: #fff;
                }
            </style>
        </head>

        <body>
            <div class="invoice-container">
                <div class="header">
                    <h1 style="font-size: 26px; font-weight: bold; color: rgb(11,105,255); margin: 0;">Invoice</h1>
                    <h2 style="font-size: 14px; margin: 5px 0; color: #000;">${settings[0].company_name}</h2>
                    </div>
                    
                    <div class="invoice-details">
                    <p style="font-size: 12px; margin: 0;">Customer Name: ${selectedOption ? capitalizeWords(selectedOption.name) : "N/A"}</p>
                    <p style="font-size: 14px; color: rgb(11,105,255); margin: 0;">Invoice Number: ${id}</p>
                    <p style="font-size: 12px; margin: 0;">Date: ${formattedDate}</p>
                </div>

                <hr style="border: 0; border-top: 1px solid #000; margin-bottom: 15px;">

                <div style="margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;" border="1" cellspacing="0" cellpadding="5">
                        <thead style="background-color: rgb(11,105,255); font-size: 12px;">
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 12px; color: #000;">
                            ${shopingcart
                                .map(
                                    (row, index) => `
                                    <tr class="${index % 2 === 0 ? 'odd-row' : 'even-row'}">
                                        <td>${index+1}</td>
                                        <td>${row.stock.name}</td>
                                        <td>${row.qty}</td>
                                        <td>${row.purchase_price} ${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}</td>
                                        <td>${row.purchase_price * row.qty} ${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}</td>
                                    </tr>
                                `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>

                <div class="amount-details">
                    <p style="margin: 0;">Total Amount: ${TotalAmount} ${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}</p>
                    <p style="margin: 0;">Paid Amount: ${PaidAmount ? PaidAmount : "0.00"} ${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}</p>
                    <p style="margin: 0;">Balance: ${update.belance} ${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}</p>
                </div>

                <hr style="border: 0; border-top: 1px solid #000; margin-bottom: 15px;">

                <div class="footer">
                    <p style="margin: 0;">Address: ${settings[0].address}</p>
                    <p style="margin: 0;">Phone: ${settings[0].phone}</p>
                    <p style="margin: 0;">Email: ${settings[0].email}</p>
                </div>
                 ${imageSrc ? `<img class="logo"  src="${imageSrc}" alt="Company Logo"/>` : ''}
            </div>
        </body>
    </html>
`;



    // Open a new tab/window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();

        // Wait for content to load in the new window
        printWindow.onload = () => {
            printWindow.focus(); // Focus on the new window
            printWindow.print(); // Open the print dialog
            printWindow.close(); // Close the new window
        };
    } else {
        alert('Please allow pop-ups for this website to print the invoice.');
    }
};

  const Sumbit = (flag) => {
    if (!Exesting && update.belance != 0) {
      showAlert({
        position: "top-end",
        icon: "error",
        title: "You don't have enough belance!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (!selectedOptionmoney || !selectedOption || shopingcart.length <= 0) {
      showAlert({
        position: "top-end",
        icon: "error",
        title: "You must fill the item input!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    let arr = [];
    shopingcart.forEach((key) => {
      arr.push({
        stocks_id: key.stocks_id,
        qty: key.qty,
        weight: key.weight,
        dateInsert: key.dateInsert,
        rate: key.rate,
        user_id: key.user_id,
        purchase_price: key.purchase_price,
        description: key.description,
        sell_price: 0,
        expiry_date: key.expiry_date,
        accounts_id: key.accounts_id,
      });
    });
    let add = { arr: arr };
    let selectedMoney=selectedOptionmoney;
    let selectedop=selectedOption;
    let pa = PaidAmount;
    let ta=TotalAmount;
    let sd=selectedDay;
    setSelectedOptionmoney(null);
        setshopingcart([]);
        setSelectedDay(moment());
        setSelectedOption(null);
        setupdate({ id: 0, belance: 0 });
        setTotalAmount(0);
        setPaidAmount(0);
        setExestQty(0);
    axios
      .post(Source.getAddress() + "/api/purchase", add, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          Exesting: Exesting ? "ok" : "no",
          money: selectedMoney.id || 0,
          accounts_id:selectedop ? (selectedop.id!==0 ? selectedop.id :'no') : 'no',
          PaidAmount: pa ? pa : 0,
          TotalAmount: ta,
          CustomerName: selectedop.name,
          DateInsert: sd,
        },
      })
      .then((res) => {
        console.log(res);
        let result = res.data.bill;
        if (flag) {
          generateInvoicePDF(result.id);
        }
        result["money"] = selectedMoney;
        if(Exesting){
          result['accounts']={account:selectedop};
        }
        let add = {
          purchase: shopingcart,
          bill: res.data.bill,
          money: selectedMoney,
        };
        setRecords([add, ...records]);
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
        showAlert({
          position: "top-end",
          icon: "error",
          title:  <FormattedMessage id="You must enter the customer name!" />,
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };
  const AddtoTable = () => {
    // بررسی اینکه تمام فیلدهای ضروری پر شده‌اند
    const weight = AddItem.weight;
    const qty = AddItem.qty ? parseInt(AddItem.qty) : 0;
    const purchasePrice = AddItem.purchase_price ? parseFloat(AddItem.purchase_price) : 0;
    if (!qty || !purchasePrice || !selectedOption1||!weight) {
      showAlert({
        position: "top-end",
        icon: "error",
        title:  <FormattedMessage id="Please select an item and fill the quantity and price!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    // اطمینان از مقدار مثبت برای موجودی
    if (qty <= 0 || purchasePrice <= 0) {
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "Quantity and price must be positive values!",
                  title:  <FormattedMessage id="Quantity and price must be positive values!" />,
        
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    // ایجاد نسخه کپی از AddItem و selectedOption1
    const addto = { ...AddItem, item: { ...selectedOption1 } };
    addto.item.qty = selectedOption1.qty
      ? qty + parseInt(selectedOption1.qty)
      : qty;
  
    // افزودن آیتم به سبد خرید
    setshopingcart((prev) => [...prev, addto]);
  
    // به‌روزرسانی مقادیر کل
    setTotalAmount((prev) => prev + qty * purchasePrice*weight);
    setPaidAmount((prev) => prev + qty * purchasePrice*weight);
  
    // بازنشانی مقدار AddItem
    setAddItem({
      stocks_id: "",
      qty: "",
      weight: null,
      dateInsert: new Date().toISOString(),
      rate: null,
      user_id: localStorage.getItem("userTokenid"),
      purchase_price: "",
      description: "",
      sell_price: null,
      expiry_date: new Date().toISOString(),
      accounts_id: "",
      money: "",
      stock: { name: "" },
      e_id: AddItem.e_id + 1,
    });
  
    // بازنشانی selectedOption1
    setSelectedOption1(null);
  };
  
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
  const handleItem = (e) => {
    setAddItem({
      ...AddItem,
      [e.target.name]: e.target.value,
    });
  };
  const [options, setOptions] = useState([]);
  // const [options1, setOptions1] = useState(stocks);
  const handleSearch = async (query) => {
    if (!Exesting) {
          if (query) {
            setAddItem({
              ...AddItem,
              temp_customer: query,
            });
            setSelectedOption({ id: null, name: query });
          }
    }
  };

  const handleSearch1 = async (query) => {
  };
  const handleInputChange = (newValue) => {
    setSearchQuery(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearch(newValue); // ارسال درخواست جستجو به سرور
  };
  const handleInputChange1 = (newValue) => {
    setSearchQuery1(newValue); // بروزرسانی مقدار ورودی جستجو
    handleSearch1(newValue); // ارسال درخواست جستجو به سرور
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");

  const [selectedOptionmoney, setSelectedOptionmoney] = useState({ name: "" });
  const algorithmmoney = (e) => {
    if (e) {
      setAddItem({
        ...AddItem,
        money: e.id,
      });
    }
  };

  const Deleteshopingcart = (e) => {
    setupdate({
      ...update,
      belance:update.belance - e.qty * e.sell_price
    })
    setTotalAmount((prev) => prev - e.qty * e.purchase_price*e.weight);
    setPaidAmount((prev) => prev - e.qty * e.purchase_price*e.weight);
    setshopingcart((prev) => prev.filter((pre) => pre.e_id !== e.e_id));
  };
  const buttonRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current && AddItemModal) {
        buttonRef.current.click();
      }
    }
  };
  const [PaidAmount, setPaidAmount] = useState(0);
  const handlepaid = (e) => {
    setPaidAmount(e.target.value);
  };
  useEffect(() => {
    if (!PaidAmount) {
      setupdate((prevState) => ({
        ...prevState,
        belance: -TotalAmount,
      }));
    } else {
      setupdate((prevState) => ({
        ...prevState,
        belance: PaidAmount - TotalAmount || 0,
      }));
    }

    // }
  }, [PaidAmount, TotalAmount, shopingcart]);
  const [Exesting, setExesting] = useState();
// console.log(users);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Source.getAddress()}/api/customers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: { query:searchQuery ,do:'ok'}, // ارسال پارامتر جستجو به سرور
        });
        const data = response.data;
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if(searchQuery){
      if (!searchQuery || searchQuery?.length < 3) {
        setOptions([]);
        return;
      }else{
    if (Exesting) {
        fetchData();}
      }
    }
  }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect
    return (
   <Box
      dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      sx={{
        width: "100%",
        maxWidth: 1200, // حداکثر عرض استاندارد برای فرم
        overflowX: "auto",
        overflowY: "auto",
        height: "75vh",
        bgcolor: "#f8f9fa",
        p: 2,
        borderRadius: 2,
        mx: "auto", // مرکز کردن فرم
      }}
      className={`popup transition ${account && "sellpurchase"} ${AddItemModal ? "show" : ""}`}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Typography
          variant="h6"
          align="center"
          sx={{ bgcolor: "info.main", color: "#fff", p: 1, borderRadius: 1, flexGrow: 1, fontSize: "1.1rem" }}
        >
          <FormattedMessage id="Add Purchase" />
        </Typography>
        <IconButton onClick={close} aria-label="Close" sx={{ ml: 2 }}>
          <X size={24} />
        </IconButton>
      </Box>

      {/* Customer Info Section */}
      <Box boxShadow={2} p={2} borderRadius={2} mb={3}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          <FormattedMessage id="Customer Info" />
        </Typography>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={3}
          alignItems="center"
          flexWrap="wrap"
        >
          {/* Exesting Switch */}
          <FormControlLabel
            control={<Switch checked={Exesting} onChange={(e) => setExesting(e.target.checked)} />}
            label={<FormattedMessage id="Exesting" />}
            sx={{ minWidth: 120 }}
          />

          {/* Customer Name Dropdown */}
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Typography component="label" fontWeight="bold" fontSize="0.9rem" mb={1} display="block">
              <FormattedMessage id="Customer Name" />
            </Typography>
            <Combo_stock
              name={<FormattedMessage id="Add Customer" />}
              setAddAccountModal={AddAccountModal}
              type={Exesting}
              searchQuery={searchQuery}
              handleInputChange={handleInputChange}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              options={options}
              Onsearch={algorithm}
              compactMode={true}
            />
          </Box>

          {/* Currency Dropdown */}
          <Box sx={{ flexGrow: 1, minWidth: 180 }}>
            <Typography component="label" fontWeight="bold" fontSize="0.9rem" mb={1} display="block">
              <FormattedMessage id="Currency" />
            </Typography>
            <Combo_Customer
            notCurrency={false}
              isEditable={account}
              setSelectedOption={setSelectedOptionmoney}
              selectedOption={selectedOptionmoney}
              options={moneys}
              Onsearch={algorithmmoney}
              compactMode={true}
            />
          </Box>
          {/* Datepicker */}
          <Box sx={{ minWidth: 180 }}>
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date}
              lebal={<FormattedMessage id="Date" />}
              setSelectedDay={setSelectedDay}
              selectedDay={selectedDay}
              compactMode={true}
            />
          </Box>
        </Box>
      </Box>
      {/* Item Info Section */}
<Box
  display="flex"
  flexDirection={{ xs: "column", md: "row" }}
  gap={2}
  alignItems="flex-end"
  flexWrap="wrap"
  sx={{
    p: 2,
    backgroundColor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1
  }}
>
  {/* Item Name */}
  <Box sx={{ minWidth: 240, flexGrow: 1 }}>
    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
      <FormattedMessage id="Item Name" />
    </Typography>
    <Combo_stockps
      searchQuery={searchQuery1}
      setSearchQuery={setSearchQuery1}
      handleInputChange={handleInputChange1}
      handleSearch={handleSearch1}
      setSelectedOption={algorithm1}
      selectedOption={selectedOption1}
      options={options1}
      compactMode={true}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 40
        }
      }}
    />
  </Box>

  {/* Quantity */}
  <Box sx={{ width: 120 }}>
    <NumericFormat
      onKeyDown={handleKeyDown}
      onValueChange={(values) => {
        handleItem({ target: { name: "qty", value: values.value } });
      }}
      value={AddItem.qty}
      customInput={TextField}
      label={<FormattedMessage id="Quantity" />}
      size="small"
      fullWidth
      thousandSeparator
      allowNegative={false}
      decimalScale={0}
      InputProps={{
        sx: { height: 40 }
      }}
    />
  </Box>

  {/* Weight (Gold only) */}
  {sidebars[0].type === "gold" && (
    <Box sx={{ width: 160 }}>
      <NumericFormat
        value={AddItem.weight}
        thousandSeparator=","
        decimalSeparator="."
        decimalScale={3}
        name="weight"
        onValueChange={(values) => {
          handleItem({ target: { name: "weight", value: values.value } });
        }}
        customInput={TextField}
        label={<FormattedMessage id="Weight" />}
        size="small"
        fullWidth
        allowNegative={false}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ color: "text.secondary" }}>
              Gram
            </InputAdornment>
          ),
          sx: { height: 40 }
        }}
      />
    </Box>
  )}

  {/* Purchase Price */}
  <Box sx={{ width: 140 }}>
    <NumericFormat
      onKeyDown={handleKeyDown}
      onValueChange={(values) => {
        handleItem({ target: { name: "purchase_price", value: values.value } });
      }}
      value={AddItem.purchase_price}
      customInput={TextField}
      label={<FormattedMessage id="Purchase Price" />}
      size="small"
      fullWidth
      thousandSeparator
      decimalScale={2}
      allowNegative={false}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ color: "text.secondary" }}>
            $
          </InputAdornment>
        ),
        sx: { height: 40 }
      }}
    />
  </Box>

  {/* Total Amount */}
  <Box sx={{ width: 160 }}>
    <NumericFormat
      value={AddItem.qty * AddItem.purchase_price * (AddItem.weight || 1)}
      customInput={TextField}
      label={<FormattedMessage id="Total Amount" />}
      size="small"
      fullWidth
      thousandSeparator
      decimalScale={2}
      InputProps={{ 
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start" sx={{ color: "text.secondary" }}>
            $
          </InputAdornment>
        ),
        sx: { 
          height: 40,
          backgroundColor: 'action.selected' 
        }
      }}
    />
  </Box>

  {/* Existing Quantity */}
  <Box sx={{ width: 140 }}>
    <NumericFormat
      value={selectedOption1 ? (selectedOption1.qty ? parseInt(AddItem.qty || 0) + parseInt(selectedOption1.qty) : "") : ""}
      customInput={TextField}
      label={<FormattedMessage id="Exest QTY" />}
      size="small"
      fullWidth
      thousandSeparator
      decimalScale={0}
      InputProps={{ 
        readOnly: true,
        sx: { 
          height: 40,
          backgroundColor: 'action.selected' 
        }
      }}
    />
  </Box>

  {/* Description */}
  <Box sx={{ flexGrow: 1, minWidth: 240 }}>
    <TextField
      name="description"
      multiline
      minRows={2}
      value={AddItem.description}
      onChange={handleItem}
      label={<FormattedMessage id="Description" />}
      size="small"
      fullWidth
      InputProps={{
        sx: { 
          alignItems: 'flex-start',
          height: 'auto'
        }
      }}
    />
  </Box>

  {/* Add Button */}
  <Button
    onClick={() => AddtoTable()}
    variant="contained"
    color="primary"
    size="medium"
    startIcon={<Plus size={18} />}
    sx={{ 
      height: 40,
      minWidth: 120,
      fontWeight: 'bold',
      textTransform: 'none',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none'
      }
    }}
  >
    <FormattedMessage id="Add" />
  </Button>
</Box>
      {/* Bottom Section */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
        <Box flex={2} pr={{ md: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ bgcolor: "info.main", color: "#fff", p: 1, borderRadius: 1, fontSize: "1rem", mb: 1 }}
            align="center"
          >
            <FormattedMessage id="Purchase stocks" />
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 320 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%" }}><FormattedMessage id="ID" /></TableCell>
                  <TableCell sx={{ width: "20%" }}><FormattedMessage id="Name" /></TableCell>
                  <TableCell sx={{ width: "10%" }}><FormattedMessage id="Quantity" /></TableCell>
                 {sidebars[0].type==='gold' && <TableCell sx={{ width: "10%" }}><FormattedMessage id="weight" /></TableCell>}
                  <TableCell sx={{ width: "10%" }}><FormattedMessage id="Price" /></TableCell>
                  <TableCell sx={{ width: "10%" }}><FormattedMessage id="Total" /></TableCell>
                  <TableCell sx={{ width: "30%" }}><FormattedMessage id="Description" /></TableCell>
                  <TableCell sx={{ width: "5%" }}><FormattedMessage id="Delete" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shopingcart && shopingcart.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.e_id}</TableCell>
                    <TableCell>{row.stock.name}</TableCell>
                    <TableCell>{row.qty}</TableCell>
                    {sidebars[0].type==='gold'&&< TableCell>{row.weight}</TableCell>}
                    <TableCell>{row.purchase_price}</TableCell>
                    <TableCell>{row.purchase_price * row.qty}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => Deleteshopingcart(row)}>
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box flex={1} pl={{ md: 2 }} marginTop={2}>
          <TextField
            value={TotalAmount}
            label={<FormattedMessage id="Total Amount" />}
            InputProps={{ readOnly: true }}
            size="small"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            value={PaidAmount}
            onChange={handlepaid}
            InputProps={{ readOnly: !Exesting }}
            label={<FormattedMessage id="Paid Amount" />}
            size="small"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            value={update.belance}
            InputProps={{ readOnly: true }}
            label={<FormattedMessage id="Remain Balance" />}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="outlined" color="error" size="medium" onClick={close}>
              <FormattedMessage id="Cancel" />
            </Button>
            <Button variant="contained" color="success" size="medium" onClick={() => Sumbit(false)}>
              <FormattedMessage id="Submit" />
            </Button>
            <Button variant="contained" color="success" size="medium" onClick={() => Sumbit(true)}>
              <FormattedMessage id="Print And Save" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
);
}