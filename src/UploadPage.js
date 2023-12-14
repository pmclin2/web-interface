import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import axios from "axios";

const BASE_URL =
  "https://4n1pa9gczk.execute-api.us-east-1.amazonaws.com/Deployment";

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [fileDescriptions, setFileDescriptions] = useState([]);
  const defaultTheme = createTheme();
  let fileInputRef = useRef(null);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/zip") {
      addFile(droppedFile);
    } else {
      alert("Please provide a valid zip file.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/zip") {
      addFile(selectedFile);
    } else {
      alert("Please provide a valid zip file.");
    }
  };

  const addFile = (newFile) => {
    if (newFile) {
      setFiles((prevFiles) => [...prevFiles, newFile]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedDescriptions = [...fileDescriptions];
    updatedDescriptions.splice(index, 1);
    setFileDescriptions(updatedDescriptions);

    // Reset the file input value to allow re-selection of the same file
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  };

  const handleFileDescriptionChange = (index, description) => {
    const updatedDescriptions = [...fileDescriptions];
    updatedDescriptions[index] = description;
    setFileDescriptions(updatedDescriptions);
  };

  const handleFileUpload = () => {
    // Handle the upload logic for all files in the 'files' array

    const postData = async (base64Data) => {
      /*const response =*/ await axios
        .post(`${BASE_URL}/package`, {
          Content: base64Data,
        })
        .catch((error) => {
          console.log(error);
        });
      //return response.statusCode;
    };

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(",")[1]; // Extract base64 data
          postData(base64Data);
        };
        reader.readAsDataURL(files[i]);
      }

      // Clear the files array and file name after upload
      setFiles([]);
    } else {
      alert("Please provide at least one valid file.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar role="heading" position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Upload Package
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
        {/* Add a button to go back to the homepage */}
        <Link to="/">
          <Button variant="outlined">Back</Button>
        </Link>
        <Container maxWidth="sm">
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Drag and drop or select a zip file of the package(s) you would like
            to upload to the registry. You may upload one or multiple files at
            once.
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
                        <Grid item xs={6}>
                          <TextField
                            label="Enter Package Name"
                            value={fileDescriptions[index]}
                            onChange={(e) =>
                              handleFileDescriptionChange(index, e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={() => removeFile(index)}>
                            Remove
                          </Button>
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
            style={{
              border: "2px dashed #cccccc",
              padding: "20px",
              textAlign: "center",
            }}
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
            <Button
              onClick={handleFileUpload}
              disabled={files.length === 0}
              variant="contained"
            >
              Upload
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UploadPage;
