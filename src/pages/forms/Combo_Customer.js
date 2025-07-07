import React from 'react';
import Select, { components } from 'react-select';
import { FormattedMessage,useIntl } from "react-intl";
const Combo_Customer = ({ 
  isEditable = false, 
  name, 
  type, 
  options, 
  Onsearch, 
  selectedOption, 
  setAddAccountModal, 
  setSelectedOption, 
  searchQuery, 
  handleInputChange 
}) => {
  const handleChange = (sselectedOption) => {
    setSelectedOption(sselectedOption);
    // console.log('hi');
    // Onsearch(sselectedOption);
  };
// console.log(searchQuery);
  const CustomMenuList = (props) => (
    <components.MenuList {...props}>
      {props.children}
      {type && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            borderTop: "1px solid #eaeaea",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
          }}
          onClick={() => {
            setAddAccountModal(searchQuery)
            // setSelectedOption({id:0, name:searchQuery});
          }}
        >
          <strong>{name}</strong>
        </div>
      )}
    </components.MenuList>
  );

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
const { formatMessage } = useIntl();

  return (
    <div className="w-40">
      <Select
        classNamePrefix="custom-select"
        inputValue={searchQuery}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{`${option.name} `}</span>
          </div>
        )}
        getOptionValue={(option) => `${option.name}`}
        // placeholder="Search..."
        placeholder={formatMessage({ id: "Search..." })}
        isClearable
        components={{ MenuList: CustomMenuList }}
        isSearchable
        isDisabled={isEditable}
        menuPortalTarget={document.body} // انتقال منو به `body`
        styles={customStyles} // تنظیم `z-index`
      />
    </div>
  );
};
export default Combo_Customer;