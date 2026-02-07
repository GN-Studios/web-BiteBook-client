import { Box, Fab, Grid, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RecipeCard, CreateRecipeDialog } from "../components";
import { useAppStore } from "../app/providers";
import type { Recipe } from "../types";

export function ExplorePage() {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);

  const recipes = useMemo(() => state.recipes, [state.recipes]);

  function onCreate(recipe: Recipe) {
    dispatch({ type: "ADD_RECIPE", recipe, addToMyRecipes: true });
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Stack spacing={2.25}>
        <Typography variant="h4">Explore Recipes</Typography>

        <Grid container spacing={2.25}>
          {recipes.map((r) => {
            const liked = state.likedIds.has(r.id);
            return (
              <Grid key={r.id} item xs={12} sm={6} lg={6} xl={4}>
                <RecipeCard
                  recipe={r}
                  liked={liked}
                  onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", recipeId: r.id })}
                  onOpen={() => navigate(`/recipe/${r.id}`)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Stack>

      <Fab
        color="primary"
        aria-label="Create new recipe"
        onClick={() => setOpenCreate(true)}
        sx={{
          position: "fixed",
          right: { xs: 18, md: 28 },
          bottom: { xs: 18, md: 28 },
          boxShadow: "0 18px 40px rgba(242,140,40,0.30)",
        }}
      >
        <AddRoundedIcon />
      </Fab>

      <CreateRecipeDialog open={openCreate} onClose={() => setOpenCreate(false)} onCreate={onCreate} />
    </Box>
  );
}
