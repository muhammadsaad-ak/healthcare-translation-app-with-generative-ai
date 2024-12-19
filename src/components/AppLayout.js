import React from "react";
import { Box, AppBar, Toolbar, Typography, Container } from "@mui/material";

const AppLayout = ({ children }) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Healthcare Translation App</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;
