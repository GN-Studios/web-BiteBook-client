import React from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Paper, Stack, Typography } from "@mui/material";
import {
  FavoriteBorderRounded,
  FavoriteRounded,
  AccessTimeRounded,
  Groups2Rounded,
  EditRounded,
  DeleteOutlineRounded,
  ChatBubbleOutlineRounded,
} from "@mui/icons-material";

import type { Recipe } from "../types/recipe";

const DEFAULT_RECIPE_IMAGE =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80";

type Props = {
  recipe: Recipe;
  liked: boolean;
  onToggleLike: () => void;
  onOpen: () => void;

  // only for "My Recipes"
  showOwnerActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RecipeCard({ recipe, liked, onToggleLike, onOpen, showOwnerActions = false, onEdit, onDelete }: Props) {
  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes;
  const displayedLikes = recipe.likes + (liked ? 1 : 0);
  const commentsCount = recipe.commentsCount ?? 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 140ms ease, box-shadow 140ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardActionArea onClick={onOpen}>
          <CardMedia
            component="img"
            src={recipe.imageUrl || DEFAULT_RECIPE_IMAGE}
            alt={recipe.title}
            sx={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              display: "block",
            }}
          />
        </CardActionArea>

        {showOwnerActions ? (
          <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, left: 12 }}>
            <Paper elevation={0} sx={{ borderRadius: 999 }}>
              <IconButton size="small" onClick={onEdit} aria-label="Edit recipe">
                <EditRounded fontSize="small" />
              </IconButton>
            </Paper>
            <Paper elevation={0} sx={{ borderRadius: 999 }}>
              <IconButton size="small" onClick={onDelete} aria-label="Delete recipe">
                <DeleteOutlineRounded fontSize="small" />
              </IconButton>
            </Paper>
          </Stack>
        ) : null}

        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            borderRadius: 999,
          }}
        >
          <IconButton size="small" onClick={onToggleLike} aria-label={liked ? "Unlike" : "Like"}>
            {liked ? <FavoriteRounded color="primary" /> : <FavoriteBorderRounded />}
          </IconButton>
        </Paper>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {recipe.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {recipe.description}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }} alignItems="center">
          <Stack direction="row" spacing={0.8} alignItems="center">
            <AccessTimeRounded fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {totalMinutes} min
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.8} alignItems="center">
            <Groups2Rounded fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.servings}
            </Typography>
          </Stack>

          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={1.6} alignItems="center">
            <Stack direction="row" spacing={0.6} alignItems="center">
              <FavoriteRounded
                sx={{
                  fontSize: 18,
                  color: liked ? "primary.main" : "success.main", // closer “accented” like the screenshot
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  color: liked ? "primary.main" : "success.main",
                }}
              >
                {displayedLikes}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.6} alignItems="center">
              <ChatBubbleOutlineRounded sx={{ fontSize: 18, opacity: 0.85 }} />
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {commentsCount}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
