import { Paper, Stack, Typography } from "@mui/material";
import { AccessTimeRounded, RestaurantRounded, Groups2Rounded } from "@mui/icons-material";

type Props = {
  prep: number;
  cook: number;
  total: number;
  servings: number;
};

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 90 }}>
      <span>{icon}</span>
      <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}

export function RecipeStats({ prep, cook, total, servings }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "rgba(0,0,0,0.02)",
        px: { xs: 2, md: 3 },
        py: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ overflowX: "auto" }}>
        <Stat icon={<AccessTimeRounded color="primary" />} value={`${prep}`} label="Prep (min)" />
        <Stat icon={<AccessTimeRounded color="primary" />} value={`${cook}`} label="Cook (min)" />
        <Stat icon={<RestaurantRounded color="primary" />} value={`${total}`} label="Total (min)" />
        <Stat icon={<Groups2Rounded color="primary" />} value={`${servings}`} label="Servings" />
      </Stack>
    </Paper>
  );
}
