import React, { useEffect, useRef, useState } from "react";
import Source from "../../../Source";
import axios from "axios";
// import Swal from "sweetalert2";
import { showAlert } from "../../../warrper";
import Profile from "../../../assets/icon/profile.png";
import IdNational from "../../../assets/icon/national_id.png";
import Datepicker_Customer from "../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Combo_Customer from "../../forms/Combo_Customer";
import Additem from "./AddItem";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../../warrper";
export default function Edititem({
  AddItemModal,
  close,
  Itemtype,
  records,
  setRecords,
  AddItem,
  setAddItem,
  selectedOption, setSelectedOption
}) {
  // console.log(AddItem.type);
  const showAlert = useShowAlert(); 
  const [selectedDay, setSelectedDay] = useState(moment()); 
  const [EndDate, setEndDate] = useState(moment());

  const algorithm=(e)=>{
    setSelectedOption(e);
    setAddItem({
      ...AddItem,
      type_id: e.id,
    });
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
        date_creation: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const sumbit=()=>{
    const uploadData ={
      name:AddItem.name,
      type_id:AddItem.type_id,
      serial_number:AddItem.serial_number,
      date_creation:AddItem.date_creation,
      description:AddItem.description,  
      _method:"put",
    };
    axios.post(Source.getAddress()+'/api/item/'+AddItem.id,uploadData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("access")}`,
      },
    }).then((res)=>{
      showAlert({
        position: "top-end",
        icon: "success",
        // title: "Item has been Updated!",
                  title: <FormattedMessage id="Your record has been updated!" />,
        
        showConfirmButton: false,
        timer: 1000,
      });
      let item={
        id:res.data.id,
        name:AddItem.name,
        type:selectedOption,
        isdelete:0,
        description:AddItem.description,
        date_creation:AddItem.date_creation,
        serial_number:AddItem.serial_number,
      }
      // setRecords([item, ...records]);
      setRecords(prevRecords =>
        prevRecords.map(record =>
          record.id === AddItem.id ? {...record,...item} : record
        )
      );
      close();
    }).catch((error)=>{
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "Something went wrong!",
                                          title: <FormattedMessage id="Not working ,please try again!" />,
        showConfirmButton: false,
        timer: 1000,
      });
    })
  }
  const handleItem = (e) => {
    setAddItem({
      ...AddItem,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div
  dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
  className={`container rounded-5 popup item ${AddItemModal ? "show" : ""}`}
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
        <FormattedMessage id="Update Item" />
      </h1>
      <div className="col-12 mt-3">
        <label htmlFor="name" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="Name" />
        </label>
        <input
          onChange={handleItem}
          value={AddItem.name}
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.3rem" }}
        />

        <label for="validationServer01" className="fw-bold" style={{ fontSize: "0.8rem" }}>
          <FormattedMessage id="Item Type" />
        </label>
        <Combo_Customer
          setSelectedOption={algorithm}
          selectedOption={selectedOption}
          options={Itemtype}
        />

        <label htmlFor="phone_number" style={{ fontWeight: "bold", marginTop: "0.5rem", fontSize: "0.8rem" }}>
          <FormattedMessage id="Serial Number" />
        </label>
        <input
          onChange={handleItem}
          value={AddItem.serial_number}
          type="text"
          name="serial_number"
          maxLength={10}
          placeholder="Phone Number"
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.3rem" }}
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
            name="description"
            class="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            value={AddItem.description}
            onChange={handleItem}
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
          onClick={sumbit}
        >
          <FormattedMessage id="Submit" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
