import { Avatar, Box, Button, IconButton, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Edit, Save, Close, LogoutRounded, PhotoCamera, DeleteOutline } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { clearToken, clearUser, getStoredUser, getToken, parseJwtPayload, setUser } from "../app/auth";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../app/providers";
import { deleteRecipe, updateRecipe, getUserRecipes, getUserById, updateUser } from "../api";
import { RecipeCard, EmptyState, CreateRecipeDialog } from "../components";
import type { Recipe } from "../types";

type UserProfile = {
  _id: string;
  username: string;
  name?: string;
  email?: string;
  image?: string | null;
};

export const ProfilePage = () => {
  const { state, dispatch } = useAppStore();
  const [tab, setTab] = useState<"my" | "liked">("my");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const navigate = useNavigate();
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const stored = getStoredUser() as UserProfile | null;
    if (stored && mounted) {
      setUserState(stored);
      setUsernameInput(stored.name ?? stored.username ?? "");
    }

    (async () => {
      const tokenPayload = parseJwtPayload(getToken());
      const tokenId = tokenPayload?.id as string | undefined;
      const id = stored?._id ?? tokenId;
      if (!id) {
        if (mounted) navigate("/login");
        return;
      }
      try {
        const fresh = await getUserById(id);
        if (!mounted) return;
        setUserState(fresh as UserProfile);
        setUser(fresh as Record<string, any>);
        setUsernameInput(fresh.name ?? fresh.username ?? "");
      } catch (err) {
        console.warn("Failed to load user profile:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const image = reader.result as string;
      if (!user?._id) return;
      try {
        const res = await updateUser(user._id, { image });
        setUserState(res.user as UserProfile);
        setUser(res.user as Record<string, any>);
      } catch (err) {
        console.error("Failed to update avatar:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = async () => {
    if (!user?._id) return;
    try {
      const res = await updateUser(user._id, { image: null });
      setUserState(res.user as UserProfile);
      setUser(res.user as Record<string, any>);
    } catch (err) {
      console.error("Failed to remove avatar:", err);
    }
  };

  const handleSaveUsername = async () => {
    if (!user?._id) return;
    try {
      const res = await updateUser(user._id, { username: usernameInput, name: usernameInput });
      setUserState(res.user as UserProfile);
      setUser(res.user as Record<string, any>);
      setEditingUsername(false);
    } catch (err) {
      console.error("Failed to update username:", err);
    }
  };

  const handleCancelEdit = () => {
    setUsernameInput(user?.name ?? user?.username ?? "");
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
      if (!user?._id) return;
      try {
        const userRecipes = await getUserRecipes(user._id);
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
  }, [dispatch, state.myRecipeIds, user?._id]);

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
              src={user?.image ?? undefined}
              sx={{ bgcolor: "primary.main", fontWeight: 900, width: 64, height: 64 }}
            >
              {user?.name ? user.name[0] : user?.username ? user.username[0] : "ש"}
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
            {user?.image && (
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
                  {user?.name ?? user?.username ?? "שקד גורן"}
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
            clearUser();
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
