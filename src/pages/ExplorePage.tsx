import { Box, Fab, Grid, Stack, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeCard, CreateRecipeDialog } from "../components";
import { createRecipe } from "../api";
import { useAppStore } from "../app/providers";
import type { Recipe } from "../types";

export const ExplorePage = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);

  const recipes = useMemo(() => state.recipes, [state.recipes]);

  const onRecipeCreate = async (recipe: Recipe) => {
    try {
      const created = await createRecipe(recipe);
      dispatch({ type: "ADD_RECIPE", recipe: created, addToMyRecipes: true });
    } catch (err) {
      console.error("Failed to create recipe:", err);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Stack spacing={2.25}>
        <Typography variant="h4">Explore Recipes</Typography>

        <Grid container spacing={2.25}>
          {recipes.map((recipe: Recipe) => {
            const liked = state.likedIds.has(recipe.id);
            return (
              <Grid key={recipe.id} item xs={12} sm={6} lg={6} xl={4}>
                <RecipeCard
                  recipe={recipe}
                  liked={liked}
                  onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", recipeId: recipe.id })}
                  onOpen={() => navigate(`/recipe/${recipe.id}`)}
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
        <AddRounded />
      </Fab>
      <CreateRecipeDialog open={openCreate} onClose={() => setOpenCreate(false)} onCreate={onRecipeCreate} mode="create" />
    </Box>
  );
};
