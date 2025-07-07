import axios from "axios";
import DataTable from "react-data-table-component";
import React, { useDebugValue, useEffect, useState,useMemo } from "react";
import Source from "../../Source";
import AddStock from "./forms/AddStock";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import Trash from "../../assets/icon/trash.png";
import pencil from "../../assets/icon/pencil.png";
import AddStockPic from "../../assets/icon/AddStock.png";
import { FormattedMessage,useIntl } from "react-intl";
import { useShowAlert  } from "../../warrper";
import { useSelector } from "react-redux";
import { Avatar, IconButton } from '@mui/material';
import { Plus, Trash2, X, Edit } from 'lucide-react';
const formatNumber = (number) => {
  return number?.toLocaleString(); // Formats number with thousand separators
};


export default function Stock() {
  const [records, setRecords] = useState([]);
  const [item,setitem]=useState([]);
  const [AddStockModal,setAddStockModal]=useState(false);
  const [EditStockModal,setEditStockModal]=useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
const showAlert = useShowAlert(); 
const handlePerRowsChange = async (newPerPage, page) => {
  setPerPage(newPerPage);
  setCurrentPage(page);
};
// const [data, setData] = useState([]);
const {sidebars}=useSelector((state) => state.sidebars);
const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);  // صفحه فعلی
const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const [search,setsearch]=useState();

const handlePageChange = page => {
  setCurrentPage(page); // برو به صفحه جدید
};

const fetchData = async (page, pageSize) => {
  setLoading(true);
  try {
    const response = await axios.get(Source.getAddress() + "/api/item",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      params: {
        page: page,
        perPage: pageSize,
        delete:0,
        stock:'true',
        search: search?.length >1 ?search : "false"
      },
    },
    );
    console.log(response);
    setRecords(response.data); // داده‌های صفحه جاری
    setTotalRows(response.data.total); // تعداد کل ردیف‌ها
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data', error);
    setLoading(false);
  }
};
useEffect(()=>{
  fetchData(currentPage,perPage);
},[perPage,currentPage,search])

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

  return `${formattedDate}`;
};
const PDcolumn = [
  {
    name: <FormattedMessage id="ID" />,
    selector: (row) => row.id,
    sortable: true,
    style: {
      width: '80px',
      minWidth: '80px',
    },
  },
  {
    name: <FormattedMessage id="Photo" />,
    cell: (row) => (
      <Avatar
        src={row.type.picture === null ? AddStockPic : row.type.picture}
        alt={row.name}
        sx={{ width: 50, height: 50 }}
      />
    ),
    sortable: false,
    style: {
      width: '80px',
      minWidth: '80px',
    },
  },
  {
    name: <FormattedMessage id="Item Type" />,
    selector: (row) => row.type.name,
    sortable: true,
    style: {
      width: '120px',
      minWidth: '120px',
    },
  },
  {
    name: <FormattedMessage id="Name" />,
    selector: (row) => row.name,
    sortable: true,
    style: {
      width: '150px',
      minWidth: '150px',
    },
  },
  {
    name: <FormattedMessage id="Date Created" />,
    selector: (row) => date(row.date_creation),
    sortable: true,
    style: {
      width: '180px',
      minWidth: '180px',
    },
  },
  {
    name: <FormattedMessage id="Description" />,
    selector: (row) => row.description,
    sortable: true,
    style: {
      width: '200px',
      minWidth: '200px',
    },
  },
  {
    name: <FormattedMessage id="Quantity" />,
    selector: (row) => formatNumber(row.qty),
    sortable: true,
    style: {
      width: '100px',
      minWidth: '100px',
      textAlign: 'right',
    },
  },
  sidebars[0].type === 'gold' && {
    name: <FormattedMessage id="weight" />,
    selector: (row) => formatNumber(row.weight),
    sortable: true,
    style: {
      width: '100px',
      minWidth: '100px',
      textAlign: 'right',
    },
  },
  {
    name: <FormattedMessage id="Rate" />,
    selector: (row) => row.rate,
    sortable: true,
    style: {
      width: '100px',
      minWidth: '100px',
      textAlign: 'right',
    },
  },
  {
    name: <FormattedMessage id="Serial Number" />,
    selector: (row) => row.serial_number,
    sortable: true,
    style: {
      width: '150px',
      minWidth: '150px',
    },
  },
  {
    name: <FormattedMessage id="Added By" />,
    selector: (row) => row.user.name,
    sortable: true,
    style: {
      width: '150px',
      minWidth: '150px',
    },
  },
].filter(Boolean);
  const columns = useMemo(() => {
    let selectedColumns;
  
    if (
      localStorage.getItem("language") === "pa" ||
      localStorage.getItem("language") === "da"
    ) {
      selectedColumns = [...PDcolumn]; // معکوس کردن ستون‌ها
    }else{
      selectedColumns=PDcolumn;
    }
    return selectedColumns;
  }, [isDesktop]);
  
  
  const getItemtype=()=>{
    axios.get(Source.getAddress()+'/api/item', {headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    }},)
    .then((res)=>{
      setitem(res.data);
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

  const handleFilter=(e)=>{
    setsearch(e.target.value);
  }
  return (
    <div className={`w-100 ${"iransans"}`}>
      <div className="m-auto mt-5 m-5" style={{ height: "100%" ,width:"99%"}}>
        {/* <button
          type="submit"
          className="btn btn-info mb-1 p-1"
          style={{ width: "100px" }}
          onClick={() => {
            getItemtype();
            setAddStockModal(true);
            setEditStockModal(false);
          }}
        
        >
          Add
        </button> */}
        <div
          className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
          style={{ borderTop: "5px solid #4a5cf2" }}
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        >
          {/* <div className="d-flex w-100 h-100 m-auto justify-content-between"> */}
            <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Stock" /></h2>
          {/* </div> */}
          <input
            className="form-control m-2 mb-2 mt-4"
            style={{ width: "100%", maxWidth: "200px" }}
            onChange={handleFilter}
            value={search}
            type="search"
            placeholder={formatMessage({ id: "Search" })}
            aria-label="Search"
          />
        </div>

        <DataTable
          // title="Customers"
          localization={localization} // ارسال ترجمه‌ها      

          columns={columns}
          data={records}
          // onRowClicked={handleRowClick}
          progressPending={loading}
          striped
            responsive
            highlightOnHover
          pagination
          paginationServer // فعال‌سازی صفحه‌بندی سرور ساید
          paginationTotalRows={totalRows} // تعداد کل ردیف‌ها
          onChangePage={handlePageChange} // تغییر صفحه
          onChangeRowsPerPage={handlePerRowsChange} // تغییر تعداد ردیف‌ها در صفحه    
          customStyles={{
            headCells: {
              style: {
                fontWeight:'bolder',
                display: 'flex',
                minWidth: '10px', // تنظیم اندازه عنوان‌ها
                maxWidth: '10px',
                width: '10px',
                margin: '0px',
              },
            },
            cells: {
              style: {
                fontWeight:'bold',
                minWidth: '10px', // تنظیم اندازه داده‌ها
                maxWidth: '10px',
                width: '15px',
              },
            },
          }}
        />
    <AddStock
              records={records}
              setRecords={setRecords}
              Item={item}
              AddItemModal={AddStockModal}
              close={()=>setAddStockModal(false)}
    />
      </div>
    </div>
  );
}
