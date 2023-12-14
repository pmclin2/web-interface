import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import axios from "axios";
import RatePage from "./RatePage";
import download from "downloadjs";

const BASE_URL =
  "https://4n1pa9gczk.execute-api.us-east-1.amazonaws.com/Deployment";

const PackageDetailPage = () => {
  const { packageName } = useParams();
  const defaultTheme = createTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState(null);
  const [fileBase64, setFile] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/package/${packageName}`);
        setData(response.data.metadata);
        setFile(response.data.Content);
        console.log(response.data.metadata);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [packageName]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Package Information
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 4,
          pb: 6,
          px: 4,
        }}
      >
        {/* <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">
            Back
          </Button>
        </Link> */}
        <Box sx={{ pt: 4 }}>
          <Typography variant="h2">
            {data ? data.Name : "Loading..."}
          </Typography>
          <Typography variant="h5">
            {data ? data.Version : "Loading..."} • Public •{" "}
            {data ? data.ID : "Loading..."}
          </Typography>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Readme" />
            <Tab label="Rating" />
            <Tab label="Download" />
            <Tab label="Delete" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <div>
                {data && data.Readme && (
                  <ReactMarkdown remarkPlugins={[gfm]}>
                    {data.Readme}
                  </ReactMarkdown>
                )}
              </div>
            )}
            {selectedTab === 1 && <RatePage />}
            {selectedTab === 2 && (
              <Button
                onClick={download(
                  fileBase64,
                  `${data.Name}.zip`,
                  "application/zip"
                )}
              ></Button>
            )}
            {selectedTab === 3 && (
              <div>
                <Link to="/home">
                  <Button variant="contained">Temp Delete</Button>
                </Link>
              </div>
            )}
            {/* Add more conditional rendering for other tabs */}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PackageDetailPage;
