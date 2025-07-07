import React, { useEffect, useRef, useState } from "react";
import Source from "../../../Source";
import axios from "axios";
import Swal from "sweetalert2";
import Profile from "../../../assets/icon/profile.png";
import IdNational from "../../../assets/icon/national_id.png";
import Datepicker_Customer from "../../forms/Datepicker_customer";
import moment from "moment-jalaali";
import jalaali from "jalaali-js";
import Combo_Customer from "../../forms/Combo_Customer";
import Additem from "./AddItem";

export default function AddStock(
  {
      AddItemModal,
      close,
      Item,
      records,
      setRecords
  }
) {
  const [selectedDay, setSelectedDay] = useState(moment());
  const [selectedOption, setSelectedOption] = useState();
  const [EndDate, setEndDate] = useState(moment());
  const [AddItem, setAddItem] = useState({
    item_id: 0,
    qty: "0",
    weight: "0",
    dateInsert: new Date().toISOString(),
    rate: "0",
    user_id: localStorage.getItem("userTokenid"),
    purchase_price: "0",
    description: "Description",
    sell_price: "0",
  });
  const algorithm = (e) => {
    setAddItem({
      ...AddItem,
      item_id: e.id,
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
        dateInsert: isoString,
      });
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const sumbit = () => {
    if(AddItem.item_id===0){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "You must fill the item input!",
            showConfirmButton: false,
            timer: 1000,
          });
        return;
    }
    axios.post(Source.getAddress()+'/api/stock',AddItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`,
        },
      }).then((res)=>{
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Stock has been created!",
          showConfirmButton: false,
          timer: 1000,
        });
        let additem={};
        additem=AddItem;
        additem['item']=selectedOption;
        additem['user']={
          id: AddItem.user_id,
          name: localStorage.getItem("userToken"),
        };
        setRecords([additem, ...records]);
        close();
      }).catch((error)=>{
        console.log(error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Something went wrong!",
          showConfirmButton: false,
          timer: 1000,
        });
      })
  };
  const handleItem = (e) => {
    setAddItem({
      ...AddItem,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div
      className={`container rounded-5 popup item ${AddItemModal ? "show" : ""}`}
      style={{
        width: "100%",
        maxWidth: "40% !important",
        overflowX: "auto",
        overflowY: "auto",
        height: "80vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close p-3 m-1 mt-0 hover_btn"
            onClick={close}
          aria-label="Close"
        ></button>
      </div>
      <div className="p-1 rounded-5">
        <div className="row">
          <h1
            className="col-6 text-center rounded p-4 text-light"
            style={{ backgroundColor: "var(--bs-info)", width: "100%"  ,marginTop:"2rem"}}
          >
            Add Stock
          </h1>
          <div className="col-12 col-md-12 mt-5">
            <label for="validationServer01" className="fw-bold">Items</label>
            <Combo_Customer
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
                options={Item}
              Onsearch={algorithm}
            />
            <label
              htmlFor="phone_number"
              style={{ fontWeight: "bold", marginTop: "1rem" }}
            >
              Rate
            </label>
            <input
              // onKeyDown={handleKeyDown}
                onChange={handleItem}
              //   value={AddItem.serial_number}
              type="text"
              name="rate"
            //   maxLength={10}
              placeholder="Rate"
              className="form-control fs-6 mb-3"
              style={{ width: "100%" }}
            />
               <Datepicker_Customer
            // onKeyDown={handleKeyDown}
            default_value={EndDate}
            // settings={settings}
            handle_date={handle_date}
            lebal={"Date"}
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
          ></Datepicker_Customer>
         
            {/* <label for="floatingTextarea2" className="index-2">Discription</label> */}
            <div class="form-floating">
            <textarea
              name="description"
              class="form-control h-50"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
                value={AddItem.description}
              onClick={()=>{
                setAddItem({
                 ...AddItem,
                  description:""
                })
              }}
                onChange={handleItem}
            ></textarea>
          </div>
          </div>
        
          <div className="col-12 d-flex justify-content-center" style={{marginTop:'4rem'}}>
            <button
              type="button"
              className="text-center btn btn-danger text-light me-2"
              style={{ width: "150px" }}
                onClick={close}
            >
              Cancel
            </button>
            <button
              // ref={buttonRef}
              type="button"
              className="text-center btn btn-success text-light ms-2"
              style={{ width: "150px" }}
              onClick={sumbit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
