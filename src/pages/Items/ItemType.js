import axios from "axios";
import React, { useState, useEffect, useMemo,useRef } from "react";
import DataTable from "react-data-table-component";
import { gregorianToJalali } from "shamsi-date-converter";
import Source from "../../Source";
import AddItemType from "./forms/AddItemType";
import * as XLSX from "xlsx"; // Import the xlsx library
import AddStock from "../../assets/icon/AddStock.png";
import Trash from "../../assets/icon/trash.png";
import pencil from "../../assets/icon/pencil.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { showAlert } from "../../warrper";
import EditItemType from "./forms/EditItemType";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../../warrper";
import Datepicker_Customer from "../forms/Datepicker_customer";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
import { 
  Grid,
  Chip,
  Paper,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField
} from '@mui/material';
import { Plus, Trash2, Edit } from 'lucide-react';
import moment from "moment-jalaali";


export default function ItemType() {
  const showAlert = useShowAlert(); 
  const {sidebars}=useSelector((state) => state.sidebars);
  const [openadd,setopenadd]=useState(false);
  const [records,setRecords]=useState([]);
  const inputRef=useRef();
  const inputRefEdit=useRef();
    const [exchange, setExchange] = useState([]);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
      const [Date_End, setDate_end] = useState(new Date().toISOString().slice(0, 10));
      const [EndDate, setEndDate] = useState();
  const [isNewExchange, setIsNewExchange] = useState(true);

  const [EditItemRow,SetEditItemRow]=useState();
  const [ModelEdit,setModelEdit]=useState(false);
  const EditItem =(row)=>{
    setModelEdit(true);
    SetEditItemRow(row);
  }
  useEffect(()=>{
    const fetchItemtype = async () => {
      const token = localStorage.getItem('access');
      if (!token) return;
      const fetchWithToken = async (token) => {
        try {
          const response = await axios.get(Source.getAddress()+'/api/itemtype', {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          setRecords(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh');
            if (!refreshToken) return;
            try {
              const refreshResponse = await axios.post(Source.getAddress() + '/api/token/refresh', {
                refresh: refreshToken,
              });
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('access', newAccessToken);
              await fetchWithToken(newAccessToken);
            } catch (refreshError) {
              console.error('Error refreshing access token:', refreshError);
            }
          } else {
            console.error('Error fetching accounts:', error);
          }
        }
      };
      await fetchWithToken(token);
    };
    fetchItemtype();
  },[Date_End]);
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها
  const delete_itemtype = async (id)=>{
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
    axios.post(Source.getAddress()+'/api/itemtype/'+id,{_method:'delete'},{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      }
    })
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
    }
    else if(result.dismiss === Swal.DismissReason.cancel){
      Swal.fire({
        position: "center",
        icon: "error",
        // text: "Your Item record is safe :)",
                        // text: <FormattedMessage id="Your Item record is safe :)"/>,
                                text:intl.formatMessage({id:"Your record is safe :)"}),
        showConfirmButton: false,
        timer: 600,
      });
    }
  }
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
            delete_itemtype(row.id);
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
      // old items
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
            EditItem(row);
            // Edit_item(row);
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
      { name:<FormattedMessage id="Mesurment" />    , selector: (row) => row.measuring, sortable: true },
    
      { name:<FormattedMessage id="Name" />    , selector: (row) => row.name, sortable: true },
    
      {
        name:<FormattedMessage id="Photo" />    ,
        cell: (row) => (
          <img
            src={row.picture===null ? AddStock : row.picture}
            alt={row.name}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        sortable: true,
      },
      
      { name:<FormattedMessage id="ID" />    , selector: (row) => row.id, sortable: true 
        ,style: {
          width: "1px",
          minWidth: "1px",
        },
      },
    ];





const columnsDesktop = [
    { name: "Id", selector: (row) => row.id, sortable: true 
      ,style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name: "Photo",
      cell: (row) => (
        <img
          src={row.picture===null ? AddStock : row.picture}
          alt={row.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
      sortable: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Mesurment", selector: (row) => row.measuring, sortable: true },
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
          EditItem(row);
          // Edit_item(row);
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
    ) },{ name: (<strong
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
          delete_itemtype(row.id);
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
  const handleAdd=()=>{
    inputRef.current.select();
    setopenadd(true);
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
  const [Rate,setRate]=useState([]);
useEffect(()=>{
  {
    sidebars[0].type==="gold"&&
    axios.get(Source.getAddress() + "/api/gold/1", {
      params:{
        date:Date_End 
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
    .then((res) => {
      if (res.data) {
            setIsNewExchange(true);
            // اگر هیچ نرخ از سرور دریافت نشد، از اطلاعات record استفاده می‌کنیم
            if (records.length > 0) {
              setExchange(records.map((row,idx) => ({item_type: row.id, value: res.data[idx]?.item_type===row.id ? res.data[idx].value : 0 })));
            }else{
              setExchange(records.map((row) => ({ item_type: row.id, value: 0 })));
            }
      }else {
            setExchange(res.data);
            setIsNewExchange(false);
          }
    })
    .catch((err) => {
      console.error("Error fetching item types:", err);
      showAlert({
        position: "top-end",
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }

},[EndDate,records])
  const handleChange = (e, idx) => {
    const formattedValue = e.target.value;
    const unformattedValue = formattedValue.replace(/,/g, "").replace("$", "");
    
    setExchange(prev => {
      // Make sure prev is an array before trying to spread it
      if (!Array.isArray(prev)) {
        return prev; // or return a default array if appropriate
      }
      
      const newExchange = [...prev];
      if (newExchange[idx]) {
        newExchange[idx] = {
          ...newExchange[idx],
          value: unformattedValue
        };
      }
      return newExchange;
    });
  };
  // تبدیل تاریخ جلالی به میلادی و تنظیم Date_End
  const handle_date_end = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      // ایجاد یک شیء تاریخ بدون ساعت و دقیقه
      const date = new Date(year, month - 1, day+1);
      // استخراج فرمت YYYY-MM-DD از تاریخ
      const isoDate = date.toISOString().slice(0, 10);
      setDate_end(isoDate);
    }
  };

  const updateRate=()=>{

    let data = {rate: exchange,_method: "put",date:Date_End,user_id:localStorage.getItem('userTokenid')};
    axios.post(Source.getAddress() + "/api/gold/1",data, {
      date: Date_End,
      user_id:localStorage.getItem('userTokenid')
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }).then((res)=>{
 showAlert({
            position: "top-end",
            icon: "success",
            title: "Settings updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
    }).catch((err)=>{
      console.log(err);
showAlert({
            position: "top-end",
            icon: "error",
            title: "Something went wrong!",
            showConfirmButton: false,
            timer: 1500,
          });
    });
  }
  return (
       <Box sx={{ 
      width: '100%',
      fontFamily: 'iransans',
      direction: localStorage.getItem("language") === "en" ? "ltr" : "rtl"
    }}>
      <Grid container spacing={3}>
        {/* Left Column - DataTable */}
        <Grid item xs={12} md={6}>
          <Button
            onClick={handleAdd}
            variant="contained"
            color="info"
            startIcon={<Plus size={18} />}
            sx={{ 
              mb: 2,
              width: 120,
              color: 'white'
            }}
          >
            <FormattedMessage id="Add" />
          </Button>
          
          <Paper 
            elevation={3}
            sx={{ 
              borderTop: '5px solid #4a5cf2',
              p: 2,
              mb: 2
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
                        <FormattedMessage id={`${sidebars[0].type==='gold'?'Item Gold': 'Item Type'}`} />
            </Typography>
            
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <DataTable
                columns={columns}
                localization={localization}
                data={records}
                striped
                responsive
                highlightOnHover
                pagination
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Daily Rate */}
        
        {
          sidebars[0].type==="gold"&&
        <Grid item xs={12} md={6}>
  <Paper 
    elevation={3}
    sx={{ 
      borderTop: '5px solid #4a5cf2',
      p: 3,
      borderRadius: 3,
      boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.12)'
      }
    }}
  >
    {/* Header Section */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 3
    }}>
      <Datepicker_Customer
      index="1"
        default_value={EndDate}
        handle_date={handle_date_end}
        lebal={<FormattedMessage id="Date" />}
        setSelectedDay={setEndDate}
        selectedDay={EndDate}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }
        }}
      />
      
      <Chip 
        label={<FormattedMessage id="Daily Rate" />}
        icon={<Plus size={18} style={{ marginLeft: '8px' }} />}
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          px: 2,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(74, 92, 242, 0.3)',
          '& .MuiChip-icon': {
            color: 'white',
            marginLeft: '4px'
          }
        }}
      />
    </Box>
    
    {/* Table Section */}
    <TableContainer 
      component={Paper}
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        mb: 2
      }}
    >
      <Table sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow sx={{ 
            bgcolor: 'primary.light',
            '& th': {
              color: 'white',
              fontWeight: 'bold',
              py: 1.5,
              px: 2,
              borderBottom: 'none'
            }
          }}>
            <TableCell sx={{ width: '10%', borderRadius: '8px 0 0 0' }}>
              <FormattedMessage id="No" />
            </TableCell>
            <TableCell sx={{ width: '30%' }}>
              <FormattedMessage id="Value" />
            </TableCell>
            <TableCell sx={{ width: '60%', borderRadius: '0 8px 0 0' }}>
              <FormattedMessage id="Item Name" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records?.map((row, idx) => (
            <TableRow 
              key={row.id}
              sx={{ 
                '&:nth-of-type(even)': { bgcolor: 'action.hover' },
                '&:hover': { bgcolor: 'primary.light', '& td': { color: 'white' } },
                '&:last-child td': { borderBottom: 0 },
                transition: 'background-color 0.2s'
              }}
            >
              <TableCell sx={{ px: 2, py: 1.5, fontWeight: 'medium' }}>
                {row.id}
              </TableCell>
              <TableCell sx={{ px: 2, py: 1.5 }}>
                <NumericFormat
                  thousandSeparator={true}
                  id="to_amount"
                  className="form-control"
                  value={exchange && exchange[idx] ? exchange[idx].value : ""}
                  style={{ 
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s",
                    '&:focus': {
                      outline: "none",
                      borderColor: "#4a5cf2",
                      boxShadow: "0 0 0 3px rgba(74, 92, 242, 0.2)"
                    }
                  }}
                  placeholder="0"
                  onChange={(e) => handleChange(e, idx)}
                />
              </TableCell>
              <TableCell sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span>{row.name}</span>
                  {idx % 3 === 0 && (
                    <Chip 
                      label="Popular" 
                      size="small" 
                      icon={<Edit size={14} style={{ marginLeft: '4px' }} />}
                      sx={{ 
                        bgcolor: 'success.light', 
                        color: 'white',
                        fontSize: '0.7rem',
                        height: '20px',
                        '& .MuiChip-icon': {
                          color: 'white',
                          marginLeft: '4px'
                        }
                      }} 
                    />
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
    {/* Action Button */}
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ 
        color: 'white',
        mt: 2,
        py: 1.5,
        borderRadius: 2,
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: '0 4px 12px rgba(74, 92, 242, 0.3)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(74, 92, 242, 0.4)'
        },
        transition: 'all 0.3s'
      }}
      onClick={updateRate}
      startIcon={<Plus size={20} />}
    >
      <FormattedMessage id="update table from amount" />
    </Button>
    
    {/* Status Indicator */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      mt: 1,
      opacity: 0.7
    }}>
      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
        <Trash2 size={14} style={{ marginRight: '4px' }} />
        <FormattedMessage id="Last updated" />: {new Date().toLocaleString()}
      </Typography>
    </Box>
  </Paper>
</Grid>}
      </Grid>

      {/* Modals */}
      <AddItemType
        setRecords={setRecords} 
        records={records} 
        open={openadd} 
        close={() => setopenadd(false)} 
        inputRef={inputRef}
      />
      <EditItemType 
        setRecords={setRecords} 
        records={records}  
        close={() => setModelEdit(false)} 
        open={ModelEdit} 
        setModelEdit={setModelEdit} 
        EditItemRow={EditItemRow} 
        SetEditItemRow={setModelEdit} 
        inputRef={inputRefEdit}
      />
    </Box>
  );
}