import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';
import Model from 'react-model'
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import jalaali from 'jalaali-js';
export default function Datepicker_start({handle_date,settings,default_value}) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [open,setopen]=useState(true);
  useEffect(() => {
    console.log(default_value);
    const today = new Date();
    if (settings[0].date === 'Persian') {
      const jalaliDate = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setSelectedDay({ day: jalaliDate.jd, month: jalaliDate.jm, year: jalaliDate.jy });
    } else {
      setSelectedDay({ day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() });
    }
  }, [settings]);
  const handleDateChange = (date) => {
    setSelectedDay(date);
  };
  return (
    <div class="col-3 m-2 mt-3"
    
    onClick={(e)=>{
      console.log(e.target.className);
        if(e.target.className==="Calendar__section -shown"||e.target.className==="Calendar__day -ltr  -selected "||e.target.className==="Calendar__day -ltr "
          || e.target.className==="Calendar__day -ltr  -weekend"||e.target.className==="Calendar__day -ltr  -today  -weekend"||e.target.className==="Calendar__day -rtl  -weekend -selected "
          ||e.target.className==="Calendar__day -rtl  -weekend"
        ){
            document.getElementById('calendar-wrapper').style.display = 'none'
        }
         if(e.target.className==="Calendar__day -rtl  -today "|| e.target.className==="Calendar__day -rtl "||
             e.target.className==="Calendar__day -rtl  -selected "||e.target.className==="col-2 m-2 mb-3 mt-3 p-0"||
             e.target.className==="col-3 m-2 mt-3"){
              document.getElementById('calendar-wrapper').style.display = 'none'
          }
    }}
    >
        <label for="" className='p-0 m-0'>Date</label>
      <input
        type="text"
        readOnly
        className='form-control m-0 w-75 text-center'
        style={{
        textAlign: 'right',
        fontFamily:'arial',
        marginTop:'0.83rem ',
        
        // padding:'0.5rem'
        // fontSize:'0.5rem',

        }}
        placeholder="Select date"
        value={selectedDay ? `${selectedDay.year}/${selectedDay.month}/${selectedDay.day}` :`${settings[0].date==='Persian'?'تاریخ را وارد کنید ':'Enter the date'}`}
        onClick={() =>{
            if(document.getElementById('calendar-wrapper').style.display === 'block'){
                document.getElementById('calendar-wrapper').style.display = 'none'
            }else{
               document.getElementById('calendar-wrapper').style.display = 'block' 
            }
            setopen(!open);
        }
        }
      />
      <div id="calendar-wrapper" style={{ display: 'none', position: 'absolute', zIndex: 1000 }}>
        <Calendar
          value={selectedDay}
          onChange={(e)=>{
            handleDateChange(e);
            handle_date(e);
        }}
          shouldHighlightWeekends
          locale={settings[0].date==='Persian' ? 'fa':'en'} // تنظیم زبان به فارسی
          calendarClassName="persian-datepicker" // نام کلاس سفارشی برای استایل‌دهی
          colorPrimary="#0fbcf9" // رنگ اصلی
        />
        {/* </Model> */}
      </div>
    </div>
  );
}
