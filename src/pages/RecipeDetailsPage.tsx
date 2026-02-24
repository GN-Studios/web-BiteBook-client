import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { useAppStore } from "../app/providers";
import { RecipeDetailsView } from "../components";
import { getRecipe, addLike, removeLike } from "../api";
import type { Recipe } from "../types";

export const RecipeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(false);

  const recipe = useMemo(() => state.recipes.find((recipe: Recipe) => recipe.id === id), [state.recipes, id]);

  useEffect(() => {
    if (recipe || !id) return;

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const fetched = await getRecipe(id);
        if (!mounted) return;
        dispatch({ type: "ADD_RECIPE", recipe: fetched, addToMyRecipes: false });
      } catch (err) {
        console.error("Failed to load recipe:", err);
        if (mounted) navigate("/explore");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, recipe, dispatch, navigate]);

  const handleToggleLike = async () => {
    if (!recipe || liking) return;
    
    setLiking(true);
    try {
      const liked = state.likedIds.has(recipe.id);
      if (liked) {
        await removeLike(recipe.id);
        dispatch({ type: "UNLIKE_RECIPE", recipeId: recipe.id });
      } else {
        await addLike(recipe.id);
        dispatch({ type: "LIKE_RECIPE", recipeId: recipe.id });
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLiking(false);
    }
  };

  if (loading) return null;
  if (!recipe) return <Navigate to="/explore" replace />;

  const liked = state.likedIds.has(recipe.id);
  const likeCount = recipe.likes;

  return (
    <RecipeDetailsView
      recipe={recipe}
      variant="details"
      liked={liked}
      likeCount={likeCount}
      onToggleLike={handleToggleLike}
      onBack={() => navigate(-1)}
    />
  );
};
