import React from 'react';
import Select, { components } from 'react-select';
import axios from 'axios';
import Source from '../../Source';
import { FormattedMessage,useIntl } from "react-intl";
import './Tstyle.css';
import { px } from 'framer-motion';
import { fontSize, height, width } from '@mui/system';
const Combo_Customer = ({ 
  isEditable = false, 
  options, 
  Onsearch, 
  selectedOption, 
  // readOnly, 
  setSelectedOption, 
  searchQuery, 
  handleInputChange 
}) => {
  const handleChange = (sselectedOption) => {
    setSelectedOption(sselectedOption);
    // if(selectedOption){
    if(sselectedOption){
      console.log(sselectedOption)
      axios.get(Source.getAddress()+'/api/commession',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: { money: sselectedOption.moneyId }, // ارسال پارامتر جستجو به سرور
      }
    ).then((res)=>{
        Onsearch((prev)=>res.data[0]);
        // console.log(res);
      })
      .catch((er)=>{
        // console.log(er);
      });
    }
      
    // }
    // Onsearch(sselectedOption);
  };

//   const CustomMenuList = (props) => (
//     <components.MenuList {...props}>
//       {props.children}
//       {type && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             padding: "10px",
//             borderTop: "1px solid #eaeaea",
//             cursor: "pointer",
//             backgroundColor: "#f9f9f9",
//           }}
//           onClick={() => setAddAccountModal(searchQuery)}
//         >
//           <strong>{name}</strong>
//         </div>
//       )}
//     </components.MenuList>
//   );

const customStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // سایر استایل‌ها در صورت نیاز...
};
const { formatMessage } = useIntl();

  // console.log(searchQuery);
  return (
    <div className="w-40">
      <Select
        classNamePrefix="custom-select form-control-sm"
        inputValue={searchQuery}
        value={selectedOption}
        style={{padding: '0!important'}}
        onChange={handleChange}
        options={options}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => (
            <div     dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
            style={{ display: 'flex', alignItems: 'center' ,}}>
              <span>{`${option.account_name} ${option.moneyType}`}</span>
            </div>)}
        getOptionValue={(option) => `${option.account_name} ${option.moneyType}`}
        // placeholder="Search..."
        placeholder={formatMessage({ id: "Search..." })}
        isClearable
        // components={{ MenuList: CustomMenuList }}
        isSearchable
        isDisabled={isEditable}
        menuPortalTarget={document.body} // انتقال منو به `body`
        styles={customStyles} // تنظیم `z-index`
      />
    </div>
  );
};

export default Combo_Customer;