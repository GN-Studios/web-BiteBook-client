import { Box, Divider } from "@mui/material";
import { Sidebar } from "./SideBar";
import { BrandBar } from "./BrandBar";

const SIDEBAR_WIDTH = 88;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
      <Sidebar width={SIDEBAR_WIDTH} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <BrandBar />
        <Divider sx={{ opacity: 0.5 }} />
        <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
