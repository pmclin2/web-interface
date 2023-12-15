import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";

const BASE_URL =
  "https://4n1pa9gczk.execute-api.us-east-1.amazonaws.com/Deployment";

export const RatePage = () => {
  const { packageName } = useParams();
  const [ratingArray, setRatingArray] = useState([]);
  const defaultTheme = createTheme();
  const [errorState, setError] = useState(false);

  const colors = [
    "#221f1f",
    "#242746",
    "#2e3233",
    "#263238",
    "#26324a",
    "#263264",
    "#2B3264",
    "#2E3264",
  ];
  const ratings = [
    "NetScore",
    "RampUp",
    "Correctness",
    "BusFactor",
    "ResponsiveMaintainer",
    "LicenseScore",
    "GoodPinningPractice",
    "PullRequest",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/package/${packageName}/rate`
        );
        console.log(response.data);
        setRatingArray([]);
        const matches = response.match(/\d+(\.\d+)?/g);
        if (matches) {
          setRatingArray(matches.map((value) => Number(value)));
        }
      } catch (error) {
        setError(true);
        console.log(error);
      }
    };

    fetchData();
  }, [packageName]);
 
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar role="heading" position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Ratings
          </Typography>
        </Toolbar>
      </AppBar>
      {errorState ? (
        <Alert severity="error">Error getting ratings</Alert>
      ) : (
        <></>
      )}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 4,
          pb: 6,
          px: 4,
        }}
      >
        {ratingArray.length !== 0 ? (
          <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
              {ratings.map((ratingName, index) => (
                <div key={ratingName} style={{ marginBottom: "30px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "#ddd",
                        width: "100%",
                        height: "40px",
                        borderRadius: "5px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${ratingArray[index] * 100}%`,
                          backgroundColor: colors[index % colors.length],
                          height: "100%",
                        }}
                      ></div>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "5px",
                          transform: "translateY(-50%)",
                          color: "white",
                          zIndex: 1,
                          textShadow:
                            "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                          // Adjust the text shadow values for the desired outline effect
                        }}
                      >
                        {ratingName} • {ratingArray[index].toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Box>
          </Container>
        ) : (
          <div>Loading...</div>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default RatePage;
