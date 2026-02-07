import { Box, Paper, Typography } from "@mui/material";
import { FavoriteBorderRounded } from "@mui/icons-material";

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "rgba(242,140,40,0.06)",
        borderRadius: 5,
        py: 8,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box
        sx={{
          width: 74,
          height: 74,
          borderRadius: 4,
          bgcolor: "rgba(242,140,40,0.14)",
          display: "grid",
          placeItems: "center",
          mb: 2,
        }}
      >
        <FavoriteBorderRounded sx={{ fontSize: 36, color: "primary.main" }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 900 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Paper>
  );
}
