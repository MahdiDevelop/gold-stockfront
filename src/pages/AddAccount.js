import React, { useEffect, useRef, useState } from "react";
import Source from "../Source";
import axios from "axios";
import Swal from "sweetalert2";
import { useShowAlert  } from "../warrper";
// import { useAlert } from "../warrper"; 

import Profile from "../assets/icon/profile.png";
import IdNational from "../assets/icon/national_id.png";
import { useSelector, useDispatch } from 'react-redux';
import { addCustomerToCache, getCustomers } from "./Redux/customerSlice";
import { FormattedMessage,useIntl } from "react-intl";

export default function AddAccount({
  close,
  addAccountModal,
  records,
  setRecords,
  accounts,
  inputRef,
}) {
  // const showAlert = useAlert(); 
  const showAlert = useShowAlert(); 
  const [account, setAccount] = useState({
    profile_picture: Profile,
    national_id_picture: IdNational,
  });
  const dispatch=useDispatch();
  const [profile_picture, setProfilePicture] = useState(null);
  const [national_id_number, setNationalIdNumber] = useState("");
  const [national_id_picture, setNationalIdPicture] = useState(null);
  const [addresss, setAddresss] = useState("");
  const [whatsup_number, setWhatsupNumber] = useState("");
  const [name, setName] = useState("");
  const [father_name, setFatherName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [whatsapp, setWhatup] = useState("");
  const [serial,setserial]=useState("");

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (event.target.name === "profile_picture") {
        setProfilePicture(selectedImage);
        setAccount((prevState) => ({
          ...prevState,
          profile_picture: reader.result,
        }));
      } else if (event.target.name === "national_id_picture") {
        setNationalIdPicture(selectedImage);
        setAccount((prevState) => ({
          ...prevState,
          national_id_picture: reader.result,
        }));
      }
    };
    reader.readAsDataURL(selectedImage);
  };

  const Edit_Account = () => {
    const dateCreate = new Date();
    // const add = {
    //   id: 0,
    //   isdelete: "False",
    //   user_name: localStorage.getItem("userToken"),
    //   profile_picture: account.profile_picture,
    //   national_id_number: national_id_number,
    //   national_id_picture: account.national_id_picture,
    //   addresss: addresss,
    //   whatsup_number: whatsup_number,
    //   name: name,
    //   father_name: father_name,
    //   phone_number: phone_number,
    //   date_created: dateCreate.toISOString(),
    //   user: localStorage.getItem('userTokenid'),
    // };
    // console.log(add.date_created);
    const uploadData = new FormData();
    uploadData.append("isdelete", 0);
    uploadData.append("user_id", localStorage.getItem("userTokenid"));
    if (profile_picture) {
      uploadData.append("profile_picture", profile_picture);
    }
    uploadData.append("national_id_number", national_id_number);
    if (national_id_picture) {
      uploadData.append("national_id_picture", national_id_picture);
    }
    if(serial){
    uploadData.append("serial", serial);
    }
    uploadData.append("addresss", addresss);
    uploadData.append("whatsup_number", whatsup_number);
    uploadData.append("name", name);
    uploadData.append("father_name", father_name);
    uploadData.append("phone_number", phone_number);
    if (name) {
      axios
      .post(Source.getAddress() + "/api/customers", uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          'Content-Type': 'multipart/form-data', // multipart for file uploads
        },
      })
        .then((response) => {
          // console.log(response);
          // dispatch(addCustomerToCache(response.data.customer));
          let add = response.data.customer;
          add.date_created= new Date().toISOString();
          setRecords([add, ...records]);
          showAlert({
            position: "top-end",
            icon: "success",
            // title: "Customer added successfully!",
            title: <FormattedMessage id="Your record has been added!" />,
            showConfirmButton: false,
            timer: 1500,
          });
          close();
          setAccount({
            profile_picture: Profile,
            national_id_picture: IdNational,
          });
          setProfilePicture(null);
          setNationalIdNumber("");
          setNationalIdPicture(null);
          setAddresss("");
          setWhatsupNumber("");
          setName("");
          setFatherName("");
          setPhoneNumber("");
          setserial("");
        })
        .catch((error) => {
          console.error("Error:", error); // Log the error for debugging
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "Something went wrong!",
                        title: <FormattedMessage id="Not working ,please try again!" />,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      showAlert({
        position: "top-end",
        icon: "error",
        title:  <FormattedMessage id="You must enter the customer name!" />,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    };
  const buttonRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current && addAccountModal) {
        buttonRef.current.click();
      }
    }
  };
  const { formatMessage } = useIntl();

  return (
    <div
  className={`container rounded-5 popup customer ${addAccountModal ? "show" : ""}`}
  style={{
    maxWidth: "65%",
    overflow: "auto",
    maxHeight: "60vh!important",
    backgroundColor: "#f8f9fa",
    padding: "15px",
    zIndex: "10000"
  }}
>
  <div className="d-flex justify-content-end">
    <button
      type="button"
      className="btn-close h-25 p-3 mt-0 hover_btn"
      onClick={close}
      aria-label="Close"
    ></button>
  </div>
  
  <div className="p-1 rounded-5" dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}>
    <div className="row">
      <h1
        className="text-center rounded text-light"
        style={{ 
          backgroundColor: "var(--bs-info)", 
          width: "100%",
          fontSize: '1rem',
          // height: '1rem',
          padding: '0.5rem',
          // paddingBottom:'2.1rem',
        }}
      >
        <FormattedMessage id="Add Account" />
      </h1>

      {/* Left Column - Images */}
      <div className="col-12 col-md-4 d-flex flex-column align-items-center mt-1">
        <div>
          <img
            className="td_img rounded"
            src={account.profile_picture}
            style={{ height: "100px", width: "100px", objectFit: "cover" }}
            alt="Profile"
          />
        </div>
        <div className="mt-1" style={{ width: "100%" }}>
          <label htmlFor="profile_picture" style={{ fontWeight: "bold", fontSize: '0.8rem' }}>
            <FormattedMessage id="ProFile Picture" />
          </label>
          <input
            onKeyDown={handleKeyDown}
            type="file"
            accept="image/*"
            name="profile_picture"
            onChange={handleImageChange}
            className="form-control form-control-sm"
            style={{ 
              width: "100%",
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              height: '1.8rem'
            }}
          />
        </div>

        <div className="mt-1">
          <img
            className="td_img rounded"
            src={account.national_id_picture}
            style={{ height: "100px", width: "100px", objectFit: "cover" }}
            alt="National ID"
          />
        </div>
        <div className="mt-1" style={{ width: "100%" }}>
          <label htmlFor="national_id_picture" style={{ fontWeight: "bold", fontSize: '0.8rem' }}>
            <FormattedMessage id="National Id Picture" />
          </label>
          <input
            onKeyDown={handleKeyDown}
            type="file"
            accept="image/*"
            name="national_id_picture"
            onChange={handleImageChange}
            className="form-control form-control-sm"
            style={{ 
              width: "100%",
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              height: '1.8rem'
            }}
          />
        </div>
      </div>

      {/* Right Column - Form Inputs */}
      <div className="col-12 col-md-4 mt-3">
        <div className="row g-2">
          {[
            { id: "name", label: "Name", value: name, setter: setName },
            { id: "father_name", label: "Father Name", value: father_name, setter: setFatherName },
            { id: "national_id_number", label: "National Id Number", value: national_id_number, setter: setNationalIdNumber },
            { id: "phone_number", label: "Phone Number", value: phone_number, setter: setPhoneNumber, maxLength: 17 },
          ].map((field) => (
            <div className="col-12" key={field.id}>
              <label htmlFor={field.id} style={{ fontWeight: "bold", fontSize: '0.8rem' }}>
                <FormattedMessage id={field.label} />
              </label>
              <input
                ref={field.id === "name" ? inputRef : null}
                onKeyDown={handleKeyDown}
                onChange={(e) => field.setter(e.target.value)}
                value={field.value}
                type="text"
                name={field.id}
                placeholder={formatMessage({ id:field.label })}
                // placeholder={field.label}
                className="form-control form-control-sm"
                style={{ 
                  width: "100%",
                  fontSize: '0.5rem',
                  padding: '0.25rem 0.5rem!important',
                  height: '0.6rem!important'
                }}
                maxLength={field.maxLength}
              />
            </div>
          ))}

        </div>
      </div>
      <div className="col-12 col-md-4 mt-3">
        <div className="row g-2">
          {[
                      { id: "whatsup_number", label: "Whatsup Number", value: whatsup_number, setter: setWhatsupNumber, maxLength: 17 },
                      { id: "addresss", label: "Address", value: addresss, setter: setAddresss },
                      { id: "serial", label: "Serial Number", value: serial, setter: setserial }].map((field) => (
            <div className="col-12" key={field.id}>
              <label htmlFor={field.id} style={{ fontWeight: "bold", fontSize: '0.8rem' }}>
                <FormattedMessage id={field.label} />
              </label>
              <input
                ref={field.id === "name" ? inputRef : null}
                onKeyDown={handleKeyDown}
                onChange={(e) => field.setter(e.target.value)}
                value={field.value}
                type="text"
                name={field.id}
                // placeholder={field.label}
                placeholder={formatMessage({ id:field.label })}
                className="form-control form-control-sm"
                style={{ 
                  width: "100%",
                  fontSize: '0.5rem',
                  padding: '0.25rem 0.5rem!important',
                  height: '0.6rem!important'
                }}
                maxLength={field.maxLength}
              />
            </div>
          ))}

          <div className="col-12">
            <div className="form-check form-switch p-0 d-flex align-items-center mt-1">
              <label htmlFor="report" className="fw-bold m-2" style={{ fontSize: '0.8rem' }}>
                <FormattedMessage id="Whatsup MSG" />
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="report"
                checked={whatsapp}
                onChange={(e) => setWhatup(e.target.checked ? 1 : 0)}
                style={{ transform: 'scale(0.8)' , marginLeft: '0.5rem'}}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="col-12 d-flex justify-content-center mt-1">
        <button
          type="button"
          className="text-center btn btn-danger text-light ms-2 me-2 btn-sm "
          style={{ width: "130px" }}
          onClick={close}
        >
          <FormattedMessage id="Cancel" />
        </button>
        <button
          ref={buttonRef}
          type="button"
          className="text-center btn btn-success text-light ms-2 btn-sm ms-2"
          style={{ width: "130px" }}
          onClick={() => Edit_Account()}
        >
          <FormattedMessage id="Submit" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
