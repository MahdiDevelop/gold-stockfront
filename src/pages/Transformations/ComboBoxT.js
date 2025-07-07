import React from 'react';
import Select, { components } from 'react-select';
import { FormattedMessage, useIntl } from "react-intl";

const Combo_Customer = ({ 
  isEditable = false, 
  options, 
  Onsearch, 
  selectedOption, 
  setSelectedOption, 
  searchQuery, 
  handleInputChange 
}) => {
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    Onsearch(selectedOption);
  };

  const { formatMessage } = useIntl();

    const customStyles = {
      menuPortal: (base) => ({ ...base, zIndex: 9999,  ...( {
        // fontSize: '0.1rem!important',
      }) }),
      // control: (provided, state) => ({
      //   ...provided,
      //   fontSize: '0.6rem!important',
      //   padding: '0',
      //   minHeight: 'calc(0.5em + 0.5rem + 2px)',
      //   borderRadius: '2px',
      //   borderColor: state.isFocused ? '#2684FF' : '#ced4da',
      //   boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : 'none',
      //   '&:hover': {
      //     borderColor: state.isFocused ? '#2684FF' : '#adb5bd'
      //   }
      // }),
      // input: (provided) => ({
      //   ...provided,
      //   fontSize: '0.6rem',
      //   margin: '0!important',
      //   padding: '0!important',
      // }),
      // option: (provided, state) => ({
      //   ...provided,
      //   fontSize: '0.6rem!important',
      //   padding: '0',
      //   backgroundColor: state.isSelected ? '#2684FF' : state.isFocused ? '#f8f9fa' : 'white',
      //   color: state.isSelected ? 'white' : '#212529',
      //   '&:active': {
      //     backgroundColor: '#dee2e6'
      //   }
      // }),
      // menu: (provided) => ({
      //   ...provided,
      //   fontSize: '0.6rem',
      //   zIndex: 10000000,
      //   marginTop: '0.25rem'
      // }),
      // singleValue: (provided) => ({
      //   ...provided,
      //   fontSize: '0.6rem'
      // }),
      // placeholder: (provided) => ({
      //   ...provided,
      //   fontSize: '0.6rem',
      //   color: '#6c757d'
      // }),
      // dropdownIndicator: (provided) => ({
      //   ...provided,
      //   padding: '0'
      // }),
      // clearIndicator: (provided) => ({
      //   ...provided,
      //   padding: '0rem'
      // }),
      // valueContainer: (provided) => ({
      //   ...provided,
      //   padding: '0'
      // })
    };

  return (
    <div className="w-100">
      <Select
        classNamePrefix="custom-select"
        inputValue={searchQuery}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => (
          <div style={{ display: 'flex', alignItems: 'center' }} className='afgFont'>
            <span>{`${option.account_name} ${option.moneyType}`}</span>
          </div>
        )}
        getOptionValue={(option) => `${option.account_name} ${option.moneyType}`}
        placeholder={formatMessage({ id: "Search..." })}
        isClearable
        isSearchable
        isDisabled={isEditable}
        styles={customStyles}
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default Combo_Customer;