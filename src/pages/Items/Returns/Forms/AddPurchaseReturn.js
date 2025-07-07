import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
// import Source from "../../../Source";
import Source from "../../../../Source";
import axios from "axios";
import Swal from "sweetalert2";
import Datepicker_Customer from "./../../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
// import Combo_stock from "./../../../forms/Combo_Customer";
import ComboBo from'./ComboBo';
import Combo_item from "./../../../forms/Combo_Customer";
import Combo_Customer from "./../../../forms/Combo_Customer";
import { showAlert } from "../../../../warrper";
import ComboBox from "./../../../forms/ComboBox";
import Trash from "./../../../../assets/icon/trash.png";
import Print from "./../../../../assets/icon/print.png";
import Add from "./../../../../assets/icon/add.png";
import jsPDF from "jspdf";
import { useSelector, useDispatch } from "react-redux";
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
import { NumericFormat } from 'react-number-format';
// import { getBelances } from "../../Redux/belanceSlice";
// import { getMoneys } from "../../Redux/moneysSlice";
// import { getCustomers } from "../../Redux/customerSlice";
// import { getReports } from "../../Redux/reportSlice";
// import { getItems } from "../../Redux/itemSlice";
// import { useSelector, useDispatch } from 'react-redux';
// import { addCustomerToCache } from "../../Redux/customerSlice";
// import { updateBelanceInCache } from "../../Redux/belanceSlice";
// import { updateStockInCache } from "../../Redux/stockSlice";
// import AddAddress from "../../../assets/icon/address.png";
import { getSettings } from "./../../../Redux/settingSlice";
// import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../../../warrper";
import { FormattedMessage,useIntl } from "react-intl";

export default function AddPurchaseReturn({
  AddSellModal,
  close,
  records,
  setRecords,
  moneys,
  belance,
  setbelance,
  setAddBalanceModal,
  options1,
  setOptions1,
}) {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const { sidebars } = useSelector((state) => state.sidebars);

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
    purchase:null,
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

  const [shopingcart, setshopingcart] = useState([]);
  const [TotalAmount, setTotalAmount] = useState(0);

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
    // console.log(e);
    if (e) {
      setAddItem({
        ...AddItem,
        stocks_id: e.stocks_id,
        stock: e,
        purchase:e.id
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
    // console.log(add);
    let BillId = 0;
    // console.log(selectedOption||
    //   shopingcart.length<=0);
    // if (!Exesting && update.belance != 0) {
    //   showAlert({
    //     position: "top-end",
    //     icon: "error",
    //     title: "You don't have enough belance!",
    //     showConfirmButton: false,
    //     timer: 1000,
    //   });
    //   return;
    // }
    if (shopingcart.length <= 0) {
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "You must fill the item input!",
                title:  <FormattedMessage id="Select an item!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    let arr = [];
    // console.log(shopingcart);
    shopingcart.forEach((key) => {
      // dispatch(updateItemInCache(key.item));
      arr.push({
        purchase:key.purchase,
        stocks_id: key.stocks_id,
        qty: key.qty,
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

    let add = { arr: arr };
    console.log(add);
    axios
      .post(Source.getAddress() + "/api/purchasereturn", add, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          bill_prev:id,
          Exesting: bill?.accounts_id ? "ok" : "no",
          money: bill?.money_id || 0,
          accounts_id: bill.accounts?.account_id,
          PaidAmount: PaidAmount ? PaidAmount : 0,
          TotalAmount: TotalAmount,
          CustomerName: bill.temp_customer,
          DateInsert: selectedDay,
          bill_id:bill.id,
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
          purchase: shopingcart,
          bill: res.data.bill,
          money: money,
        };
        console.log(add);
        setRecords([add, ...records]);
        setSelectedDay(moment());
        setSelectedOption({ name: "" });
        setSelectedOption1({ name: "", type: { measuring: "" } });
        setEndDate(moment());
        setprimari(0);
        setAddItem({
          purchase:null,
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
        setupdate({ id: 0, belance: 0 });
        setSelectedOptionmoney({ name: "" });
        setaccount(false);
        setshopingcart([]);
        setSelectedDay(moment());
        setSelectedOption();
        setSelectedOptionmoney();
        setupdate({ id: 0, belance: 0 });
        setTotalAmount(0);
        setPaidAmount(0);
        setExestQty(0);
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Stock has been created!",
                                                      title: <FormattedMessage id="Your record has been added!" />,
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((err) => {
        console.error(err);
        showAlert({
          position: "top-end",
          icon: "error",
          // title: "Sosmething went wrong!",
                                      title:  <FormattedMessage id="You must enter the customer name!" />,
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };
  // const AddAccountModal = (name) => {
  //   let add = { name: name, user_id: localStorage.getItem("userTokenid") };
  //   axios
  //     .post(Source.getAddress() + "/api/customers", add, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access")}`,
  //       },
  //     })
  //     .then((res) => {
  //       setSelectedOption(res.data.customer);
  //       setOptions([res.data.customer, ...options]);
  //       showAlert({
  //         position: "top-end",
  //         icon: "success",
  //         title: "Customer has been created!",
  //         showConfirmButton: false,
  //         timer: 1000,
  //       });
  //       // dispatch(addCustomerToCache(res.data.customer));
  //     })
  //     .catch((err) => {
  //       showAlert({
  //         position: "top-end",
  //         icon: "error",
  //         title: "Sosmething went wrong!",
  //         showConfirmButton: false,
  //         timer: 1000,
  //       });
  //     });
  // };
  const AddtoTable = () => {
    // console.log(selectedOption1);
    // بررسی اینکه تمام فیلدهای ضروری پر شده‌اند
    if (!AddItem.qty) {
      showAlert({
        position: "top-end",
        icon: "error",
        title:  <FormattedMessage id="Select an item!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    const qty = AddItem.qty ? parseInt(AddItem.qty) : 0;
    const weight= AddItem.weight ? parseFloat(AddItem.weight) : 1;
    const sellPrice = AddItem.purchase_price ? parseInt(AddItem.purchase_price) : 0;
    // console.log(sellPrice);
    if (parseInt(selectedOption1.qty) - qty < 0) {
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "have not enuagh item!",
                title:  <FormattedMessage id="have not enuagh item!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (!qty || !sellPrice || !selectedOption1) {
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
    if (qty <= 0 || sellPrice <= 0) {
      showAlert({
        position: "top-end",
        icon: "error",
        title:  <FormattedMessage id="Quantity and price must be positive values!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    const addto ={...selectedOption1,...{purchase:AddItem.purchase}};
    setSoldRecords((prevRecords) => 
      prevRecords.map((row) => {
    if (row.id === selectedOption1.id) {
      const updatedQty = parseInt(row.qty) - parseInt(AddItem.qty);
      console.log({ ...row, qty: updatedQty });
      return { ...row, qty: updatedQty };
    }
    return row;
  })
);
addto.qty=AddItem.qty;
setshopingcart((prev) => [
  ...shopingcart,
  addto
]);
setPaidAmount((prev) => prev + qty * sellPrice * weight);
setTotalAmount((prev) => prev + qty * sellPrice* weight);
setAddItem({
  purchase:null,
  stocks_id: "",
  qty: "",
  weight: null,
  dateInsert: new Date().toISOString(),
  rate: null,
  user_id: localStorage.getItem("userTokenid"),
  purchase_price: "",
  description: "",
  sell_price: "",
  expiry_date: new Date().toISOString(),
  accounts_id: "",
  money: "",
  stock: { name: "" },
  e_id: AddItem.e_id + 1,
});
// بازنشانی selectedOption1
setSelectedOption1(null);

};
  const handleItem = (e) => {
    setAddItem({
      ...AddItem,
      [e.target.name]: e.target.value,
    });
  };

  const [options, setOptions] = useState();
  // const [options1, setOptions1] = useState(items);

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
    setSoldRecords((prev) =>
      prev.map((row) =>
        row.id === e.purchase ? { ...row, qty: row.qty + e.qty } : row
      )
    );
    setTotalAmount((prev) => prev - e.qty * e.sell_price*e.weight);
    setPaidAmount((prev) => prev - e.qty * e.sell_price*e.weight);
    setshopingcart((prev) => prev.filter((pre) => pre.e_id !== e.e_id));
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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${Source.getAddress()}/api/customers`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("access")}`,
  //           },
  //           params: { query: searchQuery, do: "ok" }, // ارسال پارامتر جستجو به سرور
  //         }
  //       );
  //       const data = response.data;
  //       setOptions(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   if (searchQuery) {
  //     if (!searchQuery || searchQuery?.length < 3) {
  //       setOptions([]);
  //       return;
  //     } else {
  //       if (Exesting) {
  //         fetchData();
  //       }
  //     }
  //   }
  // }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect
  // console.log(searchQuery);
  const [id,setid]=useState();
  const [SoldRecords,setSoldRecords]=useState([]);
  const [bill,setbill]=useState({});
  const [money,setmoney]=useState();
  const FindBill=()=>{
    if(!id){
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "Please fill the bill number!",
        title:  <FormattedMessage id="Please fill the bill number!" />,
        showConfirmButton: false,
        timer: 1000,
      });
  return;
}
  else{  axios.get(Source.getAddress()+'/api/purchase/'+id,{headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    }}).then((res)=>{
      console.log(res.data);
      // console.log(res.data.sells);
      setmoney(res.data.money);
      setbill(res.data.bill);
      setSoldRecords(res.data.purchase);
    }).catch(()=>{
      setbill([]);
      setSoldRecords([]);
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "This bill number not found!",
                                    title:  <FormattedMessage id="This bill number not found!" />,
        showConfirmButton: false,
        timer: 1000,
      });
    })}
  }
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
    fontSize: "0.8rem"
  }}
>
  {/* Header Section */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
    <Typography variant="h6" sx={{
      textAlign: 'center',
      borderRadius: 1,
      p: 0.5,
      color: 'white',
      width: '100%',
      fontSize: '0.9rem',
      bgcolor: 'info.main'
    }}>
      <FormattedMessage id="Purchase Return" />
    </Typography>
    <IconButton
      size="small"
      className="hover_btn"
      onClick={close}
      aria-label="Close"
    >
      <X size={16} />
    </IconButton>
  </Box>

  {/* Main Content */}
  <Box sx={{ p: 0.5, borderRadius: 5 }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Left Column (8 columns on desktop, 12 on mobile) */}
      <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
        {/* Search Bill Section */}
        <Paper elevation={1} sx={{ p: 1, mb: 1, borderRadius: 3, px: 2 }}>
          <Typography variant="subtitle2" sx={{ mt: 0.5, mb: 1, fontSize: '0.85rem' }}>
            <FormattedMessage id="Search Bill" />
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ width: '25%', mr: 1 }}>
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage id="Bill Number" />
              </Typography>
              <TextField
                onChange={(e) => setid(e.target.value)}
                value={id}
                type="number"
                size="small"
                fullWidth
                sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
              />
            </Box>
            
            <Button
              onClick={FindBill}
              variant="contained"
              color="success"
              size="small"
              sx={{ width: '6rem', fontSize: '0.8rem', height: '2rem', mt: 3, mx: 1 }}
            >
              <FormattedMessage id="Find Bill" />
            </Button>
            <Box sx={{ width: '25%', ml: 1 }}>
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage id="Customer Name" />
              </Typography>
              <TextField
                readOnly
                value={bill?.temp_customer || bill.accounts?.account.name}
                size="small"
                fullWidth
                sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
              />
            </Box>
          </Box>
        </Paper>
        {/* Customer Info Section */}
        <Paper elevation={1} sx={{ p: 1, mb: 1, borderRadius: 3, px: 2 }}>
          <Typography variant="subtitle2" sx={{ mt: 0.5, mb: 1, fontSize: '0.85rem' }}>
            <FormattedMessage id="Customer Info" />
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage id="Date" />
              </Typography>
              <TextField
                readOnly
                value={bill?.dateInsert && date(bill?.dateInsert)}
                size="small"
                fullWidth
                sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
              />
            </Box>
            <Box sx={{ width: '100%', mr: 1 }}>
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage id="Total Amount" />
              </Typography>
              <TextField
                readOnly
                value={bill?.total && String(bill?.total) + " " + bill.money?.name}
                size="small"
                fullWidth
                sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
              />
            </Box>
            <Box sx={{ width: '100%', mr: 1 }}>
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage id="Paid Amount" />
              </Typography>
              <TextField
                readOnly
                value={bill?.PaidAmount && bill?.PaidAmount + " " + bill.money?.name}
                size="small"
                fullWidth
                sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography fontWeight="bold" variant="body2">
                <FormattedMessage id="Remain Amount" />
              </Typography>
              <TextField
                readOnly
                value={bill?.Remain && bill?.Remain + " " + bill.money?.name}
                size="small"
                fullWidth
                sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
              />
            </Box>
          </Box>
        </Paper>
        {/* Item Information Section */}
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
          thousandSeparator
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

      {/* Right Column (4 columns on desktop, 12 on mobile) */}
      <Box sx={{ width: { xs: '100%', md: '33.33%' }, ml: { md: 1 } }}>
        <Box sx={{ m: 0.5, mt: 0, maxHeight: '200px', overflow: 'auto', height: '200px' }}>
          <Typography variant="subtitle1" sx={{
            textAlign: 'center',
            borderRadius: 1,
            p: 0.5,
            color: 'white',
            mb: 0.5,
            fontSize: '0.85rem',
            bgcolor: 'info.main'
          }}>
            <FormattedMessage id="Item Sold" />
          </Typography>
          <Table size="small" sx={{ fontSize: '0.8rem' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '30%' }}><FormattedMessage id="Name" /></TableCell>
                <TableCell sx={{ width: '20%' }}><FormattedMessage id="Quantity" /></TableCell>
                {sidebars[0].type==='gold' && <TableCell sx={{ width: "10%" }}><FormattedMessage id="weight" /></TableCell>}
                <TableCell sx={{ width: '25%' }}><FormattedMessage id="Price" /></TableCell>
                <TableCell sx={{ width: '25%' }}><FormattedMessage id="Description" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SoldRecords?.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.stock.name}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  {sidebars[0].type==='gold'&&< TableCell>{row.weight}</TableCell>}
                  <TableCell>{row.purchase_price}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Typography fontWeight="bold" variant="body2">
          <FormattedMessage id="Total Return Amount" />
        </Typography>
        <TextField
          readOnly
          value={TotalAmount}
          size="small"
          fullWidth
          sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
        />
        <Typography fontWeight="bold" variant="body2">
          <FormattedMessage id="Paid Return Amount" />
        </Typography>
        <TextField
          readOnly={!Exesting}
          onChange={handlepaid}
          value={PaidAmount}
          size="small"
          fullWidth
          sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
        />
        <Typography fontWeight="bold" variant="body2">
          <FormattedMessage id="Remain Return Amount" />
        </Typography>
        <TextField
          readOnly
          value={update.belance}
          type="number"
          size="small"
          fullWidth
          sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
        />
      </Box>
    </Box>
  </Box>

  {/* Footer Section */}
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, m: 0, p: 0 }}>
    <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
      <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
        <Typography variant="subtitle1" sx={{
          textAlign: 'center',
          borderRadius: 1,
          p: 0.5,
          color: 'white',
          mb: 0.5,
          fontSize: '0.85rem',
          bgcolor: 'info.main'
        }}>
          <FormattedMessage id="Return Item Sold" />
        </Typography>
        <Table size="small" sx={{ fontSize: '0.8rem' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}><FormattedMessage id="No" /></TableCell>
              <TableCell sx={{ width: '20%' }}><FormattedMessage id="Name" /></TableCell>
              <TableCell sx={{ width: '15%' }}><FormattedMessage id="Quantity" /></TableCell>
              {sidebars[0].type==='gold' && <TableCell sx={{ width: "10%" }}><FormattedMessage id="weight" /></TableCell>}
              <TableCell sx={{ width: '15%' }}><FormattedMessage id="Price" /></TableCell>
              <TableCell sx={{ width: '15%' }}><FormattedMessage id="Total" /></TableCell>
              <TableCell sx={{ width: '20%' }}><FormattedMessage id="Description" /></TableCell>
              <TableCell sx={{ width: '10%' }}><FormattedMessage id="Delete" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopingcart?.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.e_id}</TableCell>
                <TableCell>{row.stock.name}</TableCell>
                <TableCell>{row.qty}</TableCell>
                {sidebars[0].type==='gold'&&< TableCell>{row.weight}</TableCell>}
                <TableCell>{row.purchase_price}</TableCell>
                <TableCell>{row.purchase_price * row.qty}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => Deleteshopingcart(row)}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', mt: 1 }}>
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ width: '120px', fontSize: '0.8rem', py: 0.5, mb: 0.5, mr: { md: 0.5 }, ml: 0.5 }}
          onClick={close}
        >
          <FormattedMessage id="Cancel" />
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          sx={{ width: '120px', fontSize: '0.8rem', py: 0.5, mb: 0.5, mr: { md: 0.5 }, ml: 0.5 }}
          onClick={() => Sumbit(false)}
        >
          <FormattedMessage id="Save" />
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          sx={{ width: '120px', fontSize: '0.8rem', py: 0.5, mb: 0.5, ml: 0.5 }}
          onClick={() => Sumbit(true)}
        >
          <FormattedMessage id="Print And Save" />
        </Button>
      </Box>
    </Box>
  </Box>
</div>
  );
}
