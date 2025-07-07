import React, { useEffect, useRef, useState } from "react";
import Source from "../../Source";
import axios from "axios";
import Swal from "sweetalert2";
import Profile from "../../assets/icon/profile.png";
import IdNational from "../../assets/icon/national_id.png";
import CompanyPic from '../../assets/icon/company.png'
import { useDispatch } from "react-redux";
import { showAlert } from "../../warrper";
import { updateSettingInCache } from "../Redux/settingSlice";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
import imageCompression from 'browser-image-compression';
export default function AddInfo({
  close,
  addAccountModal,
  records,
  setRecords,
  accounts,
  inputRef,
  settings,
  setsettings,
  setLoading
}) {
  const showAlert = useShowAlert(); 
  const dispatch=useDispatch();
  const [Company_pic,setCompanypic]=useState(settings[0]?.company_pic||CompanyPic);
  const [Company_pic_send,setCompany_pic_send]=useState();
  const [Company_info,setCompany_info]=useState({
    name:'',
    email:'',
    phone:'',
    address:'',
    description:'',
  });
  
  const [account, setAccount] = useState({
    profile_picture: Profile,
    national_id_picture: IdNational,
  });



  useEffect(() => {
    const fetchAndSetImage = async (url, setImage) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = url.substring(url.lastIndexOf("/") + 1);
        const file = new File([blob], filename, {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        setImage(file);
      } catch (error) {
        // console.error("Error converting URL to File:", error);
      }
    };
    if (
      settings[0]?.Company_pic &&
      typeof settings[0].CompanyPic === "string"
    ) {
      fetchAndSetImage(settings[0].CompanyPic, setCompany_pic_send);
    }
  }, [settings.CompanyPic]);


  const [profile_picture, setProfilePicture] = useState(null);
  const [national_id_number, setNationalIdNumber] = useState("");
  const [national_id_picture, setNationalIdPicture] = useState(null);
  const [addresss, setAddresss] = useState("");
  const [whatsup_number, setWhatsupNumber] = useState("");
  const [name, setName] = useState("");
  const [father_name, setFatherName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        setCompany_pic_send(selectedImage);
        setCompanypic(reader.result);


        
    // ایجاد یک کپی از آرایه موجود در company_info
    const updatedCompanyInfo = [...settings];
    // به‌روزرسانی مقدار نام برای اولین آبجکت (مثلاً اندیس 0)
    updatedCompanyInfo[0] = {
      ...updatedCompanyInfo[0],
      'company_pic': reader.result,
    };
    // تنظیم وضعیت با آرایه به‌روزرسانی شده
    setsettings(updatedCompanyInfo);
        
    };
    reader.readAsDataURL(selectedImage);
  };
  // console.log(settings);

  // const Edit_Account = () => {
  //   const uploadData = new FormData();
  //   if(Company_pic_send){
  //     uploadData.append('company_pic',Company_pic_send);
  //   }else{
  //     console.log('No Picture');
  //   }

  //   uploadData.append('company_name',settings[0].company_name);
  //   uploadData.append('description',settings[0].description);
  //   uploadData.append('address',settings[0].address);
  //   uploadData.append('phone',settings[0].phone);
  //   uploadData.append('email',settings[0].email);
  //   uploadData.append('_method',"PUT");

  //   axios.post(Source.getAddress()+ `/api/settings/${settings[0].id}`,uploadData,{
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
  //       // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
  //     }
  //   })
  //   .then((res) => {
  //     // console.log(res);
  //     dispatch(updateSettingInCache(res.data.settings));
  //     showAlert({
  //       position: "top-end",
  //       icon: "success",
  //       // title: `${name} successfully uploaded !`,
  //       title: <FormattedMessage id="Updated Successfully!"/>,
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   }).catch((err) => {
  //     // console.log(err);
  //     showAlert({
  //       position: "top-end",
  //       icon: "error",
  //       // title: "something went wrong !",
  //       title: <FormattedMessage id="Something went wrong!"/>,            
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   })
  // };
  
  const Edit_Account = async () => {
    const uploadData = new FormData();
  
    if (Company_pic_send) {
      try {
        // تنظیمات برای فشرده‌سازی و تغییر سایز تصویر
        const options = {
          maxSizeMB: 1, // حداکثر حجم فایل (1MB)
          maxWidthOrHeight: 400, // تغییر سایز به 400x400 پیکسل
          useWebWorker: true, // استفاده از Web Worker برای بهبود عملکرد
          fileType: 'image/png', // تبدیل به فرمت PNG
        };
  
        // فشرده‌سازی و تغییر سایز تصویر
        const compressedFile = await imageCompression(Company_pic_send, options);
  
        // اضافه کردن تصویر فشرده‌شده به FormData
        uploadData.append('company_pic', compressedFile, 'company_pic.png');
      } catch (error) {
        console.error('Error compressing image:', error);
        showAlert({
          position: "top-end",
          icon: "error",
          title: <FormattedMessage id="Image compression failed!" />,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
    } else {
      console.log('No Picture');
    }
  
    // اضافه کردن سایر فیلدها به FormData
    uploadData.append('company_name', settings[0].company_name);
    uploadData.append('description', settings[0].description);
    uploadData.append('address', settings[0].address);
    uploadData.append('phone', settings[0].phone);
    uploadData.append('email', settings[0].email);
    uploadData.append('_method', "PUT");
  
    // ارسال درخواست به سرور
    axios.post(Source.getAddress() + `/api/settings/${settings[0].id}`, uploadData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
        // 'Content-Type' را تنظیم نکنید؛ اجازه دهید مرورگر آن را به طور خودکار تنظیم کند.
      }
    })
      .then((res) => {
        dispatch(updateSettingInCache(res.data.settings));
        showAlert({
          position: "top-end",
          icon: "success",
          title: <FormattedMessage id="Updated Successfully!" />,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        showAlert({
          position: "top-end",
          icon: "error",
          title: <FormattedMessage id="Something went wrong!" />,
          showConfirmButton: false,
          timer: 1500,
        });
      });
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

  const handle = (e) => {
    // ایجاد یک کپی از آرایه موجود در company_info
    const updatedCompanyInfo = [...settings];
    // به‌روزرسانی مقدار نام برای اولین آبجکت (مثلاً اندیس 0)
    updatedCompanyInfo[0] = {
      ...updatedCompanyInfo[0],
      [e.target.name]: e.target.value,
    };
    // تنظیم وضعیت با آرایه به‌روزرسانی شده
    setsettings(updatedCompanyInfo);
  };
  return (
    <div
  className={`container rounded-5 popup setting ${addAccountModal ? "show" : ""}`}
  style={{
    maxWidth: "50%", // کاهش اندازه عرض
    overflowX: "auto",
    overflowY: "auto",
    height: "auto", // تنظیم ارتفاع به صورت خودکار
    backgroundColor: "#f8f9fa",
    padding: "10px", // کاهش پدینگ
  }}
>
  <div className="d-flex justify-content-end">
    <button
      type="button"
      className="btn-close p-2 m-1 mt-0 hover_btn" // کاهش پدینگ دکمه
      onClick={close}
      aria-label="Close"
    ></button>
  </div>
  <div className="p-1 rounded-5">
    <div className="row">
      <h1
        className="text-center rounded p-1 text-light" // کاهش پدینگ عنوان
        style={{ backgroundColor: "var(--bs-info)", width: "100%",fontSize: "1srem" }} // کاهش اندازه فونت
      >
        <FormattedMessage id="Change Organisation Info" />
      </h1>
      <div className="col-12 col-md-5 mt-4"> {/* کاهش margin-top */}
        <label htmlFor="name" style={{ fontWeight: "bold" }}>
          <FormattedMessage id="Company Name" />
        </label>
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={handle}
          value={settings[0]?.company_name}
          type="text"
          name="company_name"
          placeholder="Name"
          className="form-control fs-6 mb-2" // کاهش margin-bottom
          style={{ width: "100%" }}
        />
        <label htmlFor="national_id_number" style={{ fontWeight: "bold" }}>
          <FormattedMessage id="Email" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handle}
          value={settings[0]?.email || null}
          type="email"
          name="email"
          placeholder="National Id Number"
          className="form-control fs-6 mb-2"
          style={{ width: "100%" }}
        />
        <label htmlFor="phone" style={{ fontWeight: "bold" }}>
          <FormattedMessage id="Phone Number" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handle}
          value={settings[0]?.phone || null}
          type="text"
          name="phone"
          maxLength={10}
          placeholder="Phone Number"
          className="form-control fs-6 mb-2"
          style={{ width: "100%" }}
        />
        <label htmlFor="address" style={{ fontWeight: "bold" }}>
          <FormattedMessage id="Address" />
        </label>
        <input
          onKeyDown={handleKeyDown}
          onChange={handle}
          value={settings[0]?.address || null}
          type="text"
          name="address"
          placeholder="Address"
          className="form-control fs-6 mb-2"
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-12 col-md-7 d-flex flex-column align-items-center mt-4">
        <div className="">
          <img
            className="td_img rounded"
            src={settings[0]?.company_pic || CompanyPic}
            style={{ height: "120px", width: "120px", objectFit: "cover" }} // کاهش سایز تصویر
            alt="Profile"
          />
        </div>
        <div className="" style={{ width: "100%" }}>
          <label htmlFor="company_pic" style={{ fontWeight: "bold" }}>
            <FormattedMessage id="Profile Picture" />
          </label>
          <input
            type="file"
            accept="image/*"
            name="company_pic"
            onChange={handleImageChange}
            className="form-control"
            style={{ width: "100%" }}
          />
          <div className="form-floating">
            <textarea
              name="description"
              className="form-control h-50"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              value={settings[0]?.description || null}
              onChange={handle}
            ></textarea>
            <label htmlFor="floatingTextarea2">
              <FormattedMessage id="Description" />
            </label>
          </div>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center mt-2">
        <button
          type="button"
          className="text-center btn btn-danger text-light me-2 ms-2"
          style={{ width: "130px" }} // کاهش عرض دکمه
          onClick={close}
        >
          <FormattedMessage id="Cancel" />
        </button>
        <button
          ref={buttonRef}
          type="button"
          className="text-center btn btn-success text-light ms-2"
          style={{ width: "130px" }}
          onClick={Edit_Account}
        >
          <FormattedMessage id="Submit" />
        </button>
      </div>
    </div>
  </div>
</div>

  );
}
