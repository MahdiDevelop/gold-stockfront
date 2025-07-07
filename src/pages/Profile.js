// import React, { useState } from "react";
// import axios from "axios";

// export default function Profile({loguser,setLoguser}) {
//   const [constant,setConstant] =useState(localStorage.getItem('userToken'));
//   const [user,setuser]=useState(constant);

//   const handlechange = (e) => {
//     setConstant({...constant, [e.target.name]: e.target.value });
//   };
  
//   const customer = 23;
//   const updateUser = (userId) => {
//     console.log(localStorage.getItem('userToken'));
//     axios
//       .put(`http://localhost:8000/api/users/${userId}/`,constant)
//       .then((response) => {
//         console.log("User data updated successfully:");
//         localStorage.setItem('userToken', response.data);
//         // Call fetchUserData or perform any other actions as needed
//         // fetchUserData();
//       })
//       .catch((error) => {
//         console.error("Error updating user data:", error);
//       });
//   };
//   return (
//     <div class="container col-lg-8 mt-4 rounded-5">
//       <div class="card p-4 rounded-5">
//         <div class="row">
//           <h1
//             class="text-center rounded fs-2 m-0 p-4 text-light"
//             style={{ backgroundColor: "var(--bs-dark)" }}
//           >
//             Change Info
//           </h1>
//           <div className="row">
//             <div className="col"></div>
//           </div>
//           <div class="col-5 ms-5 mt-3 ps-3">
//             <label className="fw-bold" for="">User Name</label>
//             <input
//               type="text"
//               name="name"
//               readOnly={'true'}
//               value={loguser.name}
//               placeholder="Full name"
//               class="form-control"
//             />
//           </div>
//           <div class="col-5 mt-3">
//             <label className="fw-bold"  for="">Password</label>
//             <input
//               value={loguser.password}
//               readOnly={'true'}
//               type="password1"
//               name="password"
//               className="form-control"
//               id="exampleInputPassword1"
//             />
//           </div>
//           <div class="col-5 ms-5 mt-3 ps-3">
//             <label className="fw-bold"  for="">New Username</label>
//             <input
//              value={constant.name}
//              onChange={handlechange}
//               type="text"
//               name="name"
//               className="form-control"
//               id="exampleInputPassword1"
//             />
//           </div>
//           <div class="col-5 mt-3">
//             <label className="fw-bold"  for="">New Password</label>
//             <input
//               value={constant.password}
//               onChange={handlechange}
//               type="password"
//               name="password"
//               className="form-control"
//               id="exampleInputPassword1"
//             />
//           </div>
//           <div className="mt-1 justify-content-between container d-flex">
//           <button
//             onClick={updateUser(loguser.id)}
//             type="button"
//             class="col m-2 mt-3 btn btn-outline-primary fw-bold"
//           >
//             Save
//           </button>
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// }
