import React, { useEffect, useState,useRef } from "react";
import Source from "../../Source";
import axios from "axios";
// import Swal from "sweetalert2";
import { showAlert } from "../../warrper";
import Combo_Customer from ".././forms/Combo_Customer";
import Datepicker from ".././forms/Datepicker";
import Select from "react-select";
import jalaali from "jalaali-js";
import Datepicker_Customer from ".././forms/Datepicker_customer";
import moment from "moment-jalaali";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers } from "../Redux/customerSlice";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
export default function Edit_account({
  selectedOption, setSelectedOption,
  nmoney, setnmoney,
  Editefull,setEditeFull,
  setAccounts,
  close,
  addAccountModal,
  records,
  setRecords,
  // customers,
  accounts,
  money,
  settings,
  bbelance,
  setbbelance,smoney, setsmeony,add,setadd
}) {
  const dispatch = useDispatch();
  const showAlert = useShowAlert(); 
  const { customers, errorc, statusc } = useSelector(
    (state) => state.customers
  );
  useEffect(() => {
    // بررسی و بارگذاری `belances`
    // if (!statusb && belances) {
    //   dispatch(getBelances());
    // }

    // // بررسی و بارگذاری `moneys`
    // if (!statusm && moneys) {
    //   dispatch(getMoneys());
    // }

    // بررسی و بارگذاری `customers`
    if (!statusc  && !customers) {
      dispatch(getCustomers());
    }

    // if(!statuss && settings) {
    //   dispatch(getSettings());
    // }
  }, [dispatch, statusc, customers]);
  const [selectedDay, setSelectedDay] = useState(moment());
  const algorithm = (e) => {
    setnmoney('');
    if (e) {
      setbbelance({
        ...bbelance,
        account: e.id,
      });
      setadd({
        ...add,
        account_name:e.name,
        account: e.id,
      });
      // find the main account in belance
      const find = records.filter((p) => p.account === e.id);
      let moneys = [];
      for (let i = 0; i < money.length; i++) {
        const res = find.find((r) => r.type === money[i].id);
        if (!res) {
          moneys.push(money[i]);
        }
      }
      setsmeony(moneys);
    }
  };
  const handle = (e) => {
    const date = new Date();
    const isoString = date.toISOString();

    setnmoney(e);
    if (e) {
     
      setbbelance({
        ...bbelance,
        user: localStorage.getItem("userTokenid"),
        type: e.id,
        date_created: isoString,
      });
            setadd({
              ...add,
              user: localStorage.getItem("userTokenid"),
              type: e.id,
              id:Editefull.id,
              date_created:isoString,
              moneyType:e.name,
               user_name:localStorage.getItem("userToken"),  
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
        now.getMinutes(),
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC

      // setIsoDate(isoString);
      console.log(isoString);
      setbbelance({
        ...bbelance,
        date_created: isoString,
      });
      setadd({...add,
        date_created:isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };

  const sumbit = () => {
    bbelance._method='put';
    axios
      .post(Source.getAddress() + "/api/belance/"+Editefull.id+'/', bbelance, {headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
      }})
      .then((res) => {
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Your belance has been added !",
          title: <FormattedMessage id="Your record has been updated!" />,
          showConfirmButton: false,
          timer: 800,
        });

         setbbelance({
          account: null,
          type: null,
          belance: 0,
          date_created: "",
          user: null,
          isdelete: false,
         })
         setSelectedOption(null);
         setnmoney(null);
         setsmeony(null);
         setSelectedDay(moment());

        // console.log(bbelance);
        // setRecords(records.map((a) => (a.id === update.id ? update : a)));
        setRecords(records.map((a) => (a.id === add.id ? add : a)));
        close();
      })
      .catch((err) => {
        showAlert({
          position: "top-end",
          icon: "error",
                                  title: <FormattedMessage id="Not working ,please try again!" />,
          showConfirmButton: false,
          timer: 800,
        });
      });
  };

  const buttonRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current && add) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };
  

  return (
    <div
      className={`rounded-4 row g-2 popup m-4 mb-0 ${
        addAccountModal && "show"
      }`}
      style={{ width: "26rem" }}
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
                            <FormattedMessage id="Edit Account" />
      </h1>
      <div class="col-md-6">
        <label for="validationServer01" class="">
        <FormattedMessage id="Customer Name" />
        </label>
        <Combo_Customer setSelectedOption={setSelectedOption} selectedOption={selectedOption} options={customers} Onsearch={algorithm} />
        <div class="valid-feedback">Looks good!</div>
      </div>
      <div class="col-md-6">
        <label for="validationServer02" class="">
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
            placeholder={`${<FormattedMessage id="Search" />}`}
            isClearable
            isSearchable
            // isDisabled={smoney ? false : true}
          />
        </div>
        <div class="valid-feedback">Looks good!</div>
      </div>
      <div className="coll-10">
        <Datepicker_Customer
            onKeyDown={handleKeyDown}
          default_value={""}
          settings={settings}
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
