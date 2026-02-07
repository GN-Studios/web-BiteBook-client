import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type { Ingredient, NewRecipeInput, Recipe } from "../types/recipe";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (recipe: Recipe) => void;
};

function makeId() {
  return crypto.randomUUID();
}

function clampInt(value: number, min: number) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.floor(value));
}

const emptyIngredient = (): Ingredient => ({ amount: "", name: "" });

export function CreateRecipeDialog({ open, onClose, onCreate }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<NewRecipeInput>({
    title: "",
    description: "",
    imageUrl: undefined,

    prepMinutes: 0,
    cookMinutes: 0,
    servings: 4,

    ingredients: [emptyIngredient()],
    steps: [""],
  });

  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => {
    const hasTitle = form.title.trim().length > 0;
    const hasDesc = form.description.trim().length > 0;

    const hasAtLeastOneIngredient = form.ingredients.some((i) => i.amount.trim() || i.name.trim());

    const hasAtLeastOneStep = form.steps.some((s) => s.trim().length > 0);

    return hasTitle && hasDesc && hasAtLeastOneIngredient && hasAtLeastOneStep;
  }, [form]);

  function reset() {
    setForm({
      title: "",
      description: "",
      imageUrl: undefined,

      prepMinutes: 0,
      cookMinutes: 0,
      servings: 4,

      ingredients: [emptyIngredient()],
      steps: [""],
    });
  }

  function handlePickImage() {
    inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  function updateIngredient(idx: number, patch: Partial<Ingredient>) {
    setForm((prev) => {
      const next = [...prev.ingredients];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, ingredients: next };
    });
  }

  function addIngredient() {
    setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, emptyIngredient()] }));
  }

  function removeIngredient(idx: number) {
    setForm((prev) => {
      const next = prev.ingredients.filter((_, i) => i !== idx);
      return { ...prev, ingredients: next.length ? next : [emptyIngredient()] };
    });
  }

  function updateStep(idx: number, value: string) {
    setForm((prev) => {
      const next = [...prev.steps];
      next[idx] = value;
      return { ...prev, steps: next };
    });
  }

  function addStep() {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  }

  function removeStep(idx: number) {
    setForm((prev) => {
      const next = prev.steps.filter((_, i) => i !== idx);
      return { ...prev, steps: next.length ? next : [""] };
    });
  }

  async function handleCreate() {
    if (!canSubmit) return;
    setBusy(true);

    const cleanedIngredients = form.ingredients
      .map((i) => ({ amount: i.amount.trim(), name: i.name.trim() }))
      .filter((i) => i.amount || i.name);

    const cleanedSteps = form.steps.map((s) => s.trim()).filter(Boolean);

    const recipe: Recipe = {
      id: makeId(),
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl,

      creator: { name: "You" },

      prepMinutes: clampInt(form.prepMinutes, 0),
      cookMinutes: clampInt(form.cookMinutes, 0),
      servings: clampInt(form.servings, 1),

      likes: 0,
      ingredients: cleanedIngredients.length ? cleanedIngredients : [emptyIngredient()],
      steps: cleanedSteps.length ? cleanedSteps : ["(Add steps later)"],
    };

    onCreate(recipe);

    setBusy(false);
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Create New Recipe
        </Typography>

        <Box sx={{ flex: 1 }} />

        <IconButton onClick={handleClose} aria-label="Close dialog">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Stack spacing={2.25}>
          {/* Image */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
              Recipe Image
            </Typography>

            <Box
              onClick={handlePickImage}
              role="button"
              tabIndex={0}
              sx={{
                borderRadius: 3,
                border: "2px dashed rgba(0,0,0,0.15)",
                height: 220,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                overflow: "hidden",
                bgcolor: "rgba(0,0,0,0.02)",
                "&:hover": { borderColor: "rgba(242,140,40,0.55)" },
              }}
            >
              {form.imageUrl ? (
                <Box
                  component="img"
                  src={form.imageUrl}
                  alt="Uploaded"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Stack alignItems="center" spacing={1}>
                  <UploadRoundedIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload image
                  </Typography>
                </Stack>
              )}
            </Box>

            <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Box>

          {/* Title / Description */}
          <TextField
            label="Recipe Title *"
            placeholder="Enter recipe title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Description *"
            placeholder="Describe your recipe"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />

          {/* Times + Servings */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Prep Time (min)"
              type="number"
              value={form.prepMinutes}
              onChange={(e) => setForm((p) => ({ ...p, prepMinutes: clampInt(Number(e.target.value), 0) }))}
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Cook Time (min)"
              type="number"
              value={form.cookMinutes}
              onChange={(e) => setForm((p) => ({ ...p, cookMinutes: clampInt(Number(e.target.value), 0) }))}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Stack>

          <TextField
            label="Servings"
            type="number"
            value={form.servings}
            onChange={(e) => setForm((p) => ({ ...p, servings: clampInt(Number(e.target.value), 1) }))}
            fullWidth
            inputProps={{ min: 1 }}
          />

          <Divider />

          {/* Ingredients */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Ingredients
              </Typography>

              <Button
                onClick={addIngredient}
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Add
              </Button>
            </Stack>

            {form.ingredients.map((ing, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <TextField
                  placeholder="Amount (e.g., 2 cups)"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(idx, { amount: e.target.value })}
                  fullWidth
                />
                <TextField
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, { name: e.target.value })}
                  fullWidth
                />
                <IconButton aria-label="Remove ingredient" onClick={() => removeIngredient(idx)}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>

          <Divider />

          {/* Instructions */}
          <Stack spacing={1.25}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Instructions
              </Typography>

              <Button onClick={addStep} variant="outlined" startIcon={<AddRoundedIcon />} sx={{ borderRadius: 999 }}>
                Add Step
              </Button>
            </Stack>

            {form.steps.map((step, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    bgcolor: "rgba(0,0,0,0.04)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    mt: 0.5,
                  }}
                >
                  {idx + 1}
                </Box>

                <TextField
                  placeholder="Describe this step..."
                  value={step}
                  onChange={(e) => updateStep(idx, e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                />

                <IconButton aria-label="Remove step" onClick={() => removeStep(idx)} sx={{ mt: 0.5 }}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>

          {/* Actions */}
          <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ pt: 1 }}>
            <Button variant="text" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreate} disabled={!canSubmit || busy}>
              Create Recipe
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
