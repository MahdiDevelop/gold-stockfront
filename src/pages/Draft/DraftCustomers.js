import React, { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { gregorianToJalali } from "shamsi-date-converter";
// import { gregorianToJalali } from "shamsi-date-converter";
import Swal from "sweetalert2";
import { showAlert } from "../../warrper.js";
import Trash from "../../assets/icon/trash.png";
import Recover from "../../assets/icon/recover.png";
import axios, { Axios } from "axios";
import ListBox from "../forms/ListBox.js";
import Source from "../../Source.js";
import { useSelector, useDispatch } from 'react-redux';
import Profile from "../../assets/icon/profile.png";
import jalaali from "jalaali-js";
import Datepicker_Customer from "../forms/Datepicker_customer";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
// import { useShowAlert  } from "../warrper";
import { useShowAlert  } from "../../warrper";

export default function DraftCustomers({
  date1,
  user,
  // settings,
  // setsettings,
  // loading,
  // setLoading,
  belance,
  setbelance,
  money,
}) {
  const showAlert = useShowAlert(); 
  const { settings, statuss } = useSelector((state) => state.settings);
    const [selecteduser, setSelecteduser] = useState();
    const { users, statusu } = useSelector((state) => state.users);
        const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const [namesearch, setnameSearch] = useState();
      const [Date_Start, setDate_start] = useState();
      const [Date_End, setDate_end] = useState();
      const [StartDate,setStartDate]=useState();
      const [EndDate,setEndDate]=useState();
      const handle_date_start = (jalaliDate) => {
        console.log(jalaliDate);
        if (jalaliDate) {
          const { year, month, day } = jalaliDate;
          const gregorianDate = jalaali.toGregorian(year, month, day);
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          let isoDateString;
          const t = new Date();
          const date = new Date(
            jalaliDate.year,
            jalaliDate.month - 1,
            jalaliDate.day,
            t.getHours(),
            t.getMinutes()
          );
          const isoString = date.toISOString(); // This gives you the ISO string in UTC
          setDate_start(isoString);
        }else{
        setDate_start(null);
        }
      };
      const handle_date_end = (jalaliDate) => {
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
          setDate_end(isoString);
          // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
      };
      const handleName = (e) => {
        setnameSearch(e.target.value);
    };



  const [accounts,setAccounts]=useState([]);
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const handlePageChange = page => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress() + '/api/customers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        params: {
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          delete: 1,
          StartDate: StartDate&& Date_Start,
            EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
        },
      });
      setAccounts(response.data.data);
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
      setLoading(false);
    }
  };
  
  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage, EndDate, StartDate, selecteduser,namesearch]);
  
  // let user1=user;
  const [records, setRecords] = useState();
  // const [belance, setBelance] = useState([]);
  const [openBelance, setOpenBelance] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [editAccount1, setEditAccount1] = useState({
    id: 0,
    isdelete: "False",
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
  });
  const [id, setId] = useState("");
  const [addAccountModal, setAddAccountModal] = useState(false);
  // const [res,setres]=useState(false);
  const res = useMemo((result) => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      const fetchWithToken = async (token) => {
        try {
          const response = await axios.get(
            Source.getAddress() + "/api/customers/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                delete: "True",
              },
            }
          );
          setRecords(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) return;

            try {
              const refreshResponse = await axios.post(
                Source.getAddress() + "/api/token/refresh/",
                {
                  refresh: refreshToken,
                }
              );
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem("access", newAccessToken);
              await fetchWithToken(newAccessToken);
            } catch (refreshError) {
              // console.error('Error refreshing access token:', refreshError);
            }
          } else {
            //   console.error('Error fetching accounts:', error);
          }
        }
      };
      await fetchWithToken(token);
    };
    fetchAccounts();
  }, []);

  const [customer, setcustomer] = useState({
    national_id_picture: "",
    profile_picture: "",
    national_id_number: "",
    isdelete: "False",
    user: "",
    address: "",
    whatsup_number: "",
    name: "",
    father_name: "",
    phone_number: "",
  });
  const convertToHijriShamsi = (gregorianDate) => {
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
      new Date(gregorianDate)
    );

    const hijriShamsiDate = `${jalaliYear}/${jalaliMonth}/${jalaliDay}`;

    return hijriShamsiDate;
  };

  const handleFilter = (e) => {
    const newData = accounts.filter((row) => {
      if (typeof row.name === "string") {
        return row.name.toLowerCase().includes(e.target.value.toLowerCase());
      }
      return false;
    });
    setRecords(newData);
  };
    const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها

  const delete_report = async (row) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    const result = await swalWithBootstrapButtons.fire({
      title: intl.formatMessage({id:"Are you sure?"})
      ,
      text:intl.formatMessage({id:"You won't be able to revert this!"})
      ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({id:"Yes, delete it!"})
      ,
      cancelButtonText: intl.formatMessage({id:"No, cancel!"})
      ,
      reverseButtons: true,
});
  
    if (result.isConfirmed) {
      try {
        const response = await axios.post(Source.getAddress() + "/api/customers/" + `${row.id}/`,{
          _method:"put"
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Updated successfully!",
                                  // title: <FormattedMessage id="record successfully deleted!"/>,
                                                                                  title: <FormattedMessage id="Restored successfully!"/>,
          showConfirmButton: false,
          timer: 600,
        });
  
        // Update the state to remove the deleted record
        setRecords(records.filter((a) => a.id !== row.id));
        
      } catch (err) {
        console.error('Delete error:', err);
  
        showAlert({
          position: "top-end",
          icon: "error",
          // title: "Something went wrong!",
                      // title: <FormattedMessage id="Something went wrong!"/>,            
                                              title: <FormattedMessage id="Something went wrong!"/>,
          showConfirmButton: false,
          timer: 600,
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        // text: "Your imaginary file is safe :)",
                // text: <FormattedMessage id="Your record is safe :)"/>,
                title:intl.formatMessage({id:"Cancelled"}),
                text:intl.formatMessage({id:"Your record is safe :)"}),
        icon: "error",
      });
    }
  };
  
  const handleAddAccount = () => {
    setEdit(false);
    setAddAccountModal(true);
    setOpenBelance(false);
    inputRef.current.select();
  };

  const date = (d) => {
    const date1 = new Date(d);
    const formattedDate = `${date1.getFullYear()}-${String(
      date1.getMonth() + 1
    ).padStart(2, "0")}-${String(date1.getDate()).padStart(2, "0")}`;
    // return convertToHijriShamsi(gregorianDate);
    if (settings[0].date === "Persian") {
      const gregorianDate = new Date(formattedDate);
      return convertToHijriShamsi(gregorianDate);
    } else {
      return formattedDate;
    }
  };
  const [ProfilePicture,setProfilePicture]=useState();
  const [national_id_picture,setNationalIdPicture]=useState();
  const delete_restore = async (row) => {

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
          console.error("Error converting URL to File:", error);
        }
      };
      if (
        row.profile_picture &&
        typeof row.profile_picture === "string"
      ) {
        fetchAndSetImage(row.profile_picture, setProfilePicture);
      }
      if (
        row.national_id_picture &&
        typeof row.national_id_picture === "string"
      ) {
        fetchAndSetImage(row.national_id_picture, setNationalIdPicture);
      }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
  
    const result = await swalWithBootstrapButtons.fire({
      title: intl.formatMessage({id:"Are you sure?"})
              ,
              text:intl.formatMessage({id:"You won't be able to revert this!"})
              ,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: intl.formatMessage({id:"Yes, restore it!"})
              ,
              cancelButtonText: intl.formatMessage({id:"No, cancel!"})
              ,
              reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      // let isdelete={isdelete:0};
        const uploadData = new FormData();
        // if(ProfilePicture){
        //   uploadData.append("profile_picture", ProfilePicture);
        // }
        // if(national_id_picture){
        //   uploadData.append("national_id_picture", national_id_picture);
        // }
        uploadData.append("isdelete", 0);
        // uploadData.append("ontransaction", "False");
        // uploadData.append("user", row.user);
        // // update.user = localStorage.getItem("userTokenid");
        // uploadData.append("national_id_number", row.national_id_number);
        // // update.national_id_number = row.national_id_number;
        // uploadData.append("addresss", row.addresss);
        // // update.addresss = row.addresss;
        // uploadData.append("whatsup_number", row.whatsup_number);
        // // update.whatsup_number = row.whatsup_number;
        // uploadData.append("name", row.name);
        // // update.name = row.name;
        // uploadData.append("father_name", row.father_name);
        // // update.father_name = row.father_name;
        // uploadData.append("phone_number", row.phone_number);
        // // update.phone_number = row.phone_number;
        uploadData.append("_method","put");
        axios.post(Source.getAddress() + "/api/customers/" + `${row.id}/`,uploadData, {
          method: "PUT", headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
            // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
          },
          // body: ,
        })
          .then((res) => {
            // console.log(res);
            setRecords(records.filter((a) => a.id !== row.id));
            showAlert({
              position: "top-end",
              icon: "success",
              // title: "Updated successfully !",
                        // title: <FormattedMessage id="Restored successfully!"/>,
                                          title:<FormattedMessage id="Restored successfully!"/>,
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch((error) => {
            console.log(error);
            showAlert({
              position: "top-end",
              icon: "error",
              // title: "Something went wrong !",
                                                // title: <FormattedMessage id="Something went wrong!"/>,            
                                             title:<FormattedMessage id="Something went wrong!"/>,
              showConfirmButton: false,
              timer: 1000,
            });
          })
        
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        // text: "Your imaginary file is safe :)",
                                // text: <FormattedMessage id="Your record is safe :)"/>,
                                title:intl.formatMessage({id:"Cancelled"}),
                                text:intl.formatMessage({id:"Your record is safe :)"}),
        icon: "error"
      });
    }
  };

  const PDcolumn = [
    {
      name: <FormattedMessage id="ID"/>,
      selector: (row) => row.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name: <FormattedMessage id="Photo"/>,
      cell: (row) => (
        <img
          src={row.profile_picture === null ? Profile : row.profile_picture}
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      style: {
        width: "1px",
        minWidth: "1px",
      },
      sortable: true,
    },
    { name: <FormattedMessage id="Name"/>, selector: (row) => row.name, sortable: true },
    { name: <FormattedMessage id="Father Name"/>, selector: (row) => row.father_name, sortable: true },
    {
      name: <FormattedMessage id="Date Created"/>,
      selector: (row) => date(row.date_created),
    },
    { name: <FormattedMessage id="Address"/>, selector: (row) => row.addresss, sortable: true },
    { name: <FormattedMessage id="Address"/>, selector: (row) => row.phone_number, sortable: true },
    { name: <FormattedMessage id="Whatsup"/>, selector: (row) => row.whatsup_number, sortable: true },
    {
      name: <FormattedMessage id="National ID Number"/>,
      selector: (row) => row.national_id_number,
      sortable: true,
    },
    {
      name: <FormattedMessage id="Added By"/>,
      selector: (row) => row.user_name,
      sortable: true,
    },{
        name: <strong style={{textAlign:'center',backgroundColor:'tranceparent',width:'100%'}}><FormattedMessage id="Restore"/></strong>,
        selector: (row) =>  
          <button onClick={()=>{
            delete_restore(row);
           } } style={{ border: "none",backgroundColor:'transparent' ,height:'100%'}}>
            {row.cach}
            <img height={"30%"} width={"30%"} src={Recover} style={{backgroundColor:'tranceparent'}}  />
          </button>
          
      },
    {
      name: (
        <p
          style={{
            margin: "auto auto",
            textAlign: "center",
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
          <FormattedMessage id="Delete"/>
        </p>
      ),
      selector: (row) => (
        <button
          onClick={() => delete_report(row)}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"25%"}
            width={"25%"}
            src={Trash}
            style={{ backgroundColor: "transparent" }}
          />
        </button>
      ),
    },
  ];
  const columnsTablet = [
    {
      name: "Photo",
      cell: (row) => (
        <img
          src={row.profile_picture === null ? Profile : row.profile_picture}
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      sortable: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
  ];
    const columns = useMemo(() => {
      let selectedColumns;
    
      if (
        localStorage.getItem("language") === "pa" ||
        localStorage.getItem("language") === "da"
      ) {
        selectedColumns = [...PDcolumn]; // معکوس کردن ستون‌ها
      }else{
        selectedColumns=PDcolumn;
      }
      return selectedColumns;
    }, [isDesktop]);
  const [select_user, setselect_user] = useState("");
  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = accounts.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
    } else {
      setRecords(accounts);
    }
    setselect_user(e.target.value);
  };
  const inputRef = useRef(null);
  const { formatMessage } = useIntl();
  const localization = {
    pagination: {
        
        rowsPerPage:<FormattedMessage id="AddrowsPerPage"/> , // مثلا: "تعداد ردیف‌ها"
      previous: <FormattedMessage id="previous"/>, // مثلا: "قبلی"
      next: <FormattedMessage id="next"/>, // مثلا: "بعدی"
      page: <FormattedMessage id="page"/>, // مثلا: "صفحه"
    },
    // شما می‌توانید تنظیمات بیشتر برای متون مورد نظر اضافه کنید.
  };
  return (
    <div
      className={`h-100 w-100 ${
        settings[0].language === "Persian" && "iransans"
      }`}
      onClick={(e) => {
        if (
          e.target.className == "container mt-5" ||
          e.target.className == "main" ||
          e.target.className == "h-100 w-100"
        ) {
          setOpenBelance(false);
          setEdit(false);
          setAddAccountModal(false);
        } else {
        }
      }}
    >
      <div className="container mt-5 m-5" style={{ height: "100%" }}>
      <div
          dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Draft Customers"/>
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date_start}
              lebal={<FormattedMessage id="Start"/>}
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
            ></Datepicker_Customer>
          </div>
          <div className="mb-1 mt-1 mb-lg-0 me-lg-2">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date_end}
              lebal={<FormattedMessage id="End"/>}
              setSelectedDay={setEndDate}
              selectedDay={EndDate}
            ></Datepicker_Customer>
          </div>
          <ListBox
            options={users}
            selectedOption={selecteduser}
            setSelectedOption={setSelecteduser}
          />
        </div>
        <input
  className="form-control m-2 mb-2 mt-4"
  style={{ width: "100%", maxWidth: "200px" }}
  type="search"
  onChange={handleName}
  value={namesearch}
  placeholder={formatMessage({ id: "Search" })}
  aria-label="Search"
/>
      </div>    <DataTable
                  localization={localization} // ارسال ترجمه‌ها      

                  columns={columns}
                  data={records}
                  // onRowClicked={handleRowClick}
                  progressPending={loading}
        
                  striped
                  responsive
                  highlightOnHover
                  pagination
                  paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
                  paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
                  onChangePage={handlePageChange} // تغییر صفحه
                  onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه
         />
      </div>
    </div>
  );
}
