import React, { useEffect, useState } from "react";
import axios from "axios";
import Trash from "../assets/icon/trash.png";
import pencil from "../assets/icon/pencil.png";
import Swal from "sweetalert2";
import Edit from "./Edit";
import Add from "./Add";
import "./manage.css";
import Source from "../Source";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../warrper";
export default function Manage({ users,  setUsers }) {
  const showAlert = useShowAlert(); 
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const deleteItem = (itemId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: intl.formatMessage({id:"Are you sure?"})
        ,
        text:intl.formatMessage({id:"You won't be able to revert this!"})
        ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: intl.formatMessage({id:"Yes, delete it!"})
        ,
        cancelButtonText: intl.formatMessage({id:"No, cancel!"})
        ,
        reverseButtons: true,
})
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(Source.getAddress() + "/api/user/" + itemId + "/",{
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('access')}`
              }
          })
            .then((response) => {
              // console.log("Item deleted successfully");
              showAlert({
                position: "top-end",
                icon: "success",
                title: <FormattedMessage id="User has been deleted!"/>,
                showConfirmButton: false,
                timer: 1000,
              });
              setUsers(users.filter((a) => a.id !== itemId));

            })
            .catch((error) => {
              swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text:<FormattedMessage id="Something went wrong!"/>,
                icon: "error",
              });
              // console.error("Error deleting item:", error);
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title:intl.formatMessage({id:"Cancelled"}),
            text:intl.formatMessage({id:"Your record is safe :)"}),
            icon: "error",
          });
        }
      });
  };
  useEffect(()=>{
    axios.get(Source.getAddress()+'/api/user',{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
    }).then((res)=>{
      setUsers(res.data);
      console.log(res);    
    })
    .catch((err)=>{
      console.log(err);
    });
  },[]);
  const updateItem = (id, newName) => {
    const updatedItems = users.map((item) =>
      item.id === id ? { ...item, newName } : item
    );
    setUsers(updatedItems);
  };
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [user, setUser] = useState({});
  let counter = 0;
  return (
    <div
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className="container mt-5 h-100 m-auto"
      onClick={(e) => {
        if (e.target.className === "container mt-5 h-100 m-auto") {
          setAdd(false);
          setEdit(false);
        }
      }}
    >
      <button
        onClick={() => setAdd(true)}
        type="button"
        className="btn btn-info fw-bold text-white mb-3"
      >
                  <FormattedMessage id="Add New User"/>
      </button>
      <div className="card card-body rounded-2 m-auto">
        <h1
          className="text-center rounded mb-4 p-4 text-light"
          style={{ backgroundColor: "var(--bs-info)" }}
        >
                    <FormattedMessage id="Table Of Users"/>
        </h1>

        <table className="table table-light table-striped rounded-4">
          <thead>
            <tr>
              <th scope="col">          <FormattedMessage id="No"/>              </th>
              <th scope="col">          <FormattedMessage id="Username"/>
              </th>
              <th scope="col">          <FormattedMessage id="Type"/>
</th>
              <th scope="col">          <FormattedMessage id="Email"/>
              </th>
              <th scope="col">          <FormattedMessage id="Delete"/>              </th>
              <th scope="col">          <FormattedMessage id="Edit"/>              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users.map((row, idx) => {
              counter++;

              return (
                <tr key={counter}>
                  <th scope="row">{row.id}</th>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.email}</td>
                  {row.id!==1 ? <td className="text-center" style={{ width: "2vw" }}>
                    <button
                      onClick={() => deleteItem(row.id)}
                      className="p-0 m-0"
                      style={{ border: "none", background: "transparent" }}
                    >
                      <img
                        height={"24px"}
                        width={"24px"}
                        src={Trash}
                        alt="Delete"
                      />
                    </button>
                  </td> :<td style={{color:"red"}}></td>
                  }
                  <td className="text-center" style={{ width: "2vw" }}>
                    <button
                      onClick={() => {
                        setEdit(true);
                        setUser(row);
                      }}
                      className="p-0 m-0"
                      style={{ border: "none", background: "transparent" }}
                    >
                      <img
                        height={"24px"}
                        width={"24px"}
                        src={pencil}
                        alt="Edit"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {
          <Edit
            updateItem={updateItem}
            setUser={setUser}
            users={users}
            setUsers={setUsers}
            edit={edit}
            user={user}
            closeEdit={() => {
              setEdit(false);
              setUser({});
            }}
          />
        }
        {
          <Add
            closeAdd={() => {
              setAdd(false);
            }}
            add={add}
            users={users}
            setUsers={setUsers}
          />
        }
      </div>
    </div>
  );
}
