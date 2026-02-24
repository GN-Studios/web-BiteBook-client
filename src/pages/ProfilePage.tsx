import { Avatar, Box, Button, IconButton, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Edit, Save, Close, LogoutRounded, PhotoCamera, DeleteOutline } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { createFakeToken, getUserFromToken, setToken, clearToken } from "../app/auth";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../app/providers";
import { deleteRecipe, updateRecipe, getUserRecipes } from "../api";
import { RecipeCard, EmptyState, CreateRecipeDialog } from "../components";
import type { Recipe } from "../types";

export const ProfilePage = () => {
  const { state, dispatch } = useAppStore();
  const [tab, setTab] = useState<"my" | "liked">("my");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string } | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const u = getUserFromToken();
    setUser(u);
    if (u?.name) {
      setUsernameInput(u.name);
    }
  }, []);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatar = reader.result as string;
      const newUser = { ...(user ?? {}), avatar };
      setUser(newUser);
      // persist into token
      const token = createFakeToken(newUser);
      setToken(token);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    const newUser = { ...(user ?? {}) };
    delete newUser.avatar;
    setUser(newUser);
    const token = createFakeToken(newUser);
    setToken(token);
  };

  const handleSaveUsername = () => {
    const newUser = { ...(user ?? {}), name: usernameInput };
    setUser(newUser);
    const token = createFakeToken(newUser);
    setToken(token);
    setEditingUsername(false);
  };

  const handleCancelEdit = () => {
    setUsernameInput(user?.name ?? "");
    setEditingUsername(false);
  };

  const myRecipes = useMemo(() => {
    return state.recipes.filter((recipe: Recipe) => state.myRecipeIds.has(recipe.id));
  }, [state.recipes, state.myRecipeIds]);

  const likedRecipes = useMemo(() => {
    return state.recipes.filter((recipe: Recipe) => state.likedIds.has(recipe.id));
  }, [state.recipes, state.likedIds]);

  const showEmptyLiked = tab === "liked" && likedRecipes.length === 0;

  const openEdit = (recipe: Recipe) => {
    setEditing(recipe);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const userRecipes = await getUserRecipes(user?.name ?? "");
        if (!mounted) return;
        userRecipes.forEach((r) => {
          if (!state.myRecipeIds.has(r.id)) {
            dispatch({ type: "ADD_RECIPE", recipe: r, addToMyRecipes: true });
          }
        });
      } catch (err) {
        console.warn("Failed to load user recipes:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onRecipeDelete = async (id: string) => {
    try {
      await deleteRecipe(id);
      dispatch({ type: "DELETE_RECIPE", recipeId: id });
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const onRecipeUpdate = async (recipe: Recipe) => {
    try {
      const res = await updateRecipe(recipe.id, recipe);
      dispatch({ type: "UPDATE_RECIPE", recipe: res });
    } catch (err) {
      console.error("Failed to update recipe:", err);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar
              src={user?.avatar ?? undefined}
              sx={{ bgcolor: "primary.main", fontWeight: 900, width: 64, height: 64 }}
            >
              {user?.name ? user.name[0] : "ש"}
            </Avatar>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <IconButton onClick={() => fileRef.current?.click()}>
              <PhotoCamera />
            </IconButton>
            {user?.avatar && (
              <IconButton onClick={removeAvatar} aria-label="remove avatar">
                <DeleteOutline />
              </IconButton>
            )}
          </Stack>
          <Box sx={{ flex: 1 }}>
            {editingUsername ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  size="small"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  autoFocus
                />
                <IconButton size="small" onClick={handleSaveUsername} color="primary" aria-label="save username">
                  <Save />
                </IconButton>
                <IconButton size="small" onClick={handleCancelEdit} aria-label="cancel edit">
                  <Close />
                </IconButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {user?.name ?? "שקד גורן"}
                </Typography>
                <IconButton size="small" onClick={() => setEditingUsername(true)} aria-label="edit username">
                  <Edit />
                </IconButton>
              </Stack>
            )}
            <Typography variant="body2" color="text.secondary">
              {myRecipes.length} recipes
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          startIcon={<LogoutRounded />}
          sx={{ borderRadius: 999 }}
          onClick={() => {
            clearToken();
            navigate("/login");
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
          {(tab === "my" ? myRecipes : likedRecipes).map((recipe: Recipe) => {
            return (
              <Box key={recipe.id}>
                <RecipeCard
                  recipe={recipe}
                  liked={state.likedIds.has(recipe.id)}
                  onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", recipeId: recipe.id })}
                  onOpen={() => navigate(`/recipe/${recipe.id}`)}
                  showOwnerActions
                  onEdit={() => openEdit(recipe)}
                  onDelete={() => onRecipeDelete(recipe.id)}
                />
                <CreateRecipeDialog
                  open={editOpen}
                  mode="edit"
                  initialRecipe={editing ?? undefined}
                  onClose={closeEdit}
                  onUpdate={(updated) => onRecipeUpdate(updated)}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
