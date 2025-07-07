import React, { useEffect, useState,useCallback } from 'react';
import Select ,{components}from 'react-select';

const ComboBox = ({isEditable=false,name, options,type,Onsearch,selectedOption,setSelectedOption,setAddBalanceModal}) => {
  const handleChange = (selectedOption) => {
      setSelectedOption(selectedOption);
      Onsearch(selectedOption);
};
const CustomMenuList = (props) => {
  return (
    <components.MenuList {...props}>
      {props.children}
     {type &&<div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          borderTop: "1px solid #eaeaea",
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
        }}
        onClick={()=>setAddBalanceModal(true)}
      >
        {/* <strong>Add "{searchQuery}"</strong> */}
        <strong>{name}</strong>
      </div>}
    </components.MenuList>
  );
};
  return (
    <div className='w-40'>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        getOptionLabel={(option) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{`${option.account_name} ${option.moneyType}`}</span>
          </div>)}
        getOptionValue={(option) => `${option.account_name} ${option.moneyType}`}
        placeholder="Search..."
        isClearable
        components={{ MenuList: CustomMenuList }}
        isSearchable
      />
    </div>
  );
};

export default ComboBox;
