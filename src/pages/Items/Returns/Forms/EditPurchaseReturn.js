import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
// import Source from "../../../Source";
import { showAlert } from "../../../../warrper";
import Source from "../../../../Source";
import axios from "axios";
import Swal from "sweetalert2";
import Datepicker_Customer from "./../../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
// import Combo_stock from "./../../../forms/Combo_Customer";
import ComboBo from "./ComboBo";
import Combo_item from "./../../../forms/Combo_Customer";
import Combo_Customer from "./../../../forms/Combo_Customer";
import ComboBox from "./../../../forms/ComboBox";
import Trash from "./../../../../assets/icon/trash.png";
import Print from "./../../../../assets/icon/print.png";
import Add from "./../../../../assets/icon/add.png";
import jsPDF from "jspdf";
import { useSelector, useDispatch } from "react-redux";
import { getSettings } from "./../../../Redux/settingSlice";
import { FormattedMessage,useIntl } from "react-intl";
// import { useShowAlert  } from "../warrper";
import { useShowAlert  } from "../../../../warrper";
import { NumericFormat } from 'react-number-format';
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Plus, Trash2, X } from 'lucide-react';
export default function EditSellReturn({
  AddSellModal,
  close,
  // settings,
  records,
  setRecords,
  moneys,
  shopingcart,
  setshopingcart,
  // addAccountModal,
  // setAddAccountModal,
  // setcustomer,customer,
  belance,
  setbelance,
  setAddBalanceModal,
  options1,
  setOptions1,
  SoldRecords,
  setSoldRecords,
  bill,
  setbill,
  money,
  setmoney,
  returnbill,
  setreturnbill,
  TotalAmount,
  setTotalAmount,
  PaidAmount,
  setPaidAmount,
}) {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  // const { customers, errorc, statusc } = useSelector(
  //   (state) => state.customers
  // );
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const {sidebars} = useSelector((state) => state.sidebars);
  useEffect(() => {
    if (!statuss && settings?.lenght === 0) {
      dispatch(getSettings());
    }
  }, [dispatch, statuss]);
  // const { customers, errorc } = useSelector((state) => state.customers);
  const { items, errori } = useSelector((state) => state.items);
  const [selectedDay, setSelectedDay] = useState(moment());
  // const [selectedDay1, setSelectedDay1] = useState(moment());
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOption1, setSelectedOption1] = useState();
  const [EndDate, setEndDate] = useState(moment());
  const [account, setaccount] = useState(false);
  const [update, setupdate] = useState({ id: 0, belance: 0 });
  const [selectedOptionAccount, setSelectedOptionAccount] = useState([]);
  const [ExestQty, setExestQty] = useState(0);
  const [AddItem, setAddItem] = useState({
    purchase: null,
    stocks_id: "",
    qty: null,
    weight: null,
    dateInsert: new Date().toISOString(),
    rate: null,
    user_id: localStorage.getItem("userTokenid"),
    purchase_price: null,
    description: "",
    sell_price: null,
    expiry_date: new Date().toISOString(),
    accounts_id: "",
    money: "",
    stock: { name: "" },
    e_id: 1,
  });

  const [primari, setprimari] = useState(0);

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
        stocks_id: e.stocks_id,
        stock: e,
        purchase: e.id,
        // id:e.id
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
    if (settings[0].date === "Persian") {
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // حروف اول هر کلمه را بزرگ کنید
      .join(" "); // کلمات را به هم وصل کنید
  };
  const generateInvoicePDF = (id) => {
    const doc = new jsPDF();

    // Title Section
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 105, 255); // Blue color for title
    doc.text("Invoice", 105, 10, null, null, "center");

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black color for text
    doc.text(`${settings[0].company_name}`, 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(
      `Seller Name: ${
        selectedOption ? capitalizeWords(selectedOption.name) : "N/A"
      }`,
      105,
      28,
      null,
      null,
      "center"
    );

    // Invoice Details Section
    doc.setFontSize(14);
    doc.setTextColor(11, 105, 255); // Blue color for the section heading
    doc.text(`Invoice Number: ${id}`, 5, 19);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color for text

    const date = new Date(selectedDay);
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
      aa = hours >= 12 ? "pm" : "am";
      formattedDate = moment(selectedDay).format("jYYYY/jMM/jDD");
    } else {
      moment.locale("en"); // تنظیم لوکال به انگلیسی
    }
    const fromdata = `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
    // return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
    // doc.text(`Date: ${selectedDay ? date(selectedDay) : 'N/A'}`, 5, 29);
    doc.text(`Date:${fromdata}`, 5, 29);

    // Draw Horizontal Line
    doc.setDrawColor(0, 0, 0); // Black color for line
    doc.setLineWidth(0.5);
    doc.line(5, 35, 205, 35);

    // Company Image
    if (settings[0].company_pic) {
      const url = settings[0].company_pic;
      const fileName = url.split("/").pop();
      doc.addImage(
        Source.getAddress() + "/api/getImage/" + fileName,
        "JPEG",
        180,
        5,
        25,
        25
      );
    } else {
      doc.setFontSize(12);
      doc.text("No Company Image Available", 150, 20);
    }

    // Table with Purchase Details
    doc.autoTable({
      startY: 40,
      head: [["No", "Name", "Quantity", "Price", "Total"]],
      body: shopingcart.map((row) => [
        row.e_id,
        row.stock.name,
        row.qty,
        row.sell_price +
          `${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}`,
        row.sell_price * row.qty +
          `${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [11, 105, 255],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Footer Section Positioned Dynamically
    const finalY = doc.lastAutoTable.finalY || 40; // Ensure there's a fallback
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0); // Black color for text

    // Amount Details Section
    doc.text(
      `Total Amount: ${TotalAmount}` +
        `${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}`,
      152,
      finalY + 5
    );
    doc.text(
      `Paid Amount: ${PaidAmount ? PaidAmount : "0.00"}` +
        `${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}`,
      152,
      finalY + 10
    );
    doc.text(
      `Belance: ${update.belance}` +
        `${selectedOptionmoney ? selectedOptionmoney.name : "N/A"}`,
      152,
      finalY + 15
    );

    // Draw Horizontal Line
    if (finalY + 15 > 144) {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(5, 278, 205, 278);
      doc.text(`Address: ${settings[0].address}`, 10, 283);
      doc.text(`Phone: ${settings[0].phone}`, 80, 283);
      doc.text(`Email: ${settings[0].email}`, 140, 283);
    } else {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(5, 139, 205, 139);
      // Footer Address
      doc.setFontSize(12);
      // doc.addImage(AddAddress, 'png', 180, 5, 25, 25);
      doc.text(`Address: ${settings[0].address}`, 10, 144);
      doc.text(`Phone: ${settings[0].phone}`, 80, 144);
      doc.text(`Email: ${settings[0].email}`, 140, 144);
    }

    // Save the document as a PDF
    const pdfURL = doc.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfURL;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  };
  const Sumbit = (flag) => {
    let BillId = 0;
    let arr = [];
    shopingcart.forEach((key) => {
      arr.push({
        purchase: key.purchase,
        stocks_id: key.stocks_id,
        qty: parseInt(key.qty),
        weight: key.weight,
        dateInsert: key.dateInsert,
        rate: key.rate,
        user_id: key.user_id,
        purchase_price: key.purchase_price,
        description: key.description,
        expiry_date: key.expiry_date,
        bill_id: "",
        accounts_id: key.accounts_id,
      });
    });
    console.log(arr);
    let add = { arr: arr,
      _method:"put"
     };
    axios
      .post(Source.getAddress() + "/api/purchasereturn/" + returnbill.id, add, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          Exesting: bill?.accounts_id ? "ok" : "no",
          money: bill?.money_id || 0,
          accounts_id: bill.accounts?.account_id,
          PaidAmount: PaidAmount ? PaidAmount : 0,
          TotalAmount: TotalAmount,
          CustomerName: bill.temp_customer,
          DateInsert: selectedDay,
          bill_id: bill.id,
        },
      })
      .then((res) => {
        if (flag) {
          generateInvoicePDF(res.data.bill.id);
        }
        res.data.bill["money"] = money;
        res.data.bill["accounts"] = { account: bill?.accounts?.account };
        res.data.bill["temp_customer"] = bill.temp_customer;
        BillId = res.data.bill.id;
        let add = {
          sells: shopingcart,
          bill: res.data.bill,
          money: money,
        };
        // setRecords([add, ...records]);
        setSelectedDay(moment());
        setSelectedOption({ name: "" });
        setSelectedOption1({ name: "", type: { measuring: "" } });
        setEndDate(moment());
        setprimari(0);
        setAddItem({
          stocks_id: 0,
          qty: 0,
          weight: 0,
          dateInsert: new Date().toISOString(),
          rate: 0,
          user_id: localStorage.getItem("userTokenid"),
          purchase_price: 0,
          description: "Description",
          sell_price: 0,
          expiry_date: new Date().toISOString(),
          accounts_id: "",
        });
        setSearchQuery("");
        setSearchQuery1("");
        setSelectedOptionmoney({ name: "" });
        setaccount(false);
        setSelectedDay(moment());
        setSelectedOption();
        setSelectedOptionmoney();
        setExestQty(0);
        showAlert({
          position: "top-end",
          icon: "success",
          title: "Stock has been created!",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((err) => {
        console.error(err);
        showAlert({
          position: "top-end",
          icon: "error",
          title: "Sosmething went wrong!",
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };
  const AddtoTable = () => {
    if (!AddItem.qty) {
        showAlert({
            position: "top-end",
            icon: "error",
            title: "Select an item!",
            showConfirmButton: false,
            timer: 1000,
        });
        return;
    }

    const qty = parseInt(AddItem.qty) || 0;
    const weight = AddItem.weight || 1;
    const sellPrice = parseInt(AddItem.purchase_price) || 0;

    if (parseInt(selectedOption1.qty) - qty < 0) {
        showAlert({
            position: "top-end",
            icon: "error",
            title: "Not enough items!",
            showConfirmButton: false,
            timer: 1000,
        });
        return;
    }

    if (!qty || !sellPrice || !selectedOption1) {
        showAlert({
            position: "top-end",
            icon: "error",
            title: "Please select an item and fill the quantity and price!",
            showConfirmButton: false,
            timer: 1000,
        });
        return;
    }

    if (qty <= 0 || sellPrice <= 0) {
        showAlert({
            position: "top-end",
            icon: "error",
            title: "Quantity and price must be positive values!",
                showConfirmButton:false,
                timer :1000
              });
              return;
          }
    
          // Create new item with updated details
          const newItem = { ...selectedOption1, purchase_price : AddItem.purchase_price , qty };
    
          // Update existing sold records by reducing quantity
          setSoldRecords((prevRecords) =>
              prevRecords.map((row) => {
                  if (row.id === selectedOption1.id && row.qty >= qty ) { 
                      const updatedQty = parseInt(row.qty - qty);
                      return { ...row, qty : updatedQty };
                  }
                  return row;  
              })
           );
    
           let nextId=shopingcart.length > 0 ? shopingcart[shopingcart.length-1].id +1 :1 ;
           newItem.id=nextId;

           setshopingcart((prevItems)=> [...prevItems,newItem]);

           setPaidAmount(prevAmount=> prevAmount+qty*sellPrice*weight);
           setTotalAmount(prevTotal=> prevTotal+qty*sellPrice*weight);

         // Reset form fields after adding to cart
         setAddItem({
             stocks_id:"",
             qty:"",
             weight:null ,
             dateInsert:new Date().toISOString(),
             rate:null ,
             user_id : localStorage.getItem("userTokenid"),
             purchase_price:"",
             description:"",
             sell_price:"",
               expiry_date:new Date().toISOString(),
               accounts_id:"" ,
               money:"" ,
               stock:{name:""},
               id : null 
         });

       setSelectedOption1(null);   
};

  const handleItem = (e) => {
    setAddItem({
      ...AddItem,
      [e.target.name]: e.target.value,
    });
  };
  const [options, setOptions] = useState();
  const handleSearch = async (query) => {
    if (!Exesting) {
      if (query) {
        setAddItem({
          ...AddItem,
          temp_customer: query,
        });
        setSelectedOption({ id: 0, name: query });
      }
    }
  };
  const handleSearch1 = async (query) => {};
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
  const Deleteshopingcart = (e) => {
    setSoldRecords((prev) =>
      prev.map((row) =>
        row.id === e.purchase ? { ...row, qty: row.qty + e.qty } : row
      )
    );
    setTotalAmount((prev) => parseInt(prev) - parseInt(e.qty * e.purchase_price*e.weight));
    setPaidAmount((prev) => parseInt(prev) - parseInt(e.qty * e.purchase_price*e.weight));
    setshopingcart((prev) => prev.filter((pre) => pre.id !== e.id));
  };
  const buttonRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current && AddSellModal) {
        buttonRef.current.click();
      }
    }
  };
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
  const [id, setid] = useState();
  // console.log(shopingcart[shopingcart.length - 1]);
  let e_id = 0;
        const { formatMessage } = useIntl();
  return (
   <div
  dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
  className={`container rounded-5 popup transition ${account && "sellpurchase"} ${AddSellModal ? "show" : ""}`}
  style={{
    width: "95%",
    maxWidth: "95%",
    height: "85vh",
    backgroundColor: "#f8f9fa",
    padding: "5px",
    fontSize: "0.8rem",
    overflowY: "auto"
  }}
>
  {/* Header */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
    <Typography variant="h6" sx={{
      textAlign: 'center', borderRadius: 1, p: 0.5, color: 'white',
      width: '100%', fontSize: '0.9rem', bgcolor: 'info.main'
    }}>
      <FormattedMessage id="Purchase Return" />
    </Typography>
    <IconButton size="small" className="hover_btn" onClick={close}><X size={16} /></IconButton>
  </Box>

  {/* Main */}
  <Box sx={{ p: 0.5, borderRadius: 5 }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Left Section */}
      <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
        {/* Search Bill */}
        <Paper elevation={1} sx={{ p: 1, mb: 1, borderRadius: 3, px: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>
            <FormattedMessage id="Search Bill" />
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold" variant="body2"><FormattedMessage id="Bill Number" /></Typography>
              <TextField onChange={(e) => setid(e.target.value)} value={bill.id || ''} type="number" size="small" fullWidth />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold" variant="body2"><FormattedMessage id="Customer Name" /></Typography>
              <TextField readOnly value={bill?.temp_customer || bill.accounts?.account.name} size="small" fullWidth />
            </Box>
          </Box>
        </Paper>

        {/* Customer Info */}
        <Paper elevation={1} sx={{ p: 1, mb: 1, borderRadius: 3, px: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>
            <FormattedMessage id="Customer Info" />
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[
              { label: "Date", value: bill?.dateInsert && date(bill?.dateInsert) },
              { label: "Total Amount", value: bill?.total && `${bill?.total} ${bill.money?.name}` },
              { label: "Paid Amount", value: bill?.PaidAmount && `${bill?.PaidAmount} ${bill.money?.name}` },
              { label: "Remain Amount", value: bill?.Remain && `${bill?.Remain} ${bill.money?.name}` }
            ].map((field, i) => (
              <Box key={i} sx={{ flex: "1 1 45%" }}>
                <Typography fontWeight="bold" variant="body2"><FormattedMessage id={field.label} /></Typography>
                <TextField readOnly value={field.value} size="small" fullWidth />
              </Box>
            ))}
          </Box>
        </Paper>

              <Paper elevation={1} sx={{ p: 1, mb: 0.5, borderRadius: 3, px: 2 }}>
  <Typography variant="subtitle2" sx={{ mt: 0.5, mb: 1, fontSize: '0.85rem' }}>
    <FormattedMessage id="Item information" />
  </Typography>

  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 1,
      mb: 0.5
    }}
  >
    {/* Item Name */}
    <Box sx={{ flex: '1 1 200px', minWidth: '180px' }}>
      <Typography fontWeight="bold" variant="body2">
        <FormattedMessage id="Item Name" />
      </Typography>
      <ComboBo
        searchQuery={searchQuery1}
        setSearchQuery={setSearchQuery1}
        handleInputChange={handleInputChange1}
        handleSearch={handleSearch1}
        setSelectedOption={algorithm1}
        selectedOption={selectedOption1}
        options={SoldRecords}
        compactMode={true}
      />
    </Box>

    {/* Quantity */}
    <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
      <Typography fontWeight="bold" variant="body2">
        <FormattedMessage id="Quantity" />
      </Typography>
      <NumericFormat
        customInput={TextField}
        onKeyDown={handleKeyDown}
        onValueChange={({ value }) =>
          handleItem({ target: { name: 'qty', value } })
        }
        value={AddItem.qty}
        name="qty"
        size="small"
        fullWidth
        thousandSeparator
        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
      />
    </Box>

    {/* Purchase Price */}
    <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
      <Typography fontWeight="bold" variant="body2">
        <FormattedMessage id="Purchase Price" />
      </Typography>
      <NumericFormat
        customInput={TextField}
        onKeyDown={handleKeyDown}
        onValueChange={({ value }) =>
          handleItem({ target: { name: 'purchase_price', value } })
        }
        value={AddItem.purchase_price}
        name="purchase_price"
        size="small"
        fullWidth
        thousandSeparator
        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
      />
    </Box>

    {/* Weight (if gold) */}
    {sidebars[0]?.type === 'gold' && (
      <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
        <Typography fontWeight="bold" variant="body2">
          <FormattedMessage id="weight" />
        </Typography>
        <NumericFormat
          customInput={TextField}
          onKeyDown={handleKeyDown}
          thousandSeparator={true}
                decimalSeparator="."
        decimalScale={3}
          onValueChange={({ value }) =>
            handleItem({ target: { name: 'weight', value } })
          }
          value={AddItem.weight}
          name="weight"
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
        />
      </Box>
    )}

    {/* Description */}
    <Box sx={{ flex: '2 1 200px', minWidth: '180px' }}>
      <Typography fontWeight="bold" variant="body2">
        <FormattedMessage id="Description" />
      </Typography>
      <TextField
        name="description"
        multiline
        minRows={1}
        size="small"
        fullWidth
        sx={{ fontSize: '0.8rem' }}
        value={AddItem.description}
        onChange={handleItem}
      />
    </Box>

    {/* Add Button */}
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <Button
        onClick={AddtoTable}
        variant="contained"
        color="success"
        size="small"
        sx={{
          width: '5rem',
          fontSize: '0.8rem',
          height: '2rem',
          mb: 1,
          mt: { xs: 1, sm: 4 }
        }}
      >
        <Plus size={15} />
      </Button>
    </Box>
  </Box>
</Paper>
      </Box>
      {/* Right Section */}
      <Box sx={{ width: { xs: '100%', md: '33.33%' }, ml: { md: 1 } }}>
        <Box sx={{ maxHeight: 200, overflowX: 'auto', overflowY: 'auto' }}>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white', fontSize: '0.85rem' }}>
            <FormattedMessage id="Item Sold" />
          </Typography>
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell><FormattedMessage id="Name" /></TableCell>
                <TableCell><FormattedMessage id="Quantity" /></TableCell>
                                 {sidebars[0]?.type==='gold' && <TableCell sx={{ width: "10%" }}><FormattedMessage id="weight" /></TableCell>}
                <TableCell><FormattedMessage id="Price" /></TableCell>
                <TableCell><FormattedMessage id="Description" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SoldRecords?.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.stock.name}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                                      {sidebars[0]?.type==='gold'&&< TableCell>{row.weight}</TableCell>}
                  <TableCell>{row.purchase_price}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {[["Total Return Amount", TotalAmount], ["Paid Return Amount", PaidAmount], ["Remain Return Amount", update.belance]].map(([label, value], i) => (
          <Box key={i}>
            <Typography fontWeight="bold" variant="body2"><FormattedMessage id={label} /></Typography>
            <TextField
              readOnly={label !== "Paid Return Amount" || !Exesting ? true : false}
              onChange={label === "Paid Return Amount" ? handlepaid : undefined}
              value={value}
              size="small"
              fullWidth
            />
          </Box>
        ))}
      </Box>
    </Box>
  </Box>

  {/* Footer */}
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
    <Box sx={{ width: { xs: '100%', md: '66.66%' }, maxHeight: 300, overflow: 'auto' }}>
      <Typography variant="subtitle1" sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white', fontSize: '0.85rem' }}>
        <FormattedMessage id="Return Item Sold" />
      </Typography>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell><FormattedMessage id="No" /></TableCell>
            <TableCell><FormattedMessage id="Name" /></TableCell>
            <TableCell><FormattedMessage id="Quantity" /></TableCell>
                             {sidebars[0]?.type==='gold' && <TableCell sx={{ width: "10%" }}><FormattedMessage id="weight" /></TableCell>}
            <TableCell><FormattedMessage id="Price" /></TableCell>
            <TableCell><FormattedMessage id="Total" /></TableCell>
            <TableCell><FormattedMessage id="Description" /></TableCell>
            <TableCell><FormattedMessage id="Delete" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shopingcart?.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.e_id}</TableCell>
              <TableCell>{row.stock.name}</TableCell>
              <TableCell>{row.qty}</TableCell>
                                  {sidebars[0]?.type==='gold'&&< TableCell>{row.weight}</TableCell>}
              <TableCell>{row.purchase_price}</TableCell>
              <TableCell>{row.purchase_price * row.qty}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => Deleteshopingcart(row)}>
                  <Trash2 size={15} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>

    <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
      <Box className="date-picker-container">
        <Datepicker_Customer
          default_value={EndDate}
          handle_date={handle_date}
          lebal={<FormattedMessage id="Date" />}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
          compactMode={true}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', mt: 1, gap: 1 }}>
        <Button variant="contained" color="error" size="small" sx={{ width: '120px' }} onClick={close}>
          <FormattedMessage id="Cancel" />
        </Button>
        <Button variant="contained" color="success" size="small" sx={{ width: '120px' }} onClick={() => Sumbit(false)}>
          <FormattedMessage id="Save" />
        </Button>
        <Button variant="contained" color="success" size="small" sx={{ width: '120px' }} onClick={() => Sumbit(true)}>
          <FormattedMessage id="Print And Save" />
        </Button>
      </Box>
    </Box>
  </Box>
</div>

    );
}