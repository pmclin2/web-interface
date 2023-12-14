import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Alert } from "@mui/material";
import axios from "axios";

const BASE_URL =
  "https://4n1pa9gczk.execute-api.us-east-1.amazonaws.com/Deployment";

const HomePage = () => {
  const defaultTheme = createTheme();
  const [data, setData] = useState({
    Items: [
      {
        id: { S: "fecha" },
        name: { S: "fecha" },
      },
      {
        id: { S: "easy-math-module" },
        name: { S: "Easy math" },
      },
    ],
  });
  const [accessKey, setAccessKey] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [errorState, setError] = useState(false);

  const handleLogout = () => {
    setAccessKey("");
    setSecretAccessKey("");

    sessionStorage.setItem("accessKey", accessKey);
    sessionStorage.setItem("secretAccessKey", secretAccessKey);
  };


  useEffect(() => {
    // axios
    //   .get(`${BASE_URL}/packages`)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     setError(true);
    //     console.log(error);
    //   });
    // temp until /packages is done
  }, []);

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <AppBar position="relative">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" color="inherit" noWrap>
              ACME Corporation Package Registry
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              component={Link}
              to="/"
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <main>
          <a href="#packageList" tabIndex="0" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
            Skip to Package List
          </a>
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="lg">
              <Stack
                sx={{ pt: 0 }}
                direction="row"
                spacing={4}
                justifyContent="center"
              >
                <Link to="/upload">
                  <Button variant="outlined">Upload</Button>
                </Link>
                <Link to="/update">
                  <Button variant="outlined">Update</Button>
                </Link>
                <Link to="/search">
                  <Button variant="outlined">Search</Button>
                </Link>
                <Link to="/rate">
                  <Button variant="outlined">Rate</Button>
                </Link>
                <Button role="none" variant="outlined">Reset Registry</Button>
              </Stack>
            </Container>
          </Box>
          <Container role="none" href="#packageList" maxwidth="lg">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Package Directory
            </Typography>
            {errorState ? (
              <Alert severity="error">Error getting packages from registry</Alert>
            ) : (
              <></>
            )}
            <List>
              {data &&
                data.Items &&
                data.Items.length > 0 &&
                data.Items.map((item) => (
                  <ListItemButton
                    key={item.id.S} // Assuming 'id' is a string attribute (use .S for string type)
                    component={Link}
                    to={`/package/${item.id.S}`} // Assuming 'name' is a string attribute
                    divider
                  >
                    <ListItemText primary={`${item.name.S}`} />{" "}
                    {/* Display name */}
                  </ListItemButton>
                ))}
            </List>
          </Container>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default HomePage;
