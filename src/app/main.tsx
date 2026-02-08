import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { App } from "./App";
import { theme } from "../styles/theme";
import { AppStoreProvider } from "./providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
