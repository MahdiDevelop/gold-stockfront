import React, { useEffect, useState } from "react";
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
  Grid,
  Avatar,
} from "@mui/material";
import { Download, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import Source from "../Source";
import { getSettings, updateSettingInCache } from "./Redux/settingSlice";
import { useShowAlert } from "../warrper";
import AddInfo from "./forms/AddInfo";
import Reset from "./settings/Reset";
import SidebarShow from "./forms/SidebarShow";
import AddDatabaseform from "./forms/AddDatabase";

const transformOptions = (optionsObj) => {
  return Object.keys(optionsObj).map((key) => ({
    id: key,
    label: key,
    checked: optionsObj[key] === 1,
  }));
};

export default function Setting() {
  const dispatch = useDispatch();
  const showAlert = useShowAlert();
  const [showPopupReset, setShowPopupReset] = useState(false);
  const [AddinfoModel, setAddinfoModel] = useState(false);
  const [AddDatabase, setAddDatabase] = useState(false);
  const [SidebarModel, setSidebarModel] = useState(false);
  const [Settings, Setsettings] = useState([]);

  const { settings, statuss } = useSelector((state) => state.settings);
  const { sidebars } = useSelector((state) => state.sidebars);

  // جهت متن بر اساس زبان انتخاب شده
  const textDirection = Settings[0]?.language === "en" ? "ltr" : "rtl";
  const textAlign = Settings[0]?.language === "en" ? "left" : "right";

  useEffect(() => {
    if (statuss === null) dispatch(getSettings());
  }, []);

  useEffect(() => {
    if (settings.length > 0) Setsettings(settings);
  }, [settings]);

  const handle = (e) => {
    if (Settings.length === 0) return;
    const updatedSettings = { ...Settings[0], [e.target.name]: e.target.value };
    Setsettings([updatedSettings]);
    localStorage.setItem(e.target.name, e.target.value);

    const uploadData = new FormData();
    uploadData.append("_method", "PUT");
    uploadData.append("date", updatedSettings.date);
    uploadData.append("language", updatedSettings.language);

    axios
      .post(`${Source.getAddress()}/api/settings/${Settings[0]?.id}`, uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        dispatch(updateSettingInCache(res.data.settings));
        Setsettings([res.data.settings]);
        showAlert({
          position: "top-end",
          icon: "success",
          title: "Settings updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(() => {
        showAlert({
          position: "top-end",
          icon: "error",
          title: "Something went wrong!",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const handleBackup = async () => {
    try {
      const response = await axios.get(Source.getAddress() + "/api/backup", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.sql");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Backup error:", error);
      alert("Failed to create backup.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        direction: textDirection, // استفاده از جهت پویا
      }}
    >
      <Paper elevation={3} sx={{ p: 3, borderTop: "5px solid #4a5cf2" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign={textAlign}>
          <FormattedMessage id="Settings" />
        </Typography>

        <Table>
          <TableBody>
            {/* Date select */}
            <TableRow>
              <TableCell align={textAlign}>
                <Typography fontWeight="bold">
                  <FormattedMessage id="Date" />
                </Typography>
              </TableCell>
              <TableCell align={textAlign}>
                <Select
                  name="date"
                  value={Settings[0]?.date || ""}
                  onChange={handle}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="English">
                    <FormattedMessage id="English" />
                  </MenuItem>
                  <MenuItem value="Persian">
                    <FormattedMessage id="Dari" />
                  </MenuItem>
                  <MenuItem value="Persian">
                    <FormattedMessage id="Pashto" />
                  </MenuItem>
                </Select>
              </TableCell>
            </TableRow>

            {/* Language select */}
            <TableRow>
              <TableCell align={textAlign}>
                <Typography fontWeight="bold">
                  <FormattedMessage id="Language" />
                </Typography>
              </TableCell>
              <TableCell align={textAlign}>
                <Select
                  name="language"
                  value={Settings[0]?.language || ""}
                  onChange={handle}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="en">
                    <FormattedMessage id="English" />
                  </MenuItem>
                  <MenuItem value="da">
                    <FormattedMessage id="Dari" />
                  </MenuItem>
                  <MenuItem value="pa">
                    <FormattedMessage id="Pashto" />
                  </MenuItem>
                </Select>
              </TableCell>
            </TableRow>

            {/* Backup */}
            <TableRow>
              <TableCell align={textAlign}>
                <Typography fontWeight="bold">
                  <FormattedMessage id="Get Backup" />
                </Typography>
              </TableCell>
              <TableCell align={textAlign}>
                <Button
                  variant="outlined"
                  onClick={handleBackup}
                  startIcon={<Download size={16} />}
                >
                  <FormattedMessage id="Backup" />
                </Button>
              </TableCell>
            </TableRow>

            {/* Organization Info */}
            <TableRow>
              <TableCell align={textAlign} colSpan={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight="bold">
                    <FormattedMessage id="Organisation Info" />
                  </Typography>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => setAddinfoModel(true)}
                  >
                    <FormattedMessage id="Change" />
                  </Button>
                </Box>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={8} sx={{ textAlign }}>
                    <Typography fontWeight="bold">
                      <FormattedMessage id="Company Name" />: {Settings[0]?.company_name || "N/A"}
                    </Typography>
                    <Typography fontWeight="bold">
                      <FormattedMessage id="Address" />: {Settings[0]?.address || "N/A"}
                    </Typography>
                    <Typography fontWeight="bold">
                      <FormattedMessage id="Phone" />: {Settings[0]?.phone || "N/A"}
                    </Typography>
                    <Typography fontWeight="bold">
                      <FormattedMessage id="Email" />: {Settings[0]?.email || "N/A"}
                    </Typography>
                    <Typography mt={1}>
                      <FormattedMessage id="Description" />: {Settings[0]?.description || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Avatar
                      variant="rounded"
                      src={Settings[0]?.company_pic}
                      sx={{ width: 150, height: 150, border: "2px solid #ddd" }}
                      alt="Company"
                    />
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Popups */}
      <SidebarShow
        close={() => setSidebarModel(false)}
        SidebarModel={SidebarModel}
        options={transformOptions(sidebars[0])}
      />
      <Reset addAccountModal={showPopupReset} close={() => setShowPopupReset(false)} />
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