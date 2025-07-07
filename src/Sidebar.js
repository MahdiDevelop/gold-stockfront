import React, { useState, useEffect,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getSettings } from "./pages/Redux/settingSlice.js";
import { Collapse, List, ListItem, ListItemButton, ListItemText, Box, styled, Tooltip, Menu, MenuItem } from "@mui/material";
import Source from "./Source";
import { createTheme, ThemeProvider } from '@mui/material/styles';// Import your icons (replace with your actual imports)
import { ChevronDown, ChevronUp, Wallet, PlusCircle, MinusCircle, CreditCard } from 'lucide-react';
import { CircleStop } from "lucide-react";
import { getSidebars } from "./pages/Redux/sidebarSlice.js";
import { NavLink } from 'react-router-dom';
// Custom MUI styles
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: "240px",
  height: "100vh",
  overflowY: "auto",
  transition: "width 0.3s ease",
  direction: localStorage.getItem("language") === "en" ? "rtl" : "ltr",
  position: "fixed",
  backgroundColor: "#F9F9F9",
  fontFamily:localStorage.getItem("language") !== "en" && "'CustomFont1', sans-serif !important",
'*': {
    fontFamily:localStorage.getItem("language") !== "en" && "'CustomFont1', sans-serif !important",
  },  
  // تنظیمات اسکرولبار برای هر دو حالت
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
  
  // تنظیمات خاص برای حالت RTL
  "&[dir='rtl']": {
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    borderLeft: "1px solid #e0e0e0",
    borderRight: "none",
  },
  
  // تنظیمات خاص برای حالت LTR
  "&[dir='ltr']": {
    borderRight: "1px solid #e0e0e0",
    borderLeft: "none",
  },
  
  "&.collapsed": {
    width: "64px",
  },
  
  [theme.breakpoints.down('sm')]: {
    "&.expanded": {
      width: "280px !important",
    },
  },
}));

const ContentWrapper = styled(Box)({
  direction: "ltr", // Reset direction for content
});

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  height: "52px",
  color: "white",
  fontWeight: "bold",
  backgroundColor: "#F9F9F9",
  zIndex: 1000,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  direction: localStorage.getItem("language") === "en" ? "ltr" : "rtl",
  display:'flex',
  justifyContent:'space-between',
  textAlign: localStorage.getItem("language") === "en" ? "left" : "right",
  // margin: theme.spacing(0.5, 1),
  "&.Mui-selected": {
    backgroundColor: '#4D859C',
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));
const TooltipListItem = ({ title, children, isToggled, isParent = false }) => {
  if (isToggled && title) {
    return (
      <Tooltip 
        title={title} 
        placement="right" 
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: isParent ? '#4D859C' : '#555',
              color: 'white',
              fontSize: '0.875rem',
              fontFamily:localStorage.getItem("language") !== "en" && "'CustomFont1', sans-serif !important",
              '*': {
                  fontFamily:localStorage.getItem("language") !== "en" && "'CustomFont1', sans-serif !important",
                },  
            }
          }
        }}
      >
        {children}
      </Tooltip>
    );
  }
  return children;
};

export default function Sidebar({ isToggled}) {
  const dispatch = useDispatch();
  const { settings, statuss } = useSelector((state) => state.settings);
  const { sidebars} = useSelector((state) => state.sidebars);
  // State for managing collapses
   const icons = useMemo(() => ({
    Setting_pic: require("./assets/icon/settings.png"),
    Customer_pic: require("./assets/icon/customers_pic.png"),
    OwnerAssets_pic: require("./assets/icon/assets.svg").default,
    reportCustomer: require("./assets/icon/reportCustomer.png"),
    ExpensePic: require("./assets/icon/expense.svg").default,
    Draft_Expense: require("./assets/icon/Draft_Expense.svg").default,
    Deposite_pic: require("./assets/icon/deposite.png"),
    Benefit: require("./assets/icon/benefit.png"),
    Withdraw_pic: require("./assets/icon/withdraw.png"),
    CustomerReport: require("./assets/icon/CustomerReport.png"),
    Debitpic: require("./assets/icon/Debit.png"),
    Creditpic: require("./assets/icon/credit.png"),
    DraftCustomers: require("./assets/icon/DraftCustomer.png"),
    All_Transactions: require("./assets/icon/all_transaction.png"),
    DraftAccount: require("./assets/icon/DraftAccount.png"),
    DraftTransaction: require("./assets/icon/DraftTransaction.png"),
    DraftMoney: require("./assets/icon/DraftMoney.png"),
    Cash_pic: require("./assets/icon/money.png"),
    ItemsPic: require("./assets/icon/items.png"),
    ItemPic: require("./assets/icon/item.png"),
    StockPic: require("./assets/icon/stock.png"),
    MoneyType: require("./assets/icon/moneytype.png"),
    PurchasePic: require("./assets/icon/purchase.png"),
    SellPic: require("./assets/icon/sell.png"),
    Down: require("./assets/icon/down.png"),
    MenuIcon: require("./assets/icon/menuu.png"),
    Business: require("./assets/icon/Business.png"),
    Logout: require("./assets/icon/logout.png"),
    Manager: require("./assets/icon/manager.png"),
    MoneyPic: require("./assets/icon/money.png"),
    DashboardPic: require("./assets/icon/dashboard.png"),
    AccountPic: require("./assets/icon/accounts.png"),
    Draft_pic: require("./assets/icon/draft.png"),
    ItemTypePic: require("./assets/icon/itemtype.png"),
    Transformation: require("./assets/icon/transformation.png"),
    Retrunpurchasepic: require("./assets/icon/returnpurchase.png"),
    Retrunsellpic: require("./assets/icon/returnsell.png"),
    Change: require("./assets/icon/changepass.png"),
    expand: require("./assets/icon/down.png"),
    alldraft: require("./assets/icon/alldraft.png")
  }), []);
  const [openTransactions, setOpenTransactions] = useState(
    localStorage.getItem("transactionCollapseState") === "false" ? true : false
  );
  const [openReports, setOpenReports] = useState(
    localStorage.getItem("ReportCollapseState") === "false" ? true : false
  );
  const [openStock, setOpenStock] = useState(
    localStorage.getItem("StockCollapseState") === "false" ? true : false
  );
  const [openDrafts, setOpenDrafts] = useState(
    localStorage.getItem("draftCollapseState") === "false" ? true : false
  );

  // State for dropdown menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);

  const handleMenuOpen = (event, menuType) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menuType);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  useEffect(() => {
    if (statuss !== "succeeded" && !settings) {
      dispatch(getSettings());
    }
  }, [dispatch, statuss]);

  // Helper functions for menu toggles
  const handleTransactionToggle = () => {
    if (isToggled) {
      return;
    }
    const newState = !openTransactions;
    setOpenTransactions(newState);
    localStorage.setItem("transactionCollapseState", !newState);
  };

  const handleReportToggle = () => {
    if (isToggled) {
      return;
    }
    const newState = !openReports;
    setOpenReports(newState);
    localStorage.setItem("ReportCollapseState", !newState);
  };

  const handleStockToggle = () => {
    if (isToggled) {
      return;
    }
    const newState = !openStock;
    setOpenStock(newState);
    localStorage.setItem("StockCollapseState", !newState);
  };

  const handleDraftToggle = () => {
    if (isToggled) {
      return;
    }
    const newState = !openDrafts;
    setOpenDrafts(newState);
    localStorage.setItem("draftCollapseState", !newState);
  };

  // Close functions
  const Close = () => {
    if (window.innerWidth <= 768) {
      // handleToggle();
    }
  };

  const CloseTransaction = () => setOpenTransactions(false);
  const CloseReport = () => setOpenReports(false);
  const CloseStock = () => setOpenStock(false);
  const CloseDraft = () => setOpenDrafts(false);
  const CloseforReport = () => {
    localStorage.setItem("ReportExpand", true);
    localStorage.setItem("collapseReport", false);
  };

  const TransactionToggleOpen = () => {
    localStorage.setItem("transactionExpand", true);
    localStorage.setItem("collapseTransaction", false);
  };

  const StockToggleOpen = () => {
    localStorage.setItem("StockExpand", true);
    localStorage.setItem("collapseStock", false);
  };

  const DraftToggleOpen = () => {
    localStorage.setItem("draftExpand", true);
    localStorage.setItem("collapseDraft", false);
  };

  // Menu items for dropdown
  const transactionMenuItems = [
    { 
      id: "Transformation", 
      href: "/transformations", 
      icon: icons.Transformation,
      onClick: () => {
        localStorage.setItem("transactionExpand", false);
        localStorage.setItem("collapseTransaction", true);
        TransactionToggleOpen();
        CloseDraft();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Deposite", 
      href: "/deposite", 
      icon: icons.Deposite_pic,
      onClick: () => {
        localStorage.setItem("transactionExpand", false);
        localStorage.setItem("collapseTransaction", true);
        TransactionToggleOpen();
        CloseDraft();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Withdraw", 
      href: "/withdraw", 
      icon: icons.Withdraw_pic,
      onClick: () => {
        TransactionToggleOpen();
        CloseDraft();
        Close();
        handleMenuClose();
        }
    }
  ];

  const reportMenuItems = [
    { 
          id: "Owne Assets", 
          href: "/owneassests", 
          icon: icons.OwnerAssets_pic,
          onClick: () => {
            localStorage.setItem("ReportExpand", false);
            localStorage.setItem("collapseReport", true);
            CloseDraft();
            CloseforReport();
            Close();
            handleMenuClose();
          }
        },
    { 
      id: "Report Customer", 
      href: "/customerreport", 
      icon: icons.reportCustomer,
      onClick: () => {
        localStorage.setItem("ReportExpand", false);
        localStorage.setItem("collapseReport", true);
        CloseDraft();
        CloseforReport();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Debit", 
      href: "/debit", 
      icon: icons.Debitpic,
      onClick: () => {
        localStorage.setItem("ReportExpand", false);
        localStorage.setItem("collapseReport", true);
        CloseDraft();
        CloseforReport();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Credit", 
      href: "/credit", 
      icon: icons.Creditpic,
      onClick: () => {
        localStorage.setItem("ReportExpand", false);
        localStorage.setItem("collapseReport", true);
        CloseDraft();
        CloseforReport();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "benefit report", 
      href: "/benefitreport", 
      icon: icons.Benefit,
      onClick: () => {
        CloseDraft();
        CloseforReport();
        Close();
        handleMenuClose();
      }
    }
  ];

  const stockMenuItems = [
    { 
      id: sidebars[0].type==='stock' ? "Item Type" : "Gold Type", 
      href: "/itemtype", 
      icon: icons.ItemTypePic,
      onClick: () => {
        localStorage.setItem("StockExpand", false);
        localStorage.setItem("collapseStock", true);
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Items", 
      href: "/items", 
      icon: icons.ItemPic,
      onClick: () => {
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Stock", 
      href: "/stock", 
      icon: icons.StockPic,
      onClick: () => {
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Purchase", 
      href: "/purchase", 
      icon: icons.PurchasePic,
      onClick: () => {
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Sell", 
      href: "/sell", 
      icon: icons.SellPic,
      onClick: () => {
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Purchase Return", 
      href: "/purchasereturn", 
      icon: icons.Retrunpurchasepic,
      onClick: () => {
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Sell Return", 
      href: "/sellreturn", 
      icon: icons.Retrunsellpic,
      onClick: () => {
        StockToggleOpen();
        Close();
        handleMenuClose();
      }
    }
  ];

  const draftMenuItems = [
    { 
      id: "Draft Expense", 
      href: "/draftexpense", 
      icon: icons.Draft_Expense,
      onClick: () => {
        DraftToggleOpen();
        CloseTransaction();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Draft Transactions", 
      href: "/drafttransactions", 
      icon: icons.DraftTransaction,
      onClick: () => {
        DraftToggleOpen();
        CloseTransaction();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Draft Customers", 
      href: "/draftcustomer", 
      icon: icons.DraftCustomers,
      onClick: () => {
        DraftToggleOpen();
        CloseTransaction();
        Close();
        handleMenuClose();
      }
    },
    { 
      id: "Draft Currency", 
      href: "/draftmoney", 
      icon: icons.DraftMoney,
      onClick: () => {
        DraftToggleOpen();
        CloseTransaction();
        Close();
        handleMenuClose();
      }
    },
    ...(localStorage.getItem("userTokenname") === "admin" ? [{
      id: "Draft Accounts", 
      href: "/draftaccount", 
      icon: icons.DraftAccount,
      onClick: () => {
        DraftToggleOpen();
        CloseTransaction();
        Close();
        handleMenuClose();
      }
    }] : [])
  ];
  const theme = createTheme({
    typography: {
      fontFamily: "'CustomFont1', sans-serif",
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontFamily: "'CustomFont1', sans-serif",
            fontSize: '0.875rem'
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontFamily: "'CustomFont1', sans-serif"
          }
        }
      }
    }
  });
  return (
    <ThemeProvider theme={theme}>
    <SidebarContainer  className={isToggled ? "collapsed" : "" }>
      <ContentWrapper>
        <LogoContainer className="text-dark">
          {!isToggled && (
            <div className="d-flex justify-between w-100" >
                     <NavLink to="/" className="w-100 d-flex" style={{textDecoration:'none'}}>
              {window.innerWidth > 768 && settings[0]?.company_name}
            </NavLink>
              <button
                className="btn p-0 m-0 mb-6 w-25 d-block d-md-none"
                // onClick={handleToggle}
                id="sidebar-toggle"
                type="button"
                style={{ 
                  marginLeft: localStorage.getItem('language') === 'en' ? '0' : 'auto',
                  marginRight: localStorage.getItem('language') === 'en' ? 'auto' : '0',
                }}
              >
                {/* <img src={Menu} style={{ width: "30px" }} className="p-0 m-0" /> */}
              </button>
            </div>
          )}
        </LogoContainer>

        <List component="nav">
          {/* logo */}
          <ListItem disablePadding>
            <Tooltip title="Logo" placement="right"  arrow disableHoverListener={!isToggled}>
              <StyledListItemButton
                href="/"
                selected={false}
                onClick={Close}
              >
                <img
                  src={Source.getAddress()+'/api/getImage/logo.png'}
                  style={{ width: "100%", height: "100%", borderRadius: " %" }}
                  alt="logo"
                />
              </StyledListItemButton>
            </Tooltip>
          </ListItem>

          {/* Dashboard */}
        {sidebars[0].Dashboard===1 &&
        <ListItem disablePadding>
          <Tooltip  title={<FormattedMessage id="Dashboard" />} placement="right" arrow disableHoverListener={!isToggled}>
            <StyledListItemButton
              href="/"
              selected={window.location.pathname === "/"}
              onClick={Close}
              // className="afgFont"
            >
              <img src={icons.DashboardPic} alt="" style={{width: "30px", height: "30px"}} className="navhome" />
              {!isToggled && (
                <ListItemText 
              className="afgFont"
                
                primary={<FormattedMessage id="Dashboard" />} />
              )}
            </StyledListItemButton>
          </Tooltip>
        </ListItem>
}
          {/* Customers */}
          {sidebars[0].Customers===1 && <ListItem disablePadding>
            <Tooltip title={<FormattedMessage id="Customers" />} placement="right" arrow disableHoverListener={!isToggled}>
              <StyledListItemButton
                href="/customers"
                selected={window.location.pathname === "/customers"}
                onClick={Close}
              >
                <img src={icons.Customer_pic} alt="" className="navhome" style={{width: "30px", height: "30px"}}/>
                {!isToggled && (
                  <ListItemText primary={<FormattedMessage id="Customers" />} />
                )}
              </StyledListItemButton>
            </Tooltip>
          </ListItem>}

    {/* Accounts */}
    {sidebars[0].Accounts===1 &&
          <ListItem disablePadding>
            <Tooltip title={<FormattedMessage id="Accounts" />} placement="right" arrow disableHoverListener={!isToggled}>
              <StyledListItemButton
                href="/account"
                selected={window.location.pathname === "/account"}
                onClick={Close}
              >
                <img src={icons.AccountPic} alt="" className="navhome" style={{width: "30px", height: "30px"}}/>
                {!isToggled && (
                  <ListItemText primary={<FormattedMessage id="Accounts" />} />
                )}
              </StyledListItemButton>
            </Tooltip>
          </ListItem>
}

          {/* Transactions */}

          {sidebars[0].Transactions_Group===1 &&
          <ListItem disablePadding>
            <TooltipListItem 
              title={<FormattedMessage id="Transactions" />} 
              isToggled={isToggled}
              isParent={true}
            >
              <StyledListItemButton
                onClick={(e) => isToggled ? handleMenuOpen(e, 'transactions') : handleTransactionToggle()}
                selected={openTransactions}
              >
                <img src={icons.Business} alt="" className="navhome" style={{width: "30px", height: "30px"}}/>
                {!isToggled && (
                  <>
                    <ListItemText
                className="afgFont"
                    primary={<FormattedMessage id="Transactions" />} />
                    {openTransactions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </>
                )}
              </StyledListItemButton>
            </TooltipListItem>
          </ListItem>}
          {/* Transactions Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={currentMenu === 'transactions'}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {transactionMenuItems.map((item) => {
  if (sidebars[0][item.id]===0 ) return null;
  
  return (
    <MenuItem 
      key={item.id}
      onClick={item.onClick}
      href={item.href}
      component="a"
      className="afgFont"
    >
      <img src={item.icon} alt="" style={{ width: "30px", height: "30px" }} />
      <FormattedMessage id={item.id} />
    </MenuItem>
  );
})}
          </Menu>

          <Collapse in={openTransactions && !isToggled} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            {transactionMenuItems.map((item) => {
  // Skip rendering if sidebars[0][item.id] is 0
  if (sidebars[0][item.id] === 0) {
    return null;
  }

  return (
    <ListItem disablePadding key={item.id}>
      <Tooltip 
        title={<FormattedMessage id={item.id} />} 
        placement="right" 
        arrow 
        disableHoverListener={!isToggled}
      >
        <StyledListItemButton
          href={item.href}
          selected={window.location.pathname === item.href}
          sx={{ pl: 4 }}
          onClick={item.onClick}
        >
          <img 
            src={item.icon} 
            alt="" 
            style={{ width: "1.8rem" }} 
          />
          {!isToggled && (
            <ListItemText primary={<FormattedMessage id={item.id} />} />
          )}
        </StyledListItemButton>
      </Tooltip>
    </ListItem>
  );
})}        </List>
          </Collapse>

   {/* Stock Dropdown Menu */}
          {/* Stock Section */}
          {sidebars[0].Items===1 &&
          <ListItem disablePadding>
            <TooltipListItem 
              title={<FormattedMessage id="Items" />} 
              isToggled={isToggled}
              isParent={true}
            >
              <StyledListItemButton
                onClick={(e) => isToggled ? handleMenuOpen(e, 'stock') : handleStockToggle()}
                selected={openStock}
              >
                <img src={icons.ItemsPic} alt="" className="navhome" style={{ width: "30px", height: "30px" }} />
                {!isToggled && (
                  <>
                    <ListItemText primary={<FormattedMessage id="Items" />} />
                    {openStock ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </>
                )}
              </StyledListItemButton>
            </TooltipListItem>
          </ListItem>
          }
       
          <Menu
            anchorEl={anchorEl}
            open={currentMenu === 'stock'}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {stockMenuItems.map((item) => {
                const sidebarKey = item.id.replace(/ /g, "_");
                // Skip rendering if sidebars[0][item.id] is 0
                // console.log(sidebars[0][item.id]===1);
                if (sidebars[0][sidebarKey] === 0 ) return null;
                return (
              <MenuItem 
                key={item.id}
                onClick={item.onClick}
                href={item.href}
                component="a"
              >
                <img src={item.icon} alt="" style={{ width: "30px", marginLeft: "8px" }} />
                <FormattedMessage id={item.id} />
              </MenuItem>
)            })}
          </Menu>

          <Collapse in={openStock && !isToggled} timeout="auto" unmountOnExit>
            <List component="div" disablePadding style={{ maxHeight: "450px", overflowY: "auto" }}>
              {stockMenuItems.map((item) => {
                const sidebarKey = item.id.replace(/_/g, " ");
                // Skip rendering if sidebars[0][item.id] is 0
                if (sidebars[0][sidebarKey] === 0) return null;
                return(
              <ListItem disablePadding key={item.id}>
                  <Tooltip title={<FormattedMessage id={item.id} />} placement="right" arrow disableHoverListener={!isToggled}>
                    <StyledListItemButton
                      href={item.href}
                      selected={window.location.pathname === item.href}
                      sx={{ pl: 4 }}
                      onClick={item.onClick}
                    >
                      <img src={item.icon} alt="" className="navhome" style={{width:"1.8rem"}}/>
                      {!isToggled && (
                        <ListItemText primary={<FormattedMessage id={item.id} />} />
                      )}
                    </StyledListItemButton>
                  </Tooltip>
                </ListItem>
             ) })}
            </List>
          </Collapse>
{/* items */}
          

        <ListItem disablePadding>
          <Tooltip  title={<FormattedMessage id="Expenses" />} placement="right" arrow disableHoverListener={!isToggled}>
            <StyledListItemButton
              href="/expense"
              selected={window.location.pathname === "/expense"}
              onClick={Close}
              // className="afgFont"
            >
              <img src={icons.ExpensePic} alt="" style={{width: "30px", height: "30px"}} className="navhome" />
              {!isToggled && (
                <ListItemText 
              className="afgFont"
                
                primary={<FormattedMessage id="Expenses" />} />
              )}
            </StyledListItemButton>
          </Tooltip>
        </ListItem>


          {/* Reports */}
      {sidebars[0].Reports===1 &&    <ListItem disablePadding>
            <TooltipListItem 
              title={<FormattedMessage id="Reports" />} 
              isToggled={isToggled}
              isParent={true}
            >
              <StyledListItemButton
                onClick={(e) => isToggled ? handleMenuOpen(e, 'reports') : handleReportToggle()}
                selected={openReports}
              >
                <img src={icons.CustomerReport} alt=""  style={{width: "30px", height: "30px"}} />
                {!isToggled && (
                  <>
                    <ListItemText primary={<FormattedMessage id="Reports" />} />
                    {openReports ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </>
                )}
              </StyledListItemButton>
            </TooltipListItem>
          </ListItem>
      }    
          {/* Reports Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={currentMenu === 'reports'}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {reportMenuItems.map((item) => {
              const sidebarKey = item.id.replace(/ /g, "_");
              // Skip rendering if sidebars[0][item.id] is 0
              if (sidebars[0][sidebarKey] === 0) return null;
              return(            
              <MenuItem 
                key={item.id}
                onClick={item.onClick}
                href={item.href}
                component="a"
              >
                <img src={item.icon} alt="" style={{ width: "30px", height: "30px" }} />
                <FormattedMessage id={item.id} />
              </MenuItem>
            )})}
          </Menu>
          <Collapse in={openReports && !isToggled} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
  {reportMenuItems.map((item) => {
  // Replace underscores with spaces for the sidebar check
  const sidebarKey = item.id.replace(/ /g, "_");
  // Skip rendering if sidebars[0][item.id] is 0
  if (sidebars[0][sidebarKey] === 0) return null;
  return (
    <ListItem disablePadding key={item.id}>
      <Tooltip 
        title={<FormattedMessage id={item.id} />}
        placement="right"
        arrow
        disableHoverListener={!isToggled}
      >
        <StyledListItemButton
          href={item.href}
          selected={window.location.pathname === item.href}
          sx={{ pl: 4 }}
          onClick={item.onClick}
        >
          <img 
            src={item.icon} 
            alt=""
            className="navhome"
            style={{ width: "30px", height: "30px" }}
          />
          {!isToggled && (
            <ListItemText primary={<FormattedMessage id={item.id} />} />
          )}
        </StyledListItemButton>
      </Tooltip>
    </ListItem>
  );
})}
            </List>
          </Collapse>
 

          {/* Cash */}
          {sidebars[0].Cash===1 &&   <ListItem disablePadding>
            <Tooltip title={<FormattedMessage id="Cash" />} placement="right" arrow disableHoverListener={!isToggled}>
              <StyledListItemButton
                href="/cash"
                selected={window.location.pathname === "/cash"}
                onClick={Close}
              >
                <img src={icons.Cash_pic} alt="" className="navhome" style={{width: "30px", height: "30px"}}/>
                {!isToggled && (
                  <ListItemText primary={<FormattedMessage id="Cash" />} />
                )}
              </StyledListItemButton>
            </Tooltip>
          </ListItem>
}
     
          {/* Currency */}
          {sidebars[0].Currency===1 &&
          <ListItem disablePadding>
            <Tooltip title={<FormattedMessage id="Currency" />} placement="right" arrow disableHoverListener={!isToggled}>
              <StyledListItemButton
                href="/money_type"
                selected={window.location.pathname === "/money_type"}
                onClick={Close}
              >
                <img src={icons.MoneyType} alt="" className="navhome" style={{ width: "30px", height: "30px" }} />
                {!isToggled && (
                  <ListItemText primary={<FormattedMessage id="Currency" />} />
                )}
              </StyledListItemButton>
            </Tooltip>
          </ListItem>}

          {/* Drafts Section */}
          {sidebars[0].All_Draft_Group===1 &&
          <ListItem disablePadding>
            <TooltipListItem 
              title={<FormattedMessage id="All Draft" />} 
              isToggled={isToggled}
              isParent={true}
            >
              <StyledListItemButton
                onClick={(e) => isToggled ? handleMenuOpen(e, 'drafts') : handleDraftToggle()}
                selected={openDrafts}
              >
                <img src={icons.alldraft} alt="" className="navhome" style={{ width: "30px", height: "30px" }} />
                {!isToggled && (
                  <>
                    <ListItemText primary={<FormattedMessage id="All Draft" />} />
                    {openDrafts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </>
                )}
              </StyledListItemButton>
            </TooltipListItem>
          </ListItem>
          }
          {/* Drafts Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={currentMenu === 'drafts'}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {draftMenuItems.map((item) => {
                const sidebarKey = item.id.replace(/ /g, "_");
                // Skip rendering if sidebars[0][item.id] is 0
                if (sidebars[0][sidebarKey] === 0)
                  { 
                    return null;
                  }
                return (
                    <MenuItem 
                      key={item.id}
                      onClick={item.onClick}
                      href={item.href}
                      component="a"
                    >
                      <img src={item.icon} alt="" style={{ width: "30px", marginLeft: "8px",height:'30px' }} />
                      <FormattedMessage id={item.id} />
                    </MenuItem>)
            })}
          </Menu>

          <Collapse in={openDrafts && !isToggled} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {draftMenuItems.map((item) => {
                  const sidebarKey = item.id.replace(/ /g, "_");
                  // Skip rendering if sidebars[0][item.id] is 0
                  if (sidebars[0][sidebarKey] === 0) 
                    {
                      return null;
                    }
                    return(
                <ListItem disablePadding key={item.id}>
                  <Tooltip title={<FormattedMessage id={item.id} />} placement="right" arrow disableHoverListener={!isToggled}>
                    <StyledListItemButton
                      href={item.href}
                      selected={window.location.pathname === item.href}
                      sx={{ pl: 4 }}
                      onClick={item.onClick}
                    >
                      <img src={item.icon} alt="" className="navhome" style={{width:"1.8rem"}}/>
                      {!isToggled && (
                        <ListItemText primary={<FormattedMessage id={item.id} />} />
                      )}
                    </StyledListItemButton>
                  </Tooltip>
                </ListItem>
             )})}
            </List>
          </Collapse>

          {/* Settings */}
          {sidebars[0].Settings===1&&
          <ListItem disablePadding>
            <Tooltip title={<FormattedMessage id="Settings" />} placement="right" arrow disableHoverListener={!isToggled}>
              <StyledListItemButton
                href="/setting"
                selected={window.location.pathname === "/setting"}
                onClick={Close}
              >
                <img src={icons.Setting_pic} alt="" className="navhome" style={{width: "30px", height: "30px"}}/>
                {!isToggled && (
                  <ListItemText primary={<FormattedMessage id="Settings" />} />
                )}
              </StyledListItemButton>
            </Tooltip>
          </ListItem>}
        </List>
      </ContentWrapper>
    </SidebarContainer>
    </ThemeProvider>
  );
}