import axios from "axios";
import { useState,useMemo } from "react";
import DataTable from "react-data-table-component";
import React, { useEffect } from "react";
import Source from "../../../Source";
import AddSell from "../forms/AddSell";
import { showAlert } from "../../../warrper";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import AddSellReturn from "./Forms/AddSellReturn";
import EditSellReturn from "./Forms/EditSellReturn";
import Trash from "../../../assets/icon/trash.png";
import pencil from "../../../assets/icon/pencil.png";
import EditSell from "../forms/EditSell";
import { getSettings } from "../../Redux/settingSlice";
import { useSelector, useDispatch } from "react-redux";
import AddPurchaseReturn from "./Forms/AddPurchaseReturn";
import EditPurchaseReturn from "./Forms/EditPurchaseReturn";
import { FormattedMessage } from "react-intl";
import {useIntl } from "react-intl";
import { useShowAlert  } from "../../../warrper";

export default function PurchaseReturn() {
  const showAlert = useShowAlert(); 
  const dispatch = useDispatch();
  const { moneys, errorm, statusm } = useSelector((state) => state.moneys);
  const { belances, errorb, statusb } = useSelector((state) => state.belances);
  const { customers, errorc, statusc } = useSelector(
    (state) => state.customers
  );
  const [item, setitem] = useState([]);
  const [customer, setcustomer] = useState(customers);
  const [belance, setbelance] = useState(belances);
  const [options, setOptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [AddSellModal, setAddSellModal] = useState(false);
  const [AddBalanceModal, setAddBalanceModal] = useState(false);
  const [EditSellModal, setEditSellModal] = useState(false);
  const [EditSellModalm, setEditSellModalm] = useState(false);
  const [MoneyEdit, setMoneyEdit] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [shopingcart, setShopingCart] = useState([]);
  const { items, errori, statusi } = useSelector((state) => state.items);
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [id, setid] = useState();
  const [SoldRecords, setSoldRecords] = useState([]);
  const [bill, setbill] = useState({});
  const [money1, setmoney1] = useState();
  const FindBill = (id) => {
    if (!id) {
      showAlert({
        position: "top-end",
        icon: "error",
        title: "Please fill the bill number!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    } else {
      axios
        .get(Source.getAddress() + "/api/purchase/" + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          // console.log(res.data.sells);
          setmoney(res.data.money);
          setbill(res.data.bill);
          setSoldRecords(res.data.purchase);
        })
        .catch((e) => {
          console.log(e);
          setbill([]);
          setSoldRecords([]);
          showAlert({
            position: "top-end",
            icon: "error",
            title: "This bill number not found!",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    }
  };
  useEffect(() => {
    if (!statuss && settings?.lenght === 0) {
      dispatch(getSettings());
    }
  }, [dispatch,  settings, statuss]);

  const [setting, setsettings] = useState([]);
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
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  // const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // تعداد کل ردیف‌ها
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // صفحه فعلی
  const [perPage, setPerPage] = useState(10); // تعداد آیتم‌ها در هر صفحه

  // دریافت داده‌ها از سرور
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(
        Source.getAddress() + "/api/purchasereturn",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          params: {
            page: page,
            perPage: pageSize,
            delete: 0,
            product: "sell",
          },
        }
      );
      console.log(response);
      setRecords(response.data.data); // داده‌های صفحه جاری
      setTotalRows(response.data.total);
      // تعداد کل ردیف‌ها
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  // فراخوانی داده‌ها هنگام بارگذاری صفحه یا تغییر صفحه
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage]);

  // مدیریت تغییر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page); // برو به صفحه جدید
  };

  const handleAdd = () => {
    setAddAccountModal(true);
  };
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRowDetails = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };
  const [TotalAmount, setTotalAmount] = useState(0);
  const [PaidAmount, setPaidAmount] = useState(0);

  const deleteSell = async (row) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const update = {
        money: row.money.id,
        bill: row.bill.id,
        sell: row.sells[0]?.id || row.sells[0]?.e_id, // Ensure you are passing the correct 'sell' id
      };

      try {
        const res = await axios.put(
          `${Source.getAddress()}/api/sell/${row.bill.id}`,
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

        showAlert({
          position: "center",
          icon: "success",
          title: "Item record successfully deleted!",
          showConfirmButton: false,
          timer: 600,
        });

        // Remove the deleted item from the records
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.bill.id !== row.bill.id)
        );
      } catch (err) {
        console.log(err);
        showAlert({
          position: "center",
          icon: "error",
          title: "Item record not deleted",
          showConfirmButton: false,
          timer: 600,
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      showAlert({
        position: "center",
        icon: "error",
        text: "Your item record is safe :)",
        showConfirmButton: false,
        timer: 600,
      });
    }
  };
  const [returnbill, setreturnbill] = useState();
        const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const PDcolumn = [
    {
      name: "Id",
      selector: (row) => row.bill.id,
      sortable: true,
      style: {
        width: "1px",
        minWidth: "1px",
      },
    },
    {
      name: "Name",
      selector: (row) =>
        row.bill.accounts?.account
          ? row.bill.accounts.account.name
          : row.bill.temp_customer,
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
          Date Created
        </strong>
      ),
      selector: (row) => date(row.bill.dateInsert),
    },
    {
      name: "Currency",
      selector: (row) => row.bill?.money?.name,
      sortable: true,
    },
    { name: "Total Amount", selector: (row) => row.bill.total, sortable: true },
    {
      name: "Paid Amount",
      selector: (row) => row.bill.PaidAmount,
      sortable: true,
    },
    {
      name: "Rmain Amount",
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
          Show
        </strong>
      ),
      selector: (row) => (
        <button
          onClick={(e) => {
            // console.log(row);
            setShopingCart(row.sells);
            setTotalAmount(row.bill.total);
            setPaidAmount(row.bill.PaidAmount);
            setreturnbill(row.bill);
            FindBill(row.bill.bill_purchase);
            setEditSellModalm(true);
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
  const [money, setmoney] = useState([]);
  const getcustomer = () => {};
  const ExpandedComponent = ({ data }) => (
    <div className="p-3">
      <h5>{data.name}</h5>
      <p>Status: {data.status}</p>
      <p>Registered: {data.registered}</p>
      <button className="btn btn-info btn-sm">Edit</button>
      <button className="btn btn-danger btn-sm ms-2">Delete</button>
    </div>
  );
  const [Exesting, setExesting] = useState(false);
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
  // dispatch(getCustomers());
  return (
    <div className={`w-100 ${"iransans"}`}>
      <div className="m-auto mt-5 m-5" style={{ height: "100%", width: "99%" }}>
        <button
          type="submit"
          className="btn btn-info mb-1 p-1"
          style={{ width: "100px" }}
          onClick={() => {
            setAddSellModal(true);
            getcustomer();
          }}
        >
      <FormattedMessage id="Add"/>
        </button>
        <div
            dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
          className="bg-light d-flex justify-content-lg-betweend-flex flex-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center"
          style={{ borderTop: "5px solid #4a5cf2" }}
        >
          {/* <div className="d-flex w-100 h-100 m-auto justify-content-between"> */}
            <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Purchase Return"/></h2>
          {/* </div> */}
          <input
            className="form-control m-2 mb-4"
            style={{ width: "100%", maxWidth: "200px" }}
            type="search"
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
                fontWeight: "bold",
              },
            },
          }}
        />
        <AddPurchaseReturn
          options1={item}
          setOptions1={setitem}
          customer={customer}
          setcustomer={setcustomer}
          settings={setting}
          setsettings={setsettings}
          records={records}
          setRecords={setRecords}
          addAccountModal={addAccountModal}
          setAddAccountModal={setAddAccountModal}
          moneys={money}
          AddSellModal={AddSellModal}
          close={() => setAddSellModal(false)}
          setAddBalanceModal={setAddBalanceModal}
        />
        <EditPurchaseReturn
          PaidAmount={PaidAmount}
          setPaidAmount={setPaidAmount}
          TotalAmount={TotalAmount}
          setTotalAmount={setTotalAmount}
          returnbill={returnbill}
          setreturnbill={setreturnbill}
          SoldRecords={SoldRecords}
          setSoldRecords={setSoldRecords}
          bill={bill}
          setbill={setbill}
          money={money1}
          setmoney={setmoney1}
          Exesting={Exesting}
          setExesting={setExesting}
          records={records}
          setRecords={setRecords}
          settings={setting}
          setsettings={setsettings}
          AddSellModal={EditSellModalm}
          close={(e) => setEditSellModalm(false)}
          // money={MoneyEdit}
          moneys={money}
          options1={item}
          setOptions1={setitem}
          customers={customer}
          Customer={Customer}
          setCustomer={setCustomer}
          shopingcart={shopingcart}
          setshopingcart={setShopingCart}
        />
      </div>
    </div>
  );
}
