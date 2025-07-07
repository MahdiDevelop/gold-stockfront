import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const NotFound = () => {
//   const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="error" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        <FormattedMessage id="pageNotFound.title" defaultMessage="Page Not Found" />
      </Typography>
      <Typography variant="body1" mb={4}>
        <FormattedMessage
          id="pageNotFound.description"
          defaultMessage="The page you are looking for does not exist."
        />
      </Typography>
      <Button variant="contained" color="primary" onClick={() =>  window.location.href = '/'}>
        <FormattedMessage id="pageNotFound.homeButton" defaultMessage="Back to Home" />
      </Button>
    </Container>
  );
};

export default NotFound;
