import React, { useState } from "react";
import axios from "axios";
import Source from "../Source";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useShowAlert } from "../warrper";
export default function Add({ closeAdd, add, setUsers, users }) {
  const showAlert = useShowAlert(); 
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
    category: "simple", // Default to false; can be toggled if necessary
  });
  const [error, setError] = useState(false);

  const createUser = (user) => {
    if (user.name && user.password) {
      axios
        .post(`${Source.getAddress()}/api/user/`, user, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          },
        })
        .then((response) => {
          showAlert({
            position: "top-end",
            icon: "success",
            // title: "User has been created!",
                        title: <FormattedMessage id="User has been created!"/>,
            showConfirmButton: false,
            timer: 1000,
          });

          const newUser = {
            id: response.data.id, // Assuming the API returns the created user with an ID
            name: user.name,
            email: user.email,
            category:user.category,
          };

          setUsers([newUser, ...users]);
          closeAdd();
          setUser({
            name: "",
            password: "",
            email: "",
            category: "",
          });
        })
        .catch((error) => {
          // console.log(error);
          showAlert({
            position: "top-end",
            icon: "error",
            // title: "Something went wrong!",
                        title: <FormattedMessage id="Something went wrong!"/>,
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else {
      setError(true);
      Swal.fire({
        title: "Error",
        // text: "You must fill in all required fields!",
                title: <FormattedMessage id="You must fill in all required fields!"/>,
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    // const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [e.target.name]:e.target.value
    });
  };

  return (
    <div className={`container rounded-4 mx-auto p-2 mb-auto popup ${add ? "show" : ""}`} style={{ maxWidth: '400px' }}>
      <h4 className="text-center bg-info mt-4 p-3 text-light w-100">
      <FormattedMessage id="Add User"/>
      </h4>
      <div className="mb-3 mt-5">
        <label htmlFor="name" className="form-label">
        <FormattedMessage id="Username"/>
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
        <FormattedMessage id="Password"/>
        </label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={user.password}
          className="form-control"
          id="password"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
        <FormattedMessage id="Type"/>
        </label>
        <select
          id="is_staff"
          name="category"
          onChange={handleChange}
          className="form-select"
          value={user.is_staff}
        >
          <option value={"admin"}>      <FormattedMessage id="Admin"/>
          </option>
          <option value={"simple"}>      <FormattedMessage id="Sample"/>
          </option>
        </select>
      </div>
      {/* <div className="mb-3">
        <label htmlFor="last_name" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          name="last_name"
          onChange={handleChange}
          value={user.last_name}
          className="form-control"
          id="last_name"
        />
      </div> */}
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
            closeAdd();
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
