import { Box, IconButton, Tooltip } from "@mui/material";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { NavLink, useLocation } from "react-router-dom";

type Props = { width: number };

const navItems = [
  { label: "Explore", to: "/explore", icon: <ExploreOutlinedIcon /> },
  { label: "Daily", to: "/daily", icon: <AutoAwesomeOutlinedIcon /> },
  { label: "My", to: "/profile", icon: <PersonOutlineRoundedIcon /> },
];

export function Sidebar({ width }: Props) {
  const location = useLocation();

  return (
    <Box
      sx={{
        width,
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
                borderRadius: 2.5,
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
    </Box>
  );
}
