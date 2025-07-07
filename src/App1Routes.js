// App1Routes.js
import React from "react";
import { Navigate } from "react-router-dom";

import Account from './pages/Account';
import Transformation from './pages/Transformations/Transformations';
import Withdraw from './pages/Withdraw';
import Deposite from './pages/Deposite';
import AllTransactions from './pages/Transactions/AllTransactions';
import ThirdDeptDtable from './pages/ThirdDeptDtable';
import DraftTransaction from './pages/Draft/DraftTransaction';
import Dashboard from './pages/Dashboard';
import Money from './pages/Money';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import Cach from './pages/Cach';
import Manage from './pages/Manage';
import Customers from './pages/Customers';
import DraftCustomers from './pages/Draft/DraftCustomers';
import DraftMoney from './pages/Draft/DraftMoney';
import DraftAccount from './pages/Draft/DraftAccount';
import ReportCustomers from './pages/Report/ReportCustomers';
import ItemType from './pages/Items/ItemType';
import Items from './pages/Items/Items';
import Stock from './pages/Items/Stock';
import Purchase from './pages/Items/Purchase';
import Sell from './pages/Items/Sell';
import SellReturn from './pages/Items/Returns/SellReturn';
import PurchaseReturn from './pages/Items/Returns/PurchaseRetrun';
import BenefitReport from './pages/Report/BenefitReport';
import OwnAssets from './pages/Report/OwnAssets';
import Debite from './pages/Report/Debite';
import Credit from './pages/Report/Credit';
import Expenses from './pages/Expense/Expenses';
import DraftExpenses from './pages/Draft/DraftExpense';
import Sideoption from './pages/SideOption/Sideoption';
import NotFound from './NotFound';

const App1Routes = (props) => {
  const {
    loading,
    setLoading,
    belance,
    setbelance,
    accounts,
    setAccounts,
    money,
    setMoney,
    deposite,
    withdraw,
    alltransactions,
    Cash,
    setCash,
    user,
    loguser,
    setLoguser,
    setting,
    setsettings,
    date,
    username,
    typemoney,
    settypemoney,
    totals,
    setTotals,
    users,
    setUsers
  } = props;

  const isAdmin = localStorage.getItem("userTokenname") === "admin";

  return [
    { path: '/', element: <Dashboard /> },
    {
      path: '/account',
      element: <Account {...{ loading, setLoading, accounts: belance, money, customers: accounts, setAccounts, user, settings: setting, setsettings }} />
    },
    {
      path: '/transformations',
      element: <Transformation {...{ loading, setLoading, money, accounts, setAccounts, withdraw, belance, setbelance, user, Cash, setCash, settings: setting, setsettings }} />
    },
    {
      path: '/withdraw',
      element: <Withdraw {...{ loading, setLoading, money, accounts, setAccounts, withdraw, belance, setbelance, user, Cash, setCash, settings: setting, setsettings }} />
    },
    {
      path: '/deposite',
      element: <Deposite {...{ loading, setLoading, money, accounts, setAccounts, deposite, belance, setbelance, user, Cash, setCash, settings: setting, setsettings }} />
    },
    {
      path: '/alltransactions',
      element: <AllTransactions {...{ loading, setLoading, money, accounts, setAccounts, deposite: alltransactions, belance, setbelance, user, Cash, setCash, settings: setting, setsettings }} />
    },
    {
      path: '/cach/report',
      element: <ThirdDeptDtable {...{ money, setMoney, loading, setLoading, typemoney, settypemoney, deposite, belance, setbelance, user, Cash, setCash, settings: setting, setsettings, accounts, setAccounts }} />
    },
    {
      path: '/drafttransactions',
      element: <DraftTransaction {...{ loading, setLoading, withdraw: props.draft, belance, Cash, user, setCash, settings: setting, setsettings }} />
    },
    {
      path: '/money_type',
      element: <Money {...{ loading, setLoading, money, setMoney, belance, user, settings: setting }} />
    },
    {
      path: '/setting',
      element: <Setting {...{ loading, setLoading, money, setMoney, belance, user, date1: date, setdate: props.setdate, username, setsettings }} />
    },
    {
      path: '/profile',
      element: <Profile {...{ loading, setLoading, loguser, setLoguser, settings: setting, setsettings }} />
    },
    {
      path: '/cash',
      element: <Cach {...{ loading, setLoading, totals, setTotals, money, setMoney1: setMoney, setLoguser, settings: setting, setsettings }} />
    },
    {
      path: '/manage',
      element: isAdmin ? <Manage {...{ loading, setLoading, users, setUsers, settings: setting, setsettings }} /> : <Navigate to="/" />
    },
    {
      path: '/customers',
      element: <Customers {...{ money, loading, setLoading, accounts, setAccounts, date, user, setting, setsetting: setsettings, belance, setbelance }} />
    },
    {
      path: '/draftcustomer',
      element: <DraftCustomers {...{ money, loading, setLoading, accounts, setAccounts, date, user, settings: setting, setsettings, belance, setbelance }} />
    },
    {
      path: '/draftmoney',
      element: <DraftMoney {...{ loading, setLoading, money, setMoney, belance, user, settings: setting }} />
    },
    {
      path: '/draftaccount',
      element: <DraftAccount {...{ loading, setLoading, accounts: belance, money, customers: accounts, setAccounts, user, settings: setting, setsettings }} />
    },
    {
      path: '/customerreport',
      element: <ReportCustomers Customers={accounts} />
    },
    { path: '/itemtype', element: <ItemType /> },
    { path: '/items', element: <Items /> },
    { path: '/stock', element: <Stock /> },
    { path: '/purchase', element: <Purchase /> },
    { path: '/sell', element: <Sell /> },
    { path: '/sellreturn', element: <SellReturn /> },
    { path: '/purchasereturn', element: <PurchaseReturn /> },
    { path: '/benefitreport', element: <BenefitReport /> },
    { path: '/owneassests', element: <OwnAssets /> },
    { path: '/debit', element: <Debite /> },
    { path: '/credit', element: <Credit /> },
    { path: '/expense', element: <Expenses /> },
    { path: '/draftexpense', element: <DraftExpenses /> },
    { path: '/1469sideoption', element: <Sideoption /> },
    { path: '*', element: <NotFound /> },
  ];
};

export default App1Routes;
