import { Box, IconButton, Tooltip } from "@mui/material";
import { ExploreOutlined, AutoAwesomeOutlined, PersonOutlineRounded, LogoutRounded } from "@mui/icons-material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../app/auth";

type Props = { width: number };

const navItems = [
  { label: "Explore", to: "/explore", icon: <ExploreOutlined /> },
  { label: "Smart Recipe", to: "/smart-recipe", icon: <AutoAwesomeOutlined /> },
  { label: "My", to: "/profile", icon: <PersonOutlineRounded /> },
];

export const Sidebar = ({ width }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width,
        minHeight: "100vh",
        bgcolor: "background.paper",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        gap: 1.25,
      }}
    >
      {navItems.map((item) => {
        const active = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));

        return (
          <Tooltip key={item.to} title={item.label} placement="right">
            <IconButton
              component={NavLink}
              to={item.to}
              aria-label={item.label}
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                color: active ? "primary.main" : "text.secondary",
                bgcolor: active ? "rgba(242,140,40,0.14)" : "transparent",
                "&:hover": {
                  bgcolor: active ? "rgba(242,140,40,0.18)" : "rgba(0,0,0,0.04)",
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        );
      })}
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Logout" placement="right">
        <IconButton
          onClick={handleLogout}
          aria-label="logout"
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.04)",
              color: "error.main",
            },
          }}
        >
          <LogoutRounded />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
