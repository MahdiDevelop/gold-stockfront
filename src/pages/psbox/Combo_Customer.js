import React from 'react';
import Select, { components } from 'react-select';
import { FormattedMessage,useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getSidebars } from '../Redux/sidebarSlice';

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
  notCurrency=true, 
  handleInputChange 
}) => {

  const handleChange = (sselectedOption) => {
    setSelectedOption(sselectedOption);
    // console.log(sselectedOption);
    // Onsearch(sselectedOption);
  };
  const dispatch = useDispatch();
  const { sidebars,statusSidebar} = useSelector((state) => state.sidebars);
  // console.log(sidebars);
  // dispatch(getSidebars());
  const CustomMenuList = (props) => (
    <components.MenuList {...props}>
      {props.children}
      {type && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "4px",
            borderTop: "1px solid #eaeaea",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
          }}
          onClick={() => setAddAccountModal(searchQuery)}
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
            <span>{`${sidebars[0].type==="gold" && notCurrency ? option?.name+" "+option?.type?.name :option?.name} `}</span>
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
