import axios from 'axios'
import { useState,useMemo } from 'react';
import DataTable from 'react-data-table-component';
import React, { useEffect } from 'react'
import Source from '../../Source'
import AddSell from './forms/AddSell';
import Swal from 'sweetalert2';
import moment from "moment-jalaali";
import Add_customer from '../AddAccount';
// import { useMyContext } from '../constext/UseContext';
import Add_belance from '../Add_belance';
import Trash from "../../assets/icon/trash.png";
import pencil from "../../assets/icon/pencil.png";
import EditSell from './forms/EditSell';
// import EditSell from './forms/EditSell';
// import EditPurchase from "./forms/EditPurchase";
// import { useSelector, useDispatch } from 'react-redux';
import { getCustomers } from '../Redux/customerSlice';
import { getMoneys } from '../Redux/moneysSlice';
import { getSettings } from '../Redux/settingSlice';
import { getItems } from '../Redux/itemSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getBelances } from '../Redux/belanceSlice';
import jalaali from "jalaali-js";
import ListBox from "../forms/ListBox";
import Datepicker_Customer from "../forms/Datepicker_customer";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl, } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { showAlert } from '../../warrper';
import { useShowAlert  } from "../../warrper";
export default function Sell() {
  const showAlert = useShowAlert(); 
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const [namesearch, setnameSearch] = useState();
  const [Date_Start, setDate_start] = useState();
  const [Date_End, setDate_end] = useState();
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const handle_date_start = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
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

      // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setDate_end(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handleName = (e) => {
    setnameSearch(e.target.value);
  };



  const dispatch=useDispatch();
  
  const { moneys, errorm ,statusm} = useSelector((state) => state.moneys);
  const { belances, errorb ,statusb} = useSelector((state) => state.belances);
  const { customers, errorc ,statusc} = useSelector((state) => state.customers);
  const [item,setitem]=useState([]);
  const [customer,setcustomer]=useState(customers);  
  const [belance,setbelance]=useState(belances);
  const [options,setOptions]=useState([]);
  const [records, setRecords] = useState([]);
  const [addAccountModal,setAddAccountModal]=useState(false);
  const [AddSellModal,setAddSellModal] = useState(false);
  const [AddBalanceModal,setAddBalanceModal]=useState(false);
  // show and edit 
  const [EditSellModal,setEditSellModal] = useState(false);
  const [MoneyEdit,setMoneyEdit] = useState([]);
  const [Customer,setCustomer]=useState([]);
  const [shopingcart,setShopingCart] = useState([]);
  // end
  //  const { moneys, errorm,statusm } = useSelector((state) => state.moneys);
    const { items, errori,statusi } = useSelector((state) => state.items);
    const { settings, errors,statuss } = useSelector((state) => state.settings);
    
    useEffect(() => {
      // بررسی و بارگذاری `belances`
      // if (!statusm  && moneys?.lenght===0) {
      //   dispatch(getMoneys());
      // }
    
      // // console.log(items);
      // // // بررسی و بارگذاری `moneys`
      // if (!statusi  && items?.lenght===0) {
      //   dispatch(getItems());
      // }
      if (!statuss  && settings?.lenght===0) {
        dispatch(getSettings());
      }
      // if (!statusc  && !customers) {
      //   dispatch(getCustomers());
      // }
      // if (!statusb  && belance?.lenght===0) {
      //   dispatch(getBelances());
      // }
      // // بررسی و بارگذاری `customers`
      // if (statusc === 'idle' && !customers) {
      //   dispatch(getCustomers());
      // }
    }, [dispatch, settings,statuss]);
    
    const [setting,setsettings]=useState([]);
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/settings', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     // console.log(res);
  //     setsettings(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
   
  // },[]);
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/money', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     console.log(res);
  //     setmoney(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  //  },[AddBalanceModal]);
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
  
    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه

  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress()+'/api/sell', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        params: {user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          StartDate: StartDate&& Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
          delete: 0,
          product:'sell'
        },
      });
      console.log(response);
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total);
       // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
      setLoading(false);
    }
  };

  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage,EndDate, StartDate, selecteduser,namesearch]);

  // مدیریت تغییر صفحه
  const handlePageChange = page => {
    setCurrentPage(page); // برو به صفحه جدید
  };

  const handleAdd=()=>{
    setAddAccountModal(true);  
    };
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRowDetails = (rowId) => {
      setExpandedRows((prev) =>
        prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
      );
    };
    // console.log(records);
  // const columns = [
  //   {
  //     name: "Id",
  //     selector: (row) => row.id,
  //     sortable: true,
  //     style: {
  //       width: "1px",
  //       minWidth: "1px",
  //     },
  //   },
  //   {
  //     name: "Photo",
  //     cell: (row) => (
  //       <img
  //         src={row.stock.type.picture}
  //         // alt={row.name}
  //         style={{ width: "50px", height: "50px", borderRadius: "50%" }}
  //       />
  //     ),
  //     sortable: true,
  //   },
  //   {
  //     name: "Item Type",
  //     selector: (row) => row.stock.type.name,
  //     sortable: true,
  //     style: {
  //       width: "1px",
  //       minWidth: "1px",
  //     },
  //   },
  //   {
  //     name: "Name",
  //     selector: (row) => row.stock.name,
  //     sortable: true,
  //     style: {
  //       width: "1px",
  //       minWidth: "1px",
  //     },
  //   },
  //   {
  //     name: (
  //       <strong
  //         style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
  //       >
  //         Date Created
  //       </strong>
  //     ),
  //     selector: (row) => date(row.dateInsert),
  //     style: {
  //       minWidth: "170px!important", // Adjust this value as needed
  //       maxWidth: "170px", // Adjust this value as needed
  //       margin:'0px'
  //       // Width: '600px',    // Set a specific width
  //     },
  //     // sortable: true,
  //   },
  //   { name: "Description", selector: (row) => row.description, sortable: true },
  //   { name: "Purchase Price", selector: (row) => row.purchase_price, sortable: true },
  //   { name: "Sell Price", selector: (row) => row.sell_price, sortable: true },
  //   { name: "Add By", selector: (row) => row.user.name, sortable: true },
  //   { name: "Qty", selector: (row) => row.qty, sortable: true },
  //   { name: "Rate", selector: (row) => row.rate, sortable: true },
  //   {
  //     name: <p className="mt-3">Serial Number</p>,
  //     selector: (row) => row.stock.serial_number,
  //     sortable: true,
  //     style: {
  //       width: "100px",
  //       minWidth: "100px",
  //     },
  //   }, {
  //     name: 'Actions',
  //     cell: (row) => (
  //       <button
  //         onClick={() => toggleRowDetails(row.id)}
  //         className="btn btn-outline-primary btn-sm"
  //       >
  //         {expandedRows.includes(row.id) ? 'Hide' : 'Show'}
  //       </button>
  //     ),}
  //   // { name: (<strong
  //   //   style={{
  //   //     textAlign: "center",
  //   //     backgroundColor: "tranceparent",
  //   //     width: "100%",
  //   //   }}
  //   // >
  //   //   Edit
  //   // </strong>),selector: (row) => (
  //   //   <button
  //   //     onClick={() => {
  //   //       // Edit_item(row);
  //   //       // setEdit(row);
  //   //       // setUpdate(true);
  //   //       // seTtitle('Edit Type Money');
  //   //     }}
  //   //     style={{
  //   //       border: "none",
  //   //       backgroundColor: "transparent",
  //   //       height: "100%",
  //   //     }}
  //   //   >
  //   //     <img
  //   //       height={"25%"}
  //   //       width={"25%"}
  //   //       src={pencil}
  //   //       style={{ backgroundColor: "tranceparent" }}
  //   //     />
  //   //   </button>
  //   // ) },
  //   // { name: (<strong
  //   //   style={{
  //   //     textAlign: "center",
  //   //     backgroundColor: "tranceparent",
  //   //     width: "100%",
  //   //   }}
  //   // >
  //   //   Delete
  //   // </strong>),   selector: (row) => (
  //   //   <button
  //   //     onClick={() => {
  //   //       // delete_item(row.id);
  //   //       // setEdit(row);
  //   //       // setUpdate(true);
  //   //       // seTtitle('Edit Type Money');
  //   //     }}
  //   //     style={{
  //   //       border: "none",
  //   //       backgroundColor: "transparent",
  //   //       height: "100%",
  //   //     }}
  //   //   >
  //   //     <img
  //   //       height={"20%"}
  //   //       width={"20%"}
  //   //       src={Trash}
  //   //       style={{ backgroundColor: "tranceparent" }}
  //   //     />
  //   //   </button>
  //   // ) },
  // ];
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const deleteSell = async (row) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    const result = await swalWithBootstrapButtons.fire({
     title: intl.formatMessage({id:"Are you sure?"})
              ,
              text:intl.formatMessage({id:"You won't be able to revert this!"})
              ,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: intl.formatMessage({id:"Yes, delete it!"})
              ,
              cancelButtonText: intl.formatMessage({id:"No, cancel!"})
              ,
              reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      const update = {
        money: row.money.id,
        bill: row.bill.id,
        sell: row.sells[0]?.id||row.sells[0]?.e_id, // Ensure you are passing the correct 'sell' id
        _method:"put"
      };
      try {
        const res = await axios.post(
          `${Source.getAddress()}/api/sell/${row.bill.id}`,
          update,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
            },
            params: {
              type: 'delete', // If you need additional parameters, you can add them here
              // account: row.account // Uncomment and use if necessary
            }
          }
        );
  
        Swal.fire({
                   position: "top-end",
                   icon: "error",
                   // title: "Something went wrong !",
                   title: intl.formatMessage({id:"Something went wrong!"}),
       
                   showConfirmButton: false,
                   timer: 1000,
                 });
        // Remove the deleted item from the records
        setRecords((prevRecords) => 
          prevRecords.filter((record) => record.bill.id !== row.bill.id)
        );
      } catch (err) {
        Swal.fire({
          position: "center",
          icon: "error",
          // title: "Item record not deleted",
                                            title: intl.formatMessage({id:"Something went wrong!"}),            
          showConfirmButton: false,
          timer: 600,
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
            // title: "Cancelled",
            // text: "Your imaginary file is safe :)",
            title:intl.formatMessage({id:"Cancelled"}),
            text:intl.formatMessage({id:"Your record is safe :)"}),
            icon: "error",
          });
    }
  };
      const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  
const PDcolumn = [
    {
      name:                 <FormattedMessage id="ID" />      ,
      selector: (row) => row.bill.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name:                 <FormattedMessage id="Customer" />
      ,
      selector: (row) => row.bill.accounts ? row.bill.accounts.account.name :row.bill.temp_customer,
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
                          <FormattedMessage id="Date" />
        </strong>
      ),
      selector: (row) => date(row.bill.dateInsert),
    },
    { name:                 <FormattedMessage id="Currency" />      , selector: (row) => row.bill.money.name, sortable: true },
    { name: <FormattedMessage id="Total Amount" />, selector: (row) => row.bill.total, sortable: true },
    { name: <FormattedMessage id="Paid Amount" />, selector: (row) => row.bill.PaidAmount, sortable: true },
    { name: <FormattedMessage id="Remain Amount" />, selector: (row) => row.bill.Remain, sortable: true },
    // { name: "Add By", selector: (row) => row.bill.user.name, sortable: true },
    
    { name: (<strong
      style={{
        textAlign: "center",
        backgroundColor: "tranceparent",
        width: "100%",
      }}
    >
      =<FormattedMessage id="Show" />
    </strong>),selector: (row) => (
      <button
        onClick={(e) => {
          // console.log(row.bill?.accounts ? true : false);
          getcustomer();
          setExesting(row.bill?.accounts ? true : false);
          setEditSellModal(true);
          setMoneyEdit(row.money);
          setCustomer(row.bill);
          setShopingCart(row.sells);
        }}
        style={{
          border: "none",
          backgroundColor: "transparent",
          height: "100%",
        }}
      >
        <img
          height={"15%"}
          width={"15%"}
          src={pencil}
          style={{ backgroundColor: "tranceparent" }}
        />
      </button>
    ) },
    { name: (<strong
      style={{
        textAlign: "center",
        backgroundColor: "tranceparent",
        width: "100%",
      }}
    >
      <FormattedMessage id="Delete" />
    </strong>),   selector: (row) => (
      <button
        onClick={() => {
          deleteSell(row);
        }}
        style={{
          border: "none",
          backgroundColor: "transparent",
          height: "100%",
        }}
      >
        <img
          height={"20%"}
          width={"20%"}
          src={Trash}
          style={{ backgroundColor: "tranceparent" }}
        />
      </button>
    ) },
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
  const [money,setmoney]=useState([]);
  const getcustomer=()=>{
    if(item.length===0){
      axios.get(`${Source.getAddress()}/api/item`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          stock: 'true',
        },
      }).then((res)=>{
        console.log(res.data);
        setitem(res.data);
      }).catch((err)=>{
        console.log(err);
      });
    }
    if(money.length===0){
      axios.get(Source.getAddress() + '/api/money', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },params: {
          delete: 'False',
        },
      }).then((res)=>{
        setmoney(res.data);
      }).catch((err)=>{
        console.log(err);
      });
    }
  }
  const ExpandedComponent = ({ data }) => (
    <div className="p-3">
      <h5>{data.name}</h5>
      <p>Status: {data.status}</p>
      <p>Registered: {data.registered}</p>
      <button className="btn btn-info btn-sm">Edit</button>
      <button className="btn btn-danger btn-sm ms-2">Delete</button>
    </div>
  );
const [Exesting,setExesting]=useState(false);
const { formatMessage } = useIntl();
const localization = {
  pagination: {
      
      rowsPerPage:<FormattedMessage id="AddrowsPerPage"/> , // مثلا: "تعداد ردیف‌ها"
    previous: <FormattedMessage id="previous"/>, // مثلا: "قبلی"
    next: <FormattedMessage id="next"/>, // مثلا: "بعدی"
    page: <FormattedMessage id="page"/>, // مثلا: "صفحه"
  },
  // شما می‌توانید تنظیمات بیشتر برای متون مورد نظر اضافه کنید.
};
  // dispatch(getCustomers());
  return (
    <div className={`w-100 ${"iransans"}`}>
      <div className="m-auto mt-5 m-5" style={{ height: "100%" ,width:"99%"}}>
        <button
          type="submit"
          className="btn btn-info mb-1 p-1"
          style={{ width: "100px" }}
          onClick={()=>{
            setAddSellModal(true);
            getcustomer();
          }}
        >
          <FormattedMessage id="Add" />
        </button>
        <div
        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Sells"/>
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date_start}
              lebal={<FormattedMessage id="Start"/>}
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
            ></Datepicker_Customer>
          </div>
          <div className="mb-1 mt-1 mb-lg-0 me-lg-2">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date_end}
              lebal={<FormattedMessage id="End"/>}
              setSelectedDay={setEndDate}
              selectedDay={EndDate}
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
  value={namesearch}
  placeholder={formatMessage({ id: "Search" })}
  aria-label="Search"
/>
      </div>
        <DataTable
                  localization={localization} // ارسال ترجمه‌ها      
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
      customStyles={{
        headCells: {
          style: {
            // display: 'flex',
            // minWidth: '100px', // تنظیم اندازه عنوان‌ها
            // maxWidth: '100px',
            // width: '10px',
            // margin: '0px',
            fontWeight:'bold',
            // textAlign: 'center',
          },
        },
      //   cells: {
      //     style: {
      //       minWidth: '100px', // تنظیم اندازه داده‌ها
      //       maxWidth: '150px',
      //       width: '150px',
      //     },
      //   },
      }}
    />
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
      customStyles={{
        headCells: {
          style: {
            display: 'flex',
            minWidth: '100px', // تنظیم اندازه عنوان‌ها
            maxWidth: '100px',
            width: '10px',
            margin: '0px',
            fontWeight:'bold',
          },
        },
        cells: {
          style: {
            minWidth: '100px', // تنظیم اندازه داده‌ها
            maxWidth: '150px',
            width: '150px',
          },
        },
      }}
    /> */}
        {/* {
          <AccountEdit
          loading={loading}
          setLoading={setLoading}
          inputRef={inputRef1}
            close={() => setEdit(false)}
            account={editAccount1}
            setAccount={setEditAccount1}
            // records={records}
            // setRecords={setRecords}
            edit={edit}
            records={records}
            setRecords={setRecords}
          />
        }
        <Belance
        setMoney={setMoney}
        inputRef={inputRefbelance}
        belancem={belance}
         setbelance={setbelance}
        prof={prof}
        idprof={idprof}
        customer={customer}
        setcustomer={setcustomer}
        moneyp={money}
        loading={loading}
        setLoading={setLoading}
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
          setEditAccount={setEditAccount}
          openBelance={openBelance}
          setOpenBelance={setOpenBelance}
        />
        {
          <AddAccount
          loading={loading}
          setLoading={setLoading}
            inputRef={inputRef}
            close={() => setAddAccountModal(false)}
            addAccountModal={addAccountModal}
            records={records}
            setRecords={setRecords}
          />
        } */}
              <AddSell
              options1={item}
              setOptions1={setitem}
              customer={customer}
              setcustomer={setcustomer}
              settings={setting}
              setsettings={setsettings}
              records={records}
              setRecords={setRecords}
              addAccountModal={addAccountModal}
              setAddAccountModal={setAddAccountModal}
              // stock={stock}s
              moneys={money}
              AddSellModal={AddSellModal}
              close={()=>setAddSellModal(false)}    
              // belance={belance}
              // setbelance={setbelance}
              setAddBalanceModal={setAddBalanceModal}
              />
          {/* <Add_belance
          // customers={customers}
          accounts={belance}
          setAccounts={setbelance}
          close={() => setAddBalanceModal(false)}
          addAccountModal={AddBalanceModal}
          records={belance}
          setRecords={setbelance}
          money={money}
          // settings={settings}
          setAddcustomerModal={setAddAccountModal}
        /> */}
        {/* {<Add_customer
              // loading={loading}
              // setLoading={setLoading}
                // inputRef={inputRef}
                close={() => setAddAccountModal(false)}
                addAccountModal={addAccountModal}
                records={options}
                setRecords={setOptions}            
            />} */}
            <EditSell
            Exesting={Exesting}
            setExesting={setExesting}
            records={records}
            setRecords={setRecords}
            settings={setting}
            setsettings={setsettings}
            AddSellModal={EditSellModal}
            close={(e)=>setEditSellModal(false)}
            money={MoneyEdit}
            // setmoney={setMoneyEdit}
            moneys={money}
            options1={item}
             setOptions1={setitem}
            customers={customer}
            Customer={Customer}
            setCustomer={setCustomer}
            shopingcart={shopingcart}
            setshopingcart={setShopingCart}
            />
      </div>
    </div>
  );
}
