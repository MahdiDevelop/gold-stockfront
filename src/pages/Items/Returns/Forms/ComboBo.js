import React from 'react';
import Select, { components } from 'react-select';
import { FormattedMessage,useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
  
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
    // Onsearch(sselectedOption);
  };
console.log(options);
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
    menuPortal: (base) => ({ ...base, zIndex:10000000 }),
  };
  const { formatMessage } = useIntl();
  const { sidebars,statusSidebar} = useSelector((state) => state.sidebars);  
  // console.log(searchQuery);
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
            <span>{`${sidebars[0].type==="gold" ? option.stock?.name+" "+option.stock?.type?.name :option.stock?.name} `}</span>
              {/* <span>{`${option.stock?.name}`}</span> */}
            </div>)}
        getOptionValue={(option) => `${option.stock?.name}`}
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
