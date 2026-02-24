import { useMemo, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBackRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  SendRounded,
} from "@mui/icons-material";
import type { Recipe } from "../types";
import {
  getCommentsByRecipeId,
  createComment,
  deleteComment,
  type Comment,
} from "../api/comments";
import { getStoredUser } from "../app/auth";
import { RecipeStatistics } from "./RecipeStatistics";

type Props = {
  recipe: Recipe;
  variant: "daily" | "details";
  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  onBack?: () => void;
};

const DEFAULT_RECIPE_IMAGE =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80";

const IngredientPill = ({ amount, name }: { amount: string; name: string }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#F6EFE7",
        borderRadius: 3,
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "999px",
          bgcolor: "#EFE2D6",
          flex: "0 0 auto",
        }}
      />
      <Typography sx={{ fontWeight: 900 }}>{amount}</Typography>
      <Typography color="text.secondary">{name}</Typography>
    </Paper>
  );
};

const InstructionRow = ({ index, text }: { index: number; text: string }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "999px",
          bgcolor: "primary.main",
          color: "white",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          mt: 0.2,
          boxShadow: "0 12px 24px rgba(242,140,40,0.25)",
        }}
      >
        {index}
      </Box>
      <Typography sx={{ pt: 1.0, color: "text.primary" }}>{text}</Typography>
    </Stack>
  );
};

export const RecipeDetailsView = ({
  recipe,
  variant,
  liked,
  likeCount,
  onToggleLike,
  onBack,
}: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const badgeLabel = variant === "daily" ? "Daily Recipe" : "Recipe";
  const showBackButton = variant === "details" && typeof onBack === "function";

  // Load comments when recipe changes
  useEffect(() => {
    if (variant !== "details") return;

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const fetchedComments = await getCommentsByRecipeId(recipe.id);
        if (mounted) setComments(fetchedComments);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [recipe.id, variant]);

  const cleanedIngredients = useMemo(() => {
    return recipe.ingredients
      .map((ingredient: any) => ({
        amount: String(ingredient?.amount ?? "").trim(),
        name: String(ingredient?.name ?? "").trim(),
      }))
      .filter((x) => x.amount || x.name);
  }, [recipe.ingredients]);

  const steps = useMemo(() => recipe.steps.filter(Boolean), [recipe.steps]);

  const canPost = draft.trim().length > 0;

  const postComment = async () => {
    if (!canPost || posting) return;

    const user = getStoredUser() as { _id?: string; name?: string } | null;
    if (!user?._id) {
      console.error("User not authenticated");
      return;
    }

    setPosting(true);
    try {
      const newComment = await createComment({
        text: draft.trim(),
        userId: user._id,
        recipeId: recipe.id,
      });
      setComments((prev) => [newComment, ...prev]);
      setDraft("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ position: "relative" }}>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Box
            component="img"
            src={recipe.imageUrl || DEFAULT_RECIPE_IMAGE}
            alt={recipe.title}
            sx={{
              width: "100%",
              height: { xs: 260, md: 360 },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Paper>
        <Chip
          label={badgeLabel}
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            borderRadius: 999,
            fontWeight: 800,
          }}
        />
        {showBackButton ? (
          <IconButton
            onClick={onBack}
            aria-label="Back to Explore"
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              bgcolor: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(0,0,0,0.08)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ArrowBackRounded />
          </IconButton>
        ) : null}
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: { xs: -125, md: -145 },
            width: { xs: "94%", md: "86%" },
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.06)",
            bgcolor: "background.paper",
            p: { xs: 2.25, md: 3.25 },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: 28, md: 40 },
                  letterSpacing: -0.4,
                  lineHeight: 1.1,
                }}
              >
                {recipe.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 1.25, maxWidth: 760 }}
              >
                {recipe.description}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mt: 2.2 }}
              >
                <Avatar sx={{ bgcolor: "primary.main", fontWeight: 900 }}>
                  {recipe.creator.name.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                    {recipe.creator.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recipe Creator
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Paper
              elevation={0}
              sx={{
                px: 1.8,
                py: 0.9,
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "#F6EFE7",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={onToggleLike}
                aria-label={liked ? "Unlike" : "Like"}
                sx={{ p: 0.5 }}
              >
                {liked ? (
                  <FavoriteRounded color="primary" />
                ) : (
                  <FavoriteBorderRounded />
                )}
              </IconButton>
              <Typography sx={{ fontWeight: 900 }}>{likeCount}</Typography>
            </Paper>
          </Stack>
          <RecipeStatistics recipe={recipe} />
        </Paper>
      </Box>
      <Box sx={{ height: { xs: 150, md: 175 } }} />
      <Box sx={{ width: { xs: "94%", md: "86%" }, mx: "auto" }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          Ingredients
        </Typography>
        <Grid container spacing={2}>
          {cleanedIngredients.map((ingredient, idx) => (
            <Grid key={`${ingredient.name}-${idx}`} item xs={12} md={6}>
              <IngredientPill
                amount={ingredient.amount}
                name={ingredient.name}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ height: 34 }} />
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          Instructions
        </Typography>
        <Stack spacing={2.5}>
          {steps.map((step, idx) => (
            <InstructionRow
              key={`${idx}-${step}`}
              index={idx + 1}
              text={step}
            />
          ))}
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          Comments ({comments.length})
        </Typography>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.06)",
            p: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                fontWeight: 900,
                flex: "0 0 auto",
              }}
            >
              {getStoredUser()?.name?.slice(0, 1).toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <TextField
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                fullWidth
                multiline
                minRows={3}
                disabled={posting}
              />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={postComment}
                  disabled={!canPost || posting}
                  startIcon={<SendRounded />}
                  sx={{
                    borderRadius: 2.5,
                    bgcolor: "#F4B183",
                    color: "#fff",
                    "&:hover": { bgcolor: "#F0A66E" },
                  }}
                >
                  {posting ? "Posting..." : "Post Comment"}
                </Button>
              </Stack>
            </Box>
          </Stack>
          {loading ? (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", mt: 3.5, mb: 1 }}
            >
              Loading comments...
            </Typography>
          ) : comments.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", mt: 3.5, mb: 1 }}
            >
              No comments yet. Be the first to share your thoughts!
            </Typography>
          ) : (
            <Stack spacing={1.25} sx={{ mt: 2.5 }}>
              {comments.map((c) => {
                const currentUser = getStoredUser() as { _id?: string } | null;
                const isOwnComment = currentUser?._id === c.userId._id;
                return (
                  <Paper
                    key={c._id}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      bgcolor: "#FBF7F2",
                      border: "1px solid rgba(0,0,0,0.06)",
                      p: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          fontWeight: 900,
                          width: 32,
                          height: 32,
                          fontSize: 14,
                        }}
                      >
                        {c.userId.name.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                          {c.userId.name}
                        </Typography>
                        <Typography
                          sx={{ whiteSpace: "pre-wrap", fontSize: 13, mt: 0.5 }}
                        >
                          {c.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.75, display: "block" }}
                        >
                          {new Date(c.createdAt).toLocaleDateString()} at{" "}
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                      {isOwnComment && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteComment(c._id)}
                          sx={{ mt: 0.5, minWidth: "auto" }}
                        >
                          Delete
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Paper>
        <Box sx={{ height: 40 }} />
      </Box>
    </Box>
  );
};
