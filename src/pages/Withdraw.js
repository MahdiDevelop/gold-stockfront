import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import AccountEdit from "./CustomersEdit";
import Datepicker from "./forms/Datepicker";
import Add from "../assets/icon/add.png";
import Belance from "./forms/Belance";
import AddAccount from "./AddAccount";
import Trash from "../assets/icon/trash.png";
import Swal from "sweetalert2";
import { showAlert } from "../warrper";
import Source from "../Source";
import { gregorianToJalali } from "shamsi-date-converter";
import jalaali from "jalaali-js";
import ComboBox from "./forms/ComboBox";
import moment from "moment-jalaali";
import Datepicker_Customer from "./forms/Datepicker_customer";
import { NumericFormat } from "react-number-format";
import { useRef } from "react";
import Edit_withdraw from "./Edit_withdraw";
import { getReports, updateReportInCache } from './Redux/reportSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getBelances, updateBelanceInCache } from "./Redux/belanceSlice";
import { getMoneys, updateMoneyInCache } from "./Redux/moneysSlice";
import ComboBoxDeposite from "./Transformations/ComboBoxDeposite";
import ListBox from "./forms/ListBox";
import ReactDOMServer from "react-dom/server";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../warrper";
const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with thousand separators
};
export default function Withdraw({
  
  user,
  // settings,
  
}) {

  const showAlert = useShowAlert(); 
  // const dispatch = useDispatch();
  // //  const { belances, errorb } = useSelector((state) => state.belances);
  //   // const { moneys, errorm } = useSelector((state) => state.moneys);
  //   // const { customers, errorc } = useSelector((state) => state.customers); 
  //   const { belances, errorb, statusb } = useSelector((state) => state.belances);
  //         // const { moneys, errorm, statusm } = useSelector((state) => state.moneys);
  //         // const { customers, errorc, statusc } = useSelector((state) => state.customers);
          
  //         useEffect(() => {
  //           // بررسی و بارگذاری `belances`
  //           if (!statusb && belances?.lenght===0) {
  //             dispatch(getBelances());
  //           }
          
  //           // // بررسی و بارگذاری `moneys`
  //           // if (statusm === 'idle' && !moneys) {
  //           //   dispatch(getMoneys());
  //           // }
          
  //           // // بررسی و بارگذاری `customers`
  //           // if (statusc === 'idle' && !customers) {
  //           //   dispatch(getCustomers());
  //           // }
  //         }, [dispatch, statusb, belances]);

  const { settings, statuss } = useSelector((state) => state.settings);
   const [selecteduser, setSelecteduser] = useState();
    const { users, statusu } = useSelector((state) => state.users);
    const [namesearch, setnameSearch] = useState();
    // const [EndDate, setEndDate] = useState();
    //   const [StartDate, setStartDate] = useState();
      const [Date_Start, setDate_start] = useState();
      const [Date_End, setDate_end] = useState();
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
          setDate_start(isoString);
          // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
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





          
  const [withdraw,setwithdraw]=useState([]);
  const [belance,setbelance]=useState([]);
  // const [Cash,setCash]=useState(moneys);

  const [Diversity, setDiversity] = useState();
  const [selectedDayE, setSelectedDayE] = useState();
  const [selectedDay, setSelectedDay] = useState(moment());
  const [EndDateE, setEndDateE] = useState(null);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [EditDeposit, setEditDeposit] = useState({
    id: 0,
    account: 0,
    date: "",
    amount: 0,
    discription: "",
    type: "",
    customer: "",
    moneyType: "",
    cash: 0,
    // isdelete: false,
    user: localStorage.getItem("userTokenid"),
    user_id:localStorage.getItem("userTokenid"),
    user_name: "",
    moneyid: 0,
  });
  const handle_date = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      setAddDeposite({
        ...AddDeposite,
        date: isoString,
      });
    }
  };

  const [moneytype, setmoneytype] = useState(0);
  const [money1, setmoney] = useState({ name: "", cach: 0 });
  const [records, setRecords] = useState();
  // const [belance, setBelance] = useState([]);
  const [openBelance, setOpenBelance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [MainDW,setMainDW]=useState();
  const [id, setId] = useState("");
  const [idbelance, setidbelance] = useState(0);
  const [value, setValue] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Popup, setPopup] = useState(false);


  // مدیریت تغییر صفحه
  const handlePageChange = page => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  const [username, setusername] = useState("");
  const [moneyname, setmoneyname] = useState("");
  const [addAccountModal, setAddAccountModal] = useState(false);
  const onChange = (row) => {
    setPopup(true);
    setValue(row.target.value);
  };
  const [selectedBelance, setselectedBelance] = useState({
    id: 0,
    account_name: "",
    moneyType: "",
    account: 0,
    moneyId: 0,
    user: 0,
    type: 0,
    belance: 0,
    date_created: "",
  });

  const columnsDesktop = [
    {
      name: <strong style={{ width: "1px" }}>ID</strong>,
      selector: (row) => row.id,
      //  sortable: true
      style: {
        width: "1px",
        minWidth: "10px",
      },
    },

    {
      name: <strong>Customer Name</strong>,
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
    },
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "210px", width: "210px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // Width: '600px',    // Set a specific width
      },
      // sortable: true,
    },
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },
    {
      name: <strong>Money Type</strong>,
      selector: (row) => row.moneyType,
      //  sortable: true
    },
    {
      name: <strong className="w-50 text-center">Amount</strong>,
      selector: (row) => formatNumber(row.amount),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
    {
      name: <strong>Description</strong>,
      selector: (row) => row.discription,
    },
    // {
    //   name: <strong>Cash Belance</strong>,
    //   selector: (row) => formatNumber(row.cash),
    // },
    {
      name: <strong>Added by </strong>,
      selector: (row) => row.user_name,
    },
    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
          Delete
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            delete_report(row);
            // setEdit(row);
            // setUpdate(true);
            // seTtitle('Edit Type Money');
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
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
  ];

  const columnsDesktopsimple = [
    {
      name: <strong style={{ width: "1px" }}>ID</strong>,
      selector: (row) => row.id,
      //  sortable: true
      style: {
        width: "1px",
        minWidth: "10px",
      },
    },

    {
      name: <strong>Customer Name</strong>,
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "200px", width: "200px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // Width: '600px',    // Set a specific width
      },
      // sortable: true,
    },
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },
    {
      name: <strong>Money Type</strong>,
      selector: (row) => row.moneyType,
      //  sortable: true
    },
    {
      name: <strong className="w-50 text-center">Amount</strong>,
      selector: (row) => formatNumber(row.amount),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
    {
      name: <strong>Description</strong>,
      selector: (row) => row.discription,
    },
    {
      name: <strong>Cash Belance</strong>,
      selector: (row) => formatNumber(row.cash),
    },
  ];

  const columnsTablet = [
    // { name: "Id", selector: (row) => row.id, sortable: true },

    { name: "account_name", selector: (row) => row.customer, sortable: true },
    ,
    { name: "moneyType", selector: (row) => row.moneyType, sortable: true },
    {
      name: "belance",
      selector: (row) => formatNumber(row.cash),
      sortable: true,
    },
  ];

  const PDcolumn= [
    // { name: <strong>Time Created</strong>, selector: (row) => time(row.date_created),
    // //  sortable: true
    // },
    
    // {
    //   name: <strong>Cash Belance</strong>,
    //   selector: (row) => formatNumber(row.cash),
    // },
    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
                       <FormattedMessage id="Delete"/>
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            delete_report(row);
            // setEdit(row);
            // setUpdate(true);
            // seTtitle('Edit Type Money');
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
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
    {
      name: <strong>                       <FormattedMessage id="Add By"/>
</strong>,
      selector: (row) => row.user_name,
    },
   
    {
      name: <strong>                       <FormattedMessage id="Description"/>
</strong>,
      selector: (row) => row.discription,
    },
    
    {
      name: <strong className="w-50 text-center">                       <FormattedMessage id="Amount"/>
</strong>,
      selector: (row) => formatNumber(row.amount),
      //  sortable: true
      style: {
        textAlign: "center",
        // minWidth:'100px',
      },
    },
   
    {
      name: <strong>                       <FormattedMessage id="Currency"/>
</strong>,
      selector: (row) => row.moneyType,
      //  sortable: true
    }, 
    {
      name: (
        <strong
          style={{ minWidth: "170px", maxWidth: "200px", width: "200px" }}
        >
                                 <FormattedMessage id="Date Created"/>

        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "170px", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // Width: '600px',    // Set a specific width
      },
      // sortable: true,
    },
   
    {
      name: <strong>                       <FormattedMessage id="Customer Name"/>
</strong>,
      selector: (row) => row.customer,
      style: {
        padding: "0px 20px",
        justifyContent: "left",
        textAlign: "center",
      },
      // sortable: true
    },
   
    {
      name: <strong style={{ width: "1px" }}>
                       <FormattedMessage id="ID"/>

      </strong>,
      selector: (row) => row.id,
      //  sortable: true
      style: {
        width: "1px",
        minWidth: "10px",
      },
    },

  ];
  const filterDeposite = () => {
    // console.log(StartDate);
    const startDate = new Date(
      `${StartDate.year}-${StartDate.month}-${StartDate.day}`
    ); // Start date
    const endDate = new Date(`${EndDate.year}-${EndDate.month}-${EndDate.day}`); // End date
    endDate.setDate(endDate.getDate() + 2);
    const type = "withdraw";
    axios
      .get(Source.getAddress() + "/api/report", {
        params: {
          startDate: startDate,
          endDate: endDate,
          type: type,
          delete: "False",
        },headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
  }
      })
      .then((res) => {
        showAlert({
          position: "top-end",
          icon: "success",
          title: "Deposite Table filterd successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setRecords(res.data); // This will contain filtered data from the server
      })
      .catch((err) => {
        showAlert({
          position: "top-end",
          icon: "error",
          title: "Something went wrong !",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const [formattedValue, setFormattedValue] = useState("");
  const [unformattedValue, setUnformattedValue] = useState("");

  const handleChange = (e) => {
    const formattedValue = e.target.value;
    // Remove the thousand separators (commas)
    const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");
    setFormattedValue(formattedValue);
    setAddDeposite({
      ...AddDeposite,
      amount: unformattedValue,
      user: localStorage.getItem("userTokenid"),
    });
  };
  const handleDeposite = (e) => {
    setAddDeposite({
      ...AddDeposite,
      [e.target.name]: e.target.value,
    });
  };
  const Onsearch = (row) => {
    if (row) {
      setusername(row.account_name);
      setmoneyname(row.moneyType);
      setmoneytype(row.moneyId);
      setidbelance(row.id);
      setselectedBelance((prevState) => ({
        ...prevState,
        id: row.id,
        moneyId: row.moneyId,
        user: row.user,
        user_id:localStorage.getItem("userTokenid"),
        moneyType: row.moneyType,
        account: row.account,
        account_name: row.account_name,
        type: row.type,
        belance: row.belance, // Assuming 'belance' is correct, it seems like a typo
        date_created: row.date_created,
      }));
      let belanceName = row.account_name + " " + row.moneyType;
      setAddDeposite({
        ...AddDeposite,
        account: row.id,
      });
      setPopup(false);
      setValue(belanceName);
    }
  };
  const [AddDeposite, setAddDeposite] = useState({
    user: 0,
    user_id:localStorage.getItem("userTokenid"),
    // isdelete: "False",
    discription: "",
    amount: 0,
    date: new Date().toISOString(),
    account: 0,
    type: "withdraw",
    cash: 0,
  });

      // const primary = () => {
      //   if (selectedBelance.belance === "0") {
      //     return -parseInt(AddDeposite.amount);
      //   } else {
      //     let money = parseInt(AddDeposite.amount);
      //     let primar = parseInt(selectedBelance.belance);
      //     let sum = primar - money;
      //     console.log(money);
      //     console.log(primar);
      //     console.log(sum);
      //     return sum;
      //   }
      // };
  
  const SumbitReport = () => {
    if (AddDeposite.amount !== 0 && AddDeposite.account !== 0) {
      let add_deposite = {
        user_id: localStorage.getItem("userTokenid"),
        discription: "",
        amount: 0,
        date_created: null,
        account_id: 0,
        type: "deposite",
        cash: 0,
        isdelete: 0,
      };
      add_deposite.user_id = AddDeposite.user;
      add_deposite.amount = AddDeposite.amount;
      add_deposite.discription = AddDeposite.discription;
      add_deposite.date_created = AddDeposite.date;
      add_deposite.account_id = AddDeposite.account;
      add_deposite.type = AddDeposite.type;
      let submitwithdraw=AddDeposite;
      const date = new Date();
          const isoString = date.toISOString();
          setAddDeposite({
            user_id: localStorage.getItem("userTokenid"),
            user:localStorage.getItem("userTokenid"),
            isdelete:0,
            discription: "",
            amount: 0,
            date: isoString,
            account_id: 0,
            type: "withdraw",
            cash: 0,
          });
      axios
        .post(`${Source.getAddress()}/api/report`, add_deposite,{ headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },})
        .then((response) => {
          let add = {
            id: 0,
            user_name: "",
            moneyType: "",
            customer: "",
            user_id: localStorage.getItem("userTokenid"),
            user: 0,
            discription: "",
            amount: 0,
            date: null,
            account: 0,
            type: "deposite",
            cash: 0,
            // isdelete: "False",
            account: 0,
            moneyId:0,
          };

          add.id = response.data.report;
          add.account = submitwithdraw.account;
          add.user = localStorage.getItem("userTokenid");
          add.discription = submitwithdraw.discription;
          add.amount = submitwithdraw.amount;
          add.date = submitwithdraw.date;
          add.account = submitwithdraw.account;
          add.type = submitwithdraw.type;
          // add.isdelete = AddDeposite.isdelete;
          add.customer = username;
          add.user_name = localStorage.getItem("userToken");
          add.moneyType = moneyname;
          setRecords(prevRecords => [add, ...prevRecords]);
          setSelectedDay(moment());
          setFormattedValue("");
          setSelectedOption("");
          let add_cash = response.data.belance
          setbelance(prevBelance =>
            prevBelance.map(item => (item.id === add_cash.id ? add_cash : item))
          );
          // dispatch(updateBelanceInCache(add_cash));
          // dispatch(updateReportInCache(response.data.report_belance));
          let update_money =response.data.moneys;
          // setCash(prevcash=>
          //   prevcash.map((a) => (a.id === moneytype ? update_money : a))
          // );
          // dispatch(updateMoneyInCache(update_money));
          showAlert({
            position: "top-end",
            icon: "success",
                        title: <FormattedMessage id="Your record has been added!" />,
            
            // title: "Your record has been added !",
            showConfirmButton: false,
            timer: 1000,
          });

        })
        .catch((error) => {
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "Not working ,please try again !",
                        title: <FormattedMessage id="Not working ,please try again!" />
            ,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "You must fill Customer name and Amount input !",
                title: <FormattedMessage id="You must fill Customer name and Amount input!" />,
        
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const res = useMemo((result) => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });
    const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const delete_report = async (row) => {
    setOpenEdit(false)
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
      
        // let amount_delete = parseInt(row.amount);
        // let belacne_delete_primary_response = await axios.get(
        //   Source.getAddress() + `/api/belance/${row.account}`,{ headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        //   },}
        // );
  
        // const belacne_delete_primary = belacne_delete_primary_response.data;
        // let belance_amount = parseInt(belacne_delete_primary.belance);
        // let belance_delete = {
        //   account: belacne_delete_primary.account,
        //   type: belacne_delete_primary.type,
        //   belance: String(belance_amount + amount_delete)
        // };
  
        // let money_delete_primary_response = await axios.get(
        //   Source.getAddress() + `/api/money/${belacne_delete_primary.moneyId}`,{ headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        //   },}
        // );
  
        // const money_delete_primary = money_delete_primary_response.data;
        // let cash_primary = parseInt(money_delete_primary.cach);
        // let money_delete = {
        //   cach: cash_primary + amount_delete,
        // };
  
        // await axios.put(
        //   Source.getAddress() + `/api/belance/${belacne_delete_primary.id}`,
        //   belance_delete,{ headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        //   },}
        // );
  
        // belacne_delete_primary.belance = belance_delete.belance;
        // belacne_delete_primary.isdelete = belance_delete.isdelete;
  
        // setbelance((prevBelance) =>
        //   prevBelance.map((a) =>
        //     a.id === belacne_delete_primary.id ? belacne_delete_primary : a
        //   )
        // );
  
        // // Update the money
        // await axios.put(
        //   Source.getAddress() + `/api/money/${money_delete_primary.id}`,
        //   money_delete,{ headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        //   },}
        // );
  
        // money_delete_primary.cach = money_delete.cach;
        // setCash((prevCash) =>
        //   prevCash.map((a) =>
        //     a.id === money_delete_primary.id ? money_delete_primary : a
        //   )
        // );
  
        // // Update the report to mark it as deleted
        let update = {
          isdelete: 1,
          _method:'put'
        };
        axios.post(Source.getAddress() + `/api/report/${row.id}`, update,{ 
          params:{type:'delete'},
          headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },}).then((res)=>{
          Swal.fire({
            position: "center",
            icon: "success",
            title: 
                        `Withdraw ${intl.formatMessage({id:"record successfully deleted!"})}`,
            showConfirmButton: false,
            timer: 600,
          });
          setRecords((prevRecords) =>
            prevRecords.filter((record) => record.id !== row.id)
          );
          // setCash((prevCash) =>
          //   prevCash.map((a) =>
          //     a.id === res.data.moneys.id ? res.data.moneys : a
          //   ));
            setbelance((prevBelance) =>
              prevBelance.map((a) =>
                a.id === res.data.belance.id ? res.data.belance : a
              )
            );
          // dispatch(updateBelanceInCache(res.data.belance));
          // dispatch(updateReportInCache(res.data.report_belance));
          // dispatch(updateMoneyInCache(res.data.moneys));
        }).catch((e)=>{
          Swal.fire({
            position: "center",
            icon: "error",
            title: intl.formatMessage({id:"Something went wrong!"}),
            showConfirmButton: false,
            timer: 600,
          });
        })
  
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== row.id)
        );
        
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        position: "center",
        icon: "error",
        text:intl.formatMessage({id:"Your Withdraw record is safe :)"}),
        showConfirmButton: false,
        timer: 600,
      });
    }
  };

 
  const [account, setAccount] = useState();
  const [selectedOption1, setSelectedOption1] = useState();
  const inputRef=useRef();

  const handleRowClick = (row) => {
    inputRef.current.select();
    setAccount(row.account);
    let edit = {
      account_name: row.customer,
      moneyType: row.moneyType,
    };
    setSelectedOption1(edit);
    setDiversity(row.amount);
    let news;
    try {
      news = new Date(row.date);
      if (isNaN(news.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      console.error('Invalid date format:', row.date);
      return;
    }
  
    news.setDate(news.getDate());
    const jalaliDate = jalaali.toJalaali(
      news.getFullYear(),
      news.getMonth() + 1,
      news.getDate()
    );
const gregorianMoment = moment(news);
    setSelectedDayE(gregorianMoment);
    setEditAccount(row);
    setMainDW(row);
    setEdit(true);
    setEditDeposit(row);
    setOpenEdit(prev=>!prev);
  };
  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );

    const hijriShamsiDate = `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;

    return hijriShamsiDate;
  };
  const date = (d) => {
      const date = moment.utc(d); // تبدیل تاریخ بدون در نظر گرفتن تایم زون
      let formattedDate = `${date.year()}-${String(date.month() + 1).padStart(2, "0")}-${String(date.date()).padStart(2, "0")}`;
      const hours = date.hours();
      const minutes = date.minutes();
      const ampm = hours >= 12 ? "pm" : "am";
      let aa = ampm;
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    
      if (settings[0].date === "Persian") {
        moment.locale("fa"); // تنظیم لوکال به فارسی
        aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
        formattedDate = moment.utc(d).format("jYYYY-jMM-jDD");
      } else {
        moment.locale("en");
      }
    
      return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
    };
  
  const handleViewBelance = (row) => {
    const filteredBelance = belance.filter((item) => item.account === row.id);

    setEditAccount(filteredBelance);
    setId(row.id);
    setOpenBelance(true);
  };





  const handleFilter = (e) => {
    // console.log(accounts);
    const newData = withdraw.filter((row) => {
      if (typeof row.customer === "string") {
        if (
          row.customer.toLowerCase().includes(e.target.value.toLowerCase()) ||
          row.moneyType.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return row.customer;
        }
      }
      return false;
    });
    setRecords(newData);
  };

  const handleAddAccount = () => {
    setAddAccountModal(true);
  };

  
  const [select_user, setselect_user] = useState("");
  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = withdraw.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
    } else {
      setRecords(withdraw);
    }
    setselect_user(e.target.value);
  };
  const [selectedOption, setSelectedOption] = useState();

  const buttonRef = useRef(null);
  const filterRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };

  const Hanlderef = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (filterRef.current) {
        filterRef.current.click(); // Programmatically click the button
      }
    }
  };
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه

  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress()+'/api/report', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        params: {
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          delete: 0,StartDate: StartDate&& Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
          type:"withdraw"
        },
      });
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
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
  
  
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const columns = useMemo(() => {
    if (
      localStorage.getItem("language") === "pa" ||
      localStorage.getItem("language") === "da"
    ) {
      return PDcolumn.reverse();
    }
    if (isDesktop) {
      return localStorage.getItem("userTokenname") === "admin"
        ? columnsDesktop
        : columnsDesktopsimple;
    }
    return columnsTablet;
  }, [isDesktop]);

  const inputRefd = useRef(null); // Create a ref for the input field

  useEffect(() => {
    const inputElement = document.querySelector(".form-control"); // Use the class or other selector
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus(); // Focus the input field
        inputElement.select(); // Select the text in the input field
      }, 0);
    }
  }, []);
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/money', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     setCash(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  // },[]);
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/belance', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     setbelance(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  //  },[]); 
   const [SearchQueryTo,setSearchQueryTo]=useState();
   const handleInputChangeTo = (newValue) => {
     setSearchQueryTo(newValue); // بروزرسانی مقدار ورودی جستجو
     // handleSearchTo(newValue); // ارسال درخواست جستجو به سرور
   };   
   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await axios.get(`${Source.getAddress()}/api/belance`, {
           headers: {
             Authorization: `Bearer ${localStorage.getItem("access")}`,
           },
           params: { query: SearchQueryTo ,do:'ok'}, // ارسال پارامتر جستجو به سرور
         });
         setbelance(response.data);
         const data = response.data;
         console.log(data);
   
         // if (data && data.length === 0) {
         //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
         // } else {
         //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
         // }
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
   
     // if(selectedOption){
       if (!SearchQueryTo|| SearchQueryTo.length < 3) {
         setbelance([]);
         return;
       }else{
         fetchData();
       }
     // }
   }, [SearchQueryTo]); // اضافه کردن searchQuery به وابستگی‌های useEffect
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
  return (
    <div
      className="container mt-5 h-100 w-100"
      onClick={(e) => {
        if (
          e.target.className === "container mt-5 h-100 w-100" ||
          e.target.className ===
            "col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent" ||
          e.target.className ===
            "col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent "
        ) {
          setPopup(false);
          setOpenEdit(false);
        }
      }}
    >
      <form
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      class="row w-100 rounded-3 m-3 p-1 bg-transparent">
        <div class="col-lg-2 col-md-3 col-sm-6 m-1 mt-3">
          <label for="category">            <FormattedMessage id="Customer" />
          </label>
          {/* <ComboBox
            options={belance}
            Onsearch={Onsearch}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          /> */}
          <ComboBoxDeposite
          searchQuery={SearchQueryTo}
          setSearchQuery={setSearchQueryTo}
          handleInputChange={handleInputChangeTo}
          // handleSearch={handleSearchTo}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          options={belance}
          Onsearch={Onsearch}
          />
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6 m-0 mb-3 mt-3 ms-3 p-0 pe-4">
          <label for="price">            <FormattedMessage id="Amount" />
          </label>
          <NumericFormat
            ref={inputRefd}
            thousandSeparator={true}
            name="amount"
            className="form-control"
            value={formattedValue}
            onKeyDown={handleKeyDown}
            placeholder="0"
            onChange={handleChange}
          />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12 m-2 mt-3 ps-2 p-0 pe-3">
          <div class="form-floating">
            <textarea
              onKeyDown={handleKeyDown}
              name="discription"
              class="form-control h-50"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              value={AddDeposite.discription}
              onChange={handleDeposite}
            ></textarea>
            <label for="floatingTextarea2">              <FormattedMessage id="Description" />
            </label>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12  mt-3 ps-3 p-0">
          <Datepicker_Customer
            onKeyDown={handleKeyDown}
            default_value={EndDate}
            settings={settings}
            handle_date={handle_date}
            // lebal={"Date"}
                        lebal={<FormattedMessage id="Date" />}
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
          ></Datepicker_Customer>
        </div>
        <div
          class="col-lg-1 col-md-3 col-sm-6 p-0 ps-0 ms-0"
          style={{ marginTop: "2.3rem" }}
        >
          <button
            ref={buttonRef}
            onClick={SumbitReport}
            type="button"
            class="btn btn-success"
          >
                        <FormattedMessage id="Add" />
          </button>
        </div>
      </form>

      <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4">            <FormattedMessage id="Withdraw" />
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date_start}
                            lebal={<FormattedMessage id="Start" />}
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
            ></Datepicker_Customer>
          </div>
          <div className="mb-1 mt-1 mb-lg-0 me-lg-2">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date_end}
                            lebal={<FormattedMessage id="End" />}
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
      {/* <DataTable
        className="w-100"
        columns={columns}
        data={records}
        onRowClicked={handleRowClick}
        striped
        responsive
        highlightOnHover
        pagination
      /> */}
       <DataTable
      // title="Server Side Data Table"
      columns={columns}
      data={records}
      progressPending={loading}
      onRowClicked={handleRowClick}
        striped
        responsive
        highlightOnHover
      pagination
      paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
      paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
      onChangePage={handlePageChange} // تغییر صفحه
      onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه
      localization={localization} // ارسال ترجمه‌ها

    />
      <Edit_withdraw
       inputRef={inputRef}
       setSelectedOption={setSelectedOption1}
       selectedOption={selectedOption1}
       records={records}
       setRecords={setRecords}
       handleKeyDown={handleKeyDown}
      //  setCash={setCash}
      //  Cash={Cash}
       belance={belance}
       setbelance={setbelance}
       account={account}
       setAccount={setAccount}
       Diversity={Diversity}
       setDiversity={setDiversity}
       selectedDay={selectedDayE}
       setselectedDay={setSelectedDayE}
       EndDate={EndDateE}
       Edit_Deposit={EditDeposit}
       setEditDeposit={setEditDeposit}
       settings={settings}
       handle_date={handle_date}
       setSelectedDay={setSelectedDayE}
       open={OpenEdit}
       closeEdit={() => setOpenEdit(false)}
      MainDW={MainDW}
      setMainDW={setMainDW}
      />
      {/* {edit && (
        <AccountEdit
          close={() => setEdit(false)}
          account={editAccount}
          setAccount={setEditAccount}
        />
      )} */}

      {/* <img style={{height:'6%',width:'6%'}} className="p-0" src={Add}/> */}
      {openBelance && (
        <Belance
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
        />
      )}
      {addAccountModal && (
        <AddAccount close={() => setAddAccountModal(false)} />
      )}
    </div>
  );
}