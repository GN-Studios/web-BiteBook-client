import { Box, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./SideBar";
import { BrandBar } from "./BrandBar";

const SIDEBAR_WIDTH = 88;

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showSidebar = !["login", "register"].includes(location.pathname.split("/")[1]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
      }}
    >
      {showSidebar && (
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            position: "fixed",
            height: "100vh",
          }}
        >
          <Sidebar width={SIDEBAR_WIDTH} />
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          marginLeft: showSidebar ? `${SIDEBAR_WIDTH}px` : 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BrandBar />
        <Divider sx={{ opacity: 0.5 }} />
        <Box component="main" sx={{ flex: 1, overflow: "auto", p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
