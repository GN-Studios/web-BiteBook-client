import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F28C28" }, // orange accent
    background: {
      default: "#FBF7F2", // warm beige
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D2A26",
      secondary: "#6A635B",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "Apple Color Emoji",
      "Segoe UI Emoji",
    ].join(","),
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
