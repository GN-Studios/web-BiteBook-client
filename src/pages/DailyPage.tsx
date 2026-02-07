import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { useAppStore } from "../app/providers";
import { RecipeStats } from "../components";

export function DailyPage() {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const recipe = useMemo(() => {
    return state.recipes.find((r) => r.id === state.featuredRecipeId) ?? state.recipes[0];
  }, [state.recipes, state.featuredRecipeId]);

  const liked = state.likedIds.has(recipe.id);
  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Box
          component="img"
          src={recipe.imageUrl}
          alt={recipe.title}
          sx={{
            width: "100%",
            height: { xs: 240, md: 360 },
            objectFit: "cover",
            display: "block",
            filter: "saturate(1.1)",
          }}
        />

        <Chip
          label="Daily Recipe"
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            borderRadius: 999,
            fontWeight: 800,
          }}
        />

        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            bgcolor: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "white" },
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>

        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: { xs: -74, md: -88 },
            width: { xs: "92%", md: "86%" },
            borderRadius: 6,
            p: { xs: 2, md: 3 },
            border: "1px solid rgba(0,0,0,0.06)",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }} noWrap>
                {recipe.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {recipe.description}
              </Typography>

              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    bgcolor: "primary.main",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                  }}
                >
                  {recipe.creator.name.slice(0, 1).toUpperCase()}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>{recipe.creator.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recipe Creator
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "rgba(242,140,40,0.10)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => dispatch({ type: "TOGGLE_LIKE", recipeId: recipe.id })}
                aria-label={liked ? "Unlike" : "Like"}
                sx={{ p: 0.5 }}
              >
                {liked ? <FavoriteRoundedIcon color="primary" /> : <FavoriteBorderRoundedIcon />}
              </IconButton>
              <Typography sx={{ fontWeight: 900 }}>{recipe.likes + (liked ? 1 : 0)}</Typography>
            </Paper>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <RecipeStats prep={recipe.prepMinutes} cook={recipe.cookMinutes} total={total} servings={recipe.servings} />
          </Box>
        </Paper>
      </Box>

      {/* spacer because the overlay card hangs below the hero */}
      <Box sx={{ height: { xs: 100, md: 120 } }} />

      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
        Ingredients
      </Typography>
      <Stack spacing={1} sx={{ mb: 3 }}>
        {recipe.ingredients.map((ing, idx) => (
          <Paper
            key={`${ing.name}-${idx}`}
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "background.paper",
            }}
          >
            <Typography>
              {ing.amount ? `${ing.amount} ` : ""}
              {ing.name}
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
        Steps
      </Typography>
      <Stack spacing={1.25}>
        {recipe.steps.map((x, idx) => (
          <Paper
            key={x}
            elevation={0}
            sx={{
              p: 1.75,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "background.paper",
            }}
          >
            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>{idx + 1}.</Typography>
            <Typography color="text.secondary">{x}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
