import { Avatar, Box, Button, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "../app/providers";
import { RecipeCard, EmptyState, CreateRecipeDialog } from "../components";
import type { Recipe } from "../types";

export function ProfilePage() {
  const { state, dispatch } = useAppStore();
  const [tab, setTab] = useState<"my" | "liked">("my");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  const myRecipes = useMemo(() => {
    return state.recipes.filter((r) => state.myRecipeIds.has(r.id));
  }, [state.recipes, state.myRecipeIds]);

  const likedRecipes = useMemo(() => {
    return state.recipes.filter((r) => state.likedIds.has(r.id));
  }, [state.recipes, state.likedIds]);

  const showEmptyLiked = tab === "liked" && likedRecipes.length === 0;

  function openEdit(r: Recipe) {
    setEditing(r);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditing(null);
  }

  function deleteRecipe(id: string) {
    dispatch({ type: "DELETE_RECIPE", recipeId: id });
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: 900 }}>ש</Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              שקד גורן
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {myRecipes.length} recipes
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          startIcon={<LogoutRoundedIcon />}
          sx={{ borderRadius: 999 }}
          onClick={() => {
            navigate("/explore");
          }}
        >
          Sign Out
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "background.paper",
          mb: 2,
        }}
      >
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="My tabs" sx={{ px: 1 }}>
          <Tab value="my" label="My Recipes" />
          <Tab value="liked" label="Liked" />
        </Tabs>
      </Paper>

      {showEmptyLiked ? (
        <EmptyState title="No liked recipes" subtitle="Like recipes to save them here" />
      ) : (
        <Stack spacing={2.25}>
          {(tab === "my" ? myRecipes : likedRecipes).map((r) => {
            return (
              <Box key={r.id}>
                <RecipeCard
                  recipe={r}
                  liked={state.likedIds.has(r.id)}
                  onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", recipeId: r.id })}
                  onOpen={() => navigate(`/recipe/${r.id}`)}
                  showOwnerActions
                  onEdit={() => openEdit(r)}
                  onDelete={() => deleteRecipe(r.id)}
                />
                <CreateRecipeDialog
                  open={editOpen}
                  mode="edit"
                  initialRecipe={editing ?? undefined}
                  onClose={closeEdit}
                  onUpdate={(updated) => dispatch({ type: "UPDATE_RECIPE", recipe: updated })}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
