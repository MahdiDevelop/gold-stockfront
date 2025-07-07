import axios from "axios";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector ,useDispatch} from "react-redux";
import Source from "../../Source";
import { getSidebars } from "../Redux/sidebarSlice";
import { useShowAlert  } from "../../warrper";

// Transform the default options into a proper array of objects
const transformOptions = (optionsObj) => {
  return Object.keys(optionsObj).map(key => ({
    id: key,
    label: key,
    checked: optionsObj[key] === 1
  }));
};
const reverseTransformOptions = (optionsArray) => {
  return optionsArray.reduce((acc, option) => {
    acc[option.id] = option.checked ? 1 : 0;
    return acc;
  }, {});
};
const defaultOptions = transformOptions({
  Accounts: 1,
  All_Draft_Group: 1,
  Cash: 1,
  Currency: 1,
  Customers: 1,
  Dashboard: 1,
  Deposite: 1,
  Draft_Accounts: 1,
  Draft_Currency: 1,
  Draft_Customers: 1,
  Draft_Transactions: 1,
  Item_Type: 1,
  Items: 1,
  Items_Group: 1,
  Purchase: 1,
  Purchase_Return: 1,
  Report_Customer: 1,
  Reports: 1,
  Sell: 1,
  Sell_Return: 1,
  Settings: 1,
  Stock: 1,
  Transactions_Group: 1,
  Transformation: 1,
  Withdraw: 1,
  benefit_report: 1
});

export default function SidebarShow({ SidebarModel, close, onSave, options }) {
  // console.log(options);
  const { sidebars } = useSelector((state) => state.sidebars);
    const showAlert = useShowAlert(); 
    
  const [selectedOptions, setSelectedOptions] = useState(options);
  // Update selectedOptions when options prop changes
  const Dispatch=useDispatch();
  useEffect(() => {
    setSelectedOptions(options);
  }, [options]);

  const handleCheckboxChange = (id) => {
    setSelectedOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const chunkArray = (array, chunks) => {
    const result = [];
    const chunkSize = Math.ceil(array.length / chunks);
    
    for (let i = 0; i < chunks; i++) {
      result.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
    }
    
    return result;
  };
  const columns = chunkArray(selectedOptions, 3);
  const renderOptionsTable = (columnOptions) => (
    <table className="table table-light table-striped">
      <thead>
        <tr>
          <th>
            <h6 className="fw-bold w-100" style={{ fontSize: "1rem" }}>
              <FormattedMessage id="Reset Options" />
            </h6>
          </th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
      {columnOptions.map((option) => {
  if (option.id === 'created_at' || option.id === 'updated_at'|| option.id === 'id') {
    return null;
  }

  return (
    <tr key={option.id}>
      <td className="d-flex justify-content-between">
        <strong className="p-1 me-5" style={{ fontSize: "0.6rem" }}>
          <FormattedMessage
            id={option?.label}
            defaultMessage={option.label}
          />
        </strong>
        <div className="form-check form-switch pt-2 w-25">
          <input
            className="form-check-input align-bottom m-0 w-50 h-75 ms-4"
            type="checkbox"
            id={option.id}
            checked={option.checked}
            onChange={() => handleCheckboxChange(option.id)}
          />
        </div>
      </td>
    </tr>
  );
})}

      </tbody>
    </table>
  );

  const handleSave = () => {
    let data=reverseTransformOptions(selectedOptions);
    data._method='put';
  axios.post(Source.getAddress()+'/api/sidebar/1',data,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
}).then((res)=>{
// console.log(res)
showAlert({
  position: "top-end",
  icon: "success",
  title: <FormattedMessage id="Transformation has been updated!" />,
  showConfirmButton: false,
  timer: 1000,
});
Dispatch(getSidebars());
}).catch((err)=>{
  console.log(err);
  showAlert({
    position: "top-end",
    icon: "error",
    title: <FormattedMessage id="Something went wrong!" />,
    showConfirmButton: false,
    timer: 1000,
  });
})}
  return (
    <div
      className={`container rounded-5 popup ${SidebarModel ? "show" : ""}`}
      style={{
        maxWidth: "90%",
        overflow: "auto",
        maxHeight: "60vh",
        backgroundColor: "#f8f9fa",
        padding: "15px",
        zIndex: "100",
        width: "90%",
        height: "90vh",
        fontSize: '0.6rem'
      }}
    >
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close h-25 p-3 mt-0 hover_btn"
          onClick={close}
          aria-label="Close"
        ></button>
      </div>

      <div className="p-1 rounded-5" dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}>
        <div className="row">
          <h1
            className="text-center rounded text-light"
            style={{
              backgroundColor: "var(--bs-info)",
              width: "100%",
              fontSize: "1rem",
              padding: "0.5rem",
            }}
          >
            <FormattedMessage id="CustomizeSidebar" defaultMessage="Sidebar Options" />
          </h1>
          {columns.map((columnOptions, index) => {
  if (columnOptions.id === 'id') {
    return null;
  }
  return (
    <div className="col-12 col-md-4" key={index}>
      <div className="d-flex justify-content-end m-0 p-0" style={{ fontSize: "1rem" }}>
        {renderOptionsTable(columnOptions)}
      </div>
    </div>
  );
})}


          <div className="col-12 d-flex justify-content-center mt-1">
            <button
              type="button"
              className="text-center btn btn-danger text-light ms-2 me-2 btn-sm"
              style={{ width: "130px" }}
              onClick={close}
            >
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </button>
            <button
              type="button"
              className="text-center btn btn-success text-light ms-2 btn-sm"
              style={{ width: "130px" }}
              onClick={() => handleSave(selectedOptions)}
            >
              <FormattedMessage id="Save" defaultMessage="Save" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}