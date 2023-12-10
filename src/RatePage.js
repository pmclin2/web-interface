import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

const RatePage = () => {
  // Mock scores similar to the API response

  const ratingMock = '{ "URL": "github.com/pinojs/pino", "NET_SCORE" : 0.52, "RAMP_UP_SCORE" : 0.5341, "CORRECTNESS_SCORE" : 0.0816, "BUS_FACTOR_SCORE" : 0.9471, "RESPONSIVE_MAINTAINER_SCORE" : 0.2, "LICENSE_SCORE" : 1, "DEPENDENCE_SCORE" : 0.5, "REVIEWED_CODE_SCORE" : 0.3,}';
  const ratings = ['NET SCORE', 'RAMP UP SCORE', 'CORRECTNESS SCORE', 'BUS FACTOR SCORE', 
  'RESPONSIVE MAINTAINER SCORE', 'LICENSE SCORE', 'DEPENDENCE_ CORE', 'REVIEWED CODE SCORE'];

  let ratingArray = [];
  const matches = ratingMock.match(/\d+(\.\d+)?/g);
  if (matches) {
    ratingArray = matches.map(value => Number(value));
  }

  const [urlInput, setURL] = useState('');
  const defaultTheme = createTheme();

  const colors = ['#221f1f', '#242746', '#2e3233', '#263238', '#26324a', '#263264', '#2B3264', '#2E3264'];

  // State to manage the visibility of scores
  const [showScores, setShowScores] = useState(false);

  const handleRateButtonClick = (urlInput) => {
    const urlRegex = /(github\.com|npmjs\.com)\/.+/;

    if (urlRegex.test(urlInput)) {
      // Valid URL format
      setShowScores(true);
    } else {
      // Invalid URL format, show alert
      alert('Please enter a valid GitHub or NPM URL.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Rate Packages
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
          px: 4,
        }}
      >
        {/* Add "Back to Homepage" button */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">
            Back
          </Button>
        </Link>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Rate any packages by entering the package's URL below.
          </Typography>
        </Container>
        <Container maxWidth="lg">
          {/* Text field and Rate button */}
          <TextField
            placeholder="Enter package URL"
            value={urlInput}
            onChange={(e) => setURL(e.target.value)}
            sx={{ mt: 2, mb: 2, mr: 2, width: '100%' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Button variant="contained" onClick={() => handleRateButtonClick(urlInput)} disabled={urlInput.trim().length === 0} sx={{ mt: 2 }}>
              Rate
            </Button>
          </Box>

          {/* Display bars for each score if showScores is true */}
          {showScores && (
            <Box sx={{ mt: 4 }}>
              {ratings.map((ratingName, index) => (
                <div key={ratingName} style={{ marginBottom: '30px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ position: 'relative', backgroundColor: '#ddd', width: '100%', height: '40px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${ratingArray[index] * 100}%`, backgroundColor: colors[index % colors.length], height: '100%' }}></div>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '5px',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        zIndex: 1,
                        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                        // Adjust the text shadow values for the desired outline effect
                      }}>{ratingName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RatePage;