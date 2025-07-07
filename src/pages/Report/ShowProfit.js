import React, {useMemo, useEffect, useRef, useState } from "react";
import axios from "axios";
import Source from "../../Source";
import Swal from "sweetalert2";
import Profile from "../../assets/icon/profile.png";
import IdNational from "../../assets/icon/national_id.png";
import { useSelector, useDispatch } from "react-redux";
import { addCustomerToCache, getCustomers } from "../Redux/customerSlice";
import "./style.css";
import { FormattedMessage } from "react-intl";
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};
export default function ShowProfit({
  close,
  addAccountModal,
  record,
  setRecord,
  accounts,
  inputRef,
  ShowBill,
}) {
  return (
    <div
      className={`container rounded-5 popup customer ${
        addAccountModal ? "show" : ""
      }`}
      style={{
        maxWidth: "70%",
        overflowX: "auto",
        overflowY: "auto",
        height: "80vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        zIndex: "10000",
      }}
    >
      <div
        class="card card-body m-auto"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-close p-3 m-1 mt-0 hover_btn"
            onClick={close}
            aria-label="Close"
          ></button>
        </div>
        <h1 class="text-center rounded m-0 mb-2 p-4 text-light fw-bold bg-info">
          Tracking of profite
        </h1>
        <table class="table table-light table-striped">
          <thead>
            <tr>
              <th scope="col">
              <FormattedMessage id="No"/>
              </th>
              <th scope="col">
              <FormattedMessage id="Source"/>
              </th>
              <th scope="col">              <FormattedMessage id="Profit"/>
              </th>
              <th scope="col">              <FormattedMessage id="Bill Number"/>
              </th>
              <th scope="col">              <FormattedMessage id="Currency"/>
              </th>
              <th scope="col">              <FormattedMessage id="Show"/>
              </th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            {record &&
              record.map((row, idx) => {
                return (
                  <tr key={idx}>
                    <th scope="row">{idx + 1}</th>
                    <td>
                      {row.source === "Report" ? "Transformations" : row.source}
                    </td>
                    <td>{<span dir="ltr">{formatNumber(row.profit)}</span>}</td>
                    <td>
                      {row.source === "Report"
                        ? row.report_id + " Number"
                        : row.bill_id}
                    </td>
                    <td>{row.money_type}</td>
                    {/* <td>{row.money_type}</td> */}
                    <td>
                      {" "}
                      {row.source !== "Report" && (
                        <button
                          onClick={() => {
                            ShowBill(row.bill_id);
                          }}
                          type="button"
                          className="btn btn-outline-info rounded-4"
                          style={{ fontSize: "0.6rem" }}
                        >
                                        <FormattedMessage id="Veiw"/>
                        </button>
                      )}
                    </td>
                    {/* <td style={{ width: "5%" }}>
                             {!row.ontransaction && (
                               <button
                                 style={{
                                   border: "none",
                                   background: "tranceparent",
                                 }}
                                 onClick={() => Delete(row)}
                               >
                                 <img
                                   height={"50%"}
                                   width={"50%"}
                                   src={Trash}
                                   style={{
                                     background: "transparent",
                                   }}
                                 />
                               </button>
                             )}
                           </td>
                           <td style={{ width: "5%" }}>
                             {!row.ontransaction && (
                               <button
                                 onClick={() => {
                                   setAdd(false);
                                   setEdit(row);
                                   setUpdate(true);
                                   seTtitle("Edit Type Money");
                                   updateRef.current.select();
                                 }}
                                 style={{
                                   border: "none",
                                   backgroundColor: "tranceparent!important",
                                 }}
                               >
                                 <img height={"90%"} width={"90%"} src={pencil} />
                               </button>
                             )}
                           </td> */}
                  </tr>
                );
              })}
            {/* {source.length>=6 && <a o className="text-primary underlined text-center">{text}</a>} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
