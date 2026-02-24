import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, Divider, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { setToken, setUser, createFakeToken } from "../app/auth";
import { login } from "../api";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await login({ email: username, password });
        setToken(res.token);
        setUser(res.user);
        navigate("/explorer");
      } catch (err: any) {
        // extract message from server response
        const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Login failed";
        setError(String(msg));
        setOpenError(true);
        return;
      }
    })();
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google login success:", credentialResponse);
    // Decode the JWT credential
    const base64Url = credentialResponse.credential.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const googleUser = JSON.parse(jsonPayload);
    console.log("Google user data:", googleUser);

    // Create a token with Google user info
    // For now create fake token from Google payload and store user
    const user = {
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.picture,
      provider: "google",
    };
    const token = createFakeToken(user);
    setToken(token);
    setUser(user);
    navigate("/profile");
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
  };

  const handleCloseError = () => {
    setOpenError(false);
    setError(null);
    // clear inputs when alert closes
    setUsername("");
    setPassword("");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h6" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Log in
          </Button>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="signin" />
          </Box>
          <Button onClick={() => navigate("/register")} color="inherit" fullWidth sx={{ mt: 1 }}>
            Create account
          </Button>
        </Box>
        <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};
