import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
export default function AddMoney({
  setAdd,
  title,
  Addmoney,
  error,
  add,
  setmoney,
  money,
  setError,
  inputRef,
}) {
  const showAlert = useShowAlert(); 
  const handle = (e) => {
    setmoney({
      ...money,
      [e.target.name]: e.target.value,
      // user: parseInt(localStorage.getItem("userTokenid")),
    });
  };
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
  return (
    <div
  className={`rounded-4 row g-2 money popup m-4 mb-0 ${add && "show"} justify-content-center`}
  style={{
    width: "30vw",
    maxWidth: "100%",
  }}
>
  <h1
    className="text-center rounded m-0 p-2 w-100 text-light fs-4"
    style={{ backgroundColor: "var(--bs-info)" }}
  >
    <FormattedMessage id="Add Currency" />
  </h1>

  <div className="col-12 d-flex flex-column align-items-center">
    <label htmlFor="exampleInputEmail1" className="w-100 text-start">
      <FormattedMessage id="Currency Name" />
    </label>
    <input
      ref={inputRef}
      onKeyDown={handleKeyDown}
      type="text"
      name="name"
      onChange={handle}
      value={money.name}
      className="form-control"
      id="exampleInputEmail1"
      aria-describedby="emailHelp"
      style={{ width: "100%", maxWidth: "90%" }}
    />
  </div>

  <div className="col-12 d-flex justify-content-center mt-4 gap-2 flex-wrap">
    <button
      className="btn btn-danger text-light"
      style={{ width: "120px" }}
      onClick={() => {
        setAdd(false);
        setError(false);
      }}
    >
      <FormattedMessage id="Cancel" />
    </button>

    <button
      className="btn btn-success text-light"
      ref={buttonRef}
      style={{ width: "120px" }}
      onClick={() => Addmoney(money)}
    >
      <FormattedMessage id="Submit" />
    </button>
  </div>
</div>

  );
}