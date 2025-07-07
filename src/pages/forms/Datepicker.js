import React, { useEffect, useState } from 'react';
import "jalaali-react-date-picker/lib/styles/index.css";
import { InputDatePicker } from "jalaali-react-date-picker";
import moment, { months } from 'moment-timezone';

export default function Datepicker({ handle_date, settings,default_value ,lebal,onKeyDown}) {
  const [selectedDay, setSelectedDay] = useState();
  const handleDateChange = (date) => {
    setSelectedDay(date);
        if(date!=null){
        const handl={year:date._a[0],month:date._a[1]+1,day:date._a[2]}
      handle_date(handl);
        }
    };
  return (
    <div className="col-3 m-2 mt-3"
    >
      <label htmlFor="" className='p-0 m-0'>{lebal}</label>
      <InputDatePicker
      onKeyDown={onKeyDown}
        value={selectedDay}
        onChange={handleDateChange}
        inputPlaceholder={settings[0].date === 'Persian' ? 'تاریخ را وارد کنید' : 'Enter the date'}
        locale={settings[0].date === 'Persian' ? 'fa' : 'en'}
        colorPrimary="#0fbcf9"
        maximumDate={{ year: 9999, month: 12, day: 31 }}
        minimumDate={{ year: 1, month: 1, day: 1 }}
      />
    </div>
  );
}
