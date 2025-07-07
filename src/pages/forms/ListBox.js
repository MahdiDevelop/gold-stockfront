import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { ChevronDown } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

const ListBox = ({
  isDisabled = false,
  options = [],
  selectedOption,
  setSelectedOption,
  width = '100%',
}) => {
  const { formatMessage, locale } = useIntl();
  const isRTL = locale === 'fa'; // Assuming 'fa' is your Persian locale code
  
  const allUsersOption = { 
    name: <FormattedMessage id="All Users" />, 
    id: 0 
  };
  
  const updatedOptions = [allUsersOption, ...options];

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(allUsersOption);
    }
  }, [selectedOption, setSelectedOption, allUsersOption]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      fontFamily: localStorage.getItem("language") !== "en" &&  "'CustomFont1', sans-serif",
      backgroundColor: '#fff',
      zIndex: 1,
      borderRadius: '8px',
      border: state.isFocused ? '2px solid #4f46e5' : '1px solid #d1d5db',
      boxShadow: state.isFocused ? '0 0 5px rgba(79, 70, 229, 0.5)' : 'none',
      '&:hover': {
        border: '1px solid #4f46e5',
      },
      minHeight: '39px',
      padding: '4px 8px',
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr',
    }),
    menu: (base) => ({
      ...base,
      fontFamily: localStorage.getItem("language") !== "en" &&  "'CustomFont1', sans-serif",
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      fontFamily: localStorage.getItem("language") !== "en" &&  "'CustomFont1', sans-serif",
      backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#e0e7ff' : '#fff',
      color: isSelected ? '#fff' : '#111827',
      padding: isRTL ? '12px 16px 12px 8px' : '12px 8px 12px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      textAlign: isRTL ? 'right' : 'left',
      '&:active': {
        backgroundColor: '#4338ca',
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontFamily: localStorage.getItem("language") !== "en" &&  "'CustomFont1', sans-serif",
      fontWeight: 'bold',
      color: '#4f46e5',
      fontSize: '14px',
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr',
    }),
    placeholder: (base) => ({
      ...base,
      fontFamily: localStorage.getItem("language") !== "en" &&  "'CustomFont1', sans-serif",
      fontSize: '14px',
      color: '#6b7280',
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      fontFamily:localStorage.getItem("language") !== "en" &&  "'CustomFont1', sans-serif",
      padding: '8px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
    input: (base) => ({
      ...base,
      fontFamily:localStorage.getItem("language") !== "en" && "'CustomFont1', sans-serif",
      textAlign: isRTL ? 'right' : 'left',
    }),
  };

  return (
    <div 
      className={`mt-3`} 
      style={{ width }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Select
        classNamePrefix="custom-select"
        value={selectedOption}
        onChange={handleChange}
        options={updatedOptions}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        placeholder={formatMessage({ id: 'select.placeholder' }) || (isRTL ? 'انتخاب کنید...' : 'Select...')}
        isClearable={false}
        isSearchable={false}
        isDisabled={isDisabled}
        menuPortalTarget={document.body}
        styles={customStyles}
        components={{
          DropdownIndicator: ({ innerProps }) => (
            <div {...innerProps} className={isRTL ? 'pl-2 text-gray-500' : 'pr-2 text-gray-500'}>
              <ChevronDown size={20} />
            </div>
          ),
          ClearIndicator: null,
        }}
      />
    </div>
  );
};

ListBox.propTypes = {
  isDisabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.node.isRequired,
    })
  ),
  selectedOption: PropTypes.object,
  setSelectedOption: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ListBox.defaultProps = {
  isDisabled: false,
  options: [],
  selectedOption: null,
  width: '100%',
};

export default ListBox;