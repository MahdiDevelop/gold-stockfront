import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
// import Source from "../../../Source";
import Source from "../../../../Source";
import axios from "axios";
import Swal from "sweetalert2";
import { showAlert } from "../../../../warrper";
import Datepicker_Customer from "./../../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
// import Combo_stock from "./../../../forms/Combo_Customer";
import ComboBo from'./ComboBo';
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
import { useShowAlert  } from "../../../../warrper";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Plus, Trash2, X } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
export default function EditSellReturn({
  AddSellModal,
  close,
  // settings,
  records,
  setRecords,
  moneys,
  shopingcart,setshopingcart,
  // addAccountModal,
  // setAddAccountModal,
  // setcustomer,customer,
  belance,
  setbelance,
  setAddBalanceModal,
  options1,
  setOptions1,
  SoldRecords,setSoldRecords,
  bill,setbill,
  money,setmoney,
  returnbill,setreturnbill,TotalAmount, setTotalAmount,PaidAmount, setPaidAmount
}) {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  useEffect(() => {
    if (!statuss && settings?.lenght === 0) {
      dispatch(getSettings());
    }
  }, [dispatch, statuss]);
  // const { customers, errorc } = useSelector((state) => state.customers);
  const { items, errori } = useSelector((state) => state.items);
  const [selectedDay, setSelectedDay] = useState(moment());
  const { sidebars } = useSelector((state) => state.sidebars);
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOption1, setSelectedOption1] = useState();
  const [EndDate, setEndDate] = useState(moment());
  const [account, setaccount] = useState(false);
  const [update, setupdate] = useState({ id: 0, belance: 0 });
  const [selectedOptionAccount, setSelectedOptionAccount] = useState([]);
  const [ExestQty, setExestQty] = useState(0);
  const [AddItem, setAddItem] = useState({
    sell:null,
    item_id: "",
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
        item_id: e.item_id,
        stock: e,
        sell:e.id
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
  // console.log(bill);
  const Sumbit = (flag) => {
    let BillId = 0;
    // if (shopingcart.length <= 0) {
    //   showAlert({
    //     position: "top-end",
    //     icon: "error",
    //     title: "You must fill the item input!",
    //     showConfirmButton: false,
    //     timer: 1000,
    //   });
    //   return;
    // }
    let arr = [];
    shopingcart.forEach((key) => {
      arr.push({
        sell:key.sell,
        item_id: key.item_id,
        qty:parseInt(key.qty),
        weight: key.weight,
        dateInsert: key.dateInsert,
        rate: key.rate,
        user_id: key.user_id,
        sell_price: key.sell_price,
        description: key.description,
        expiry_date: key.expiry_date,
        bill_id: "",
        accounts_id: key.accounts_id,
      });
    });
    // console.log(arr);
    let add = { arr: arr ,
      _method:"put"
    };
    axios
      .post(Source.getAddress() + "/api/sellreturn/"+returnbill.id, add, {
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
          sells: shopingcart,
          bill: res.data.bill,
          money: money,
        };
        console.log(res);
        setRecords([add, ...records]);
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
  const AddtoTable = () => {
    if (!AddItem.qty) {
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "Select an item!",
                        title:  <FormattedMessage id="Select an item!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    const qty = AddItem.qty ? parseInt(AddItem.qty) : 0;
    const weight = AddItem.weight ||1;
    const sellPrice = AddItem.sell_price ? parseFloat(AddItem.sell_price) : 0;
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
        // title: "Please select an item and fill the quantity and price!",
                                          title:  <FormattedMessage id="Please select an item and fill the quantity and price!" />,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
      if (qty <= 0 || sellPrice <= 0) {
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
    const addto ={...selectedOption1,...{sell:AddItem.sell}};
    setSoldRecords((prevRecords) => 
      prevRecords.map((row) => {
    if (row.id === selectedOption1.id) {
      // console.log(row);
      const updatedQty = parseInt(row.qty, 10) - parseInt(AddItem.qty, 10);
      // console.log({ ...row, qty: updatedQty });
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

setPaidAmount((prev) => prev + qty * sellPrice*weight);
setTotalAmount((prev) => prev + qty * sellPrice*weight);
setAddItem({
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
        row.id === e.sell ? { ...row, qty: row.qty + e.qty } : row
      )
    );
    setTotalAmount((prev) => parseInt(prev) - parseInt(e.qty * e.sell_price*e.weight));
    setPaidAmount((prev) =>  parseInt(prev)  - parseInt(e.qty * e.sell_price*e.weight));
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
  const [id,setid]=useState();
  console.log(shopingcart);
  let e_id=0;
  const { formatMessage } = useIntl();
  return (
     <Dialog
          open={AddSellModal}
          onClose={close}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              height: '85vh',
              backgroundColor: '#f8f9fa',
              padding: 1,
              fontSize: '0.8rem',
              direction: localStorage.getItem("language") === "en" ? "ltr" : "rtl"
            }
          }}
        >
          {/* Header Section */}
          <DialogTitle sx={{ p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="h6"
                sx={{
                  backgroundColor: 'info.main',
                  color: 'white',
                  width: '100%',
                  textAlign: 'center',
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.9rem'
                }}
              >
                <FormattedMessage id="Return Sell" />
              </Typography>
              <IconButton onClick={close} size="small" sx={{ mt: 0 }}>
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
    
          {/* Main Content */}
          <DialogContent sx={{ p: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {/* Left Column (8 columns on desktop, 12 on mobile) */}
              <Box sx={{ width: { xs: '100%', md: '66%' } }}>
                {/* Search Bill Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>
                      <FormattedMessage id="Search Bill" />
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
                      <TextField
                        // onChange={(e) => setid(e.target.value)}
                        value={bill.id || ''}
                        type="number"
                        label={<FormattedMessage id="Bill Number" />}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 200 }}
                      />
                      <TextField
                        readOnly
                        value={bill?.temp_customer || bill?.accounts?.account?.name}
                        label={<FormattedMessage id="Customer Name" />}
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  </CardContent>
                </Card>
    
                {/* Customer Info Section */}
                <Card sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>
                      <FormattedMessage id="Customer Info" />
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        readOnly
                        value={bill?.dateInsert && date(bill?.dateInsert)}
                        label={<FormattedMessage id="Date" />}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        readOnly
                        value={bill?.total && `${bill?.total} ${bill.money?.name}`}
                        label={<FormattedMessage id="Total Amount" />}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        readOnly
                        value={bill?.PaidAmount && `${bill?.PaidAmount} ${bill.money?.name}`}
                        label={<FormattedMessage id="Paid Amount" />}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        readOnly
                        value={bill?.Remain && `${bill?.Remain} ${bill.money?.name}`}
                        label={<FormattedMessage id="Remain Amount" />}
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  </CardContent>
                </Card>
    
                {/* Item Information Section */}
                <Card sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>
                      <FormattedMessage id="Item information" />
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      alignItems: 'flex-end',
                      flexWrap: 'wrap'
                    }}>
                      {/* Item Name */}
                      <Box sx={{ flex: '2 1 180px', minWidth: 180 }}>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
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
                          sx={{ width: '100%' }}
                        />
                      </Box>
    
                      {/* Quantity */}
                      <Box sx={{ flex: '1 1 120px', minWidth: 120 }}>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          <FormattedMessage id="Quantity" />
                        </Typography>
                        <NumericFormat
                          customInput={TextField}
                          onKeyDown={handleKeyDown}
                          onValueChange={({ value }) => handleItem({ target: { name: 'qty', value } })}
                          value={AddItem.qty}
                          name="qty"
                          size="small"
                          fullWidth
                          thousandSeparator
                        />
                      </Box>
    
                      {/* Sell Price */}
                      <Box sx={{ flex: '1 1 120px', minWidth: 120 }}>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          <FormattedMessage id="Price" />
                        </Typography>
                        <NumericFormat
                          customInput={TextField}
                          onKeyDown={handleKeyDown}
                          onValueChange={({ value }) => handleItem({ target: { name: 'sell_price', value } })}
                          value={AddItem.sell_price}
                          name="sell_price"
                          size="small"
                          fullWidth
                          thousandSeparator
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
    
                      {/* Weight (if gold) */}
                      {sidebars[0]?.type === 'gold' && (
                        <Box sx={{ flex: '1 1 120px', minWidth: 120 }}>
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            <FormattedMessage id="weight" />
                          </Typography>
                          <NumericFormat
                            customInput={TextField}
                            onKeyDown={handleKeyDown}
                            thousandSeparator
                            decimalSeparator="."
                            decimalScale={3}
                            onValueChange={({ value }) => handleItem({ target: { name: 'weight', value } })}
                            value={AddItem.weight}
                            name="weight"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                                  g
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      )}
    
                      {/* Description */}
                      <Box sx={{ flex: '2 1 200px', minWidth: 180 }}>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          <FormattedMessage id="Description" />
                        </Typography>
                        <TextField
                          name="description"
                          multiline
                          minRows={1}
                          size="small"
                          fullWidth
                          value={AddItem.description}
                          onChange={handleItem}
                        />
                      </Box>
    
                      {/* Add Button */}
                      <Button
                        onClick={AddtoTable}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Plus size={16} />}
                        sx={{ height: 40, minWidth: 100 }}
                      >
                        <FormattedMessage id="Add" />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
    
              {/* Right Column (4 columns on desktop, 12 on mobile) */}
              <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                {/* Item Sold Table */}
                <Card sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
                  <CardContent sx={{ p: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: 'info.main',
                        color: 'white',
                        textAlign: 'center',
                        py: 1,
                        borderRadius: 1,
                        fontSize: '0.85rem',
                        mb: 1
                      }}
                    >
                      <FormattedMessage id="Item Sold" />
                    </Typography>
                    <TableContainer>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '30%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Name" />
                            </TableCell>
                            <TableCell sx={{ width: '20%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Quantity" />
                            </TableCell>
                                             {sidebars[0].type==='gold' && <TableCell sx={{ width: "10%" }}><FormattedMessage id="weight" /></TableCell>}
                            <TableCell sx={{ width: '25%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Price" />
                            </TableCell>
                            <TableCell sx={{ width: '25%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Description" />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {SoldRecords?.map((row, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.stock.name}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.qty}</TableCell>
                                                  {sidebars[0].type==='gold'&&< TableCell>{row.weight}</TableCell>}
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.sell_price}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
    
                {/* Return Amounts */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <NumericFormat
                      customInput={TextField}
                      value={TotalAmount}
                      label={<FormattedMessage id="Total Return Amount" />}
                      size="small"
                      fullWidth
                      thousandSeparator
                      readOnly
                      sx={{ mb: 2 }}
                    />
                    <NumericFormat
                      customInput={TextField}
                      value={PaidAmount}
                      onChange={handlepaid}
                      label={<FormattedMessage id="Paid Return Amount" />}
                      size="small"
                      fullWidth
                      thousandSeparator
                      readOnly={!Exesting}
                      sx={{ mb: 2 }}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </DialogContent>
    
          {/* Footer Section */}
          <Box sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {/* Return Item Sold Table */}
              <Box sx={{ width: { xs: '100%', md: '66%' } }}>
                <Card sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <CardContent sx={{ p: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: 'info.main',
                        color: 'white',
                        textAlign: 'center',
                        py: 1,
                        borderRadius: 1,
                        fontSize: '0.85rem',
                        mb: 1
                      }}
                    >
                      <FormattedMessage id="Return Item Sold" />
                    </Typography>
                    <TableContainer>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '5%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="No" />
                            </TableCell>
                            <TableCell sx={{ width: '20%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Name" />
                            </TableCell>
                            <TableCell sx={{ width: '15%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Quantity" />
                            </TableCell>
                            {sidebars[0]?.type === 'gold' && (
                              <TableCell sx={{ width: '10%', fontSize: '0.8rem' }}>
                                <FormattedMessage id="weight" />
                              </TableCell>
                            )}
                            <TableCell sx={{ width: '15%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Price" />
                            </TableCell>
                            <TableCell sx={{ width: '15%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Total" />
                            </TableCell>
                            <TableCell sx={{ width: '20%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Description" />
                            </TableCell>
                            <TableCell sx={{ width: '10%', fontSize: '0.8rem' }}>
                              <FormattedMessage id="Delete" />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {shopingcart?.map((row, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.e_id}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.stock.name}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.qty}</TableCell>
                              {sidebars[0]?.type === 'gold' && (
                                <TableCell sx={{ fontSize: '0.8rem' }}>{row.weight}</TableCell>
                              )}
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.sell_price}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.sell_price * row.qty}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.description}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => Deleteshopingcart(row)}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
    
              {/* Remain Amount and Actions */}
              <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <NumericFormat
                      customInput={TextField}
                      value={update.belance}
                      label={<FormattedMessage id="Remain Return Amount" />}
                      size="small"
                      fullWidth
                      thousandSeparator
                      readOnly
                      sx={{ mb: 2 }}
                    />
                    <Datepicker_Customer
                              default_value={EndDate}
                              handle_date={handle_date}
                              lebal={<FormattedMessage id="Date" />}
                              setSelectedDay={setSelectedDay}
                              selectedDay={selectedDay}
                            />
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={close}
                        sx={{ width: 100, fontSize: '0.8rem' }}
                      >
                        <FormattedMessage id="Cancel" />
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => Sumbit(false)}
                        sx={{ width: 100, fontSize: '0.8rem' }}
                      >
                        <FormattedMessage id="Save" />
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Box>
        </Dialog>

  );
}
