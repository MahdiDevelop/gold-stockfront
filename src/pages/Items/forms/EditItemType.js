import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import AddStock from "../../../assets/icon/AddStock.png";
import Source from "../../../Source";
import Multiselect from 'multiselect-react-dropdown';
// import Swal from "sweetalert2";
import { showAlert } from "../../../warrper";
import { FormattedMessage } from "react-intl";
import { useShowAlert  } from "../../../warrper";
import { useSelector } from "react-redux";
export default function EditItemType({
  inputRef,
  open,
  close,
  records, setRecords,EditItemRow, SetEditItemRow
}) {
  const showAlert = useShowAlert(); 
  const [Name, setName] = useState('');
  const {sidebars}=useSelector((state) => state.sidebars);
  const [ItemPictureImg, setItempictureImg] = useState(AddStock);
  const [ItemPicture, setItempicture] = useState();
  const handle = (e) => {
    // به روز رسانی فقط نام بدون از دست دادن ویژگی‌های دیگر
    setName(e.target.value);
  };
  
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setItempicture(selectedImage);
      setItempictureImg(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };


  const Sumbit = () => {
    let mus = '';
  
    // Ensure selectedValues are correctly set
    for (let i = 0; i < selectedValues.length; i++) {
      if (i === selectedValues.length - 1) {
        mus += selectedValues[i].name;
      } else {
        mus += selectedValues[i].name + ',';
      }
    }
  
    const uploadData = new FormData();
  
    // Add the image if there is one
    if (ItemPicture) {
      // console.log(ItemPicture);
      uploadData.append('picture', ItemPicture);
      console.log('Picture added');
    }
  
    // Add necessary fields to the FormData object
    uploadData.append("_method", 'PUT');
    uploadData.append('user_id', localStorage.getItem('userTokenid'));
    uploadData.append('measuring', mus);
    uploadData.append('name', Name);
    uploadData.append('isdelete', 0);
  
    // Logging the FormData for debugging
    // console.log('FormData:', uploadData);
  
    // Perform the PUT request using axios.put instead of axios.post
    axios.post(Source.getAddress() + '/api/itemtype/' + EditItemRow.id, uploadData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }).then((res) => {
      showAlert({
        position: "top-end",
        icon: "success",
        // title: "Item updated successfully!",
                  title: <FormattedMessage id="Your record has been updated!" />,
        
        showConfirmButton: false,
        timer: 1500,
      });
  
      // Update records after successful response
      let add2 = res.data;

      // Ensure you are spreading the existing object properly to keep all keys intact
      add2 = {
        ...add2,
        user_name: localStorage.getItem('userToken')
      };
      
      // Update the record in the `records` array if the `id` matches
      setRecords(records.map((a) => (a.id === add2.id ? add2 : a)));
      
    }).catch((err) => {
      console.error("Error:", err.response);
      showAlert({
        position: "top-end",
        icon: "error",
        // title: err.response?.data?.message || "An error occurred",
                                          title: <FormattedMessage id="Not working ,please try again!" />,
        
        showConfirmButton: false,
        timer: 1500,
      });
    });
  
    // Reset fields after submit
    close();
    setName('');
    setItempicture('');
    setItempictureImg(AddStock);
    setSelectedValues([]);
    setoptions([
      { name: 'Qty', id: counter },
      { name: 'Weight', id: counter + 1 },
    ]);
    setcounter(counter + 2);
  };
  
// 
  const [counter, setcounter] = useState(3);
  const [options, setoptions] = useState([
    { name: 'Qty', id: 1 },
    { name: 'Weight', id: 2 },
  ]);

  const [selectedValues, setSelectedValues] = useState([
    { name: 'Qty', id: 1 },
  ]);

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValues(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedValues(selectedList);
  };
  const buttonRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      e.preventDefault(); // Prevent default action if needed
      if (buttonRef.current && Name) {
        buttonRef.current.click(); // Programmatically click the button
      }
    }
  };
  useEffect(() => {
    // وقتی که EditItemRow به‌روزرسانی می‌شود، مقدار measuring را به آرایه‌ای تقسیم کرده و به selectedValues اختصاص می‌دهیم
    if (EditItemRow?.measuring) {
      const selectedItems = EditItemRow.measuring.split(',').map(item => ({ name: item, id: 1 }));
      setSelectedValues(selectedItems);
    }
    if(EditItemRow){
      setName(EditItemRow.name);
    }
    if(EditItemRow?.picture){
      setItempictureImg(EditItemRow.picture);
    }
  }, [EditItemRow]); // به‌روزرسانی selectedValues زمانی که EditItemRow تغییر کند
  
  return (
    <div
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className={`rounded-4 row g-2 popup mx-auto ${open && "show"}`}
      style={{ width: "22rem" }}
    >
      <h1
        className="text-center rounded m-0 p-2 w-100 text-light fs-2"
        style={{ backgroundColor: "var(--bs-info)" }}
      >
                           <FormattedMessage id={`Edit ${sidebars[0].type==="gold" ? "Gold" : "Item"} Type`} />
      </h1>
      <div class="col-md-12">
        <div className="d-flex mt-2">
          <img
            className="td_img rounded border-white rounded-4 me-1"
            src={ItemPictureImg}
            style={{ height: "100px", width: "100px", objectFit: "fit", border: "5px solid" }}
            alt="Profile"
          />
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <label htmlFor="profile_picture" style={{ fontWeight: "bold" }}>
            <FormattedMessage id="Add Image" />
            </label>
            <input
              onKeyDown={handleKeyDown}
              type="file"
              accept="image/*"
              name="profile_picture"
              placeholder="Add image"
              onChange={handleImageChange}
              className="form-control m-auto"
              style={{ width: "70%" }}
            />
          </div>
        </div>
        <br></br>
        <div className="d-flex">
          <label htmlFor="exampleInputEmail1" className="fw-bold">
          <FormattedMessage id="Item Type Name" />
          </label>
          <input
            autoFocus
            ref={inputRef}
            onKeyDown={handleKeyDown}
            type="text"
            name="name"
            onChange={handle}
            value={Name}
            className="form-control w-50 m-auto mt-2"
            id="exampleInputEmail1"
            // aria-describedby="emailHelp"
            style={{ width: "70%" }}
          />
        </div>
        <div className="mb-3 d-flex mt-4">
          <label className="fw-bold"><FormattedMessage id="Mesurment Type" /></label>
          <Multiselect
            onKeyDown={handleKeyDown}
            style={{ width: '40px', padding: '2rem' ,margin:'auto' ,maxWidth: '40px '}}
            options={options} // Options to display in the dropdown
            selectedValues={selectedValues} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            className="ms-4 w-75"
          // placeholder="Select Types Of mesurement"
          />

        </div>
      </div>
      <div className="col-10 ms-4 m-10 mt-5 ps-3 d-flex">
        <a
          className="text-center form-control btn btn-danger text-light me-1 ms-1"
          style={{ margin: "auto", width: "150px" }}
          onClick={() => {
            close();
            // setError(false);
          }}
        >
         <FormattedMessage id="Cancel" />
        </a>
        <a
          className="text-center btn form-control btn-success text-light ms-1"
          ref={buttonRef}
          style={{ margin: "auto", width: "150px" }}
          onClick={() => Sumbit()}
        >
                   <FormattedMessage id="Submit" />
        </a>
      </div>
    </div>
  );
}
