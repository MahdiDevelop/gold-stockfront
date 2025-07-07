import React, { useEffect, useState } from 'react';
import "jalaali-react-date-picker/lib/styles/index.css";
import { InputDatePicker } from "jalaali-react-date-picker";
import moment from 'moment-jalaali';
import { useSelector, useDispatch } from "react-redux";
import zIndex from '@mui/material/styles/zIndex';

export default function Datepicker_customer({ handle_date,default_value ,lebal,setSelectedDay,selectedDay,onKeyDown,index="10000000000000"}) {
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const handleDateChange = (date) => {  
    setSelectedDay(date);
        if(date!=null){
        const handl={year:date._a[0],month:date._a[1]+1,day:date._a[2]}
        // console.log(handl);
      handle_date(handl);
        } };
  return (
    <div className="col-3 m-2 mt-0 fw-normal" style={{zIndex:index}}>
      <label htmlFor="" className='p-0 m-0 fw-bold'>{lebal}</label>
      <InputDatePicker
      // style={{zIndex:'10000000000000'}}
        className='fw-normal afgFont'
        onKeyDown={onKeyDown}
        value={selectedDay}
        sx={{
          fontFamily: 'CustomFont1, sans-serif',
          '& .MuiInputBase-input': {
            fontFamily: 'CustomFont1, sans-serif !important'
          }
        }}
        inputProps={{
          style: {
            fontFamily: 'CustomFont1' // ارث بری از تم
          }
        }}
        popupStyles={{
          fontFamily: "'CustomFont1', sans-serif",
          // برای متن‌های داخل پاپ‌آپ تقویم
          '& .jalaali-datepicker-header': {
            fontFamily: "'CustomFont1', sans-serif !important",
          },
          '& .jalaali-datepicker-day-names': {
            fontFamily: "'CustomFont1', sans-serif !important",
          },
          '& .jalaali-datepicker-days': {
            fontFamily: "'CustomFont1', sans-serif !important",
          },
          '& .jalaali-datepicker-footer': {
            fontFamily: "'CustomFont1', sans-serif !important",
          },
          '& *': {
            fontFamily: "'CustomFont1', sans-serif !important",
          }
        }}
        onChange={handleDateChange}
        inputPlaceholder={settings[0].date === "Persian" ? 'تاریخ را وارد کنید' : 'Enter the date'}
        locale={settings[0].date === "Persian" ? 'fa' : 'en'}
        // locale='en'
        colorPrimary="#0fbcf9"
        maximumDate={{ year: 9999, month: 12, day: 31 }}
        minimumDate={{ year: 1, month: 1, day: 1 }}
      />
    </div>
  );
}