import React, { useState, useEffect, useMemo } from "react";
import { gregorianToJalali } from "shamsi-date-converter";
import Alert from "../forms/Alert";
import Datepicker from "../forms/Datepicker";
import Datepicker_Customer from "../forms/Datepicker_customer";
import Datepicker_start from "../forms/Datepicker_start";
import DataTable from "react-data-table-component";
import axios from "axios";
import AccountEdit from "../CustomersEdit";
import Add from "../../assets/icon/add.png";
import Trash from "../../assets/icon/trash.png";
import { useRef } from "react";
import Belance from "../forms/Belance";
import AddAccount from "../AddAccount";
import ComboBox from "../forms/ComboBox";
import Source from "../../Source";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Edit_deposite from "../Edit_deposite";
import { Calendar } from "react-modern-calendar-datepicker";
import * as shamsi from "shamsi-date-converter";
// import DatePicker from "react-modern-calendar-datepicker";
import { NumericFormat } from "react-number-format";
import { utils } from "react-modern-calendar-datepicker";
const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with thousand separators
};

export default function AllTransactions({
  user,
  settings,
}) {
  const [  accounts,setAccounts]=useState([]);
  const [  money,setmoney]=useState([]);
  const [  Cash,setCash]=useState([]);
  const [  belance,  setbelance]=useState([]);
  const [deposite,setdeposite]=useState([]);
  const [selectedDay, setSelectedDay] = useState(moment());

  const [open, setopen] = useState(true);
  const [alert, setalert] = useState(false);
  const [records, setRecords] = useState([]);
  const persianToday = utils("fa").getToday();
  const [Ddate, setDdate] = useState(null);
  const [de_id, setde_id] = useState(0);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [EditDeposit, setEditDeposit] = useState({
    id: 2,
    account: 0,
    date: "",
    amount: 0,
    discription: "",
    type: "",
    customer: "",
    moneyType: "",
    cash: 0,
    isdelete: false,
    user: 0,
    user_name: "",
    moneyid: 0,
  });
  const [cashreport, setcashreport] = useState(0);
  const [report_delete, Setreport_delete] = useState({
    account: 15,
    date: "2024-05-15T15:41:44.888608Z",
    amount: 0,
    discription: "",
    type: "deposite",
    cash: 0,
    isdelete: "True",
  });
  const delete_report = async (row) => {
    setOpenEdit(false);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      try {
        let amount_delete = parseInt(row.amount);
        let belacne_delete_primary_response = await axios.get(
          Source.getAddress() + `/api/belance/${row.account}`
          ,{headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          },}
        );
        const belacne_delete_primary = belacne_delete_primary_response.data;
        let belance_amount = parseInt(belacne_delete_primary.belance);
        let belance_delete = {
          belance: String(belance_amount - amount_delete),
        };
  
        let money_delete_primary_response = await axios.get(
          Source.getAddress() + `/api/money/${belacne_delete_primary.moneyId}`
        ,{ headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },}
        );
  
        const money_delete_primary = money_delete_primary_response.data;
        let cash_primary = parseInt(money_delete_primary.cach);
        let money_delete = {
          cach: parseInt(cash_primary - amount_delete),
        };
  
        await axios.put(
          Source.getAddress() + `/api/belance/${belacne_delete_primary.id}`,
          belance_delete,{ headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          },}
        );
  
        belacne_delete_primary.belance = belance_delete.belance;
        belacne_delete_primary.isdelete = belance_delete.isdelete;
  
        setbelance((prevBelance) =>
          prevBelance.map((a) =>
            a.id === belacne_delete_primary.id ? belacne_delete_primary : a
          )
        );
  
        // Update the money
        await axios.put(
          Source.getAddress() + `/api/money/${money_delete_primary.id}`,
          money_delete,{ headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          },}
        );
  
        money_delete_primary.cach = money_delete.cach;
        setCash((prevCash) =>
          prevCash.map((a) =>
            a.id === money_delete_primary.id ? money_delete_primary : a
          )
        );
  
        // Update the report to mark it as deleted
        let update = {
          isdelete: 1,
        };
  
        await axios.put(Source.getAddress() + `/api/report/${row.id}`, update,{ headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },});
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== row.id)
        );
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Deposite record successfully deleted !",
          showConfirmButton: false,
          timer: 600,
        });
      } catch (err) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Deposite record not deleted",
          showConfirmButton: false,
          timer: 600,
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Your Deposite record is safe :)",
        showConfirmButton: false,
        timer: 600,
      });
    }
  };
  

  const [moneytype, setmoneytype] = useState(0);
  const [EndDateE, setEndDateE] = useState(null);
  const [idbelance, setidbelance] = useState(0);
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
  const [openBelance, setOpenBelance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [id, setId] = useState("");
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [username, setusername] = useState("");
  const [moneyname, setmoneyname] = useState("");
  const [AddDeposite, setAddDeposite] = useState({
    user: 0,
    discription: "",
    amount: "",
    date: null,
    account: 0,
    type: "deposite",
    cash: 0,
    isdelete: "False",
  });
  const filterDeposite = () => {
    // console.log(StartDate);    2024-05-29
    const startDate = new Date(
      `${StartDate.year}-${StartDate.month}-${StartDate.day}`
    ); // Start date
    const endDate = new Date(`${EndDate.year}-${EndDate.month}-${EndDate.day}`); // End date
    endDate.setDate(endDate.getDate() + 2);
    const type = "deposite";
    axios
      .get(Source.getAddress() + "/api/report", {
        params: {
          startDate: startDate,
          endDate: endDate,
          type: type,
          delete: "False",
        },headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
  }})
      .then((res) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Deposite Table filterd successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setRecords(res.data); // This will contain filtered data from the server
        // console.log(res.data);
      })
      .catch((err) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Something went wrong !",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const primary = () => {
    if (selectedBelance.belance === "0") {
      return AddDeposite.amount;
    } else {
      let primar = parseInt(selectedBelance.belance);
      primar += parseInt(AddDeposite.amount);
      return primar;
    }
  };
  const updatemoney = () => {
    const record = Cash.find((item) => item.id === moneytype);
    if (record) {
      let money = parseInt(AddDeposite.amount);
      let primmoney = parseInt(record.cach);
      let sum = primmoney + money;
      return { name: record.name, cash: sum, user: record.user };
    } else {
      // Handle the case when record is undefined
      return { name: "", cash: 0 };
    }
  };

  const primary1 = () => {
    // const record= Cash.filter((item)=>{item.id==moneytype});
    if (selectedBelance.belance === "0") {
      return -parseInt(AddDeposite.amount);
    } else {
      let money = parseInt(AddDeposite.amount);
      let primar = parseInt(selectedBelance.belance);
      let sum = primar - money;
      return sum;
    }
  };

  const updatemoney1 = () => {
    const record = Cash.find((item) => item.id === moneytype);
    if (record) {
      let money = parseInt(AddDeposite.amount);
      let primmoney = parseInt(record.cach);
      let sum = primmoney - money;
      return { name: record.name, cash: sum, user: record.user };
    } else {
      // Handle the case when record is undefined
      return { name: "", cash: 0 };
    }
  };

  const SumbitReport = () => {
    if (AddDeposite.amount !== 0 && AddDeposite.account !== 0) {
        if(AddDeposite.type==='deposite') {
      let newId = 1;
      // ? Math.max(...records.map((record) => record.id)) + 1
    //   axios
    //     .get("http://127.0.0.1:8000/api/report/get_last_report_id/",{headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //       // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    // }})
        // .then((res) => (newId = res.data.last_report_id + 1))
        // .catch((err) => {});
      let dd = new Date();
      const pri = primary();
      const moneyinsert = updatemoney();
      const uploadDatamoney = {
        cash:String(moneyinsert.cash),
        ontransaction:1
      }
      
      // uploadDatamoney.append("name", moneyinsert.name);
      // uploadDatamoney.append("cach", moneyinsert.cash);
      // uploadDatamoney.append("delete", "False");
      // uploadDatamoney.append("user", moneyinsert.user);
      // uploadDatamoney.append("ontransaction","True");
      const uploadData ={
        belance:String(pri),
        ontransaction:1
      }
      // uploadData.append("type", selectedBelance.type);
      // uploadData.append("belance", pri);
      // uploadData.append("account", selectedBelance.account);
      // uploadData.append("date_created", selectedBelance.date_created);
      // uploadData.append("user", selectedBelance.user);
      // uploadData.append("isdelete", "False");
      // uploadData.append('ontransaction',"True");
      let add_deposite = {
        user_id: 0,
        discription: "",
        amount: 0,
        date: null,
        account_id: 0,
        type: "deposite",
        cash: 0,
        isdelete: 0,
      };
      add_deposite.user_id = AddDeposite.user;
      add_deposite.amount = AddDeposite.amount;
      add_deposite.discription = AddDeposite.discription;
      add_deposite.date = AddDeposite.date;
      add_deposite.account_id = AddDeposite.account;
      add_deposite.type = AddDeposite.type;
      add_deposite.cash =parseInt(moneyinsert.cash);
      add_deposite.isdelete = 0;
      axios
        .post(`${Source.getAddress()}/api/report`, add_deposite,{headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    }},)
        .then((response) => {
          let add = {
            id: 0,
            user_name: "",
            moneyType: "",
            customer: "",
            user: 0,
            discription: "",
            amount: 0,
            date: null,
            account: 0,
            type: "deposite",
            cash: 0,
            isdelete: "False",
            account: 0,
            moneyId:0,
          };
          add.id =response.data.report;
          axios.put(Source.getAddress() + "/api/belance/" + `${idbelance}`,uploadData,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
                        
               // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
            }
          })
          // fetch(Source.getAddress() + "/api/belance/" + `${idbelance}/`, {
          //   method: "PUT",
            // headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
                        
            //    // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
            // },
          //   body: uploadData,
          // })
            .then((res) => {
              axios.put(Source.getAddress() + "/api/money/" + `${moneytype}`,uploadDatamoney,{
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
                  // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
                },
              })
              // fetch(Source.getAddress() + "/api/money/" + `${moneytype}/`, {
              //   method: "PUT",
              //   headers: {
              //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
              //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
              //   },
              //   body: uploadDatamoney,
              // })
                .then((res) => {
                  add.account = AddDeposite.account;
                  add.user = localStorage.getItem("userTokenid");
                  add.discription = AddDeposite.discription;
                  add.amount = AddDeposite.amount;
                  add.date = AddDeposite.date;
                  add.account = AddDeposite.account;
                  add.type = AddDeposite.type;
                  add.cash = moneyinsert.cash;
                  add.isdelete = AddDeposite.isdelete;
                  add.customer = username;
                  add.user_name = localStorage.getItem("userToken");
                  add.moneyType = moneyname;
                  setRecords([add, ...records]);
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your record has been added !",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                  setSelectedOption("");
                  let datetime = new Date();
                  const jalaliDate12 = {
                    year: datetime.getFullYear(),
                    month: datetime.getMonth() + 1,
                    day: datetime.getDay(),
                  };
                  const { year, month, day } = jalaliDate12;
                  const t = new Date();
                  const date = new Date();
                  const isoString = date.toISOString();
                  setAddDeposite({
                    ...AddDeposite,
                    user: 0,
                    discription: "",
                    amount: 0,
                    date: isoString,
                    account: 0,
                    type: "deposite",
                    cash: 0,
                    isdelete: 0,
                  });
                  setFormattedValue("");
                  setSelectedDay(moment());
                  let add_cash = {
                    id: 0,
                    account_name: "",
                    moneyType: "",
                    account: 0,
                    moneyId: 0,
                    type: 0,
                    belance: 0,
                    date_created: "",
                    user: 0,
                  };
                  add_cash.id = selectedBelance.id;
                  add_cash.account_name = selectedBelance.account_name;
                  add_cash.moneyId = selectedBelance.moneyId;
                  add_cash.moneyType = selectedBelance.moneyType;
                  add_cash.account = selectedBelance.account;
                  add_cash.type = selectedBelance.type;
                  add_cash.belance = pri;
                  add_cash.date_created = selectedBelance.date_created;
                  add_cash.user = selectedBelance.user;
                  setbelance(
                    belance.map((a) => (a.id === add_cash.id ? add_cash : a))
                  );
                  let update_money = {
                    name: "sefide",
                    user: 1,
                    existense: false,
                    cach: 0,
                    user_name: "",
                    id: 0,
                  };
                  update_money.name = moneyinsert.name;
                  update_money.id = moneytype;
                  update_money.cach = moneyinsert.cash;
                  update_money.user = moneyinsert.user;
                  setCash(
                    Cash.map((a) => (a.id === moneytype ? update_money : a))
                  );
                })
                .catch((err) => {
                  Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Your cache not updated !",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                });
            })
            .catch((error) => {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Account and cache not updated !",
                showConfirmButton: false,
                timer: 1000,
              });
            });
        })
        .catch((error) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Not working ,please try again !",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }else{
        let dd = new Date();
        let pri = primary1();
        // setselectedBelance({
        //   ...selectedBelance,
        //   belance: pri,
        // });
        const moneyinsert = updatemoney1();
        const uploadData = {
          belance:String(pri),
          ontransaction:1
        };
        const uploadDatamoney = {
          ontransaction:1,
          cach:parseInt(moneyinsert.cash)
        }
        // uploadDatamoney.append("name", moneyinsert.name);
        // uploadDatamoney.append("cach", moneyinsert.cash);
        // uploadDatamoney.append("isdelete", "False");
        // uploadDatamoney.append("user", moneyinsert.user);
        // uploadDatamoney.append('ontransaction','True');

        // uploadData.append("type", selectedBelance.type);
        // uploadData.append("belance", pri);
        // uploadData.append('ontransaction','True');
        // uploadData.append("account", selectedBelance.account);
        // uploadData.append("date_created", selectedBelance.date_created);
        // uploadData.append("user", selectedBelance.user);
        // uploadData.append("isdelete", "False");
        let add_deposite = {
          user_id: 0,
          discription: "",
          amount: 0,
          date: null,
          account_id: 0,
          type: "deposite",
          cash: 0,
          isdelete: 0,
        };
        add_deposite.user_id = AddDeposite.user;
        add_deposite.amount = AddDeposite.amount;
        add_deposite.discription = AddDeposite.discription;
        add_deposite.date = AddDeposite.date;
        add_deposite.account_id = AddDeposite.account;
        add_deposite.type = AddDeposite.type;
        add_deposite.cash = moneyinsert.cash;
        // add_deposite.isdelete = 0;
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
              user: 0,
              discription: "",
              amount: 0,
              date: null,
              account: 0,
              type: "deposite",
              cash: 0,
              isdelete: "False",
              account: 0,
              moneyId:0,
            };
            add.id = response.data.report;
            axios.put(Source.getAddress() + "/api/belance/" + `${idbelance}`,uploadData,{
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
                // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
              },
            })
            // fetch(Source.getAddress() + "/api/belance/" + `${idbelance}/`, {
            //   method: "PUT",
            //   headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
            //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
            //   },
            //   body: uploadData,
            // })
              .then((res) => {
                axios.put(Source.getAddress() + "/api/money/" + `${moneytype}`,uploadDatamoney,{
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
                    // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
                  },
                })
                // fetch(Source.getAddress() + "/api/money/" + `${moneytype}/`, {
                //   method: "PUT",
                //   headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
                //     // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
                //   },
                //   body: uploadDatamoney,
                // })
                  .then((res) => {
                    add.account = AddDeposite.account;
                    add.user = localStorage.getItem("userTokenid");
                    add.discription = AddDeposite.discription;
                    add.amount = AddDeposite.amount;
                    add.date = AddDeposite.date;
                    add.account = AddDeposite.account;
                    add.type = AddDeposite.type;
                    add.cash = moneyinsert.cash;
                    add.isdelete = AddDeposite.isdelete;
                    add.customer = username;
                    add.user_name = localStorage.getItem("userToken");
                    add.moneyType = moneyname;
                    setRecords(prevRecords => [add, ...prevRecords]);
                    setSelectedDay(moment());
                    let datetime = new Date();
                    // console.log();
                    // const handl={year:date._a[0],month:date._a[1]+1,day:date._a[2]}
                    const jalaliDate12 = {
                      year: datetime.getFullYear(),
                      month: datetime.getMonth() + 1,
                      day: datetime.getDay(),
                    };
                    const { year, month, day } = jalaliDate12;
                    // Create the ISO date string
                    const t = new Date();
                    const date = new Date();
                    const isoString = date.toISOString();
                    setAddDeposite({
                      user: localStorage.getItem("userTokenid"),
                      isdelete: 0,
                      discription: "",
                      amount: 0,
                      date: isoString,
                      account: 0,
                      type: "withdraw",
                      cash: 0,
                    });
                    setFormattedValue("");
                    setSelectedOption("");
                    let add_cash = {
                      id: 0,
                      account_name: "",
                      moneyType: "",
                      account: 0,
                      moneyId: 0,
                      type: 0,
                      belance: 0,
                      date_created: "",
                      user: 0,
                    };
                    add_cash.user = selectedBelance.user;
                    add_cash.id = selectedBelance.id;
                    add_cash.account_name = selectedBelance.account_name;
                    add_cash.moneyId = selectedBelance.moneyId;
                    add_cash.moneyType = selectedBelance.moneyType;
                    add_cash.account = selectedBelance.account;
                    add_cash.type = selectedBelance.type;
                    add_cash.belance = pri;
                    add_cash.date_created = selectedBelance.date_created;
                    setbelance(prevBelance =>
                      prevBelance.map(item => (item.id === add_cash.id ? add_cash : item))
                    );
                    
                    let update_money = {
                      name: "sefide",
                      user: 1,
                      existense: false,
                      cach: 0,
                      user_name: "",
                      id: 0,
                    };
                    update_money.name = moneyinsert.name;
                    update_money.id = moneytype;
                    update_money.cach = moneyinsert.cash;
                    setCash(prevcash=>
                      prevcash.map((a) => (a.id === moneytype ? update_money : a))
                    );
                    Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: "Your record has been added !",
                      showConfirmButton: false,
                      timer: 1000,
                    });
                  })
                  .catch((err) => {
                    Swal.fire({
                      position: "top-end",
                      icon: "error",
                      title: "Your cache not updated !",
                      showConfirmButton: false,
                      timer: 1000,
                    });
                  });
              })
              .catch((error) => {
                Swal.fire({
                  position: "top-end",
                  icon: "error",
                  title: "Account and cache not updated !",
                  showConfirmButton: false,
                  timer: 1000,
                });
              });
          })
          .catch((error) => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Not working ,please try again !",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      
    }
      // console.log(AddDeposite);
    } else {
      // setError(true);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "You must fill Customer name and Amount input !",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const convertToKabulTime = (dateStr) => {
    const dateObj = new Date(dateStr);

    // Set the time zone to Kabul (UTC+4:30)
    dateObj.setMinutes(dateObj.getMinutes() + 540); // Kabul is UTC+4:30

    // Format the date object into the desired string format
    const formattedDateStr = dateObj.toISOString().slice(0, 16);

    return formattedDateStr;
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
      setAddDeposite({
        ...AddDeposite,
        date: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };

  // const [str,setstr]=useState('');

  const [formattedValue, setFormattedValue] = useState("");

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
      user: localStorage.getItem("userTokenid"),
    });
  };

  const [Popup, setPopup] = useState(false);
  // const [Settings, setSettings] = useState([]);
  const res = useMemo((result) => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });
  // useEffect(()=>{
  //   axios.get(Source.getAddress()+'api/settings').then((res)=>setSettings(res.data)).catch((err)=>console.error(err));
  // })
  useEffect(() => {
    axios.get(Source.getAddress() + '/api/customers', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },params: {
        delete: 'False',
      },
    }).then((res)=>{
      setAccounts(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  },[]);
  useEffect(()=>{
    axios.get(Source.getAddress() + '/api/money', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },params: {
        delete: 'False',
      },
    }).then((res)=>{
      setmoney(res.data);
      setCash(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  },[]);
  useEffect(()=>{
    axios.get(Source.getAddress() + '/api/belance', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },params: {
        delete: 'False',
      },
    }).then((res)=>{
      setbelance(res.data);
    }).catch((err)=>{
      console.log(err);
    });
   },[]); 
  // useEffect(() => {
  //   const startDate = new Date();
  //       const endDate = new Date();
  //       startDate.setDate(startDate.getDate() - 30);
  //       endDate.setDate(endDate.getDate() + 1);
  //     axios.get(Source.getAddress() + '/api/report/', {
  //       headers:{
  //         Authorization: `Bearer ${localStorage.getItem('access')}`,
  //       },
  //       params: {
  //         delete:'False',
  //         startDate: startDate.toISOString(),
  //         endDate: endDate.toISOString(), 
  //       },
  //     }).then((res)=>{
  //       setRecords(res.data);
  //       setdeposite(res.data);
  //     }).catch((res)=>{
  //       console.log(res);
  //     });


  //   let news = new Date();
  //   let mmm = news.toISOString().slice(0, 16);
  //   let to = convertToKabulTime(mmm);
  //   const jalaliDate1 = jalaali.toJalaali(
  //     news.getFullYear(),
  //     news.getMonth() + 1,
  //     news.getDate()
  //   );

  //   news.setDate(news.getDate() - 1);
  //   const jalaliDate = jalaali.toJalaali(
  //     news.getFullYear(),
  //     news.getMonth() + 1,
  //     news.getDate()
  //   );

  //   if (settings[0].date === "Persian") {
  //     setStartDate(
  //       moment({
  //         day: jalaliDate1.jd,
  //         month: jalaliDate1.jm,
  //         year: jalaliDate1.jy,
  //       })
  //     );
  //     setEndDate(
  //       moment({
  //         day: jalaliDate.jd,
  //         month: jalaliDate.jm,
  //         year: jalaliDate.jy,
  //       })
  //     );
  //   } else {
  //     setStartDate(
  //       moment({
  //         day: String(news.getDate()).padStart(2, "0"),
  //         month: String(news.getMonth() + 1).padStart(2, "0"),
  //         year: news.getFullYear(),
  //       })
  //     );
  //     setEndDate(moment(news));
  //   }
  // }, []);

  useEffect(() => {
    let datetime = new Date();
    const t = new Date();
    const date = new Date();
    const isoString = date.toISOString();

    setAddDeposite({
      ...AddDeposite,
      date: isoString,
    });
  }, [setAddDeposite]);

  const handleRowClick = (row) => {
    setEditAccount(row);
    setEdit(true);
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
    const newData = deposite.filter((row) => {
      if (typeof row.customer === "string") {
        if (
          row.customer.toLowerCase().includes(e.target.value.toLowerCase()) ||
          row.moneyType.toLowerCase().includes(e.target.value.toLowerCase()) ||
          row.amount === e.target.value
        ) {
          return row.customer;
        }
      }
      return false;
    });
    setRecords(newData);
  };

  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );

    const hijriShamsiDate = `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;

    return hijriShamsiDate;
  };
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
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
          Date Created
        </strong>
      ),
      selector: (row) => date(row.date),
      style: {
        minWidth: "190px!important", // Adjust this value as needed
        maxWidth: "200px", // Adjust this value as needed
        // margin:'0px'
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
  const ShowDeposit = (type) => {
    return (
      <p
        className={`text-capitalize position-static p-2 mb-0 ${
          type === "deposite" ? "bg-success" : "bg-danger"
        } rounded text-light text-center `}
        style={{ width: "75px" }}
      >
        {type}
      </p>
    );
  };

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
        textAlign: "left",
        // minWidth:'100px',
      },
    },
    {
      name: <strong>Transaction</strong>,
      selector: (row) => ShowDeposit(row.type),
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
          {row.cach}
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

  const columnsTablet = [
    // { name: "Id", selector: (row) => row.id, sortable: true },
    {
      name: <strong>Customer</strong>,
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: <strong>Money Type</strong>,
      selector: (row) => row.moneyType,
      sortable: true,
    },
    {
      name: <strong>Amount</strong>,
      selector: (row) => row.amount,
    },
    // {
    //   name: "Date Created",
    //   selector: (row) => date(row.date),
    //   sortable: true,
    // },
    // { name: "belance", selector: (row) => row.belance, sortable: true },
    // { name: "discription", selector: (row) => row.discription, sortable: true },
    ,
  ];
  const [value, setValue] = useState("");
  const onChange = (row) => {
    setPopup(true);
    setValue(row.target.value);
  };

  const Onsearch = (row) => {
    // This gives you the ISO string in UTC
    // setIsoDate(isoString);

    if (row) {
      setmoneyname(row.moneyType);
      setusername(row.account_name);
      setmoneytype(row.moneyId);
      setidbelance(row.id);
      setselectedBelance((prevState) => ({
        ...prevState,
        id: row.id,
        moneyId: row.moneyId,
        user: row.user,
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
        // date:isoString,
      });
      setPopup(false);
      // console.log(belanceName)
      setValue(belanceName);
      // console.log('s  earch ',row);
    }
  };
  const [select_user, setselect_user] = useState("");
  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = deposite.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
    } else {
      setRecords(deposite);
    }
    setselect_user(e.target.value);
  };
  // console.log(AddDeposite)
  const [selectedOption, setSelectedOption] = useState();

  const buttonRef = useRef(null);
  const filterRef = useRef(null);

  const [selectedDayE, setSelectedDayE] = useState();

  const [Diversity, setDiversity] = useState();
  const [account, setAccount] = useState();
  const editeRef=useRef(null);
  const handleshow = (row) => {
    editeRef.current.select();
    setAccount(row.account);
    setSelectedDayE(moment(row.date));
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
      // console.error('Invalid date format:', row.date);
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
    setEditDeposit(row);
    setOpenEdit(prev=> !prev);
  };
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

  const inputRef = useRef(null); // Create a ref for the input field

  useEffect(() => {
    const inputElement = document.querySelector(".form-control"); // Use the class or other selector
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus(); // Focus the input field
        inputElement.select(); // Select the text in the input field
      }, 0);
    }
  }, []);

  // useEffect(() => {

  // }, [Edit_Deposit.date, settings, setEndDate]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const columns = useMemo(() => {
    if (isDesktop) {
      return localStorage.getItem("userTokenname") === "admin"
        ? columnsDesktop
        : columnsDesktopsimple;
    }
    return columnsTablet;
  }, [isDesktop]);
  const [selectedOption1, setSelectedOption1] = useState();


  
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
          page: page,
          perPage: pageSize,
          delete:0,
          type:"all"
        },
      });
      console.log(response);
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
  }, [currentPage, perPage]);

  // مدیریت تغییر صفحه
  const handlePageChange = page => {
    setCurrentPage(page); // برو به صفحه جدید
  };


  return (
    <div
      className="container mt-5 w-100 h-100"
      onClick={(e) => {
        if (
          e.target.className === "container mt-5 w-100 h-100" ||
          e.target.className ===
            "col-12 w-100 row rounded-3 m-3 pe-5 p-1 bg-transparent"
        ) {
          setOpenEdit(false);
          setPopup(false);
        }
      }}
    >
      <form class="row w-100 rounded-3 m-3 p-1 bg-transparent">
        <div class="col-lg-2 col-md-3 col-sm-6 m-1 mt-3">
          <label for="category">Customer</label>
          <ComboBox
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
            options={belance}
            Onsearch={Onsearch}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6 m-0 mb-3 mt-3 ms-3 p-0 pe-4">
          <label for="price">Amount</label>
          <NumericFormat
            ref={inputRef}
            onKeyDown={handleKeyDown}
            thousandSeparator={true}
            name="amount"
            className="form-control"
            value={formattedValue}
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
            <label for="floatingTextarea2">Discription</label>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-12  mt-3 ps-3 p-0">
        <label htmlFor="category">Type</label>
            <select
              name="type"
              id="category"
              onChange={handleDeposite}
              value={AddDeposite.type}
              className="form-select w-50"
            >
              <option value="deposite">Deposite</option>
              <option value="withdraw">Withdraw</option>
            </select>
        </div>
        <div
          class="col-lg-1 col-md-3 col-sm-6 p-0 ps-0 ms-0"
          style={{ marginTop: "2.3rem" }}
        >
          <button
            onClick={() => {
              SumbitReport();
            }}
            ref={buttonRef}
            type="button"
            class="btn btn-success w-100"
          >
            ADD
          </button>
        </div>
      </form>

      <div
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4">All Transactions</h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-2 mb-lg-0 me-lg-2">
            <Datepicker
              onKeyDown={Hanlderef}
              default_value={StartDate}
              settings={settings}
              handle_date={(e) => setStartDate(e)}
              lebal={"Start"}
            />
          </div>
          <div className="mb-2 mb-lg-0 me-lg-2">
            <Datepicker
              onKeyDown={Hanlderef}
              default_value={EndDate}
              settings={settings}
              handle_date={(e) => setEndDate(e)}
              lebal={"End"}
            />
          </div>
          <button
            ref={filterRef}
            onClick={() => {
              filterDeposite();
            }}
            type="button"
            className="btn btn-success mb-2 mb-lg-0 w-100 w-lg-50 h-50"
            style={{ marginTop: "2rem" }}
          >
            Filter
          </button>

          <select
            id=""
            name="gender"
            className="form-select mb-2 mb-lg-0 ms-lg-5 mt-4"
            style={{ width: "100%", maxWidth: "200px" }}
            value={select_user}
            onChange={ChangeUser}
          >
            <option value={"all users"} style={{ height: "100px" }} selected>
              All Users
            </option>
            {user.map((item) => (
              <option value={item.name} key={item.name}>
                <p> {item.name}</p>
              </option>
            ))}
          </select>
        </div>
        <input
          className="form-control m-2 mb-2 mt-4"
          style={{ width: "100%", maxWidth: "200px" }}
          type="search"
          onChange={handleFilter}
          placeholder="Search"
          aria-label="Search"
        />
      </div>

      {/* <DataTable
        onRowClicked={handleshow}
        columns={columns}
        data={records}
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
      onRowClicked={handleshow}
        striped
        responsive
        highlightOnHover
      pagination
      paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
      paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
      onChangePage={handlePageChange} // تغییر صفحه
      onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه
    />
 
      <Edit_deposite
        useRef1={editeRef}
        setSelectedOption={setSelectedOption1}
        selectedOption={selectedOption1}
        money={money}
        accounts={accounts}
        setAccounts={setAccounts}
        records={records}
        setRecords={setRecords}
        handleKeyDown={handleKeyDown}
        setCash={setCash}
        Cash={Cash}
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
        // lebal={"Date"}
        setSelectedDay={setSelectedDayE}
        open={OpenEdit}
        closeEdit={() => setOpenEdit(false)}
      />
      {/* {edit && (
        <AccountEdit
          close={() => setEdit(false)}
          account={editAccount}
          setAccount={setEditAccount}
        />
      )} */}

      {/* <img style={{height:'6%',width:'6%'}} className="p-0" src={Add}/> */}
      {/* {(
        <Belance
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
        />
      )} */}
      {addAccountModal && (
        <AddAccount close={() => setAddAccountModal(false)} />
      )}
      {alert && <Alert />}
    </div>
  );
}
