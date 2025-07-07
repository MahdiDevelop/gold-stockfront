import axios from "axios";
import React, { useEffect, useState } from "react";
import Source from "../../Source";
import { useShowAlert } from "../../warrper";
import { useSelector, useDispatch } from "react-redux";
import { getSettings, updateSettingInCache } from "../Redux/settingSlice";
import { FormattedMessage } from "react-intl";
import Reset from "../settings/Reset";
import AddInfo from "../forms/AddInfo";
import AddDatabaseform from "../forms/AddDatabase";
import SidebarShow from "../forms/SidebarShow";
// import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { updateSidebarInCache } from "../Redux/sidebarSlice";

const transformOptions = (optionsObj) => {
  return Object.keys(optionsObj).map((key) => ({
    id: key,
    label: key,
    checked: optionsObj[key] === 1,
  }));
};

export default function Sideoption() {
  const showAlert = useShowAlert();
  const [showPopupReset, setShowPopupReset] = useState(false);
  const [AddinfoModel, setAddinfoModel] = useState(false);
  const [AddDatabase, setAddDatabase] = useState(false);
  const [SidebarModel, setSidebarModel] = useState(false);
  const [Settings, Setsettings] = useState([]);
  const { settings, statuss } = useSelector((state) => state.settings);
  // const { sidebars } = useSelector((state) => state.sidebars);
  const dispatch = useDispatch();
  const { sidebars} = useSelector((state) => state.sidebars);
  useEffect(() => {
    if (statuss === null) {
      dispatch(getSettings());
    }
  }, [dispatch, statuss]);

  useEffect(() => {
    if (settings.length > 0) {
      Setsettings(settings);
    }
  }, [settings]);

  const handle = (e) => {
  let data={type:e.target.value};
      data._method='put';
      console.log(data);
    axios.post(Source.getAddress()+'/api/sidebar/1',data,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
  }).then((res)=>{
  console.log(res)
  showAlert({
    position: "top-end",
    icon: "success",
    title: <FormattedMessage id="Transformation has been updated!" />,
    showConfirmButton: false,
    timer: 1000,
  });
  let update={...sidebars[0]};
  update.type=data.type;
  dispatch(updateSidebarInCache(update));
  }).catch((err)=>{
    console.log(err);
    showAlert({
      position: "top-end",
      icon: "error",
      title: <FormattedMessage id="Something went wrong!" />,
      showConfirmButton: false,
      timer: 1000,
    });
  })
  
};

  const handleDatabase = () => setAddDatabase(true);
// console.log(sidebars);
  return (
    <Box
      dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}
      sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 5 }}
    >
      <Paper elevation={3} sx={{ borderTop: "5px solid #4a5cf2", p: 2 }}>
        <h2 className="m-2 fw-bold mb-4"><FormattedMessage id="Settings" /></h2>

        <Table>
          <TableBody>
            {Settings.length > 0 ? (
              <>
                <TableRow>
                  <TableCell align="right">
                    <Typography fontWeight="bold" variant="h6">
                      <FormattedMessage id="System Type" />
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Select
                      name="type"
                      value={sidebars[0].type}
                      onChange={handle}
                      size="small"
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="stock">
                        <FormattedMessage id="Stock Store" />
                      </MenuItem>
                      <MenuItem value="gold">
                        <FormattedMessage id="Gold Store" />
                      </MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>

                {/* Reset To Default */}
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        <FormattedMessage id="Reset To Default" />
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setShowPopupReset(true)}
                      >
                        <FormattedMessage id="Reset" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>

                {/* Upload Database */}
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        <FormattedMessage id="Upload Databse" />
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleDatabase}
                      >
                        <FormattedMessage id="Upload Databse" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
                {/* Sidebar Option */}
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        <FormattedMessage id="Sidebar Option" />
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setSidebarModel(true)}
                      >
                        <FormattedMessage id="Change" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <FormattedMessage id="Loading..." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modals */}
      <SidebarShow
        close={() => setSidebarModel(false)}
        SidebarModel={SidebarModel}
        options={transformOptions(sidebars[0])}
      />

      <Reset
        addAccountModal={showPopupReset}
        close={() => setShowPopupReset(false)}
      />

      <AddInfo
        settings={Settings}
        setsettings={Setsettings}
        close={() => setAddinfoModel(false)}
        addAccountModal={AddinfoModel}
      />

      <AddDatabaseform
        setsettings={Setsettings}
        settings={Settings}
        close={() => setAddDatabase(false)}
        addAccountModal={AddDatabase}
      />
    </Box>
  );
}
