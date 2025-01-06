import React from "react";
import "@fontsource-variable/inter";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
    },
    primary: {
      main: "#27272a",
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans Thai", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 300 },
  },
  shape: {
    borderRadius: 15,
  },
});

function AppTheme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default AppTheme;
