import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';

const UpdatePage = () => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const defaultTheme = createTheme();
  let fileInputRef = useRef(null);
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB();

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    // Sanitation of input same as upload page, if youre doing this first go check my comments in upload page, same place

    if (droppedFile && droppedFile.type === 'application/zip'){
      addFile(droppedFile);
    } else {
      alert('Please provide a valid zip file.');
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Input Sanitization, same as above, 'slectedFile' is the file

    if (selectedFile && selectedFile.type === 'application/zip'){
      addFile(selectedFile);
    } else {
      alert('Please provide a valid zip file.');
    }
  }

  const addFile = (newFile) => {
    if (newFile) {
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setFileName(newFile.name);
    }
  }

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    // Reset the file input value to allow re-selection of the same file
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the input value
    }
  }

  AWS.config.update({
    accessKeyId: sessionStorage.getItem('accessKey'),
    secretAccessKey: sessionStorage.getItem('secretAccessKey'),
    region: 'us-east-1'
  });

  const handleFileUpload = () => {
    // Handle the upload logic for all files in the 'files' array
    if (files.length > 0) {
    //   for (let i = 0; i < files.length; i++) {
    //     const item = {
    //       TableName: 'registry',
    //       Item: {
    //         'id': { S: fileDescriptions[i].toLowerCase() },
    //         'name': { S: (fileDescriptions[i] === '' ? fileName : fileDescriptions[i]) },
    //         'version': { S: '1.0' },
    //         'ratings': { S: '{ "URL": "github.com/pinojs/pino", "NET_SCORE" : 0.52, "RAMP_UP_SCORE" : 0.5341, "CORRECTNESS_SCORE" : 0.0816, "BUS_FACTOR_SCORE" : 0.9471, "RESPONSIVE_MAINTAINER_SCORE" : 0.2, "LICENSE_SCORE" : 1, "DEPENDENCE_SCORE" : 0.5, "REVIEWED_CODE_SCORE" : 0.3,}' } 
    //       }
    //     };

    //     dynamodb.putItem(item, (err, data) => {
    //       if (err) {
    //         console.error('Error adding item:', err);
    //       } else {
    //         console.log('Item added successfully:', data);
    //       }
    //     });
    //   }

      // Clear the files array and file name after upload
      setFiles([]);
      setFileName('');
    } else {
      alert('Please provide at least one valid file.');
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Update Package
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
          px: 4
        }}
      >
        {/* Add a button to go back to the homepage */}
        <Link to="/">
            <Button variant="outlined">
              Back
            </Button>
        </Link>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Drag and drop or select a zip file of the package(s) you would like to update
            that alreay exist in the registry. You may update one or multiple files at once.
          </Typography>
        </Container>
        <Container maxWidth="xl">
          {/* Display the list of files above the drag-and-drop area */}
          {files.length > 0 && (
            <ul>
              {files.length > 0 && (
                <Grid container spacing={2}>
                  {files.map((file, index) => (
                    <Grid item xs={10} key={index}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={2}>
                          {file.name}
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={() => removeFile(index)}>Remove</Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              )}
            </ul>
          )}

          <div
            className="upload-box"
            onDrop={handleFileDrop}
            onDragOver={(event) => event.preventDefault()}
            style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}
          >
            <Typography variant="body1" gutterBottom>
              Drag your zipped package file here
            </Typography>
            <Typography variant="body1" gutterBottom>
              or
            </Typography>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          <Box sx={{ pt: 4 }}>
            <Button onClick={handleFileUpload} disabled={files.length === 0} variant="contained">
              Upload 
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default UpdatePage;
