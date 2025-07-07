import React, { lazy, memo, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// External libraries
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FormattedMessage } from "react-intl";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

// Styles
import "../src/App.css";

// Icons
import Accountp from "./assets/icon/accountp.png";
import af from "./assets/icon/afghanistan.png";
import en from "./assets/icon/ENGLISH.png";
import Menu from "./assets/icon/menuu.png";
import Logout from "./assets/icon/logout.png";
import Manager from "./assets/icon/manager.png";

// Internal utilities
import { useShowAlert } from "./warrper.js";
import { getSettings, updateSettingInCache } from "./pages/Redux/settingSlice.js";

// Static components
import NotFound from "./NotFound";
import Sidebar from "./Sidebar.js";
import Source from "./Source";

// Lazy-loaded pages with memo
const Dashboard = memo(lazy(() => import("./pages/Dashboard")));
const Account = memo(lazy(() => import("./pages/Account")));
const Money = memo(lazy(() => import("./pages/Money")));
const Setting = memo(lazy(() => import("./pages/Setting.js")));
const Withdraw = memo(lazy(() => import("./pages/Withdraw.js")));
const Deposite = memo(lazy(() => import("./pages/Deposite.js")));
const Cach = memo(lazy(() => import("./pages/Cach.js")));
const Manage = memo(lazy(() => import("./pages/Manage")));
const Profile = memo(lazy(() => import("./pages/Profile")));
const Customers = memo(lazy(() => import("./pages/Customers.js")));
const Transformation = memo(lazy(() => import("./pages/Transformations/Transformations.js")));
const ThirdDeptDtable = memo(lazy(() => import("./pages/ThirdDeptDtable.js")));
const ItemType = memo(lazy(() => import("./pages/Items/ItemType.js")));
const Items = memo(lazy(() => import("./pages/Items/Items.js")));
const Stock = memo(lazy(() => import("./pages/Items/Stock.js")));
const Purchase = memo(lazy(() => import("./pages/Items/Purchase.js")));
const Sell = memo(lazy(() => import("./pages/Items/Sell.js")));
const PurchaseReturn = memo(lazy(() => import("./pages/Items/Returns/PurchaseRetrun.js")));
const SellReturn = memo(lazy(() => import("./pages/Items/Returns/SellReturn.js")));
const AllTransactions = memo(lazy(() => import("./pages/Transactions/AllTransactions.js")));
const DraftTransaction = memo(lazy(() => import("./pages/Draft/DraftTransaction.js")));
const DraftCustomers = memo(lazy(() => import("./pages/Draft/DraftCustomers.js")));
const DraftAccount = memo(lazy(() => import("./pages/Draft/DraftAccount.js")));
const DraftMoney = memo(lazy(() => import("./pages/Draft/DraftMoney.js")));
const DraftExpenses = memo(lazy(() => import("./pages/Draft/DraftExpense.js")));
const BenefitReport = memo(lazy(() => import("./pages/Report/BenefitReport.js")));
const OwnAssets = memo(lazy(() => import("./pages/Report/OwnAssets.js")));
const ReportCustomers = memo(lazy(() => import("./pages/Report/ReportCustomers.js")));
const Debite = memo(lazy(() => import("./pages/Report/Debite.js")));
const Credit = memo(lazy(() => import("./pages/Report/Credit.js")));
const Expenses = memo(lazy(() => import("./pages/Expense/Expenses.js")));
const Sideoption = memo(lazy(() => import("./pages/SideOption/Sideoption.js")));

// Styled components
const LanguageSelect = styled(Select)(({ theme }) => ({
  color: '#4d859c',
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 12px',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const LanguageMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
}));

const LanguageSelector = () => {
  const availableLanguages = ['en', 'da', 'pa']; // زبان‌های موجود در سیستم
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [open, setOpen] = useState(false);

  const showAlert = useShowAlert();
  const dispatch = useDispatch();
  
  // کامپوننت سفارشی برای مخفی کردن فلش
  const CustomDropdownIcon = () => {
    // اگر فقط یک زبان موجود است، هیچ چیزی رندر نکن
    if (availableLanguages.length <= 1) {
      return null;
    }
    // در غیر این صورت فلش معمولی را نمایش بده
    return <></>; // یا می‌توانید آیکون سفارشی خود را اینجا برگردانید
  };

  const handleChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    handleLanguageChange(newLanguage);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleLanguageChange = (language) => {
    const uploadData = new FormData();
    uploadData.append("_method", "PUT");
    localStorage.setItem("language", language);
    uploadData.append("language", language);
    axios
      .post(Source.getAddress() + "/api/settings/1", uploadData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        dispatch(updateSettingInCache(res.data.settings));
        showAlert({
          position: "top-end",
          icon: "success",
          title: <FormattedMessage id="Language updated successfully!" />,
          showConfirmButton: false,
          timer: 1500,
        });
        window.location.reload();
      })
      .catch((err) => {
        showAlert({
          position: "top-end",
          icon: "error",
          title: <FormattedMessage id="Something went wrong!" />,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <FormControl sx={{ m: 0, minWidth: 100 }} size="small">
      <LanguageSelect
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={language}
        onChange={handleChange}
        IconComponent={CustomDropdownIcon} // استفاده از آیکون سفارشی
        disabled={availableLanguages.length <= 1} // غیرفعال کردن اگر فقط یک زبان وجود دارد
        renderValue={(selected) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={selected === 'en' ? en : af} 
              alt={selected} 
              style={{ width: '24px', marginRight: '8px' }} 
            />
            <span style={{ fontSize: '0.875rem' }}>
              {selected === 'en' ? <FormattedMessage id='English'/> : selected === 'pa' ? <FormattedMessage id='Pashto'/> : <FormattedMessage id='Dari'/>}
            </span>
          </div>
        )}
      >
        {availableLanguages.map((lang) => (
          <LanguageMenuItem key={lang} value={lang}>
            <span>{lang === 'en' ?  <FormattedMessage id='English'/> : lang === 'pa' ? <FormattedMessage id='Pashto'/> : <FormattedMessage id='Dari'/>}</span>
            <img src={lang === 'en' ? en : af} alt={lang} style={{ width: '24px' }} />
          </LanguageMenuItem>
        ))}
      </LanguageSelect>
    </FormControl>
  );
};

function App1({
  setCorrect,
  setError,
  loguser,
  setLoguser,
  type,
  Collapse,
  setCollapse,
  username,
  password,
}) {
  return (
    <Router>
      <AppContent 
        setCorrect={setCorrect}
        setError={setError}
        loguser={loguser}
        setLoguser={setLoguser}
        type={type}
        Collapse={Collapse}
        setCollapse={setCollapse}
        username={username}
        password={password}
      />
    </Router>
  );
}

function AppContent({
  setCorrect,
  setError,
  loguser,
  setLoguser,
  type,
  Collapse,
  setCollapse,
  username,
  password,
}) {
  const location = useLocation();
  const showAlert = useShowAlert();
  const dispatch = useDispatch();
  const { settings, errors, statuss } = useSelector((state) => state.settings);
  const [setting, setsettings] = useState([{ date: "", language: "" }]);
  const [money, setMoney] = useState([]);
  const [date, setdate] = useState("Hejiri Date");
  const [deposite, setdeposite] = useState([]);
  const [withdraw, setwithdraw] = useState([]);
  const [alltransactions, setalltransactions] = useState([]);
  const [draft, setdraft] = useState([]);
  const [Cash, setCash] = useState([]);
  const [user, setuser] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(false);
  const [belance, setbelance] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState(accounts);
  const [isToggled, setIsToggled] = useState(localStorage.getItem('toggle') === 'true');
  const [typemoney, settypemoney] = useState();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const fetchTotalRecords = async () => {
      const newTotals = {};
      for (const record of money) {
        try {
          const res = await axios.get(
            Source.getAddress() + "/api/reports/sum_by_money_type",
            {
              params: { moneytype: record.id },
              headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
            }
          );
          newTotals[record.id] = res.data.total_amount;
        } catch (err) {
          console.error("Error getting report:", err);
        }
      }
      setTotals(newTotals);
    };
    fetchTotalRecords();
  }, [money]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("access");
    localStorage.removeItem("userTokenname");
    localStorage.removeItem("userTokenid");
    localStorage.clear();
    setError(false);
    setCorrect(false);
  };

  const handleToggle = () => {
    const newValue = !isToggled;
    localStorage.setItem("toggle", String(newValue));
    setIsToggled(newValue);
  };

  const options = [
    ...(localStorage.getItem("userTokenname") === "admin" ? [{
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Manager} alt="manager-icon" style={{ width: "20px", marginRight: "8px" }} />
          <FormattedMessage id="Manage Users" />
        </div>
      ),
      value: "manage_users",
    }] : []),
    {
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Logout} alt="logout-icon" style={{ width: "20px", marginRight: "8px" }} />
          <FormattedMessage id="Logout" />
        </div>
      ),
      value: "logout",
    }
  ];

  const handle = (language) => {
    const uploadData = new FormData();
    uploadData.append("_method", "PUT");
    localStorage.setItem("language", language);
    uploadData.append("language", language);
    axios
      .post(Source.getAddress() + "/api/settings/1", uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        dispatch(updateSettingInCache(res.data.settings));
        showAlert({
          position: "top-end",
          icon: "success",
          title: <FormattedMessage id="Language updated successfully!" />,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        showAlert({
          position: "top-end",
          icon: "error",
          title: <FormattedMessage id="Something went wrong!" />,
          showConfirmButton: false,
          timer: 1500,
        });
      });
      window.location.reload();
  };

  const handleSelect = (option) => {
    if (option.value === "logout") handleLogout();
    else if (option.value === "manage_users") window.location.href = "/manage";
  };

  return (
    <div>
      <div
        dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
        className="wrapper"
        style={{ backgroundColor: "#ecf0f5", width: "100%", height: "100vh", display: "flex" }}
      >
        <div style={{
          width: isToggled ? "64px" : isDesktop ? '240px' : '0px',
          height: "100vh",
          backgroundColor: "#343a40",
          transition: "width 0.3s ease",
          flexShrink: 0,
          overflow: "auto"
        }}>
          <Sidebar isToggled={isToggled} handleToggle={handleToggle} />
        </div>
        <section 
          id="content" 
          style={{ 
            flex: 1,
            height: "100vh",
            backgroundColor: "#ecf0f5",
            overflow: "auto"
          }}
        >
          <nav style={{ padding: "10px", display: "flex", alignItems: "center" }}>
            <button
              className="btn p-0 m-0 d-flex"
              onClick={handleToggle}
              id="sidebar-toggle"
              type="button"
            >
              <img src={Menu} style={{ width: "30px" }} className="p-0 m-0" alt="menu" />
            </button>
            
            <div className="form-input w-100"></div>
            
            <LanguageSelector />
            
            <div style={{
              position: "relative",
              display: "inline-block",
              marginLeft: localStorage.getItem("language") === "en" ? "auto" : "0",
              marginRight: localStorage.getItem("language") === "en" ? "0" : "auto",
            }}>
              <Dropdown
                options={options}
                onChange={handleSelect}
                placeholder={
                  <div style={{ display: "flex", margin: "0px", alignItems: "center", border: 'none!important', color: '#4d859c' }} 
                       dir="ltr" 
                       className={localStorage.getItem('language') !== 'en' ? 'afgFont' : ''}>
                    {localStorage.getItem("userToken")}
                    <img
                      src={Accountp}
                      className="p-1 rounded-5"
                      style={{
                        width: "2.5em",
                        marginLeft: localStorage.getItem("language") === "en" ? "8px" : "0",
                        marginRight: localStorage.getItem("language") === "en" ? "0" : "8px",
                      }}
                      alt="User"
                    />
                  </div>
                }
                className={`custom-dropdown ${localStorage.getItem('language') !== 'en' ? 'afgFont' : ''}`}
                style={{border: 'none!important'}}
              />
            </div>
          </nav>
          
          <div style={{ backgroundColor: "#ecf0f5", padding: "20px" }}>
             <Suspense>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/account" element={
                  <Account
                    loading={loading}
                    setLoading={setLoading}
                    accounts={belance}
                    money={money}
                    customers={accounts}
                    setAccounts={setAccounts}
                    user={user}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/transformations" element={
                  <Transformation
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    accounts={accounts}
                    setAccounts={setAccounts}
                    withdraw={withdraw}
                    belance={belance}
                    setbelance={setbelance}
                    user={user}
                    Cash={Cash}
                    setCash={setCash}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/withdraw" element={
                  <Withdraw
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    accounts={accounts}
                    setAccounts={setAccounts}
                    withdraw={withdraw}
                    belance={belance}
                    setbelance={setbelance}
                    user={user}
                    Cash={Cash}
                    setCash={setCash}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/deposite" element={
                  <Deposite
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    accounts={accounts}
                    setAccounts={setAccounts}
                    deposite={deposite}
                    setbelance={setbelance}
                    belance={belance}
                    user={user}
                    Cash={Cash}
                    setCash={setCash}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/alltransactions" element={
                  <AllTransactions
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    accounts={accounts}
                    setAccounts={setAccounts}
                    deposite={alltransactions}
                    setbelance={setbelance}
                    belance={belance}
                    user={user}
                    Cash={Cash}
                    setCash={setCash}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/cach/report" element={
                  <ThirdDeptDtable
                    money={money}
                    setMoney={setMoney}
                    loading={loading}
                    setLoading={setLoading}
                    typemoney={typemoney}
                    settypemoney={settypemoney}
                    deposite={deposite}
                    setbelance={setbelance}
                    belance={belance}
                    user={user}
                    Cash={Cash}
                    setCash={setCash}
                    settings={setting}
                    setsettings={setsettings}
                    accounts={accounts}
                    setAccounts={setAccounts}
                  />
                } />
                <Route path="/drafttransactions" element={
                  <DraftTransaction
                    loading={loading}
                    setLoading={setLoading}
                    withdraw={draft}
                    belance={belance}
                    Cash={Cash}
                    user={user}
                    setCash={setCash}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/money_type" element={
                  <Money
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    setMoney={setMoney}
                    belance={belance}
                    user={user}
                    settings={setting}
                  />
                } />
                <Route path="/setting" element={
                  <Setting
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    belance={belance}
                    setMoney={setMoney}
                    user={user}
                    date1={date}
                    setdate={setdate}
                    username={username}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/profile" element={
                  <Profile
                    loading={loading}
                    setLoading={setLoading}
                    loguser={loguser}
                    setLoguser={setLoguser}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/cash" element={
                  <Cach
                    loading={loading}
                    setLoading={setLoading}
                    totals={totals}
                    setTotals={setTotals}
                    money={money}
                    setMoney1={setMoney}
                    setLoguser={setLoguser}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/manage" element={
                  localStorage.getItem("userTokenname") === "admin" ? (
                    <Manage
                      loading={loading}
                      setLoading={setLoading}
                      users={users}
                      setUsers={setUsers}
                      settings={setting}
                      setsettings={setsettings}
                    />
                  ) : null
                } />
                <Route path="/customers" element={
                  <Customers
                    money={money}
                    loading={loading}
                    setLoading={setLoading}
                    accounts={accounts}
                    setAccounts={setAccounts}
                    date={date}
                    user={user}
                    setting={setting}
                    setsetting={setsettings}
                    belance={belance}
                    setbelance={setbelance}
                  />
                } />
                <Route path="/draftcustomer" element={
                  <DraftCustomers
                    money={money}
                    loading={loading}
                    setLoading={setLoading}
                    accounts={accounts}
                    setAccounts={setAccounts}
                    date={date}
                    user={user}
                    settings={setting}
                    setsettings={setsettings}
                    belance={belance}
                    setbelance={setbelance}
                  />
                } />
                <Route path="/draftmoney" element={
                  <DraftMoney
                    loading={loading}
                    setLoading={setLoading}
                    money={money}
                    setMoney={setMoney}
                    belance={belance}
                    user={user}
                    settings={setting}
                  />
                } />
                <Route path="/draftaccount" element={
                  <DraftAccount
                    loading={loading}
                    setLoading={setLoading}
                    accounts={belance}
                    money={money}
                    customers={accounts}
                    setAccounts={setAccounts}
                    user={user}
                    settings={setting}
                    setsettings={setsettings}
                  />
                } />
                <Route path="/customerreport" element={<ReportCustomers Customers={accounts} />} />
                <Route path="/itemtype" element={<ItemType />} />
                <Route path="/items" element={<Items />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/sellreturn" element={<SellReturn />} />
                <Route path="/purchasereturn" element={<PurchaseReturn />} />
                <Route path="/benefitreport" element={<BenefitReport />} />
                <Route path="/owneassests" element={<OwnAssets />} />
                <Route path="/debit" element={<Debite />} />
                <Route path="/credit" element={<Credit />} />
                <Route path="/expense" element={<Expenses />} />
                <Route path="/draftexpense" element={<DraftExpenses />} />
                <Route path="/1469sideoption" element={<Sideoption />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App1;