import { Box, Paper, Stack, Typography } from "@mui/material";
import { AccessTimeRounded, Groups2Rounded } from "@mui/icons-material";
import type { Recipe } from "../types";

type Props = {
  recipe: Recipe;
};

const StatisticItem = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => {
  return (
    <Stack alignItems="center" spacing={0.6} sx={{ minWidth: 110 }}>
      <Box sx={{ color: "primary.main" }}>{icon}</Box>
      <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
};

export const RecipeStatistics = ({ recipe }: Props) => {
  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 4,
        bgcolor: "#F6EFE7",
        px: { xs: 2, md: 3 },
        py: 2.2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ overflowX: "auto" }}>
        <StatisticItem icon={<AccessTimeRounded />} value={`${recipe.prepMinutes}`} label="Prep (min)" />
        <StatisticItem icon={<AccessTimeRounded />} value={`${recipe.cookMinutes}`} label="Cook (min)" />
        <StatisticItem icon={<AccessTimeRounded />} value={`${total}`} label="Total (min)" />
        <StatisticItem icon={<Groups2Rounded />} value={`${recipe.servings}`} label="Servings" />
      </Stack>
    </Paper>
  );
};
