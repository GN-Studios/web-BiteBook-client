import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { setToken, setUser } from "../app/auth";
import { register as apiRegister } from "../api";
import { useNavigate } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await apiRegister({
          username,
          email,
          password,
          image: avatar ?? undefined,
        });
        setToken(res.token);
        setUser(res.user);
        navigate("/explore");
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "Registration failed";
        setError(String(msg));
        setOpenError(true);
        return;
      }
    })();
  };

  const handleCloseError = () => {
    setOpenError(false);
    setError(null);
    // clear inputs when alert closes
    setUsername("");
    setEmail("");
    setPassword("");
    setAvatar(null);
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h6" gutterBottom>
          Create account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Avatar
              src={avatar ?? undefined}
              sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
            >
              {username ? username[0] : "U"}
            </Avatar>
            <IconButton
              aria-label="upload picture"
              component="label"
              sx={{ p: 0 }}
              onClick={() => fileRef.current?.click()}
            >
              <PhotoCameraIcon />
            </IconButton>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </Stack>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            type="email"
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          <Button
            onClick={() => navigate("/login")}
            color="inherit"
            fullWidth
            sx={{ mt: 1 }}
          >
            Already have an account?
          </Button>
        </Box>
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};
