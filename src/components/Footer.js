import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: "auto",
        textAlign: "center",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Nao Medical. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
