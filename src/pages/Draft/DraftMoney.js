import React, { useState, useEffect, useMemo, useRef } from "react";
import { showAlert } from "../../warrper";
import axios from "axios";
import Source from "../../Source";
import Trash from "../../assets/icon/trash.png";
import Restore from "../../assets/icon/recover.png";
import pencil from "../../assets/icon/pencil.png";
import Swal from "sweetalert2";
import "../forms/money.css";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
// import { useShowAlert  } from "../warrper";
import { useShowAlert  } from "../../warrper";


export default function DraftMoney({
  user,
  settings,
}) {
  const showAlert = useShowAlert(); 
  const [belance, setbelance]=useState([]);
  const [money,setMoney]=useState([]);
  useEffect(()=>{
    axios.get(Source.getAddress() + '/api/belance/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },params: {
        delete:'1',
      },
    }).then((res)=>{
      setbelance(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  },[]); 
  useEffect(()=>{
    axios.get(Source.getAddress() + '/api/money/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },params: {
        delete: '1',
      },
    }).then((res)=>{
      setRecords(res.data);
      setMoney(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  },[]);
  const [add, setAdd] = useState(false);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(false);
  const [record, setRecords] = useState([]);
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  
  const Delete = async (row) => {
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
      axios
        .post(Source.getAddress() + "/api/money/" + `${row.id}/`,{
        _method:"put"
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          showAlert({
            position: "top-end",
            icon: "success",
            // title: "Money deleted successfully !",
                        // title: <FormattedMessage id="record successfully deleted!"/>,
                                    // title: ReactDOMServer.renderToString(<FormattedMessage id="record successfully deleted!"/>),
                                                title: <FormattedMessage id="Restored successfully!"/>,
            showConfirmButton: false,
            timer: 600,
          });
        })
        .catch((err) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            // title: <FormattedMessage id="Something went wrong!"/>,            
                        title: intl.formatMessage({id:"Something went wrong!"}),
            showConfirmButton: false,
            timer: 600,
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        // title: "Cancelled",
        // text: "Your imaginary file is safe :)",
        // text: <FormattedMessage id="Your record is safe :)"/>,
                title:intl.formatMessage({id:"Cancelled"}),
                text:intl.formatMessage({id:"Your record is safe :)"}),
        icon: "error",
      });
    }
  };
  const [money1, setmoney] = useState({
    name: "",
    existense: "False",
    user: 0,
  });
  const find = (e) => {
    const foundElement = belance.find((element) => element === e);
    return foundElement;
  };

  const [edit, setEdit] = useState({
    id: "",
    name: "",
  });
  const [select_user, setselect_user] = useState("");

  const ChangeUser = (e) => {
    if (e.target.value !== "all users") {
      const newData = money.filter((row) => {
        if (typeof row.user_name === "string") {
          return row.user_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
      setRecords(newData);
      // console.log(e.target.value);
    } else {
      setRecords(money);
    }
    // else{setMoney(accounts)}
    setselect_user(e.target.value);
  };

  const inputRef = useRef(null);
  const updateRef = useRef(null);
  const restore = async (row) => { 
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
      confirmButtonText: intl.formatMessage({id:"Yes, restore it!"})
      ,
      cancelButtonText: intl.formatMessage({id:"No, cancel!"})
      ,
      reverseButtons: true,

    });
    if (result.isConfirmed) {
      let moneyUpdate={
        cach:'',
    existense:'True',
    name
    : 
    "",
    ontransaction
    : 
    '',
    user
    : 
    ''
      };
      moneyUpdate.cach=row.cach;
      moneyUpdate.name=row.name;
      moneyUpdate.ontransaction=0;
      moneyUpdate.user=row.user;
    // const uploadData = new FormData();
      // for (let key  in row){
      //   if (row.hasOwnProperty(key)) {
      //     if(String(key)!=='id' && String(key)!=='user_name' && String(key)!=='existense'){
      //       uploadData.append(String(key),row[key]);
      //     }
      //   }
      // }
      // uploadData.append('existense',0);
      let update={
        existense: 0
      };
      axios.post(Source.getAddress() + "/api/money/" + `${row.id}/`,update, {
        method: "PUT", headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
          // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
        },
        // body: uploadData,
      }).then((res)=>{
        showAlert({
          position: "top-end",
          icon: "success",
          // title: "Restored successfully!",
          // title: <FormattedMessage id=""/>,
                  title:<FormattedMessage id="Restored successfully!"/>,
          showConfirmButton: false,
          timer: 600,
        });
    setRecords(record.filter((a) => a.id !== row.id));    
      }).catch((err)=>{
        showAlert({
          position: "top-end",
          icon: "error",
          // title: "Something went wrong !",
                                  // title: <FormattedMessage id="Something went wrong!"/>,            
                  title:<FormattedMessage id="Something went wrong!"/>,
          showConfirmButton: false,
          timer: 600
        });
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        // title: "Cancelled",
        // text: "Your imaginary file is safe :)",
                        // text: <FormattedMessage id="Your record is safe :)"/>,
                        title:intl.formatMessage({id:"Cancelled"}),
                        text:intl.formatMessage({id:"Your record is safe :)"}),
        icon: "error",
      });
    } 
      };

  return (
    <div
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className={`continer w-100 h-100 English ${
        settings[0].language === "Persian" && "iransans"
      }`}
      onClick={(e) => {
        if (
          e.target.className == "continer w-100 h-100" ||
          e.target.className == "me-auto ms-auto pt-4 pb-4 h-100 w-50"
        ) {
          setAdd(false);
          setUpdate(false);
          setError(false);
        }
      }}
    >
      <div className="me-auto ms-auto pt-4 pb-4 h-100 resm">
        <div
          class="card card-body m-auto"
          style={{ borderTop: "5px solid #4a5cf2" }}
        >
          <h1 class="text-center rounded m-0 mb-2 p-4 text-light fw-bold bg-info">
          <FormattedMessage id="Draft Of Currency"/>
          </h1>
          <div className="d-flex w-100 h-100 m-auto justify-content-between">
            {/* <select
              id=""
              name="gender"
              onChange={ChangeUser}
              class="form-select h-50 m-auto mb-2"
              style={{ width: "20%" }}
              value={select_user}
            >
              <option value={"all users"} selected>
                All Users
              </option>
            </select> */}
          </div>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table 
              style={{ 
                minWidth: '500px',
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px 8px', }}><FormattedMessage id="No" /></th>
                  <th style={{ padding: '12px 8px', }}><FormattedMessage id="Name" /></th>
                  <th style={{ padding: '12px 8px', }}><FormattedMessage id="Added By" /></th>
                  <th style={{ padding: '12px 8px', width: '5%' }}><FormattedMessage id="Delete" /></th>
                  <th style={{ padding: '12px 8px', width: '5%' }}><FormattedMessage id="Edit" /></th>
                </tr>
              </thead>
            <tbody class="table-group-divider">
              {record &&
                record.map((row, idx) => {
                  return (
                    <tr key={idx} 
                    style={{ 
                      borderBottom: '1px solid #dee2e6',
                      ':hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
                    }}>
                      <td style={{ padding: '12px 8px' }}>{row.id}</td>
          <td style={{ padding: '12px 8px' }}>{row.name}</td>
          <td style={{ padding: '12px 8px' }}>{row.user_name}</td>
          <td style={{ padding: '12px 8px', width: '5%' }}>
                        {(
                          <button
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            ':hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                          }}
                            onClick={() => restore(row)}
                          >
                            <img
                              style={{
                                height: '24px',
                                width: '24px',
                                '@media (max-width: 768px)': {
                                  height: '32px',
                                  width: '32px'
                                }
                              }}
                              src={Restore}
                              
                            />
                          </button>
                        )}
                      </td>
                      <td style={{ width: "5%" }}>
                        {(
                          <button
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            ':hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                          }}
                            onClick={() => Delete(row)}
                          >
                            <img
                            style={{
                              height: '24px',
                              width: '24px',
                              '@media (max-width: 768px)': {
                                height: '32px',
                                width: '32px'
                              }
                            }}
                              src={Trash}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              {/* {source.length>=6 && <a o className="text-primary underlined text-center">{text}</a>} */}
            </tbody>
          </table>

        </div>
        </div>
      </div>
    </div>
  );
}
