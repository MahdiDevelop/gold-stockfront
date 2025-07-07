import React, { useEffect, useRef, useState } from "react";
import Source from "../../Source";
import axios from "axios";
// import Swal from "sweetalert2";
import { showAlert } from "../../warrper";
import Profile from "../../assets/icon/profile.png";
import IdNational from "../../assets/icon/national_id.png";
import Datepicker_Customer from "../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Combo_Customer from "../forms/Combo_Customer";
// import Additem from "./AddItem";
import { NumericFormat } from "react-number-format";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
// import Expenses from "./Expenses";
export default function UpdateExpense({
  OptionsMoney,
    AddExpenseModel,
  close,AddExpenseData,setAddExpenseData,
  records,
  setRecords,
  options,
  setOptions,selectedOption, setSelectedOption,
  selectedOptionmoney, setSelectedOptionmoney,
  formattedValue, setFormattedValue,selectedDay, setSelectedDay
}) {
  // console.log(AddItem.type);
  const showAlert = useShowAlert(); 
  // const [selectedDay, setSelectedDay] = useState(moment()); 
  const [EndDate, setEndDate] = useState(moment());
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedOptionmoney, setSelectedOptionmoney] = useState({ name: "" });
  // const [formattedValue, setFormattedValue] = useState("");
//   const [AddExpenseData,setAddExpenseData]=useState({
//     amount:'',
//             ex_cat:'',
//             money_id :'',
//             description :'',
//             date :new Date().toISOString(), 
//             user_id:parseInt(localStorage.getItem("userTokenid"))
//   })
  const algorithm=(e)=>{
    // console.log(e);
    setSelectedOption(e);
    if(e) {
    setAddExpenseData({
      ...AddExpenseData,
      ex_cat: e.id,
    });}
  };
    // const [selectedOption, setSelectedOption] = useState();
    // const [options, setOptions] = useState([]);
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
      setAddExpenseData({
        ...AddExpenseData,
        date: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
 
  const AddAccountModal = (name) => {
    // console.log(name);
      let add = { name: name,
        user_id:localStorage.getItem('userTokenid')
       };
      axios
        .post(Source.getAddress() + "/api/expense/category", add, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          let data=res.data;
          // setSearchQuery(res.data.name);
        setAddExpenseData({
          ...AddExpenseData,
          ex_cat: res.data.id,
        });
          setOptions([data,...options]);  
          // handleInputChange("");
          setSelectedOption(res.data);
          // ← خیلی مهم
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
    const handleInputChange = (newValue) => {
      // console.log(newValue);
      setSearchQuery(newValue); // بروزرسانی مقدار ورودی جستجو
    };
    // useEffect(() => {
    //   // console.log(searchQuery);
    //   const fetchData = async () => {
    //     try {
    //       const response = await axios.get(`${Source.getAddress()}/api/expense/category`, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("access")}`,
    //         },
    //         params: { name:searchQuery }, // ارسال پارامتر جستجو به سرور
    //       });
    //       // setSelectedOption(response.data);
    //       const data = response.data;
    //       setOptions(data);
    //       // console.log('hhi');
    
    //       // if (data && data.length === 0) {
    //       //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
    //       // } else {
    //       //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
    //       // }
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   };
    
    //   if(searchQuery){
    //     if (!searchQuery || searchQuery?.length < 3) {
    //       setOptions([]);
    //       return;
    //     }else{
    //   // if (Exesting) {
    //       fetchData();}
    //     // }
    //   }
    // }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect
    const algorithmmoney = (e) => {
      setSelectedOptionmoney(e);
      if (e) {
        setAddExpenseData({
          ...AddExpenseData,
          money_id: e.id,
        });
      }
    };
      const submit = () => {
        console.log(AddExpenseData);
        if(selectedOption || selectedOptionmoney){
          AddExpenseData._method="PUT";
          let category=selectedOption;
          let money=selectedOptionmoney;
          // setSelectedOption();
          // setSelectedOptionmoney();
          axios
          .post(Source.getAddress() + "/api/expense/"+AddExpenseData.id, AddExpenseData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          })
          .then((res) => {
            // console.log(res);
            showAlert({
              position: "top-end",
              icon: "success",
              // title: "Item has been created!",
                                      title: <FormattedMessage id="Your record has been added!" />,
              showConfirmButton: false,
              timer: 1000,
            });
            // let item = {
            //   id: res.data.item.id,
            //   name: AddItem.name,
            //   type: selectedOption,
            //   user: {
            //     id: AddItem.user_id,
            //     name: localStorage.getItem("userToken"),
            //   },
            //   isdelete: 0,
            //   description: AddItem.description,
            //   date_creation: AddItem.date_creation,
            //   serial_number: AddItem.serial_number,
            // };
            // setFormattedValue(null);
            AddExpenseData['money']=money;
            AddExpenseData['category']=category;
            // setRecords([AddExpenseData, ...records]);
            setRecords(
              records.map(a => (a.id === AddExpenseData.id ? AddExpenseData : a))
            );
            // setAddExpenseData({
            //           amount:'',
            //           ex_cat:'',
            //           money_id :'',
            //           description :'',
            //           date :new Date().toISOString(), 
            //           user_id:parseInt(localStorage.getItem("userTokenid"))
            // });
            // setAddItem({
            //   name: "",
            //   type_id: "",
            //   user_id: parseInt(localStorage.getItem("userTokenid")),
            //   isdelete: 0,
            //   description: "",
            //   date_creation: new Date().toISOString(),
            //   serial_number: "",
            //   rate:"",
            //   weight:null,
            //   qty:null,
            // });
            // setSelectedDay(moment());
            close();
          })
          .catch((error) => {
            // console.log(error);
            showAlert({
              position: "top-end",
              icon: "error",
              // title: "Something went wrong!",
                                      title: <FormattedMessage id="Not working ,please try again!" />,
              showConfirmButton: false,
              timer: 1000,
            });
          });
        }else{
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "You Must fill all inputs!",
                    title:  <FormattedMessage id="You Must fill all inputs!" />,
            
            showConfirmButton: false,
            timer: 1000,
          });
        }
      };
      const handleChange = (e) => {
        const formattedValue = e.target.value;
        // Remove the thousand separators (commas)
        const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");
        setFormattedValue(formattedValue);
        setAddExpenseData({
          ...AddExpenseData,
          amount: unformattedValue,
        });
      };
  return (
    <div
  dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
  className={`container rounded-5 popup item ${AddExpenseModel ? "show" : ""}`}
  style={{
    width: "96%",
    maxWidth: "40% !important",
    overflowX: "auto",
    overflowY: "auto",
    height: "70vh",
    backgroundColor: "#f8f9fa",
    padding: "10px",
  }}
>
  <div className="d-flex justify-content-end">
    <button
      type="button"
      className="btn-close p-2 m-1 mt-0 hover_btn"
      onClick={close}
      aria-label="Close"
      style={{ fontSize: "0.7rem" }}
    ></button>
  </div>
  <div className="p-1 rounded-5">
    <div className="row">
      <h1
        className="text-center rounded p-2 text-light"
        style={{ 
          backgroundColor: "var(--bs-info)", 
          width: "100%",
          fontSize: "0.8rem",
          padding: "0.8rem"
        }}
      >
        <FormattedMessage id="Update Expense" />
      </h1>
      <div className="col-12 mt-3">
        <label for="validationServer01" className="fw-bold" style={{ fontSize: "0.8rem" }}>
          <FormattedMessage id="Expense Type" />
        </label>
        <Combo_Customer
          name={<FormattedMessage id="Add Type Expense" />}
          setAddAccountModal={AddAccountModal}
          type={true}
          searchQuery={searchQuery}
          handleInputChange={handleInputChange}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          options={options}
          Onsearch={algorithm}
          compactMode={true}
        />
  <label htmlFor="Amount" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                  <FormattedMessage id="Currency" />
                </label>
                <Combo_Customer
                  // isEditable={account}
                  setSelectedOption={algorithmmoney}
                  selectedOption={selectedOptionmoney}
                  options={OptionsMoney}
                  Onsearch={algorithmmoney}
                  compactMode={true}
                />
    
        {/* <label htmlFor="phone_number" style={{ fontWeight: "bold", marginTop: "0.5rem", fontSize: "0.8rem" }}>
          <FormattedMessage id="Serial Number" />
        </label>
        <input
        //   onChange={handleItem}
        //   value={AddItem.serial_number}
          type="text"
          name="serial_number"
          maxLength={10}
          placeholder="Phone Number"
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.3rem" }}
        /> */}
<label for="Amount">
            <FormattedMessage id="Amount" />
          </label>
          <NumericFormat
            // ref={inputRef}
            // onKeyDown={handleKeyDown}
            thousandSeparator={true}
            name="amount"
            className="form-control"
            value={formattedValue}
            placeholder="0"
            onChange={handleChange}
          />
        <Datepicker_Customer
          default_value={EndDate}
          handle_date={handle_date}
          lebal={<FormattedMessage id="Date" />}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
        />

        <div class="form-floating">
          <textarea
            value={AddExpenseData?.description}
            onChange={(e) => {
              setAddExpenseData({
                ...AddExpenseData,
                description: e.target.value,
              });
            }}
            name="description"
            class="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style={{ fontSize: "0.7rem", minHeight: "60px" }}
          ></textarea>
        </div>
      </div>
      
      <div className="col-12 d-flex justify-content-center mt-2">
        <button
          type="button"
          className="text-center btn btn-danger text-light me-2 ms-2"
          style={{ width: "120px", fontSize: "0.7rem", padding: "0.3rem" }}
          onClick={close}
        >
          <FormattedMessage id="Cancel" />
        </button>
        <button
          type="button"
          className="text-center btn btn-success text-light ms-2"
          style={{ width: "120px", fontSize: "0.7rem", padding: "0.3rem" }}
          onClick={submit}
        >
          <FormattedMessage id="Submit" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
