import axios from "axios";
import React, { useEffect, useState,useMemo } from "react";
import DataTable from "react-data-table-component";
import Source from "../../Source";
import AddPurchase from "./forms/AddPurchase";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import Add_customer from "../AddAccount";
import Add_belance from "../Add_belance";
import Trash from "../../assets/icon/trash.png";
import pencil from "../../assets/icon/pencil.png";
import EditSell from "./forms/EditSell";
import EditPurchase from "./forms/EditPurchase";
import { useSelector, useDispatch } from "react-redux";
import { getMoneys } from "../Redux/moneysSlice";
import { getItemFromCache, getItems } from "../Redux/itemSlice";
import { getSettings } from "../Redux/settingSlice";
import { getCustomers } from "../Redux/customerSlice";
import { getStocks } from "../Redux/stockSlice";
import jalaali from "jalaali-js";
import ListBox from "../forms/ListBox";
import Datepicker_Customer from "../forms/Datepicker_customer";
import { showAlert } from "../../warrper";
// import { FormattedMessage } from "react-intl";
import { FormattedMessage,useIntl } from "react-intl";
import ReactDOMServer from "react-dom/server";
import { useShowAlert  } from "../../warrper";


export default function Purchase() {
  const showAlert = useShowAlert(); 
  const [selecteduser, setSelecteduser] = useState();
  const { users, statusu } = useSelector((state) => state.users);
  const [namesearch, setnameSearch] = useState();
  const [Date_Start, setDate_start] = useState();
  const [Date_End, setDate_end] = useState();
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
      const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const handle_date_start = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      let isoDateString;
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      setDate_start(isoString);
    }
  };
  const handle_date_end = (jalaliDate) => {
    if (jalaliDate) {
      const { year, month, day } = jalaliDate;
      const gregorianDate = jalaali.toGregorian(year, month, day);
      // Get current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      // Create the ISO date string
      let isoDateString;
      const t = new Date();
      const date = new Date(
        jalaliDate.year,
        jalaliDate.month - 1,
        jalaliDate.day,
        t.getHours(),
        t.getMinutes()
      );

      // const date = new Date(jalaliDate.year, jalaliDate.month - 1, jalaliDate.day);
      const isoString = date.toISOString(); // This gives you the ISO string in UTC
      // setIsoDate(isoString);
      setDate_end(isoString);
      // const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };
  const handleName = (e) => {
    setnameSearch(e.target.value);
  };

  const dispatch = useDispatch();
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [options, setOptions] = useState([]);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [AddPurchaseModal, setAddPurchaseModal] = useState(false);
  const [stock, setstock] = useState([]);
  const [belance, setbelance] = useState();
  const [AddBalanceModal, setAddBalanceModal] = useState(false);

  // show and edit
  const [EditSellModal, setEditSellModal] = useState(false);
  const [MoneyEdit, setMoneyEdit] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [shopingcart, setShopingCart] = useState([]);
  const [Exesting, setExesting] = useState(false);
  //   dispatch(getStocks());
  // console.log(stocks);
  // useEffect(() => {
  //   // بررسی و بارگذاری `belances`
  //   if (!statusm && moneys?.length===0) {
  //     dispatch(getMoneys());
  //   }
  // // console.log();
  //   // console.log(customers);
  //   // // بررسی و بارگذاری `moneys`
  //   if (!statusStock  && stocks?.length===0) {
  //     dispatch(getStocks());
  //   }
  //   if (!statuss  && settings?.length===0) {
  //     dispatch(getSettings());
  //   }
  //   // console.log(!statusc);
  //   if (!statusc  && customers?.length===0) {
  //     dispatch(getCustomers());
  //   }
  //   // // بررسی و بارگذاری `customers`
  //   // if (statusc === 'idle' && !customers) {
  //   //   dispatch(getCustomers());
  //   // }
  // }, [dispatch, statusm, moneys,settings,statuss]);
  // console.log(!items?.lenght)
  // console.log(!statusi);
  const getcustomer = () => {
    if(stock.length===0){
      axios
        .get(`${Source.getAddress()}/api/item`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            query: "ok",
          },
        })
        .then((res) => {
          setstock(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if(money.length===0){
      axios
        .get(Source.getAddress() + "/api/money", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            delete: "False",
          },
        })
        .then((res) => {
          setmoney(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const [setting, setsettings] = useState(settings);
  // useEffect(()=>{
  //   axios.get(Source.getAddress() + '/api/settings', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access')}`,
  //     },params: {
  //       delete: 'False',
  //     },
  //   }).then((res)=>{
  //     // console.log(res);
  //     setsettings(res.data);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });

  // },[]);
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه
  const [addbalance, setaddbalance] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [money, setmoney] = useState([]);

  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(Source.getAddress() + "/api/purchase", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {  
          user_id: selecteduser.id,
          page: page,
          perPage: pageSize,
          StartDate: StartDate&& Date_Start,
          EndDate: EndDate && Date_End,
          search: namesearch?.length ? namesearch : 'false',
          delete: 0,
        },
      });
      // console.log(response);
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total); // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };
  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage,EndDate, StartDate, selecteduser,namesearch]);

  // مدیریت تغییر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page); // برو به صفحه جدید
  };
  const intl = useIntl(); // استفاده از هوک useIntl برای دسترسی به ترجمه‌ها

  const deletePurchase = async (row) => {
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

    if (result.isConfirmed) {
      const update = {
        money: row.money.id,
        bill: row.bill.id,
        _method:"put"
        // sell: row.purchase[0]?.id||row.purchase[0]?.e_id, // Ensure you are passing the correct 'sell' id
      };

      try {
        const res = await axios.post(
          `${Source.getAddress()}/api/purchase/${row.bill.id}`,
          update,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`, // Add the access token here
            },
            params: {
              type: "delete", // If you need additional parameters, you can add them here
              // account: row.account // Uncomment and use if necessary
            },
          }
        );

        Swal.fire({
          position: "center",
          icon: "success",
          // title: "Item record successfully deleted!",
                      // title: <FormattedMessage id="record successfully deleted!"/>,
                                  title: intl.formatMessage({id:"record successfully deleted!"}),
          showConfirmButton: false,
          timer: 600,
        });

        // Remove the deleted item from the records
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.bill.id !== row.bill.id)
        );
      } catch (err) {
        Swal.fire({
          position: "center",
          icon: "error",
          // title: "Item record not deleted",
                                  // title: <FormattedMessage id="Something went wrong!"/>,            
                                              title: intl.formatMessage({id:"Something went wrong!"}),
                                  
          showConfirmButton: false,
          timer: 600,
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        position: "center",
        icon: "error",
        // text: "Your item record is safe :)",
                        // text: <FormattedMessage id="Your record is safe :)"/>,
                                text:intl.formatMessage({id:"Your record is safe :)"}),
        showConfirmButton: false,
        timer: 600,
      });
    }
  };

  const PDcolumn = [
    {
      name:
      <FormattedMessage id="Bill Number" />
      ,
      selector: (row) => row.bill.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name:           <FormattedMessage id="Name" />      ,
      selector: (row) =>
        row.bill.temp_customer
          ? row.bill.temp_customer
          : row.bill.accounts.account.name,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name: (
        <strong
          style={{ minWidth: "200px", maxWidth: "240px", width: "240px" }}
        >
                    <FormattedMessage id="Date Created" />
        </strong>
      ),
      selector: (row) => date(row.bill.dateInsert),
    },
    {
      name:           <FormattedMessage id="Currency" />      ,
      selector: (row) => row.bill.money.name,
      sortable: true,
    },
    { name:           <FormattedMessage id="Total Amount" />
      , selector: (row) => row.bill.total, sortable: true },
    {
      name:           <FormattedMessage id="Paid Amount" />      ,
      selector: (row) => row.bill.PaidAmount,
      sortable: true,
    },
    {
      name:           <FormattedMessage id="Remain Amount" />      ,
      selector: (row) => row.bill.Remain,
      sortable: true,
    },
    // { name: "Add By", selector: (row) => row.bill.user.name, sortable: true },

    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
          <FormattedMessage id="Show" />
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={(e) => {
            getcustomer();
            setExesting(row.bill.accounts ? true : false);
            setEditSellModal(true);
            setMoneyEdit(row.money);
            setCustomer(row.bill);
            setShopingCart(row.purchase);
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
            src={pencil}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
    {
      name: (
        <strong
          style={{
            textAlign: "center",
            backgroundColor: "tranceparent",
            width: "100%",
          }}
        >
                    <FormattedMessage id="Delete" />
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={() => {
            deletePurchase(row);
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
            src={Trash}
            style={{ backgroundColor: "tranceparent" }}
          />
        </button>
      ),
    },
  ];
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
  const date = (d) => {
    const date = new Date(d);

    let formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    let aa = ampm;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    if (localStorage.getItem("date") === "Persian") {
      moment.locale("fa"); // تنظیم لوکال به فارسی
      aa = hours >= 12 ? "ب.ظ" : "ق.ظ";
      formattedDate = moment(d).format("jYYYY-jMM-jDD");
    } else {
      moment.locale("en"); // تنظیم لوکال به انگلیسی
    }

    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${aa}`;
  };
  const [addcusotmer, setaddcustomer] = useState([]);
  const [addbelance, setaddbelance] = useState([]);
  // useEffect(() => {
  //   fetchData(currentPage, perPage);
  // }, [currentPage, perPage]);
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
  return (
    <div className={`w-100 ${"iransans"}`}>
      <div className="m-auto mt-5 m-5" style={{ height: "100%", width: "99%" }}>
        <button
          type="submit"
          className="btn btn-info mb-1 p-1"
          style={{ width: "100px" }}
          onClick={() => {
            setAddPurchaseModal(true);
            getcustomer();
          }}
        >
          <FormattedMessage id="Add" />
        </button>
        <div
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
className="bg-light d-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
        style={{ borderTop: "5px solid #4a5cf2" }}
      >
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Purchase"/>
        </h2>
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
          <div className="mb-1 mb-lg-0 me-lg-2 mt-1 ">
            <Datepicker_Customer
              default_value={StartDate}
              handle_date={handle_date_start}
              lebal={<FormattedMessage id="Start"/>}
              setSelectedDay={setStartDate}
              selectedDay={StartDate}
            ></Datepicker_Customer>
          </div>
          <div className="mb-1 mt-1 mb-lg-0 me-lg-2">
            <Datepicker_Customer
              default_value={EndDate}
              handle_date={handle_date_end}
              lebal={<FormattedMessage id="End"/>}
              setSelectedDay={setEndDate}
              selectedDay={EndDate}
            ></Datepicker_Customer>
          </div>
          <ListBox
            options={users}
            selectedOption={selecteduser}
            setSelectedOption={setSelecteduser}
          />
        </div>
        <input
  className="form-control m-2 mb-2 mt-4"
  style={{ width: "100%", maxWidth: "200px" }}
  type="search"
  onChange={handleName}
  value={namesearch}
  placeholder={formatMessage({ id: "Search" })}
  aria-label="Search"
/>
      </div>
        <DataTable
                  localization={localization} // ارسال ترجمه‌ها      
          columns={columns}
          data={records}
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
                display: "flex",
                minWidth: "100px", // تنظیم اندازه عنوان‌ها
                maxWidth: "100px",
                width: "10px",
                margin: "0px",
                fontWeight: "bold",
              },
            },
            cells: {
              style: {
                minWidth: "100px", // تنظیم اندازه داده‌ها
                maxWidth: "150px",
                width: "150px",
              },
            },
          }}
        />
        {/* {
          <AccountEdit
          loading={loading}
          setLoading={setLoading}
          inputRef={inputRef1}
            close={() => setEdit(false)}
            account={editAccount1}
            setAccount={setEditAccount1}
            // records={records}
            // setRecords={setRecords}
            edit={edit}
            records={records}
            setRecords={setRecords}
          />
        }
        <Belance
        setMoney={setMoney}
        inputRef={inputRefbelance}
        belancem={belance}
         setbelance={setbelance}
        prof={prof}
        idprof={idprof}
        customer={customer}
        setcustomer={setcustomer}
        moneyp={money}
        loading={loading}
        setLoading={setLoading}
          close={() => setOpenBelance(false)}
          id={id}
          accountbelance={editAccount}
          setEditAccount={setEditAccount}
          openBelance={openBelance}
          setOpenBelance={setOpenBelance}
        />
        {
          <AddAccount
          loading={loading}
          setLoading={setLoading}
            inputRef={inputRef}
            close={() => setAddAccountModal(false)}
            addAccountModal={addAccountModal}
            records={records}
            setRecords={setRecords}
          />
        } */}
        <AddPurchase
          customers={accounts}
          setsettings={setsettings}
          settings={setting}
          belance={belance}
          records={records}
          setRecords={setRecords}
          options1={stock}
          moneys={money}
          AddItemModal={AddPurchaseModal}
          close={() => setAddPurchaseModal(false)}
          setAddAccountModal={setAddAccountModal}
          setAddBalanceModal={setAddBalanceModal}
        />
        <Add_belance
          // customers={customers}
          accounts={belance}
          setAccounts={setbelance}
          close={() => setAddBalanceModal(false)}
          addAccountModal={AddBalanceModal}
          records={belance}
          setRecords={setbelance}
          money={money}
          // settings={settings}
          setAddcustomerModal={setAddAccountModal}
        />
        {
          <Add_customer
            // loading={loading}
            // setLoading={setLoading}
            // inputRef={inputRef}
            close={() => setAddAccountModal(false)}
            addAccountModal={addAccountModal}
            records={addcusotmer}
            setRecords={setaddcustomer}
          />
        }
        <EditPurchase
          Exesting={Exesting}
          setExesting={setExesting}
          records={records}
          setRecords={setRecords}
          AddItemModal={EditSellModal}
          close={(e) => setEditSellModal(false)}
          money={MoneyEdit}
          setmoney={setMoneyEdit}
          moneys={money}
          Customer={Customer}
          setCustomer={setCustomer}
          shopingcart={shopingcart}
          setshopingcart={setShopingCart}
          options1={stock}
          setOptions1={setstock}
        />
      </div>
    </div>
  );
}
