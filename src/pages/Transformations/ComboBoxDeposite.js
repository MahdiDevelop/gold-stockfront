import React from 'react';
import Select, { components } from 'react-select';
import { FormattedMessage,useIntl } from "react-intl";

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
    Onsearch(sselectedOption);
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
              <span>{`${option.account_name} ${option.moneyType}`}</span>
            </div>)}
        getOptionValue={(option) => `${option.account_name} ${option.moneyType}`}
        // placeholder="Search..."
        placeholder={formatMessage({ id: "Search..." })}
        isClearable
        isSearchable
        isDisabled={isEditable}
      />
    </div>
  );
};

export default Combo_Customer;
