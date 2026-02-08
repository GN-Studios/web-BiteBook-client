import { useMemo } from "react";
import { useAppStore } from "../app/providers/store";
import { RecipeDetailsView } from "../components/RecipeDetailsView";

export function DailyPage() {
  const { state, dispatch } = useAppStore();

  const recipe = useMemo(() => {
    return state.recipes.find((r) => r.id === state.featuredRecipeId) ?? state.recipes[0];
  }, [state.recipes, state.featuredRecipeId]);

  const liked = state.likedIds.has(recipe.id);
  const likeCount = recipe.likes + (liked ? 1 : 0);

  return (
    <RecipeDetailsView
      recipe={recipe}
      variant="daily"
      liked={liked}
      likeCount={likeCount}
      onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", recipeId: recipe.id })}
    />
  );
}
