import axios from 'axios';
import React, { useState,useRef } from 'react'
import Source from '../../Source';
// import Swal from "sweetalert2"; 
import { showAlert } from '../../warrper';
import { useSelector, useDispatch } from 'react-redux';
import getMoneys from "../Redux/moneysSlice";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
export default function Updatemoney({setAdd ,money,setmoney,update,updateRef,record,setRecords}) {
  // const dispatch = useDispatch();
  // const { moneys, errorm } = useSelector((state) => state.moneys);
  const showAlert = useShowAlert(); 

  const updatemoney = (userId) => {
    money._method='put';
    axios
      .post(`${Source.getAddress()}/api/money/${userId}`, money,{ headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
      }},)
      .then((response) => {
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Money updated successfully !",
          title: <FormattedMessage id="Your record has been added!" />,

          showConfirmButton: false,
          timer: 1000,
        });
        setRecords(
          record.map(a => (a.id === money.id ? money : a))
        );
      })
      .catch((error) => {
        console.log(error);
        showAlert({
          position: "top-end",
          icon: "error",
          title: <FormattedMessage id="Not working ,please try again!" />,
          showConfirmButton: false,
          timer: 1000
        });
      });
      // dispatch(getMoneys());
  };
  const handle=(e)=>setmoney({
    ...money,
      [e.target.name] : e.target.value
  })
const buttonRef = useRef(null);
const handleKeyDown = (e) => {
  if (e.key === 'Enter') { // Check if the Enter key was pressed
    e.preventDefault(); // Prevent default action if needed
    if (buttonRef.current && update) {
      buttonRef.current.click(); // Programmatically click the button
    }
  }
};
  return (


<div
      className={`rounded-4 row money g-2 popup m-4 mb-0 ${
        update && "show"
      }`}
      style={{width: "30vw",
        maxWidth: "100%", }}
    >
      <h1
        className="text-center rounded m-0 p-2 w-100 text-light fs-4"
        style={{ backgroundColor: "var(--bs-info)" }}
      >
                                              <FormattedMessage id="Add Currency" />
      </h1>
      <div class="col-md-12"> <label htmlFor="exampleInputEmail1" className="">
      <FormattedMessage id="Currency Name" />

          </label>
          <input
          // autoFocus
            ref={updateRef}
            onKeyDown={handleKeyDown}
            type="text"
            name="name"
            onChange={handle}
            value={money.name}
            className="form-control w-100"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            style={{width: '70%'}}
          />
      </div>
      <div className="col-10 ms-4 m-10 mt-5 ps-3 d-flex"  >
        <a
          className="text-center form-control btn btn-danger text-light me-1 ms-1"
          style={{ margin: "auto", width: "150px" }}
          onClick={()=>setAdd(false)}
          // ref={buttonRef}
        >
                <FormattedMessage id="Cancel" />
        </a>
        <a
          className="text-center btn form-control btn-success text-light ms-1"
          ref={buttonRef}
          style={{ margin: "auto", width: "150px" }}
          onClick={()=>
            {updatemoney(money.id);
              setAdd(false);
            }}

        >
                <FormattedMessage id="Submit" />
        </a>
      </div>
    </div>

  )
}