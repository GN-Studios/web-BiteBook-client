import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import type { Recipe } from "../types/recipe";

type Props = {
  recipe: Recipe;
  liked: boolean;
  onToggleLike: () => void;
  onOpen: () => void;
};

export function RecipeCard({ recipe, liked, onToggleLike, onOpen }: Props) {
  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes;
  const commentsCount = recipe.commentsCount ?? 0;

  // if you want EXACT behaviour like Base44:
  // keep the displayed likes as recipe.likes (don't auto +1 locally)
  const displayedLikes = recipe.likes + (liked ? 1 : 0);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
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
      {/* Image area */}
      <Box sx={{ position: "relative" }}>
        <CardActionArea onClick={onOpen} sx={{ display: "block" }}>
          <CardMedia
            component="img"
            image={recipe.imageUrl}
            alt={recipe.title}
            sx={{
              height: 260, // closer to your screenshot card height
              objectFit: "cover",
              bgcolor: "rgba(0,0,0,0.04)",
            }}
          />
        </CardActionArea>

        {/* Floating like button */}
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleLike();
          }}
          aria-label={liked ? "Unlike recipe" : "Like recipe"}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 40,
            height: 40,
            bgcolor: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "white" },
          }}
        >
          {liked ? <FavoriteRoundedIcon color="primary" /> : <FavoriteBorderRoundedIcon />}
        </IconButton>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.25 }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 18,
            lineHeight: 1.2,
            mb: 0.75,
          }}
          noWrap
        >
          {recipe.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recipe.description}
        </Typography>

        {/* Footer row */}
        <Stack direction="row" alignItems="center" sx={{ color: "text.secondary" }}>
          {/* Left side: time + servings */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {totalMinutes} min
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.75} alignItems="center">
              <PeopleAltOutlinedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {recipe.servings}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1 }} />

          {/* Right side: likes + comments */}
          <Stack direction="row" spacing={1.6} alignItems="center">
            <Stack direction="row" spacing={0.6} alignItems="center">
              <FavoriteRoundedIcon
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
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18, opacity: 0.85 }} />
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
