import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Source from "../../Source";
import { useDispatch } from "react-redux";
import { showAlert } from "../../warrper";
import { getMoneys } from "../Redux/moneysSlice";
import { getCustomers } from "../Redux/customerSlice";
import { getBelances } from "../Redux/belanceSlice";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../warrper";
import { Factory } from "lucide-react";
export default function Reset({ addAccountModal,close }) {
  const showAlert = useShowAlert(); 
  const [selectedTables, setSelectedTables] = useState({
    accounts: false,
    balance: false,
    report: false,
    money: false,
    factory: false,
  });
  const dispatch=useDispatch();
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setSelectedTables((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSubmit = async () => {
    const tablesToReset = Object.keys(selectedTables).filter(
      (table) => selectedTables[table]
    );
    // console.log(tablesToReset);

    if (tablesToReset.length === 0) {
            showAlert({
              position: "top-end",
              icon: "error",
              title:  <FormattedMessage id="Please select at least one table to reset." />,
              showConfirmButton: false,
              timer: 1500,
            });
      return;
    }

    try {
      const response = await axios.post(Source.getAddress()+"/api/empty-selected-tables", {
        tables: tablesToReset,
      },{headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },});
      // showAlert("Success", <FormattedMessage id="Updated Successfully!"/>,"success");
      showAlert({
              position: "top-end",
              icon: "Success",
              title:  <FormattedMessage id="Updated Successfully!" />,
              showConfirmButton: false,
              timer: 1500,
            });
      if(selectedTables.money){
        dispatch(getMoneys());
      }
      if(selectedTables.balance){
        // dispatch(getBelances());
      }
      if(selectedTables.accounts){
        // dispatch(getCustomers());
      }
    } catch (error) {
      // showAlert("Error", <FormattedMessage id="Something went wrong!"/>, "error");
           showAlert({
              position: "top-end",
              icon: "error",
              title:  <FormattedMessage id="Something went wrong!" />,
              showConfirmButton: false,
              timer: 1500,
            });
      console.error(error);
    }
    close()
  };

  return (
      <div
        className={`rounded-4 row g-2 popup m-4 mb-0 ${addAccountModal && "show"}`}
        style={{ width: "26rem" }}
      >
        <div className="d-flex justify-content-end m-0 p-0">
          <table className="table table-light table-striped">
            <thead>
              <tr>
                <h2 className="m-2 fw-bold mb-4 w-100"><FormattedMessage id="Reset Options"/></h2>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              <tr>
                <td className="d-flex justify-content-between">
                  <strong className="fs-5 p-1 me-5"><FormattedMessage id="Customers"/></strong>
                  <div className="form-check form-switch pt-2 w-25">
                    <input
                      className="form-check-input align-bottom m-0 w-50 h-75 ms-4"
                      type="checkbox"
                      id="accounts"
                      checked={selectedTables.accounts}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="d-flex justify-content-between">
                  <strong className="fs-5 p-1 me-5"><FormattedMessage id="Accounts"/></strong>
                  <div className="form-check form-switch pt-2 w-25">
                    <input
                      className="form-check-input align-bottom m-0 w-50 h-75 ms-4"
                      type="checkbox"
                      id="balance"
                      checked={selectedTables.balance}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="d-flex justify-content-between">
                  <strong className="fs-5 p-1 me-5"><FormattedMessage id="Deposit And Withdraw"/></strong>
                  <div className="form-check form-switch pt-2 w-25">
                    <input
                      className="form-check-input align-bottom m-0 w-50 h-75 ms-4"
                      type="checkbox"
                      id="report"
                      checked={selectedTables.report}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="d-flex justify-content-between">
                  <strong className="fs-5 p-1 me-5"><FormattedMessage id="Cash"/></strong>
                  <div className="form-check form-switch pt-2 w-25">
                    <input
                      className="form-check-input align-bottom m-0 w-50 h-75 ms-4"
                      type="checkbox"
                      id="money"
                      checked={selectedTables.money}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="d-flex justify-content-between">
                  <strong className="fs-5 p-1 me-5"><FormattedMessage id="Factory Reset"/></strong>
                  <div className="form-check form-switch pt-2 w-25">
                    <input
                      className="form-check-input align-bottom m-0 w-50 h-75 ms-4"
                      type="checkbox"
                      id="factory"
                      checked={selectedTables.factory}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-10 ms-4 m-10 mt-5 ps-3 d-flex center">
          <button
            className="text-center form-control btn btn-danger text-light me-1 ms-1"
            style={{ margin: "auto", width: "150px" }}
            onClick={()=>close()}
          >
            <FormattedMessage id="Cancel"/>
          </button>
          <button
            className="text-center btn form-control btn-success text-light ms-1"
            style={{ margin: "auto", width: "150px" }}
            onClick={handleSubmit}
          >
                        <FormattedMessage id="Submit"/>
          </button>
        </div>
      </div>
  );
}
