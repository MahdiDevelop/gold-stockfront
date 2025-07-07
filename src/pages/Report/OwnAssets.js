import React, { useEffect, useRef, useState,useMemo } from "react";
import axios from "axios";
import { useShowAlert  } from "../../warrper";
import DataTable from "react-data-table-component";
import Combo_stock from "../Toiloring/Forms/Combo";
import Combo_Customer from "../forms/Combo_Customer";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat} from "react-number-format";
import jalaali from "jalaali-js";
import Datepicker_Customer from "../forms/Datepicker_customer";
import moment from "moment-jalaali";
import { FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import AddStockPic from "../../assets/icon/AddStock.png";
import transformation from'../../assets/dashboard/transformation.png'
import money from'../../assets/dashboard/money.png'
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import {
  Button,
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
  Divider,
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
import Source from '../../Source';
import { FormattedMessage,useIntl } from "react-intl";
import { motion, AnimatePresence } from 'framer-motion';
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};
export default function OwnAssets() {
  const intl= useIntl();
  const [dashboardData, setdashboardData] = useState({
          Totalassets: 0,
          cash:0,
          mainBalance: 0,
          stock: 0,
          credit: 0,
          debit:0,
          benefit:0,
          totalbenefit:0,
          otherbenefit:0,
  });
const cards = [
  {
    title: <FormattedMessage id="Total Assets" />,
    Show: "tailoring",
    group: "",
    text: dashboardData.Totalassets,
    bg: "#0077b6", // آبی درخشان
    textColor: "white",
    link: "./account",
    captions: <FormattedMessage id="Sell All" />,
  },
  {
    title: <FormattedMessage id="Debit" />,
    text: dashboardData.debit,
    group: "Transaction_Group",
    Show: "Deposite",
    bg: "#ff6f00", // نارنجی تند
    link: "./debit",
    textColor: "white",
    captions: <FormattedMessage id="Sell All" />,
  },
  {
    title: <FormattedMessage id="Credit" />,
    text: dashboardData.credit,
    group: "Transaction_Group",
    Show: "Deposite",
    bg: "#1976d2", // آبی روشن ولی تیره‌تر از قبل
    link: "./credit",
    textColor: "white",
    captions: <FormattedMessage id="Sell All" />,
  },
  {
    title: <FormattedMessage id="Main Balance" />,
    text: dashboardData.mainBalance,
    group: "Transaction_Group",
    Show: "Deposite",
    bg: "#388e3c", // سبز تیره‌تر ولی پررنگ
    link: "./credit",
    textColor: "white",
    captions: <FormattedMessage id="Sell All" />,
  },
  {
    title: <FormattedMessage id="Cash" />,
    text: dashboardData.cash,
    group: "Transaction_Group",
    Show: "Deposite",
    bg: "#fdd835", // زرد خورشیدی پررنگ
    link: "./credit",
    textColor: "white", // برای کنتراست بهتر
    captions: <FormattedMessage id="Sell All" />,
  },
  {
    title: <FormattedMessage id="Stock" />,
    text: dashboardData.stock,
    group: "Transaction_Group",
    Show: "Deposite",
    bg: "#ab47bc", // بنفش تند
    link: "./credit",
    textColor: "white",
    captions: <FormattedMessage id="Sell All" />,
  },
  {
    title: <FormattedMessage id="Benefit" />,
    text: dashboardData.benefit,
    group: "Transaction_Group",
    Show: "Deposite",
    bg: "#d81b60", // صورتی-قرمز درخشان
    link: "./credit",
    textColor: "white",
    captions: <FormattedMessage id="Sell All" />,
  },
  // {
  //   title: <FormattedMessage id="Total Benefit" />,
  //   text: dashboardData.totalbenefit,
  //   group: "Transaction_Group",
  //   Show: "Deposite",
  //   bg: "#009688", // سبز آبی اشباع
  //   link: "./credit",
  //   textColor: "white",
  //   captions: <FormattedMessage id="Sell All" />,
  // },
  // {
  //   title: <FormattedMessage id="Other Benefit" />,
  //   text: dashboardData.otherbenefit,
  //   group: "Transaction_Group",
  //   Show: "Deposite",
  //   bg: "#ef5350", // قرمز ملایم ولی پررنگ
  //   link: "./credit",
  //   textColor: "white",
  //   captions: <FormattedMessage id="Sell All" />,
  // },
];


const { sidebars,statusSidebar} = useSelector((state) => state.sidebars);
const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const [search,setsearch]=useState();
   
const currentLanguage = localStorage.getItem("language") || 'en';
  const [records, setRecords] = useState([]);
  const [item,setitem]=useState([]);
  const [AddStockModal,setAddStockModal]=useState(false);
  const [EditStockModal,setEditStockModal]=useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
const showAlert = useShowAlert(); 
const handlePerRowsChange = async (newPerPage, page) => {
  setPerPage(newPerPage);
  setCurrentPage(page);
};
const fetchData = async (page, pageSize) => {
  setLoading(true);
  try {
    const response = await axios.get(Source.getAddress() + "/api/item",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      params: {
          assets:"ok",
        page: page,
        perPage: pageSize,
        delete:0,
        stock:'true',
        search: search?.length >1 ?search : "false"
      },
    },
    );
    setdashboardData({
          ...dashboardData,
          Totalassets: response.data.Totalassets,
          cash: response.data.cash,
          mainBalance: response.data.mainBalance,
          stock: response.data.stock,
          credit: response.data.credit,
          debit:response.data.debit,
          benefit:response.data.benefit,
          totalbenefit:response.data.totalbenefit,
          otherbenefit:response.data.otherbenefit,
        });
    setRecords(response.data.data); // داده‌های صفحه جاری
    setTotalRows(response.data.data.total); // تعداد کل ردیف‌ها
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data', error);
    setLoading(false);
  }
};
const date = (d) => {

  const date = new Date(d);

  let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  let aa = ampm;
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  if (localStorage.getItem('date') === "Persian") {
    moment.locale('fa'); // تنظیم لوکال به فارسی
    aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
    formattedDate = moment(d).format('jYYYY-jMM-jDD');
  } else {
    moment.locale('en'); // تنظیم لوکال به انگلیسی
  }

  return `${formattedDate}`;
};
const handleChange = (id,e) => {
  setRecords(prevRecords =>
         prevRecords.map(record =>
           record.id === id ? { ...record, [e.target.name]: e.target.value } : record
         )
       );
    // setRecords([{ ...records, [e.target.name]: e.target.value }]);

  };
  const Update=(row)=>{
    row._method="put";
    // console.log(row);
    axios.post(Source.getAddress() + "/api/item/"+row.id,row,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    }).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      showAlert({
        type: 'error',
        message: intl.formatMessage({ id: 'Error' }),
      });
    })
  }
  const PDcolumn = [
    {
      name:               <FormattedMessage id="ID" />      ,
      selector: (row) => row.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name:               <FormattedMessage id="Photo" />      ,
      cell: (row) => (
        <img
          src={row.type.picture===null ? AddStockPic : row.type.picture
          }
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      sortable: true,
    },
    {
      name:<FormattedMessage id="Item Type" />
,
      selector: (row) => row.type.name,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name:<FormattedMessage id="Name" />
      ,
      selector: (row) => row.name,
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
          <FormattedMessage id="Date Created" />
        </strong>
      ),
      selector: (row) => date(row.date_creation),
    },

    { name: <FormattedMessage id="Quantitny" />, selector: (row) => formatNumber(row?.qty), sortable: true },
    // { name: <FormattedMessage id="Quantitny" />, selector: (row) => row.purchase_price, sortable: true },
    
    
    // {
    //     name: <strong><FormattedMessage id="Purchase Price" /></strong>,
    //     cell: (row) => (
    //       <NumericFormat
    //                     name={'sell_price'}
    //                     // label={<FormattedMessage id={'Sell Price'} />}
    //                     value={row.purchase_price}
    //                     fullWidth
    //                     size="small"
    //                     thousandSeparator=","
    //                      displayType="input"
    //                      customInput={TextField}
    //                      dir="ltr"
    //                     // onChange={handleChange}
    //                      onValueChange={(values) => {
    //                        handleChange(row.id,{ target: { name:'purchase_price', value: values.value } });
    //                      }}
    //                      type="text"
    //                      className="text-danger"
    //                     //  InputProps={{
    //                     //    startAdornment: <InputAdornment position="start">AFG</InputAdornment>,
    //                     //  }}
    //                     />
    //     ),
    //   },
// {
//   name: <strong><FormattedMessage id="Update" /></strong>,
//   cell: (row) => (
//     <button
//       onClick={() => Update(row)}
//       type="button"
//       onMouseEnter={(e) => {
//         e.currentTarget.style.backgroundColor = "#138496";
//         e.currentTarget.style.transform = "scale(1.05)";
//         e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.backgroundColor = "#17a2b8";
//         e.currentTarget.style.transform = "scale(1)";
//         e.currentTarget.style.boxShadow = "none";
//       }}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "8px",
//         padding: "6px 12px",
//         borderRadius: "12px",
//         backgroundColor: "#17a2b8", // رنگ آبی برای ویرایش
//         color: "#fff",
//         fontSize: "0.95rem",
//         fontWeight: 500,
//         border: "none",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//         transition: "all 0.3s ease",
//         cursor: "pointer",
//       }}
//     >
//       <i className="bi bi-pencil-square"></i>
//       <FormattedMessage id="update" />
//     </button>
//   ),
// }


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
  
useEffect(()=>{
  fetchData(currentPage,perPage);
},[perPage,currentPage,search])



const handlePageChange = page => {
  setCurrentPage(page); // برو به صفحه جدید
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

  // useEffect(() => {
  //   axios
  //     .get(Source.getAddress() + "/api/dashboard", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access")}`,
  //       },
  //       params:{
  //         assets:"ok"
  //       }
  //     })
  //     .then((res) => {
        // setdashboardData({
        //   ...dashboardData,
        //   belance: res.data.belance,
        //   sell: res.data.sell,
        //   purchase: res.data.purchase,
        //   transaction: res.data.transaction,
        //   transformations: res.data.transformation,
        //   money:res.data.money,
        //   stock:res.data.stock,
        //   debit:res.data.debit,
        //   credit:res.data.credit,
        //   expense:res.data.expense,
        // });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   // if ( statuss === null) {
  //   //   dispatch(getSettings());
  //   // }
  //   // if (tailors.length===0) {
  //   //   dispatch(getTailors());
  //   //   }
  //   // if (statusu ===null) {
  //   //   dispatch(getUsers());
  //   //   }
  //   //   if(statusSidebar===null){
  //   //     dispatch(getSidebars());
  //   // }

  // }, []);


  return (
     <Paper
                className="custom-scroll"
                elevation={3}
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  maxWidth: '100%',
                  width:2300,
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  margin: 'auto',
                  backgroundColor: 'transparent',
                }}
              >
                <div className="d-flex justify-content-end">
                 <h1
                           className="text-center rounded p-1 w-50 text-light mb-3 mx-auto"
                           style={{ backgroundColor: "var(--bs-info)", width: "100%" ,fontSize:'1.8rem'}}
                         >
                           {/* <FormattedMessage id="Edit" />{" "} */}
                           <FormattedMessage id="Owne Assets" />
                         </h1>
                </div>
               
               
                <form dir={currentLanguage === 'en' ? 'ltr' : 'rtl'} >
                  {/* Dependent Information Section */}
                  {/* Measurement Specifications Section */}
                  {/* Additional Details Section */}
                  <div
                            className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
                            style={{ borderTop: "5px solid #4a5cf2" }}
                      dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
                          >
                            {/* <div className="d-flex w-100 h-100 m-auto justify-content-between"> */}
                              <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Stock" /></h2>
                            {/* </div> */}
                          </div>
          <DataTable
          // title="Customers"
          localization={localization} // ارسال ترجمه‌ها      

          columns={columns}
          data={records}
          // onRowClicked={handleRowClick}
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
                fontWeight:'bolder',
                display: 'flex',
                minWidth: '10px', // تنظیم اندازه عنوان‌ها
                maxWidth: '10px',
                width: '10px',
                margin: '0px',
              },
            },
            cells: {
              style: {
                fontWeight:'bold',
                minWidth: '10px', // تنظیم اندازه داده‌ها
                maxWidth: '10px',
                width: '15px',
              },
            },
          }}
        />
        <div className="row g-4">
{cards.map((card, index) => {
          // console.log(sidebars);
          // console.log(index);
          // console.log(sidebars[0][card.Show]);
          // if(sidebars[0][card.Show]===0 || sidebars[0][card.group]===0){
          //   return null;
          // }
          return (
          <div className="col-md-4 col-lg-3 " key={index}>
            <div className={`card shadow-sm`} 
              style={{
                color:'white',
                backgroundColor:card.bg,
                backgroundImage: `url(${card.img})`,
                backgroundSize: '80px 45px', // اندازه دقیق تصویر
                backgroundPosition: 'center', // موقعیت تصویر
                backgroundRepeat: 'no-repeat', // جلوگیری از تکرار تصویر
                // width:""
                // border: '2px solid black', // اضافه کردن حاشیه
                // borderRadius: '10px', // گرد کردن گوشه‌ها
              }}
            >
              <div className="fw-bold fs-6 center">{card.title}</div>
              <div className={`card-body bg-gradient `}>
                <div className="d-flex mt-4" style={{justifyContent:"center"}}>
                  <p className={`card-text fs-2 ${card.textColor || ""} ${localStorage.getItem("language") === "en" ? "" : "afgFont"}`} dir="ltr">{formatNumber(parseInt(card.text))} <FormattedMessage id="AFG"/></p>
                </div>
              </div>
              {/* <div className="card-body text-center">
              </div> */}
            </div>
          </div>)
        })}
        </div>
                </form>
              </Paper>
  )
}
