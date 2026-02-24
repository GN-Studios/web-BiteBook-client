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
import { apiClient } from "../config/api";
import type { Recipe } from "../types";

// Demo recipes for testing

// TODO: Replace with actual AI API call when ready
const fetchAIRecipeSuggestions = async (
  description: string,
): Promise<Recipe[]> => {
  try {
    const response = await apiClient.post("/api/chatgpt/suggest-recipes", {
      input: description,
    });

    return response.data.recipes || [];
  } catch (error) {
    console.error("Error fetching AI recipes:", error);
    throw error;
  }
};

export const SmartRecipePage = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const contentEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    contentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.searchHistory, isLoading]);

  // Timer for elapsed time
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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

      // Save search history to global state
      dispatch({
        type: "ADD_SEARCH_HISTORY",
        item: {
          id: Date.now().toString(),
          query,
          recipes,
          timestamp: Date.now(),
        },
      });
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
        {state.searchHistory.length === 0 && (
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
        {state.searchHistory.map((item) => (
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
