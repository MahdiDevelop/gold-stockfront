import React from 'react';
import Select, { components } from 'react-select';
import { FormattedMessage, useIntl } from "react-intl";

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
  handleInputChange,
  label,  // اضافه کردن prop جدید برای label
}) => {
  const { formatMessage } = useIntl();

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    // اگر خواستی می‌تونی این خط رو فعال کنی
    // Onsearch(selectedOption);
  };

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
            setAddAccountModal(searchQuery);
            // setSelectedOption({id:0, name:searchQuery}); // در صورت نیاز می‌توانید فعال کنید
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

  return (
    <div className="w-40">
      {/* نمایش label در صورت ارسال */}
      {label && (
        <label 
          style={{
            display: 'block',
            marginBottom: 2,
            fontWeight: 'bold',
            fontSize: 14,
            padding: 0,
            color: '#333' 
          }}
        >
          {label}
        </label>
      )}

      <Select
        classNamePrefix="custom-select"
        inputValue={searchQuery}

        value={selectedOption}
        onChange={handleChange}
        options={options}
          filterOption={(option, inputValue) => {
    const name = option.data.name.toLowerCase();
    const code = option.data.whatsup_number?.toLowerCase() || '';
    const input = inputValue.toLowerCase();
    return name.includes(input) || code.includes(input);
  }}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{option.name}</span>
          </div>
        )}
        getOptionValue={(option) => option.name}
        placeholder={formatMessage({ id: "Search..." })}
        isClearable
        components={{ MenuList: CustomMenuList }}
        isSearchable
        isDisabled={isEditable}
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    </div>
  );
};

export default Combo_Customer;
