import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, Divider, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { setToken, setUser } from "../app/auth";
import { login, googleLogin } from "../api";

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
        const res = await login({ username, password });
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log("Google login success:", credentialResponse);
      // Send the credential to the backend for verification
      const res = await googleLogin(credentialResponse.credential);
      setToken(res.token);
      setUser(res.user);
      navigate("/explorer");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Google login failed";
      setError(String(msg));
      setOpenError(true);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed");
    setOpenError(true);
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
