import { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Stack,
  Typography,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import { SendRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../app/providers";
import { RecipeCard } from "../components";
import type { Recipe } from "../types";

// Demo recipe for testing
const demoRecipe: Recipe = {
  id: "ai-demo-pasta",
  title: "Creamy Garlic Parmesan Pasta",
  description:
    "A delicious and simple pasta dish with garlic, cream, and parmesan cheese. Perfect for a quick weeknight dinner.",
  imageUrl:
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1600&q=80",
  creator: { name: "AI Chef" },
  prepMinutes: 10,
  cookMinutes: 15,
  servings: 4,
  likes: 0,
  tags: ["Pasta", "Dinner", "Quick", "Italian"],
  ingredients: [
    { amount: "400g", name: "Pasta (fettuccine or penne)" },
    { amount: "4 cloves", name: "Garlic (minced)" },
    { amount: "1 cup", name: "Heavy cream" },
    { amount: "100g", name: "Parmesan cheese (grated)" },
    { amount: "2 tbsp", name: "Butter" },
    { amount: "Salt & pepper", name: "To taste" },
    { amount: "Handful", name: "Fresh parsley (chopped)" },
  ],
  steps: [
    "Cook pasta according to package instructions until al dente. Reserve 1 cup of pasta water.",
    "In a large pan, melt butter over medium heat and sauté minced garlic for 1-2 minutes until fragrant.",
    "Pour in the heavy cream and bring to a simmer. Stir in the grated parmesan cheese until smooth.",
    "Add the cooked pasta to the sauce and toss well. Add pasta water as needed to reach desired consistency.",
    "Season with salt and pepper to taste. Garnish with fresh parsley and serve immediately.",
  ],
};

// TODO: Replace with actual AI API call when ready
const fetchAIRecipeSuggestions = async (
  description: string,
): Promise<Recipe[]> => {
  // Placeholder - replace with actual AI API call
  // Example: const response = await fetch('/api/ai/suggest-recipes', {
  //   method: 'POST',
  //   body: JSON.stringify({ description })
  // });
  console.log("AI Recipe Suggestion Request:", description);

  // Simulate API delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return demo recipe for now
  return [demoRecipe];
};

type SearchHistory = {
  id: string;
  query: string;
  recipes: Recipe[];
  timestamp: number;
};

export const DailyPage = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const contentEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    contentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [searchHistory, isLoading]);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading && loadStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - loadStartTime) / 1000));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadStartTime]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText("");
    setIsLoading(true);
    setLoadStartTime(Date.now());
    setElapsedTime(0);

    try {
      const recipes = await fetchAIRecipeSuggestions(query);

      // Add AI recipes to state so they can be viewed in details page
      recipes.forEach((recipe) => {
        dispatch({ type: "ADD_RECIPE", recipe, addToMyRecipes: false });
      });

      setSearchHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          query,
          recipes,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error fetching AI recipes:", error);
    } finally {
      setIsLoading(false);
      setLoadStartTime(null);
    }
  }, [inputText, dispatch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Stack
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Chat Content Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          pb: 2,
        }}
      >
        {/* Empty State */}
        {searchHistory.length === 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
              textAlign: "center",
              color: "text.secondary",
              px: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
              >
                What would you like to cook?
              </Typography>
              <Typography variant="body2">
                Tell me what you're craving and I'll suggest recipes for you
              </Typography>
            </Box>
          </Box>
        )}

        {/* Search History */}
        {searchHistory.map((item) => (
          <Box key={item.id}>
            {/* User Query */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
                px: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                <Typography variant="body2">{item.query}</Typography>
              </Paper>
            </Box>

            {/* AI Response */}
            {item.recipes.length === 0 ? (
              <Box sx={{ px: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No recipes found for that search. Try asking differently!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2, px: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    display: "block",
                    mb: 1.5,
                  }}
                >
                  Found {item.recipes.length} recipe
                  {item.recipes.length !== 1 ? "s" : ""}
                </Typography>
                <Grid container spacing={2}>
                  {item.recipes.map((recipe: Recipe) => {
                    const liked = state.likedIds.has(recipe.id);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                        <RecipeCard
                          recipe={recipe}
                          liked={liked}
                          onToggleLike={() =>
                            dispatch({
                              type: "TOGGLE_LIKE",
                              recipeId: recipe.id,
                            })
                          }
                          onOpen={() => navigate(`/recipe/${recipe.id}`)}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />
          </Box>
        ))}

        <div ref={contentEndRef} />
      </Box>

      {/* Loading indicator with elapsed time */}
      {isLoading && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "rgba(242, 140, 40, 0.1)",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
            }}
          >
            <Stack spacing={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                Thinking...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {elapsedTime}s
              </Typography>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* Input Area */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "2px solid rgba(242, 140, 40, 0.2)",
            overflow: "hidden",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            p: 1.5,
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            placeholder="Tell me what you'd like to cook..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 16,
                fontWeight: 500,
                color: "text.primary",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.7,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            sx={{
              color: "white",
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(242, 140, 40, 0.3)",
                color: "rgba(0,0,0,0.26)",
              },
            }}
          >
            <SendRounded />
          </IconButton>
        </Paper>
      </Box>
    </Stack>
  );
};
