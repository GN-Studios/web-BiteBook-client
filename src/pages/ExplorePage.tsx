import { Box, Fab, Grid, Stack, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeCard, CreateRecipeDialog } from "../components";
import { createRecipe, getRecipesPage } from "../api";
import { useAppStore } from "../app/providers";
import type { NewRecipeInput, Recipe } from "../types";

export const ExplorePage = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const recipes = useMemo(() => state.recipes, [state.recipes]);
  const pagination = state.recipesPagination;

  const fetchPage = async (pageNumber: number, append: boolean) => {
    setLoadingPage(true);
    try {
      const page = await getRecipesPage(pageNumber, pagination.limit);
      const nextRecipes = append ? [...recipes, ...page.data] : page.data;
      const unique = Array.from(new Map(nextRecipes.map((r) => [r.id, r])).values());
      dispatch({ type: "SET_RECIPES", recipes: unique });
      dispatch({ type: "SET_RECIPES_PAGINATION", pagination: page.pagination });
    } catch (err) {
      console.error("Failed to load recipes page:", err);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    if (recipes.length === 0 && !loadingPage) {
      fetchPage(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!pagination.hasNextPage) return;

    const target = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingPage) {
          fetchPage(pagination.page + 1, true);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [pagination.hasNextPage, pagination.page, loadingPage, recipes.length]);

  const onRecipeCreate = async (recipe: NewRecipeInput) => {
    try {
      const created = await createRecipe(recipe);
      dispatch({ type: "ADD_RECIPE", recipe: created, addToMyRecipes: true });
      dispatch({
        type: "SET_RECIPES_PAGINATION",
        pagination: {
          ...pagination,
          total: pagination.total + 1,
          totalPages: Math.max(pagination.totalPages, Math.ceil((pagination.total + 1) / pagination.limit)),
        },
      });
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
                  onToggleLike={() =>
                    dispatch({ type: "TOGGLE_LIKE", recipeId: recipe.id })
                  }
                  onOpen={() => navigate(`/recipe/${recipe.id}`)}
                />
              </Grid>
            );
          })}
        </Grid>

        <Box ref={loadMoreRef} sx={{ height: 1 }} />
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
      <CreateRecipeDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={onRecipeCreate}
        mode="create"
      />
    </Box>
  );
};
