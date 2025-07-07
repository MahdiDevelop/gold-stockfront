import React, { useState } from "react";
import Add from "../../assets/icon/add.png";
export default function AddBelance({close}) {
  const [addbelance,setaddbelance] =useState(true);
  return (
    <div
      style={{
        zIndex: 1,
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0.4",
      }}
      className="d-flex w-100 h-100"
      onClick={(e) => {
        if (
          e.target.className === "d-flex w-100 h-100" ||
          e.target.className === "container"
        ) {
          close();
        }
      }}
      
    > hi  </div>
  );
}