import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Source from "../Source";
import Swal from "sweetalert2";
import Profile from "../assets/icon/profile.png";
import IdNational from "../assets/icon/national_id.png";
import './edite.css';
import { useSelector, useDispatch } from 'react-redux';
import { addCustomerToCache, updateCustomerInCache } from "./Redux/customerSlice";
import { showAlert } from "../warrper";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../warrper";
export default function CustomersEdit({
  id,
  close,
  account,
  setAccount,
  edit,
  records,
  setRecords,
  inputRef,loading,setLoading
}) {
  const showAlert = useShowAlert(); 
  const [profile_picture, setProfilePicture] = useState(null);
  const [national_id_picture, setNationalIdPicture] = useState(null);
  const [serial,setserial]=useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAndSetImage = async (url, setImage) => {
      try {
        // const response = await fetch(url);
        const response = await fetch(url, {
          mode: 'no-cors', // فعال کردن حالت CORS
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // اگر توکن لازم است، می‌توانید این هدر را تنظیم کنید
          },
        });
        if(!response.ok){
          console.log(response);
        }
        const blob = await response.blob();
        const filename = url.substring(url.lastIndexOf("/") + 1);
        const file = new File([blob], filename, {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        console.log(file);
        setImage(file);
      } catch (error) {
        console.error("Error converting URL to File:", error);
      }
    };
    if (
      account.profile_picture &&
      typeof account.profile_picture === "string"
    ) {
      fetchAndSetImage(account.profile_picture, setProfilePicture);
    }
    if (
      account.national_id_picture &&
      typeof account.national_id_picture === "string"
    ) {
      fetchAndSetImage(account.national_id_picture, setNationalIdPicture);
    }
  }, [account.profile_picture, account.national_id_picture]);

  // useEffect(() => {
  //   const fetchAndSetImage = async (url, setImage) => {
  //     try {
  //       // اینجا از blob صرف نظر می‌کنیم و فقط فایل را از URL ایجاد می‌کنیم
  //       const filename = url.substring(url.lastIndexOf("/") + 1);

  //       // ایجاد فایل جدید از URL
  //       const file = new File([], filename, {
  //         lastModified: new Date().getTime(),
  //         type: "image/jpeg", // نوع فایل را اینجا مشخص می‌کنید
  //       });

  //       // به‌روزرسانی state با فایل
  //       setImage(file);
  //       console.log(file);
  //     } catch (error) {
  //       console.error("Error converting URL to File:", error);
  //     }
  //   };

  //   // بررسی و بازیابی تصویر پروفایل
  //   if (account.profile_picture && typeof account.profile_picture === "string") {
  //     fetchAndSetImage(account.profile_picture, setProfilePicture);
  //   }

  //   // بررسی و بازیابی تصویر کارت ملی
  //   if (account.national_id_picture && typeof account.national_id_picture === "string") {
  //     fetchAndSetImage(account.national_id_picture, setNationalIdPicture);
  //   }
  // }, []);



  const [profile_picture1, setProfilePicture1] = useState(null);
  const [national_id_picture1, setNationalIdPicture1] = useState(null);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (event.target.name === "profile_picture") {
        setProfilePicture1(selectedImage);
        setAccount((prevState) => ({
          ...prevState,
          profile_picture: reader.result,
        }));
      } else if (event.target.name === "national_id_picture") {
        setNationalIdPicture1(selectedImage);
        setAccount((prevState) => ({
          ...prevState,
          national_id_picture: reader.result,
        }));
      }
    };
    reader.readAsDataURL(selectedImage);
  };
//   const Edit_Account = () => {
//     console.log(account.id);
//     const uploadData = new FormData();

    // let update = {
    //     id: account.id,
    //     isdelete: "False",
    //     user: 0,
    //     name: "",
    //     date_created: "",
    //     father_name: "",
    //     national_id_number: "",
    //     phone_number: "",
    //     whatsup_number: 0,
    //     addresss: "",
    //     profile_picture: "",
    //     national_id_picture: "",
    //     user_name: "",
    // };

    // update.date_created = account.date_created;
    // update.user_name = account.user_name;

//     if (profile_picture1) {
//         uploadData.append("profile_picture", profile_picture1);
//         console.log(profile_picture1);
        // update.profile_picture = profile_picture1;  // Update to use new picture
//     } else {
        // update.profile_picture = account.profile_picture;  // Fallback to existing
//     }

//     if (national_id_picture1) {
//         console.log(national_id_picture1);
//         uploadData.append("national_id_picture", national_id_picture1);
        // update.national_id_picture = national_id_picture1;  // Update to use new ID picture
//     } else {
//         update.national_id_picture = account.national_id_picture;  // Fallback to existing
//     }

//     uploadData.append("isdelete", 0);
//     uploadData.append("user_id", localStorage.getItem("userTokenid"));
    // update.isdelete = 0;
    // update.user = account.user;
    // update.national_id_number = account.national_id_number;
//     uploadData.append("national_id_number", account.national_id_number);
    // update.addresss = account.addresss;
//     uploadData.append("addresss", account.addresss);
    // update.whatsup_number = account.whatsup_number;
//     uploadData.append("whatsup_number", account.whatsup_number);
    // update.name = account.name;
//     uploadData.append("name", account.name);
    // update.father_name = account.father_name;
//     uploadData.append("father_name", account.father_name);
    // update.phone_number = account.phone_number;
//     uploadData.append("phone_number", account.phone_number);

//     console.log(update);

//     fetch(`${Source.getAddress()}/api/customers/${account.id}/`, {
//         method: "PUT",
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("access")}`,
            // "Content-Type": "application/json",
//             // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
//         },
//         body: uploadData,
//     })
//     .then((res) => {
//         if (!res.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log(data);
//         showAlert({
//             position: "top-end",
//             icon: "success",
//             title: "Updated successfully!",
//             showConfirmButton: false,
//             timer: 1500,
//         });
//         setRecords(records.map((a) => (a.id === update.id ? update : a)));
//         close();
//     })
//     .catch((error) => { 
//         console.error(error);
//         showAlert({
//             position: "top-end",
//             icon: "error",
//             title: "Something went wrong!",
//             showConfirmButton: false,
//             timer: 1500,
//         });
//     });
// };


// import axios from 'axios';
// import Swal from 'sweetalert2';

// import axios from 'axios';
// import Swal from 'sweetalert2';

// const Edit_Account = () => {
//   const uploadData = new FormData();

//   // Gather data from the account
//   const update = {
//       id: account.id,
//       // سایر داده‌ها
//   };

//   // چک کردن فیلدهای ضروری
//   // const requiredFields = ['name', 'father_name', 'national_id_number', 'phone_number', 'addresss'];
//   // const missingFields = requiredFields.filter(field => !update[field]);

//   // if (missingFields.length > 0) {
//   //     showAlert({
//   //         icon: "error",
//   //         title: "Missing Fields",
//   //         text: `Please fill in the following fields: ${missingFields.join(', ')}`,
//   //     });
//   //     return;
//   // }

//   // اضافه کردن تصاویر به uploadData به صورت Blob
//   if (profile_picture1) {
//     console.log(profile_picture1);
//       uploadData.append("profile_picture", profile_picture1);
//   }

//   if (national_id_picture1) {
//     console.log(national_id_picture1);
//       uploadData.append("national_id_picture", national_id_picture1);
//   }

//   // اضافه کردن سایر داده‌ها
//   uploadData.append("name", account.name);
//   uploadData.append("father_name", account.father_name);
//   uploadData.append("national_id_number", account.national_id_number);
//   uploadData.append("phone_number", account.phone_number);
//   uploadData.append("whatsup_number", account.whatsup_number);
//   uploadData.append("addresss", account.addresss);

//   // Send PUT request
//   axios.put(`${Source.getAddress()}/api/customers/${account.id}/`, uploadData, {
//       headers: {

//           Authorization: `Bearer ${localStorage.getItem("access")}`,
//       },
//   })
//   .then((res) => {
//     console.log(res)
//       showAlert({
//           position: "top-end",
//           icon: "success",
//           title: "Updated successfully!",
//           showConfirmButton: false,
//           timer: 1500,
//       });
      // setRecords(records.map((a) => (a.id === update.id ? { ...update, ...res.data } : a)));
//       close();
//   })
//   .catch((error) => {
//     console.log(error);
//       // خطاها را مدیریت کنید
//   });
// };




  const Edit_Account = () => {
    const uploadData = new FormData();
    console.log(account);
    let update = {
      id: account.id,
      isdelete: 0,
      user: 0,
      name: "",
      date_created: "",
      father_name: "",
      national_id_number: "",
      phone_number: "",
      whatsup_number: 0,
      addresss: "",
      profile_picture: "",
      national_id_picture: "",
      user_name: "",
  };
  update.date_created = account.date_created;
  update.user_name = account.user_name;
    uploadData.append("_method", 'PUT');
    update.isdelete = 0;
    update.user = account.user;
    update.national_id_number = account.national_id_number;
    update.addresss = account.addresss;
    update.whatsup_number = account.whatsup_number;
    update.name = account.name;
    update.father_name = account.father_name;
    update.phone_number = account.phone_number;

    // Update fields
    uploadData.append("isdelete", 0);
    // uploadData.append("user_id", account.user.id);
    account.national_id_number && uploadData.append("national_id_number", account.national_id_number);
    account.addresss && uploadData.append("addresss", account.addresss);
    account.whatsup_number && uploadData.append("whatsup_number", account.whatsup_number);
    account.name && uploadData.append("name", account.name);
    account.father_name && uploadData.append("father_name", account.father_name);
    account.phone_number && uploadData.append("phone_number", account.phone_number);
    uploadData.append("whatsup", account.whatsup);
    
    if(account.serial){
      uploadData.append("serial", account.serial);
      }
    // Append files if they exist
    if (profile_picture1) {
      uploadData.append("profile_picture", profile_picture1); // Ensure this is a file
    const reader = new FileReader();
    reader.onload = () => {
        update.profile_picture = reader.result;  // Update to use new picture
      }
      reader.readAsDataURL(profile_picture1);

    }
  
    if (national_id_picture1) {
    const reader = new FileReader();
      // update.national_id_picture = national_id_picture1;  // Update to use new ID picture
      uploadData.append("national_id_picture", national_id_picture1); // Ensure this is a file
      reader.onload = () => {
        update.national_id_picture = reader.result;  // Update to use new picture
      }
      reader.readAsDataURL(national_id_picture);
      // console.log("National ID Picture:", national_id_picture1);
    }
  
    // Make the API call
    axios
      .post(Source.getAddress() + "/api/customers/" + `${account.id}`, uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
          // Do NOT set 'Content-Type' header here
        },
      })
      .then((res) => {
      setRecords(records.map((a) => (a.id === update.id ? res.data.customer  : a)));
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Updated successfully!",
               title: <FormattedMessage id="Updated Successfully!"/>,
          
          showConfirmButton: false,
          timer: 600,
        });           
        // setRecords(records.map((a) => (a.id === account.id ? res.data.account : a)));
        close();
      })  
      .catch((error) => {
        // console.log("Error:", error);
        showAlert({
          position: "top-end",
          icon: "error",
          // title: "Something went wrong!",
                   title: <FormattedMessage id="Not Updated Successfully!"/>,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  
  const handleAll = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

  // const handleImageChange = (event, setImageState, setAccountImageField) => {
  //   const selectedImage = event.target.files[0];
  //   setImageState(selectedImage);
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setAccount((prevState) => ({
  //       ...prevState,
  //       [setAccountImageField]: reader.result,
  //     }));
  //   };
  //   reader.readAsDataURL(selectedImage);
  // };

  const buttonRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current && edit) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };
  const { formatMessage } = useIntl();

  return (
<div
  className={`container rounded-5 customer popup ${edit ? "show" : ""}`}
  style={{
    overflowX: "auto",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
    padding: "10px",
  }}
>
  <div className="d-flex justify-content-end">
    <button
      type="button"
      className="btn-close align-self-end p-2 h-25 m-1 mt-0 hover_btn"
      onClick={close}
      aria-label="Close"
      style={{ fontSize: "0.5rem" }}
    ></button>
  </div>
  <div
    className="h-50 rounded-5"
    style={{ transition: "all", transitionDuration: 1000 }}
  >
    <div className="row" style={{ flexWrap: "wrap", margin: 0 }}>
      <h1
        className="text-center rounded text-light"
        style={{ 
          backgroundColor: "var(--bs-info)", 
          width: "100%",
          fontSize: '1rem',
          height: '1rem',
          padding: '1.5rem',
        }}
      >
        <FormattedMessage id="Edit Account" />
      </h1>
      <div
        className="col-12 col-md-4 d-flex flex-column align-items-center"
        style={{ maxWidth: "100%", padding: "0 10px" }}
      > 
        <div>
          <img
            className="td_img rounded"
            src={account.profile_picture || Profile}
            style={{ height: "100px", width: "100px", objectFit: "cover" }}
            alt="Profile"
          />
        </div>
        <div
          className="col-12 mt-1 mb-3"
          style={{ maxWidth: "100%", padding: "0 10px" }}
        >
          <label htmlFor="profile_picture" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
            <FormattedMessage id="ProFile Picture" />
          </label>
          <input
            type="file"
            accept="image/jpeg"
            name="profile_picture"
            onChange={(e) => {
              handleImageChange(e);
            }}
            className="form-control"
            style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
          />
        </div>

        <div>
          <img
            className="td_img rounded"
            src={account.national_id_picture || IdNational}
            style={{ height: "100px", width: "100px", objectFit: "cover" }}
            alt="National ID"
          />
        </div>
        <div
          className="col-12 mt-1"
          style={{ maxWidth: "100%", padding: "0 10px" }}
        >
          <label
            htmlFor="national_id_picture"
            style={{ fontWeight: "bold", fontSize: "0.8rem" }}
          >
            <FormattedMessage id="National Id Picture" />
          </label>
          <input
            type="file"
            accept="image/*"
            name="national_id_picture"
            onChange={(e) => {
              handleImageChange(e);
            }}
            className="form-control"
            style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
          />
        </div>
      </div>
      <div
        className="col-12 col-md-4 mt-3"
        style={{ maxWidth: "100%", padding: "0 10px" }}
      >
        <label htmlFor="name" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="Name" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          ref={inputRef}
          onChange={handleAll}
          value={account.name}
          type="text"
          name="name"
          placeholder={formatMessage({ id:"Name" })}
          // placeholder="Name"
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
        <label
          htmlFor="father_name"
          style={{ fontWeight: "bold", fontSize: "0.8rem" }}
        >
          <FormattedMessage id="Father Name" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handleAll}
          value={account.father_name}
          type="text"
          name="father_name"
          // placeholder="Father Name"
          placeholder={formatMessage({ id:"Father Name" })}
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
        <label htmlFor="national_id_number" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="National Id Number" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handleAll}
          value={account.national_id_number}
          type="text"
          name="national_id_number"
          // placeholder="National Id Number"
          placeholder={formatMessage({ id:"National Id Number" })}
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
        <label htmlFor="phone_number" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="Phone Number" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handleAll}
          value={account.phone_number}
          type="text"
          name="phone_number"
          maxLength={17}
          // placeholder="Phone Number"
          placeholder={formatMessage({ id:"Phone Number" })}
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
   
      </div>
      <div
        className="col-12 col-md-4 mt-3"
        style={{ maxWidth: "100%", padding: "0 10px" }}
      >
             <label htmlFor="whatsup_number" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="Whatsup Number" />
        </label>
        <input      
          onChange={handleAll}
          onKeyDown={handleKeyDown}
          value={account.whatsup_number}
          type="text"
          name="whatsup_number"
          maxLength={17}
          // placeholder="Whatsup Number"
          placeholder={formatMessage({ id:"Whatsup Number" })}
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
        <label htmlFor="addresss" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="Address" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handleAll}
          value={account.addresss}
          type="text"
          name="addresss"
          placeholder={formatMessage({ id:"Address" })}
          // placeholder="Address"
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
        <label htmlFor="whatsup_number" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
          <FormattedMessage id="Serial Number" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handleAll}
          value={account.serial}
          type="text"
          name="serial"
          maxLength={17}
          // placeholder="Serial Number"
          placeholder={formatMessage({ id:"Serial Number" })}
          className="form-control mb-2"
          style={{ width: "100%", fontSize: "0.7rem", padding: "0.2rem" }}
        />
        <div
          className="form-check form-switch p-0 center d-flex ms-3"
          style={{ width: "4rem", height: "1.5rem" }}
        >
          <label for="validationServer01" className="fw-bold" style={{ fontSize: "0.8rem" }}>
            <FormattedMessage id="Whatsup MSG" />
          </label>
          <input
            className="form-check-input align-bottom w-50 h-75 mt-2 ms-2 mb-1"
            type="checkbox"
            id="report"
            checked={account.whatsup}
            onChange={(e) => {
              setAccount({...account,
                whatsup: e.target.checked ? 1 : 0
              });
            }}
          />
        </div>
      </div>
      <div className="col-12 d-flex flex-column flex-md-row justify-content-center mt-3 mb-1">
        <button
          type="button"
          className="text-center form-control w-100 w-md-25 btn btn-outline-danger me-1 mb-1 mb-md-0 ms-1"
          onClick={close}
          style={{ fontSize: "0.7rem", padding: "0.2rem" }}
        >
          <FormattedMessage id="Cancel" />
        </button>
        <button
          type="button"
          ref={buttonRef}
          className="text-center form-control w-100 w-md-25 btn btn-outline-success ms-1"
          onClick={Edit_Account}
          style={{ fontSize: "0.7rem", padding: "0.2rem" }}
        >
          <FormattedMessage id="Submit" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
