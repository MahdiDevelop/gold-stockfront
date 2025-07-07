import React, { useEffect, useState,useCallback } from 'react';
import Select from 'react-select';

const Combo_item = ({ options,Onsearch,selectedOption,setSelectedOption}) => {
  
  const handleChange = (sselectedOption) => {
    setSelectedOption(sselectedOption);
      Onsearch(sselectedOption);
};
  return (
    <div className='w-40'>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        getOptionLabel={(option) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{`${option.name} `}</span>
          </div>)}
        getOptionValue={(option) => `${option.name}`}
        placeholder="Search..."
        isClearable
        isSearchable
      />
    </div>
  );
};

export default Combo_Customer;
