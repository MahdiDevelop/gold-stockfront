import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Select from 'react-select';
import Source from "../../Source";
import Swal from "sweetalert2";
// import Profile from "../assets/icon/profile.png";
import jalaali from "jalaali-js";
// import IdNational from "../assets/icon/national_id.png";
// import ComboBox from "./forms/ComboBox";
import ComboBox from "./ComboBox";
// import Select from "react-select";
import Datepicker_Customer from "./Datepicker_customer";
// import moment from "moment-jalaali";
// import Combo_Customer from "./forms/Combo_Customer";
// import Edit_account from "./forms/Edit_account";
import '../edite.css';
import Edit_deposite from "../Edit_deposite";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";


export default function Edit_ThirdDepttable({
  useRef1,
  selectedOption,
  setSelectedOption,
  Edit_Deposit,
  closeEdit,
  open,
  settings,
  EndDateE,
  account,
  setAccount,
  setEditDeposit,
  selectedDay,
  setSelectedDay,
  Diversity,
  setDiversity,
  setCash,
  Cash,
  belance,
  setbelance,
  records,
  setRecords,
  type,settype,primarytype,setprimarytype
}) {
  const [moneyid,setmoneyid]=useState();
  const showAlert = useShowAlert(); 
  const Onsearch = (row) => {
    if (row) {
      setmoneyid(row.moneyId);
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
      setEditDeposit({
        ...Edit_Deposit,
        account: row.id,
      });
    }
  };
  const [AddDeposite, setAddDeposite] = useState({
    user: 0,
    discription: "",
    amount: "",
    date: null,
    account: 0,
    type: "deposite",
    cash: 0,
    delete: "False",
  });
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
  const [idbelance, setidbelance] = useState(0);
  const [moneytype, setmoneytype] = useState(0);
  const [username, setusername] = useState("");
  const [moneyname, setmoneyname] = useState("");

  const Submit_Edit = async () => {
    // if(Edit_Deposit.type==='deposite'){
    //   try {
    //     let TotalDeversity = parseInt(Edit_Deposit.amount) - parseInt(Diversity);
    
    //     let edit_deposite1 = {
    //       user: Edit_Deposit.user,
    //       discription: Edit_Deposit.discription,
    //       amount: Edit_Deposit.amount,
    //       date: Edit_Deposit.date,
    //       account: Edit_Deposit.account,
    //       type: Edit_Deposit.type,
    //       cash: 0,
    //       delete: Edit_Deposit.delete,
    //     };
    
    //     // Update report
    //     await axios.put(
    //       `${Source.getAddress()}/api/report/${Edit_Deposit.id}`,
    //       edit_deposite1, { headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //         // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //       }}
    //     );
    //     // Edit_Deposit.amount=edit_deposite1.amount;
    //     console.log(edit_deposite1);
    //     const updateRecords = () => {
    //     };
    
    //     if (account === Edit_Deposit.account) {
    //       const belacne_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/belance/${Edit_Deposit.account}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const belacne_delete_primary = belacne_delete_primary_response.data;
    
    //       let belance_delete = {
    //         account: belacne_delete_primary.account,
    //         type: belacne_delete_primary.type,
    //         belance: belacne_delete_primary.belance + TotalDeversity,
    //         date_created: belacne_delete_primary.date_created,
    //         user: belacne_delete_primary.user,
    //         delete: "False",
    //       };
    
    //       const money_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/money/${belacne_delete_primary.moneyId}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const money_delete_primary = money_delete_primary_response.data;
    //       let cash_primary = parseInt(money_delete_primary.cach);
    
    //       let money_delete = {
    //         name: money_delete_primary.name,
    //         cach: cash_primary + TotalDeversity,
    //         delete: "False",
    //         user: money_delete_primary.user,
    //       };
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/belance/${belacne_delete_primary.id}`,
    //         belance_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       belacne_delete_primary.belance += TotalDeversity;
    //       setbelance(prevBelance =>
    //         prevBelance.map(a =>
    //           a.id === belacne_delete_primary.id ? belacne_delete_primary : a
    //         )
    //       );
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/money/${money_delete_primary.id}`,
    //         money_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       money_delete_primary.cach += TotalDeversity;
    //       setCash(prevCash =>
    //         prevCash.map(a =>
    //           a.id === money_delete_primary.id ? money_delete_primary : a
    //         )
    //       );
    
    //     } else {
    //       const belacne_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/belance/${account}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const belacne_delete_primary = belacne_delete_primary_response.data;
    
    //       let belance_delete = {
    //         account: belacne_delete_primary.account,
    //         type: belacne_delete_primary.type,
    //         belance: belacne_delete_primary.belance - parseInt(Diversity),
    //         date_created: belacne_delete_primary.date_created,
    //         user: belacne_delete_primary.user,
    //         delete: "False",
    //       };
    
    //       const money_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/money/${belacne_delete_primary.moneyId}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const money_delete_primary = money_delete_primary_response.data;
    //       let cash_primary = parseInt(money_delete_primary.cach);
    
    //       let money_delete = {
    //         name: money_delete_primary.name,
    //         cach: cash_primary - parseInt(Diversity),
    //         delete: "False",
    //         user: money_delete_primary.user,
    //       };
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/belance/${belacne_delete_primary.id}`,
    //         belance_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       belacne_delete_primary.belance -= parseInt(Diversity);
    //       setbelance(prevBelance =>
    //         prevBelance.map(a =>
    //           a.id === belacne_delete_primary.id ? belacne_delete_primary : a
    //         )
    //       );
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/money/${money_delete_primary.id}`,
    //         money_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       money_delete_primary.cach -= parseInt(Diversity);
    //       setCash(prevCash =>
    //         prevCash.map(a =>
    //           a.id === money_delete_primary.id ? money_delete_primary : a
    //         )
    //       );
    
    //       const belacne_delete_primary_response1 = await axios.get(
    //         `${Source.getAddress()}/api/belance/${Edit_Deposit.account}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const belacne_delete_primary1 = belacne_delete_primary_response1.data;
    
    //       let belance_delete1 = {
    //         account: belacne_delete_primary1.account,
    //         type: belacne_delete_primary1.type,
    //         belance: belacne_delete_primary1.belance + parseInt(Edit_Deposit.amount),
    //         date_created: belacne_delete_primary1.date_created,
    //         user: belacne_delete_primary1.user,
    //         delete: "False",
    //       };
    
    //       const money_delete_primary_response1 = await axios.get(
    //         `${Source.getAddress()}/api/money/${belacne_delete_primary1.moneyId}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const money_delete_primary1 = money_delete_primary_response1.data;
    //       let cash_primary1 = parseInt(money_delete_primary1.cach);
    
    //       let money_delete1 = {
    //         name: money_delete_primary1.name,
    //         cach: cash_primary1 + parseInt(Edit_Deposit.amount),
    //         delete: "False",
    //         user: money_delete_primary1.user,
    //       };
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/belance/${belacne_delete_primary1.id}`,
    //         belance_delete1, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       belacne_delete_primary1.belance += parseInt(Edit_Deposit.amount);
    //       setbelance(prevBelance =>
    //         prevBelance.map(a =>
    //           a.id === belacne_delete_primary1.id ? belacne_delete_primary1 : a
    //         )
    //       );
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/money/${money_delete_primary1.id}`,
    //         money_delete1, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       money_delete_primary1.cach += parseInt(Edit_Deposit.amount);
    //       setCash(prevCash =>
    //         prevCash.map(a =>
    //           a.id === money_delete_primary1.id ? money_delete_primary1 : a
    //         )
    //       );
    
    //       Edit_Deposit.customer = username;
    //       Edit_Deposit.moneyType = moneyname;
    //       Edit_Deposit.moneyId = moneyid;
    //       Edit_Deposit.account = idbelance;
          
    //     }
        
    //     setRecords(prevRecords =>
    //       prevRecords.map(record =>
    //         record.id === Edit_Deposit.id ? { ...record, ...Edit_Deposit } : record
    //       )
    //     );
    //     console.log(Edit_Deposit);
    //     console.log(Cash)
    //     console.log(belance)
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "success",
    //       title: "Updated Successfully!",
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "error",
    //       title: "Not updated successfully!",
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //   }
    // }else{
    //   try {
    //     let TotalDeversity = parseInt(Edit_Deposit.amount) - parseInt(Diversity);
    
    //     let edit_deposite1 = {
    //       user: Edit_Deposit.user,
    //       discription: Edit_Deposit.discription,
    //       amount: Edit_Deposit.amount,
    //       date: Edit_Deposit.date,
    //       account: Edit_Deposit.account,
    //       type: Edit_Deposit.type,
    //       cash: 0,
    //       delete: Edit_Deposit.delete,
    //     };
    
    //     // Update report
    //     await axios.put(
    //       `${Source.getAddress()}/api/report/${Edit_Deposit.id}`,
    //       edit_deposite1, { headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //         // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //       }}
    //     );
    //     // Edit_Deposit.amount=edit_deposite1.amount;
    //     console.log(edit_deposite1);
    //     const updateRecords = () => {
    //     };
    
    //     if (account === Edit_Deposit.account) {
    //       const belacne_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/belance/${Edit_Deposit.account}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const belacne_delete_primary = belacne_delete_primary_response.data;
    
    //       let belance_delete = {
    //         account: belacne_delete_primary.account,
    //         type: belacne_delete_primary.type,
    //         belance: belacne_delete_primary.belance - TotalDeversity,
    //         date_created: belacne_delete_primary.date_created,
    //         user: belacne_delete_primary.user,
    //         delete: "False",
    //       };
    
    //       const money_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/money/${belacne_delete_primary.moneyId}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const money_delete_primary = money_delete_primary_response.data;
    //       let cash_primary = parseInt(money_delete_primary.cach);
    
    //       let money_delete = {
    //         name: money_delete_primary.name,
    //         cach: cash_primary - TotalDeversity,
    //         delete: "False",
    //         user: money_delete_primary.user,
    //       };
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/belance/${belacne_delete_primary.id}`,
    //         belance_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       belacne_delete_primary.belance -= TotalDeversity;
    //       setbelance(prevBelance =>
    //         prevBelance.map(a =>
    //           a.id === belacne_delete_primary.id ? belacne_delete_primary : a
    //         )
    //       );
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/money/${money_delete_primary.id}`,
    //         money_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       money_delete_primary.cach -= TotalDeversity;
    //       setCash(prevCash =>
    //         prevCash.map(a =>
    //           a.id === money_delete_primary.id ? money_delete_primary : a
    //         )
    //       );
    
    //     } else {
    //       const belacne_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/belance/${account}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const belacne_delete_primary = belacne_delete_primary_response.data;
    
    //       let belance_delete = {
    //         account: belacne_delete_primary.account,
    //         type: belacne_delete_primary.type,
    //         belance: belacne_delete_primary.belance + parseInt(Diversity),
    //         date_created: belacne_delete_primary.date_created,
    //         user: belacne_delete_primary.user,
    //         delete: "False",
    //       };
    
    //       const money_delete_primary_response = await axios.get(
    //         `${Source.getAddress()}/api/money/${belacne_delete_primary.moneyId}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const money_delete_primary = money_delete_primary_response.data;
    //       let cash_primary = parseInt(money_delete_primary.cach);
    
    //       let money_delete = {
    //         name: money_delete_primary.name,
    //         cach: cash_primary + parseInt(Diversity),
    //         delete: "False",
    //         user: money_delete_primary.user,
    //       };
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/belance/${belacne_delete_primary.id}`,
    //         belance_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       belacne_delete_primary.belance += parseInt(Diversity);
    //       setbelance(prevBelance =>
    //         prevBelance.map(a =>
    //           a.id === belacne_delete_primary.id ? belacne_delete_primary : a
    //         )
    //       );
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/money/${money_delete_primary.id}`,
    //         money_delete, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       money_delete_primary.cach += parseInt(Diversity);
    //       setCash(prevCash =>
    //         prevCash.map(a =>
    //           a.id === money_delete_primary.id ? money_delete_primary : a
    //         )
    //       );
    
    //       const belacne_delete_primary_response1 = await axios.get(
    //         `${Source.getAddress()}/api/belance/${Edit_Deposit.account}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const belacne_delete_primary1 = belacne_delete_primary_response1.data;
    
    //       let belance_delete1 = {
    //         account: belacne_delete_primary1.account,
    //         type: belacne_delete_primary1.type,
    //         belance: belacne_delete_primary1.belance - parseInt(Edit_Deposit.amount),
    //         date_created: belacne_delete_primary1.date_created,
    //         user: belacne_delete_primary1.user,
    //         delete: "False",
    //       };
    
    //       const money_delete_primary_response1 = await axios.get(
    //         `${Source.getAddress()}/api/money/${belacne_delete_primary1.moneyId}`, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       const money_delete_primary1 = money_delete_primary_response1.data;
    //       let cash_primary1 = parseInt(money_delete_primary1.cach);
    
    //       let money_delete1 = {
    //         name: money_delete_primary1.name,
    //         cach: cash_primary1 - parseInt(Edit_Deposit.amount),
    //         delete: "False",
    //         user: money_delete_primary1.user,
    //       };
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/belance/${belacne_delete_primary1.id}`,
    //         belance_delete1, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       belacne_delete_primary1.belance -= parseInt(Edit_Deposit.amount);
    //       setbelance(prevBelance =>
    //         prevBelance.map(a =>
    //           a.id === belacne_delete_primary1.id ? belacne_delete_primary1 : a
    //         )
    //       );
    
    //       await axios.put(
    //         `${Source.getAddress()}/api/money/${money_delete_primary1.id}`,
    //         money_delete1, { headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
    //           // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
    //         }}
    //       );
    //       money_delete_primary1.cach -= parseInt(Edit_Deposit.amount);
    //       setCash(prevCash =>
    //         prevCash.map(a =>
    //           a.id === money_delete_primary1.id ? money_delete_primary1 : a
    //         )
    //       );
    
    //       Edit_Deposit.customer = username;
    //       Edit_Deposit.moneyType = moneyname;
    //       Edit_Deposit.moneyId = moneyid;
    //       Edit_Deposit.account = idbelance;
          
    //     }
        
    //     setRecords(prevRecords =>
    //       prevRecords.map(record =>
    //         record.id === Edit_Deposit.id ? { ...record, ...Edit_Deposit } : record
    //       )
    //     );
    //     console.log(Edit_Deposit);
    //     console.log(Cash)
    //     console.log(belance)
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "success",
    //       title: "Updated Successfully!",
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //   } catch (err) {
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "error",
    //       title: "Not updated successfully!",
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //   }
    // }
    if (account === Edit_Deposit.account) {
      // console.log(Edit_Deposit);
      axios.put(
       `${Source.getAddress()}/api/report/${Edit_Deposit.id}/`,
       Edit_Deposit, { headers: {
         'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
         // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
       }}
     ).then((res)=>{
      console.log(res);
       setRecords(prevRecords =>
         prevRecords.map(record =>
           record.id === res.data.report.id ? { ...record, ...res.data.report } : record
         )
       );
      //  dispatch(updateBelanceInCache(res.data.belance));
      //  dispatch(updateReportInCache(res.data.report_belance));
      //  dispatch(updateMoneyInCache(res.data.moneys));
   showAlert({
     position: "top-end",
     icon: "success",
     title: <FormattedMessage id="Updated Successfully!"/>,
     showConfirmButton: false,
     timer: 1000,
   });

     }).catch((err)=>{
       console.log(err);
       showAlert({
         position: "top-end",
         icon: "error",
         title: <FormattedMessage id="Not Updated Successfully!"/>,
         showConfirmButton: false,
         timer: 1000,
       });
     })
    } else {
      // Edit_Deposit['MainWDW']=MainDW;
      // console.log(Edit_Deposit);
      axios.put(
        `${Source.getAddress()}/api/report/${Edit_Deposit.id}/`,
        Edit_Deposit, {
          params:{
            type:'change',
          },
          headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        }}
      ).then((res)=>{
        console.log(res);
        setRecords(prevRecords =>
          prevRecords.map(record =>
            record.id === res.data.report.id ? { ...record, ...res.data.report } : record
          )
        );
        // dispatch(updateBelanceInCache(res.data.belance));
        // dispatch(updateBelanceInCache(res.data.secondbelance));
        // // dispatch(updateReportInCache(res.data.secondreport_belance));
        // // dispatch(updateReportInCache(res.data.report_belance));
        // dispatch(updateMoneyInCache(res.data.moneys));
    showAlert({
      position: "top-end",
      icon: "success",
      // title: "Updated Successfully!",
     title: <FormattedMessage id="Updated Successfully!"/>,

      showConfirmButton: false,
      timer: 1000,
    });
      }).catch((err)=>{
        console.log(err);
        showAlert({
          position: "top-end",
          icon: "error",
          // title: "Not updated successfully!",
         title: <FormattedMessage id="Not Updated Successfully!"/>,
          showConfirmButton: false,
          timer: 1000,
        });
      })


    }
    closeEdit();
  };
  

  const handle_date = (jalaliDate) => {
    setDiversity(0);
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
      setEditDeposit({
        ...Edit_Deposit,
        date: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handleChange=(e)=>{
    settype(e);
    setEditDeposit((prevState) => ({
      ...prevState,
      type: e.name,
    }));
    // setEditDeposit(prev({
    //   ...Edit_Deposit,
    //   type:e
    // }));
  }

  const handleAll = (e) => {
    if (e.target.name === "amount") {
      setEditDeposit({
        ...Edit_Deposit,
        [e.target.name]: e.target.value,
      });
    } else {
      setEditDeposit({
        ...Edit_Deposit,
        [e.target.name]: e.target.value,
      });
    }
  };
  const [add, setadd] = useState({
    id: 0,
    account: 0,
    type: 0,
    belance: 0,
    date_created: "",
    moneyType: "",
    account_name: "",
    moneyId: 0,
    user: 0,
    user_name: "",
    delete: false,
  });
  const [bbelance, setbbelance] = useState({
    account: null,
    type: null,
    belance: 0,
    date_created: "",
    user: null,
    delete: false,
  });

  const buttonRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };

  const options1=[
    { name: 'deposite',label:'deposite'},
    { name: 'withdraw',label:'withdraw'},
  ]
  const customStyles = {
    container: (provided) => ({
      ...provided,
      margin: '2rem 0 ', // Apply margin here
    }),}
  return (
    <div
      className={`container rounded-5 popup res ${open ? "show" : ""}`}
      style={{
        // maxWidth: "80%",
        overflowX: "auto",
        overflowY: "auto",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-end ">
        <button
          type="button"
          className="btn-close align-self-end p-3 m-1 mt-0 hover_btn"
          onClick={closeEdit}
          aria-label="Close"
        ></button>
      </div>
      <div
        className="h-50 rounded-5"
        style={{ transition: "all", transitionDuration: 1000 }}
      >
        <div className="row" style={{ flexWrap: "wrap", margin: 0 }}>
          <h1
            className="text-center rounded p-4 text-light"
            style={{ backgroundColor: "var(--bs-info)", width: "100%" }}
          >
                        <FormattedMessage id="Edit Transaction" />
          </h1>
          <div className="col-12 col-md-6 d-flex flex-column  mt-5 ">
            <label for="category">                        <FormattedMessage id="Customer" />
            </label>
            <ComboBox
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              options={belance}
              Onsearch={Onsearch}
              onKeyDown={handleKeyDown}
            />
            {/* <Select
            styles={customStyles}
            value={type}
            onChange={handleChange}
            options={options1}
            getOptionValue={(option) => `${option.name}`}

            isSearchable={false}
            /> */}
            <Datepicker_Customer
              onKeyDown={handleKeyDown}
              default_value={EndDateE}
              settings={settings}
              handle_date={handle_date}
              lebal={                        <FormattedMessage id="Date" />              }
              setSelectedDay={setSelectedDay}
              selectedDay={selectedDay}
            ></Datepicker_Customer>
            <div
              className="col-12 mt-1 mb-6"
              style={{ maxWidth: "100%", padding: "0 15px" }}
            ></div>

            <div
              className="col-12 mt-1"
              style={{ maxWidth: "100%", padding: "0 15px" }}
            ></div>
          </div>
          <div
            className="col-12 col-md-6 mt-5"
            style={{ maxWidth: "100%", padding: "0 15px" }}
          >
            <label htmlFor="national_id_number">                        <FormattedMessage id="Amount" />            </label>
            <input
              ref={useRef1}
              onKeyDown={handleKeyDown}
              type="text"
              name="amount"
              placeholder="Amount"
              className="form-control fs-6 mb-3"
              value={Edit_Deposit.amount}
              onChange={handleAll}
              style={{ width: "100%" }}
            />
            <div class="form-floating">
              <textarea
                name="discription"
                class="form-control h-50"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                value={Edit_Deposit.discription}
                onChange={handleAll}
                onKeyDown={handleKeyDown}
              ></textarea>
              <label for="floatingTextarea2">                        <FormattedMessage id="Description" />              </label>
            </div>
          </div>

          <div className="col-12 d-flex flex-column flex-md-row justify-content-center margin">
            <button
              type="button"
              className="text-center form-control w-100 w-md-25 btn btn-outline-danger me-1 mb-2 mb-md-0"
              onClick={closeEdit}
            >
                                      <FormattedMessage id="Cancel" />
            </button>
            <button
              type="button"
              ref={buttonRef}
              className="text-center form-control w-100 w-md-25 btn btn-outline-success"
              onClick={Submit_Edit}
            >
                                      <FormattedMessage id="Submit" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
