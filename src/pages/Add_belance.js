import React, { useEffect, useState, useRef } from "react";
import Source from "../Source";
import axios from "axios";
// import Swal from "sweetalert2";
// import { showAlert } from "../warrper";
import Profile from "../assets/icon/profile.png";
import IdNational from "../assets/icon/national_id.png";
import Combo_Customer from "./forms/Combo_Customer";
import Datepicker from "./forms/Datepicker";
import Select from "react-select";
import jalaali from "jalaali-js";
import Datepicker_Customer from "./forms/Datepicker_customer";
import moment from "moment-jalaali";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers } from "./Redux/customerSlice";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../warrper";

export default function Add_belance({
  setAccounts,
  close,
  addAccountModal,
  records,
  setRecords,
  // setAddAccountModal,
  setAddcustomerModal,
  // customers,
  accounts,
  money,
  // settings,
}) {
  // console.log(money);
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  const { customers, errorc, statusc } = useSelector(
    (state) => state.customers
  );
  // useEffect(() => {
  //   // بررسی و بارگذاری `belances`
  //   // if (!statusb && belances) {
  //   //   dispatch(getBelances());
  //   // }

  //   // // بررسی و بارگذاری `moneys`
  //   // if (!statusm && moneys) {
  //   //   dispatch(getMoneys());
  //   // }

  //   // بررسی و بارگذاری `customers`
  //   if (!statusc  && customers) {
  //     dispatch(getCustomers());
  //   }

  //   // if(!statuss && settings) {
  //   //   dispatch(getSettings());
  //   // }
  // }, [dispatch, statusc, customers]);
  const [options,setOptions]=useState([]);
  const [bbelance, setbbelance] = useState({
    account_id: null,
    type_id: null,
    belance: "0",
    date_created: "",
    user_id: localStorage.getItem('userTokenid'),
    isdelete: 0,
  });
  const [customer, setcustomers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(moment());
  const [selectedOption, setSelectedOption] = useState();
  const [add, setadd] = useState({
    id: 0,
    account_id: 0,
    type_id: 0,
    belance: "0",
    date_created: "",
    moneyType: "",
    account_name: "",
    moneyId: 0,
    user_id: localStorage.getItem("userTokenid"),
    user_name: localStorage.getItem("userToken"),
    isdelete: 0,
  });
  const [Customer, setCustomer] = useState({
    national_id_picture: "",
    profile_picture: "",
    national_id_number: "",
    isdelete: "False",
    user_id: "",
    address: "",
    whatsup_number: "",
    name: "",
    father_name: "",
    phone_number: "",
    // ontransaction:'True'
  });
  const [smoney, setsmeony] = useState([]);
  const algorithm = (e) => {
    setSelectedOption(e);
    if (e) {
      setCustomer(e);
      setbbelance({
        ...bbelance,
        account_id: e.id,
      });
      setadd({
        ...add,
        account_name: e.name,
        account_id: e.id,
      });
      setsmeony(e.missing_moneys);
      // const find = records.filter((p) => p.account_id === e.id);
      // let moneys = [];
      // for (let i = 0; i < money.length; i++) {
      //   const res = find.find((r) => r.type_id === money[i].id);
      //   if (!res) {
      //     moneys.push(money[i]);
      //   }
      // }
      // setsmeony(moneys);
      // axios.get(Source.getAddress() + '/api/money', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('access')}`,
      //   },params: {
      //     delete: '0',
      //     account_id: e.id,
      //   },
      // }).then((res)=>{
      // setsmeony(res.data.available_currencies);

      // }).catch((err)=>{
      //   console.log(err);
      // });
    }
  };
  const [nmoney, setnmoney] = useState();
  const handle = (e) => {
    const date = new Date();
    // console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.toLocaleTimeString()}`);
    const isoString = date.toISOString();
    // console.log(isoString);
    setnmoney(e);
    if (e) {
      setbbelance({
        ...bbelance,
        user_id: localStorage.getItem("userTokenid"),
        type_id: e.id,
        date_created: isoString,
      });
      const newId =
        records.length > 0
          ? Math.max(...records.map((record) => record.id)) + 1
          : 1;
      setadd({
        ...add,
        user_id: localStorage.getItem("userTokenid"),
        type_id: e.id,
        id: newId,
        belance: "0",
        date_created: isoString,
        moneyType: e.name,
        user_name: localStorage.getItem("userToken"),
      });
    }
  };

  const handle_date = (jalaliDate) => {
    // console.log(jalaliDate);
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        now.getHours(),
        now.getMinutes()
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC

      // setIsoDate(isoString);
      // console.log(isoString);
      setbbelance({
        ...bbelance,
        date_created: isoString,
      });
      setadd({ ...add, date_created: isoString });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const [national_id_picture, setNationalIdPicture] = useState();
  const [ProfilePicture, setProfilePicture] = useState();
  const sumbit = () => {
    if (!nmoney) {
      showAlert({
        position: "top-end",
        icon: "error",
        title: <FormattedMessage id="You Must fill all inputs!"/>,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    axios
      .post(Source.getAddress() + "/api/belance", bbelance, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
          "Content-Type": "application/json",
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },
      })
      .then((res) => {
        setadd((prev) => [{ ...prev, id: res.data.id }]);
        let customer = {
          national_id_number: Customer.national_id_number,
          isdelete: Customer.isdelete,
          user: Customer.user,
          address: Customer.address,
          whatsup_number: Customer.whatsup_number,
          name: Customer.name,
          father_name: Customer.father_name,
          phone_number: Customer.phone_number,
          ontransaction: 1,
        };
        axios
          .put(
            Source.getAddress() + "/api/customers/" + `${Customer.id}/`,
            customer,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
                // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
              },
            }
          )
          .then((res) => {
            showAlert({
              position: "top-end",
              icon: "success",
              title: <FormattedMessage id="Your record has been added!" />,
              showConfirmButton: false,
              timer: 800,
            });
          })
          .catch((err) => {
            console.log(err);
            showAlert({
              position: "top-end",
              icon: "error",
                                      title: <FormattedMessage id="Not working ,please try again!" />,
              
              showConfirmButton: false,
              timer: 800,
            });
          });

        setbbelance({
          account: null,
          type: null,
          belance: "0",
          date_created: "",
          user_id: localStorage.getItem('userTokenid'),
          isdelete: 0,
        });
        setSelectedOption({ name: "" });
        setnmoney(null);
        setsmeony(null);
        setSelectedDay(moment());

        // console.log(bbelance);
        setRecords([add, ...records]);
        close();
      })
      .catch((err) => {
        console.log(err);
        showAlert({
          position: "top-end",
          icon: "error",
                                  title: <FormattedMessage id="Not working ,please try again!" />,
          showConfirmButton: false,
          timer: 800,
        });
      });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const buttonRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current && add) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };
  // const [options, setOptions] = useState(customers);

  const handleInputChange = (newValue) => {
    setSearchQuery(newValue); // بروزرسانی مقدار ورودی جستجو
    // handleSearch(newValue); // ارسال درخواست جستجو به سرور
  };
  const handleSearch = async (query) => {
    // if (query.length < 3) {
    //   // برای جلوگیری از ارسال درخواست بیش از حد، درخواست فقط اگر ورودی بیشتر از 2 حرف باشد ارسال شود
    //   setOptions([]);
    //   return;
    // }
    // try {
    //   const response = await axios.get(`${Source.getAddress()}/api/customers`, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("access")}`,
    //     },
    //     params: { query: query }, // ارسال پارامتر جستجو به سرور
    //   });
    //   //   console.log(query);
    //   const data = response.data;
    //   // تبدیل داده‌ها به فرمت مناسب برای react-select
    //   let formattedOptions = data;
    //   setOptions(formattedOptions);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // } finally {
    // }
  };
  // const [Exesting, setExesting] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Source.getAddress()}/api/customers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: { query:searchQuery ,do:'ok'}, // ارسال پارامتر جستجو به سرور
        });
        // setSelectedOption(response.data);
        const data = response.data;
        setOptions(data);
        // setnmoney(data.missing_moneys);
        // console.log(response);
        // if (data && data.length === 0) {
        //   setSelectedOptionTo({ id: 0, name: searchQueryTo });
        // } else {
        //   setOptionsTo(data); // ذخیره داده‌ها برای نمایش در لیست
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if(searchQuery){
      if (!searchQuery || searchQuery?.length < 3) {
        setOptions([]);
        return;
      }else{
        fetchData();}
    }
  }, [searchQuery]); // اضافه کردن searchQuery به وابستگی‌های useEffect
// console.log(smoney);
  return (
    <div
      className={`rounded-4 row g-2 popup m-4 mb-0 ${
        addAccountModal && "show"
      }`}
      style={{ width: "20rem" }}
    >
      <div className="d-flex justify-content-end m-0 p-0">
        <button
          type="button"
          class="btn-close align-self-end p-3 m-1 mt-0 hover_btn"
          onClick={() => {
            close();
          }}
          aria-label="Close"
        ></button>
      </div>
      <h1
        className="text-center rounded m-0 p-2 w-100 text-light fs-4"
        style={{ backgroundColor: "var(--bs-info)" }}
      >
                                  <FormattedMessage id="Add Account" />
      </h1>
      <div class="col-md-6">
        <label for="validationServer01" className="fw-bold">
        <FormattedMessage id="Customer Name" />
        </label>
        <Combo_Customer
          name={          <FormattedMessage id="Add Customer" />          }
          setAddAccountModal={setAddcustomerModal}
          type={true}
          searchQuery={searchQuery}
          handleInputChange={handleInputChange}
          setSelectedOption={algorithm}
          selectedOption={selectedOption}
          options={options}
          // Onsearch={algorithm}
        />
        <div class="valid-feedback">Looks good!</div>
      </div>
      <div class="col-md-6">
        <label for="validationServer02" className="fw-bold">
        <FormattedMessage id="Currency" />
        </label>
        {/* <input type="text" class="form-control is-valid" id="validationServer02" value="" required /> */}
        <div className="w-40">
          <Select
            onKeyDown={handleKeyDown}
            value={nmoney}
            onChange={handle}
            options={smoney}
            getOptionLabel={(option) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <img src={option.pictureUrl} alt={`Portrait of ${option.firstName} ${option.lastName}`} style={{ width: '30px', marginRight: '10px' }} /> */}
                <span>{`${option.name} `}</span>
              </div>
            )}
            getOptionValue={(option) => `${option.name}`}
            // placeholder={`${<FormattedMessage id="Search" />}`}
            isClearable
            isSearchable
            isDisabled={smoney ? false : true}
          />
        </div>
        <div class="valid-feedback">Looks good!</div>
      </div>
      <div className="coll-10">
        <Datepicker_Customer
          onKeyDown={handleKeyDown}
          default_value={""}
          // settings={settings}
          handle_date={handle_date}
          lebal={<FormattedMessage id="Date" />}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
        ></Datepicker_Customer>
      </div>
      <div className="col-10 ms-4 m-10 mt-5 ps-3 d-flex">
        <a
          className="text-center form-control btn btn-danger text-light me-1 ms-1"
          style={{ margin: "auto", width: "150px" }}
          onClick={close}
        >
                    <FormattedMessage id="Cancel" />
        </a>
        <a
          className="text-center btn form-control btn-success text-light ms-1"
          ref={buttonRef}
          style={{ margin: "auto", width: "150px" }}
          onClick={() => {
            sumbit();
          }}
        >
                    <FormattedMessage id="Submit" />
        </a>
      </div>
    </div>
  );
}
