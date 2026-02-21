import { Box, Typography } from "@mui/material";
import { RestaurantRounded } from "@mui/icons-material";

export const BrandBar = () => {
  return (
    <Box
      sx={{
        height: 72,
        px: { xs: 2, md: 3 },
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "primary.main",
          display: "grid",
          placeItems: "center",
          color: "white",
          boxShadow: "0 10px 25px rgba(242,140,40,0.25)",
        }}
      >
        <RestaurantRounded fontSize="small" />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 900 }}>
        BiteBook
      </Typography>
    </Box>
  );
};
