import React, { useMemo, useState } from "react";
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
  AccessTimeRounded,
  Groups2Rounded,
  SendRounded,
} from "@mui/icons-material";

import type { Recipe } from "../types";

type Props = {
  recipe: Recipe;
  variant: "daily" | "details";
  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  onBack?: () => void;
};

type Comment = { id: string; text: string };

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Stack alignItems="center" spacing={0.6} sx={{ minWidth: 110 }}>
      <Box sx={{ color: "primary.main" }}>{icon}</Box>
      <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}

function IngredientPill({ amount, name }: { amount: string; name: string }) {
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
}

function InstructionRow({ index, text }: { index: number; text: string }) {
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
}

export function RecipeDetailsView({ recipe, variant, liked, likeCount, onToggleLike, onBack }: Props) {
  const total = recipe.prepMinutes + recipe.cookMinutes;

  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");

  const badgeLabel = variant === "daily" ? "Daily Recipe" : "Recipe";
  const showBackButton = variant === "details" && typeof onBack === "function";

  const cleanedIngredients = useMemo(() => {
    return recipe.ingredients
      .map((ing: any) => ({
        amount: String(ing?.amount ?? "").trim(),
        name: String(ing?.name ?? "").trim(),
      }))
      .filter((x) => x.amount || x.name);
  }, [recipe.ingredients]);

  const steps = useMemo(() => recipe.steps.filter(Boolean), [recipe.steps]);

  const canPost = draft.trim().length > 0;

  function postComment() {
    if (!canPost) return;
    setComments((prev) => [{ id: crypto.randomUUID(), text: draft.trim() }, ...prev]);
    setDraft("");
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      {/* HERO + FLOATING CARD */}
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
            src={recipe.imageUrl}
            alt={recipe.title}
            sx={{
              width: "100%",
              height: { xs: 260, md: 360 },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Paper>

        {/* Daily badge or Recipe badge (same place) */}
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

        {/* Back button ONLY for Details (opened from Explore) */}
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

        {/* Floating panel */}
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

              <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: 760 }}>
                {recipe.description}
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2.2 }}>
                <Avatar sx={{ bgcolor: "primary.main", fontWeight: 900 }}>
                  {recipe.creator.name.slice(0, 1).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 900, lineHeight: 1.15 }}>{recipe.creator.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recipe Creator
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Like pill */}
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
              <IconButton size="small" onClick={onToggleLike} aria-label={liked ? "Unlike" : "Like"} sx={{ p: 0.5 }}>
                {liked ? <FavoriteRounded color="primary" /> : <FavoriteBorderRounded />}
              </IconButton>
              <Typography sx={{ fontWeight: 900 }}>{likeCount}</Typography>
            </Paper>
          </Stack>

          {/* Stats strip */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 4,
              bgcolor: "#F6EFE7",
              px: { xs: 2, md: 3 },
              py: 2.2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ overflowX: "auto" }}>
              <StatItem icon={<AccessTimeRounded />} value={`${recipe.prepMinutes}`} label="Prep (min)" />
              <StatItem icon={<AccessTimeRounded />} value={`${recipe.cookMinutes}`} label="Cook (min)" />
              <StatItem icon={<AccessTimeRounded />} value={`${total}`} label="Total (min)" />
              <StatItem icon={<Groups2Rounded />} value={`${recipe.servings}`} label="Servings" />
            </Stack>
          </Paper>
        </Paper>
      </Box>

      {/* Spacer because the card overlaps hero */}
      <Box sx={{ height: { xs: 150, md: 175 } }} />

      {/* CONTENT */}
      <Box sx={{ width: { xs: "94%", md: "86%" }, mx: "auto" }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          Ingredients
        </Typography>

        <Grid container spacing={2}>
          {cleanedIngredients.map((ing, idx) => (
            <Grid key={`${ing.name}-${idx}`} item xs={12} md={6}>
              <IngredientPill amount={ing.amount} name={ing.name} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height: 34 }} />

        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          Instructions
        </Typography>

        <Stack spacing={2.5}>
          {steps.map((step, idx) => (
            <InstructionRow key={`${idx}-${step}`} index={idx + 1} text={step} />
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
            <Avatar sx={{ bgcolor: "primary.main", fontWeight: 900 }}>ש</Avatar>

            <Box sx={{ flex: 1 }}>
              <TextField
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                fullWidth
                multiline
                minRows={3}
              />

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={postComment}
                  disabled={!canPost}
                  startIcon={<SendRounded />}
                  sx={{
                    borderRadius: 2.5,
                    bgcolor: "#F4B183",
                    color: "#fff",
                    "&:hover": { bgcolor: "#F0A66E" },
                  }}
                >
                  Post Comment
                </Button>
              </Stack>
            </Box>
          </Stack>

          {comments.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: "center", mt: 3.5, mb: 1 }}>
              No comments yet. Be the first to share your thoughts!
            </Typography>
          ) : (
            <Stack spacing={1.25} sx={{ mt: 2.5 }}>
              {comments.map((c) => (
                <Paper
                  key={c.id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    bgcolor: "#FBF7F2",
                    border: "1px solid rgba(0,0,0,0.06)",
                    p: 1.5,
                  }}
                >
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>{c.text}</Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        <Box sx={{ height: 40 }} />
      </Box>
    </Box>
  );
}
