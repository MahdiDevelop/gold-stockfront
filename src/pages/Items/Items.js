import axios from "axios";
import React, { useState, useEffect, useMemo,useRef } from "react";
import DataTable, { Alignment } from "react-data-table-component";
import { gregorianToJalali } from "shamsi-date-converter";
import Source from "../../Source";
import AddItem from "./forms/AddItem";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import Trash from "../../assets/icon/trash.png";
import pencil from "../../assets/icon/pencil.png";
import Edititem from "./forms/Edititem";
import AddStock from "../../assets/icon/AddStock.png";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
// import { useShowAlert  } from "../../warrper";
import { useShowAlert } from "../../warrper";
export default function Items() {
  const showAlert = useShowAlert(); 
  const [records,setRecords]=useState([]);
  const [AddItemModal,setAddItemModal]=useState(false);
  const [EditItemModal,setEditItemModal]=useState(false);
  const [Itemtype,setItemtype]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const inputRef=useRef(null);
  
  const getItemtype=()=>{
    inputRef.current.select();
    axios.get(Source.getAddress()+'/api/itemtype', {headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    }},)
    .then((res)=>{
      setItemtype(res.data);
    }).catch((err)=>{
      showAlert({
        position: "top-end",
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 1000,
      });
    });
  }
  const handleFilter=(e)=>{
    setsearch(e.target.value);
  }
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const delete_item= async(id)=>{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    const result = await swalWithBootstrapButtons.fire({
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
                 });
    if(result.isConfirmed){
      axios.post(Source.getAddress()+'/api/item/'+id,{_method:'delete'},{ headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`, // Add the access token here
        // Do NOT set 'Content-Type' when using FormData; let the browser set it automatically
      },})
      .then((res)=>{

        Swal.fire({
          position: "center",
          icon: "success",
          // title: "Item record successfully deleted !",
                      // title: <FormattedMessage id="record successfully deleted!"/>,
                                  title: intl.formatMessage({id:"record successfully deleted!"}),
                      
          
          showConfirmButton: false,
          timer: 600,
        });
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== id)
        );
      }).catch((err)=>{
        Swal.fire({
          position: "center",
          icon: "error",
          // title: "Item record not deleted",
                                  // title: <FormattedMessage id="Something went wrong!"/>,            
                                              title: intl.formatMessage({id:"Something went wrong!"}),
                                  
          
          showConfirmButton: false,
          timer: 600,
        });
      })
    }else if(result.dismiss === Swal.DismissReason.cancel){
      Swal.fire({
        position: "center",
        icon: "error",
        // text: "Your Item record is safe :)",
                        // text: <FormattedMessage id="Your record is safe :)"/>,
                                text:intl.formatMessage({id:"Your record is safe :)"}),
        showConfirmButton: false,
        timer: 600,
      });
    }
    
  }
  const date = (d) => {

    const date = new Date(d);
  
    let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    let aa = ampm;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    if (localStorage.getItem('date') === "Persian") {
      moment.locale('fa'); // تنظیم لوکال به فارسی
      aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
      formattedDate = moment(d).format('jYYYY-jMM-jDD');
    } else {
      moment.locale('en'); // تنظیم لوکال به انگلیسی
    }
  
    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };
  // useEffect(()=>{
  //   const fetchItem = async () => {
  //     // const token = ;
  //     const fetchWithToken = async () => {
  //       try {
  //         const response = await axios.get(Source.getAddress()+'/api/item', {
  //           headers: {
  //             'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //           },
  //         });
  //         setRecords(response.data);
  //       } catch (error) {
  //         if (error.response && error.response.status === 401) {
  //           const refreshToken = localStorage.getItem('refresh');
  //           if (!refreshToken) return;

  //           try {
  //             const refreshResponse = await axios.post(Source.getAddress() + '/api/token/refresh', {
  //               refresh: refreshToken,
  //             });
  //             const newAccessToken = refreshResponse.data.access;
  //             localStorage.setItem('access', newAccessToken);
  //             await fetchWithToken(newAccessToken);
  //           } catch (refreshError) {
  //             console.error('Error refreshing access token:', refreshError);
  //           }
  //         } else {
  //           console.error('Error fetching accounts:', error);
  //         }
  //       }
  //     };

  //     await fetchWithToken();
  //   };
  //   fetchItem();
  // },[])
  const handlePageChange = page => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const [search,setsearch]=useState();
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        perPage: pageSize,
        delete: 0,
      };
  
      // اگر search خالی نبود، آن را به پارامترها اضافه کنید
      if (search && search.length > 1) {
        // params.search = search;
        params.search= search?.length ? search : 'false';

      }
  
      const response = await axios.get(Source.getAddress() + '/api/item', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        params: params, // پارامترها را اینجا ارسال کنید
      });
  
      setRecords(response.data.data);
      setTotalRows(response.data.total);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchData(currentPage,perPage);
  },[perPage,currentPage,search])
  const [selectedOption, setSelectedOption] = useState();
  const [Item,setItem] = useState({
    id: 0,
    name: "",
    type_id: 0,
    user_id: 0,
    isdelete: 0,
    description: "",
    date_creation: "",
    serial_number: "",
    created_at: "",
    updated_at: "",
    type: {
       },
    user: {
    }
  });
  const Edit_item=(row)=>{
    getItemtype();
  setItem(row);
  setAddItemModal(false);
  setEditItemModal(true);
  setSelectedOption(row.type);
  }
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  
    const PDcolumn=[ 
      { name: (<strong
        style={{
          textAlign: "center",
          backgroundColor: "tranceparent",
          width: "100%",
        }}
      >
                  <FormattedMessage id="Delete" />
      </strong>),   selector: (row) => (
        <button
          onClick={() => {
            delete_item(row.id);
            // setEdit(row);
            // setUpdate(true);
            // seTtitle('Edit Type Money');
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"15%"}
            width={"15%"}
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ) },
      // end of this
      { name: (<strong
        style={{
          textAlign: "center",
          backgroundColor: "tranceparent",
          width: "100%",
        }}
      >
                          <FormattedMessage id="Edit" />
      </strong>),selector: (row) => (
        <button
          onClick={() => {
            Edit_item(row);
            // setEdit(row);
            // setUpdate(true);
            // seTtitle('Edit Type Money');
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            height: "100%",
          }}
        >
          <img
            height={"20%"}
            width={"20%"}
            src={pencil}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ) },

      { name: (<strong><FormattedMessage id="Added By" /></strong>), selector: (row) => row.user.name , sortable: true },

  { name: (<strong><FormattedMessage id="Description" /></strong>), selector: (row) => row.description, sortable: true },

      {
        name: (
          <strong
            style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
          ><FormattedMessage id="Date Created" />
          </strong>
        ),
        selector: (row) => date(row.date_creation),
        style: {
          minWidth: "170px!important", // Adjust this value as needed
          maxWidth: "170px", // Adjust this value as needed
          margin:'0px'
          // Width: '600px',    // Set a specific width
        },
        // sortable: true,
      },
      { name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px", textAlign:"left"}}
        >
<FormattedMessage id="Serial Number" />
        </strong>
      ), selector: (row) => row.serial_number, sortable: true 
        ,style: {
          Alignment:"center",
          width: "1px",
          minWidth: "1px",
        },
      }
    ,
      {  name: (
        <strong
          style={{ minWidth: "10px", maxWidth: "20px", width: "20px", textAlign:"left"}}
        ><FormattedMessage id="Item" />
        </strong>
      ), selector: (row) => row.name, sortable: true 
        ,style: {
          width: "1px",
          minWidth: "1px",
        },
      }
    ,
      {  name: (
        <strong
          style={{ minWidth: "60px", maxWidth: "60px", width: "60px", textAlign:"center"}}
        ><FormattedMessage id="Item Type" />
        </strong>
      ), selector: (row) => row.type.name, sortable: true 
        ,style: {
          width: "1px",
          minWidth: "1px",
        },
      }
      ,
      {
        name: (
          <strong
            style={{ minWidth: "50px", maxWidth: "50px", width: "50px", textAlign:"left"}}
          >
                                      <FormattedMessage id="Photo" />
          </strong>
        ),
        cell: (row) => (
          <img
            src={row.type.picture===null ? AddStock : row.type.picture}
            alt={row.name}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        sortable: true,
      },
      {  name: (
        <strong
          style={{ minWidth: "50px", maxWidth: "50px", width: "240px", textAlign:"left"}}
        >
                                    <FormattedMessage id="ID" />
        </strong>
      ), selector: (row) => row.id, sortable: true 
        ,style: {
          width: "1px",
          minWidth: "1px",
        },
      },
    ];
  const columnsDesktop = [
    {  name: (
      <strong
        style={{ minWidth: "50px", maxWidth: "50px", width: "50px", textAlign:"left"}}
      >
        ID
      </strong>
    ), selector: (row) => row.id, sortable: true 
      ,style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    
    {
      name: (
        <strong
          style={{ minWidth: "100px", maxWidth: "100px", width: "100px", textAlign:"left"}}
        >
          Photo
        </strong>
      ),
      cell: (row) => (
        <img
          src={row.type.picture===null ? AddStock : row.type.picture}
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      sortable: true,
    },
    {  name: (
      <strong
        style={{ minWidth: "200px", maxWidth: "240px", width: "240px", textAlign:"left"}}
      >
        Item Type
      </strong>
    ), selector: (row) => row.type.name, sortable: true 
      ,style: {
        width: "1px",
        minWidth: "1px",
      },
    }
    ,
    {  name: (
      <strong
        style={{ minWidth: "10px", maxWidth: "20px", width: "20px", textAlign:"left"}}
      >
        Item
      </strong>
    ), selector: (row) => row.name, sortable: true 
      ,style: {
        width: "1px",
        minWidth: "1px",
      },
    }
  ,
  { name: (
    <strong
      style={{ minWidth: "200px", maxWidth: "240px", width: "240px", textAlign:"left"}}
    >
      Serial Number
    </strong>
  ), selector: (row) => row.serial_number, sortable: true 
    ,style: {
      Alignment:"center",
      width: "1px",
      minWidth: "1px",
    },
  }
,
{
  name: (
    <strong
      style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
    >
      Date Created
    </strong>
  ),
  selector: (row) => date(row.date_creation),
  style: {
    minWidth: "170px!important", // Adjust this value as needed
    maxWidth: "170px", // Adjust this value as needed
    margin:'0px'
    // Width: '600px',    // Set a specific width
  },
  // sortable: true,
},{ name: (<strong>Description</strong>), selector: (row) => row.description, sortable: true },
    { name: (<strong>Added by</strong>), selector: (row) => row.user.name , sortable: true },
    { name: (<strong
      style={{
        textAlign: "center",
        backgroundColor: "tranceparent",
        width: "100%",
      }}
    >
      Edit
    </strong>),selector: (row) => (
      <button
        onClick={() => {
          Edit_item(row);
          // setEdit(row);
          // setUpdate(true);
          // seTtitle('Edit Type Money');
        }}
        style={{
          border: "none",
          backgroundColor: "transparent",
          height: "100%",
        }}
      >
        <img
          height={"20%"}
          width={"20%"}
          src={pencil}
          style={{ backgroundColor: "tranceparent" }}
        />
      </button>
    ) },
    { name: (<strong
      style={{
        textAlign: "center",
        backgroundColor: "tranceparent",
        width: "100%",
      }}
    >
      Delete
    </strong>),   selector: (row) => (
      <button
        onClick={() => {
          delete_item(row.id);
          // setEdit(row);
          // setUpdate(true);
          // seTtitle('Edit Type Money');
        }}
        style={{
          border: "none",
          backgroundColor: "transparent",
          height: "100%",
        }}
      >
        <img
          height={"15%"}
          width={"15%"}
          src={Trash}
          style={{ backgroundColor: "tranceparent" }}
        />
      </button>
    ) },
  ];

          const { formatMessage } = useIntl();
          const localization = {
            pagination: {
                
                rowsPerPage:<FormattedMessage id="AddrowsPerPage"/> , // مثلا: "تعداد ردیف‌ها"
              previous: <FormattedMessage id="previous"/>, // مثلا: "قبلی"
              next: <FormattedMessage id="next"/>, // مثلا: "بعدی"
              page: <FormattedMessage id="page"/>, // مثلا: "صفحه"
            },
            // شما می‌توانید تنظیمات بیشتر برای متون مورد نظر اضافه کنید.
          };
          const columns = useMemo(() => {
            if (
              localStorage.getItem("language") === "pa" ||
              localStorage.getItem("language") === "da"
            ) {
              return PDcolumn.reverse();
            }
            if (isDesktop) {
              return localStorage.getItem("userTokenname") === "admin"
                ? columnsDesktop
                : columnsDesktop;
            }
            return columnsDesktop;
          }, [isDesktop]);
  return (
    <div className={`w-100 ${"iransans"}`}>
  <div className="m-auto mt-3 m-3" style={{ height: "100%", width: "95%" }}>
    <button
      type="submit"
      className="btn btn-info mb-1 p-1"
      style={{ width: "80px", fontSize: "0.8rem" }}
      onClick={() => {
        getItemtype();
        setAddItemModal(true);
        setEditItemModal(false);
      }}
    >
      <FormattedMessage id="Add" />
    </button>
    
    <div
      dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      className="bg-light d-flex justify-content-lg-between"
      style={{ borderTop: "3px solid #4a5cf2" }}
    >
      <div className="d-flex w-100 h-100 m-auto justify-content-between">
        <h2 className="m-1 fw-bold mb-3">
          <FormattedMessage id="Items" />
        </h2>
      </div>
      <input
        className="form-control m-1 mb-3"
        style={{ width: "25%", fontSize: "0.8rem", padding: "0.3rem" }}
        onChange={handleFilter}
        value={search}
        type="search"
        placeholder={formatMessage({ id: "Search" })}
        aria-label="Search"
      />
    </div>
    
    <DataTable
      localization={localization}
      columns={columns}
      data={records}
      progressPending={loading}
      striped
      responsive
      highlightOnHover
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      customStyles={{
        headCells: {
          style: {
            fontWeight: 'bolder',
            display: 'flex',
            minWidth: '8px',
            maxWidth: '8px',
            width: '8px',
            margin: '0px',
            fontSize: '0.8rem'
          },
        },
        cells: {
          style: {
            fontWeight: 'bold',
            minWidth: '8px',
            maxWidth: '8px',
            width: '12px',
            fontSize: '0.8rem'
          },
        },
      }}
    />
    
    <AddItem
      inputRef={inputRef}
      records={records}
      setRecords={setRecords}
      Itemtype={Itemtype}
      AddItemModal={AddItemModal}
      close={()=>setAddItemModal(false)}
    />
    
    <Edititem
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      records={records}
      setRecords={setRecords}
      AddItem={Item}
      setAddItem={setItem}
      Itemtype={Itemtype}
      AddItemModal={EditItemModal}
      close={()=>setEditItemModal(false)}
    />
  </div>
</div>
  );
}