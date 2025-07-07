import React, { useState } from "react";
import axios from "axios";
import Source from "../Source";
import Swal from "sweetalert2";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert } from "../warrper";
export default function Edit({users,setUsers, closeEdit, edit, setUser, user, updateItem }) {
  const [error, setError] = useState(false);
  const showAlert = useShowAlert(); 


  const createUser = (user) => {
    const update = {
      name: user.name,
      password: password,
      first_name: user.first_name,
      email: user.email,
      category: user.category,
    };
    if (user.name && password) {
      axios
        .put(`${Source.getAddress()}/api/user/${user.id}/`, update, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((response) => {
          showAlert({
            position: "top-end",
            icon: "success",
            title: <FormattedMessage id="User has been updated!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
          localStorage.setItem('userToken',user.name);
          setUsers(users.map((row)=>(row.id === user.id ? user :row)));
          closeEdit();
          setUser({});
        })
        .catch((error) => {
          showAlert({
            position: "top-end",
            icon: "error",
            title: <FormattedMessage id="Something went wrong!"/>,
            // title: "Something went wrong!",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else {
      setError(true);
      showAlert({
        title: "Error",
        title: <FormattedMessage id="You must fill in all required fields!"/>,
        // text: "You must fill in all required fields!",
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [e.target.name]:e.target.value
    });
  };
  const [password,setpassword]=useState();
  const handlepassword=(e)=>{
    setpassword(e.target.value);
  }
  return (
    <div className={`container rounded-4 p-2  popup ${edit ? "show" : ""}`} style={{ maxWidth: '400px' }}>
      <h4 className="text-center bg-info mt-4 p-3 text-light w-100">
        <FormattedMessage id="Edit User"/>
      </h4>
      <div className="mb-3 mt-5">
        <label htmlFor="username" className="form-label">
        <FormattedMessage id="User Name"/>
        </label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={user.name}
          className="form-control"
          id="username"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
        <FormattedMessage id="New Password"/>
        </label>
        <input
          type="password"
          name="password"
          onChange={handlepassword}
          value={password}
          className="form-control"
          id="password"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="is_staff" className="form-label">
                  <FormattedMessage id="Type"/>
        </label>
        <select
          id="is_staff"
          name="category"
          onChange={handleChange}
          className="form-select"
          value={user.category}
        >
          <option value={"admin"}>
          <FormattedMessage id="Admin"/>
            </option>
          <option value={"simple"}>
          <FormattedMessage id="Simple"/>
            </option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <FormattedMessage id="Email"/>
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={user.email}
          className="form-control"
          id="email"
        />
      </div>

      {error && (
        <div className="text-light ps-2 opacity-75 rounded bg-danger font-weight-bold mt-0">
          <FormattedMessage id="You must fill in all required fields."/>
        </div>
      )}
      <div className="mt-1 justify-content-around d-flex">
        <button
          type="button"
          className="col-5 m-2 mt-3 btn btn-outline-danger fw-bold"
          onClick={() => {
            closeEdit();
            setError(false);
          }}
        >
          <FormattedMessage id="Cancel"/>
        </button>
        <button
          onClick={() => {
            createUser(user);
          }}
          type="button"
          className="col-5 m-2 mt-3 btn btn-outline-success fw-bold"
        >
                    <FormattedMessage id="Save"/>
        </button>
      </div>
    </div>
  );
}
