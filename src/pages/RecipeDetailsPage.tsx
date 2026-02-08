import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useAppStore } from "../app/providers";
import { RecipeDetailsView } from "../components";

export function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const recipe = useMemo(() => state.recipes.find((r) => r.id === id), [state.recipes, id]);
  if (!recipe) return <Navigate to="/explore" replace />;

  const liked = state.likedIds.has(recipe.id);
  const likeCount = recipe.likes + (liked ? 1 : 0);

  return (
    <RecipeDetailsView
      recipe={recipe}
      variant="details"
      liked={liked}
      likeCount={likeCount}
      onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", recipeId: recipe.id })}
      onBack={() => navigate(-1)}
    />
  );
}
