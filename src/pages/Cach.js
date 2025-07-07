import axios from "axios";
import { updateLocale } from "moment-timezone";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Source from "../Source";
import belance from "../assets/icon/belance.png";
import ComboBox from "./forms/ComboBox";
import { useSelector, useDispatch } from 'react-redux';
import { getMoneys } from "./Redux/moneysSlice";
import { FormattedMessage } from "react-intl";

const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};
// import {ComboBoxComponent} from '@syncfusion/ej2-react-dropdowns'
export default function Cach({
  fetchTotalRecords,
  totals,
  setTotals,
  setMoney1
}) {
  // const [record,setRecord]=useState([]);
  const dispatch=useDispatch();
  //   const { moneys, errorm ,statusm} = useSelector((state) => state.moneys);
  const [money,setMoney]=useState([]);
   useEffect(()=>{
      axios.get(Source.getAddress() + '/api/money', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },params: {
          delete: 'False',
        },
      }).then((res)=>{
        setMoney(res.data);
      setMoney1(res.data);

      }).catch((err)=>{
        console.log(err);
      });
    },[]);
  // useEffect(() => {
  //   // بررسی و بارگذاری `belances`
  //   // if (statusb === 'idle' && !belances) {
  //   //   dispatch(getBelances());
  //   // }
  
  //   // // بررسی و بارگذاری `moneys`
  //   if (!statusm && moneys?.lenght ===0) {
  //     dispatch(getMoneys());
  //   }else if( statusm==='succeeded'){
  //     setMoney(moneys);
      // setMoney1(moneys);
  //   }
  
  //   // // بررسی و بارگذاری `customers`
  //   // if (statusc === 'idle' && !customers) {
  //   //   dispatch(getCustomers());
  //   // }
    
  // }, [dispatch, statusm, moneys]);
  
  let record = [];
  record = money;
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="container"
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
    >
      <div className="balance-container row mt-4 p-4  pb-0 mb-0">
        <h1 className="fw-bold fs-1 p-1">        <FormattedMessage id="Cash" />
</h1>
        {/* {accountbelance && accountbelance.map((row) => ( */}
        {record &&
          record.map((row) => {
            return (
              <div className="col-12 col-md-3 mb-2" key={row.id}>
                <div
                  className="ps-2 pe-2 rounded-3"
                  style={{
                    backgroundColor: "white",
                    borderTop: "3px solid #4a5cf2",
                    width:'200px',
                    // style={{
                      // color:'white',
                      // backgroundColor:card.bg,
                      backgroundImage: `url(${belance})`,
                      backgroundSize: '80px 60px', // اندازه دقیق تصویر
                      backgroundPosition: 'left', // موقعیت تصویر
                      backgroundRepeat: 'no-repeat', // جلوگیری از تکرار تصویر
                      // width:""
                      // border: '2px solid black', // اضافه کردن حاشیه
                      // borderRadius: '10px', // گرد کردن گوشه‌ها
                    // }}
                  }}
                >
                  <div className="d-flex py-4" >
                    <div className="row p-1 ps-4">
                      <h5 className="mb-2 fw-bold text-capitalize">
                        {row.name}{' '}
                        <FormattedMessage id="Total transactions :" />
                        {totals[row.id] !== undefined
                          ? formatNumber(totals[row.id])
                          :<FormattedMessage id="Loading..." /> }
                      </h5>
                      <p className="mb-2 fw-bold">
                      <FormattedMessage id="Total" />
                      : {formatNumber(row.cach)} 
                      <FormattedMessage id="Available Cash" />
                      </p>
                    </div>
                  </div>
                  <a
                    className="btn btn-info mb-1 p-1 self-center"
                    style={{ color: "white" }}
                    href="/cach/report"
                    onClick={()=>{
                      localStorage.setItem('cashid',row.id);
                      localStorage.setItem('cashName',row.name);
                    }}
                  >
                      <FormattedMessage id="See all transactions" />
                  </a>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
