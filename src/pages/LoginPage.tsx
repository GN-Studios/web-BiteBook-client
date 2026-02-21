import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { createFakeToken, setToken } from "../app/auth";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login", { username, password });
    // create a fake token (replace with real auth later)
    const user = { name: username };
    const token = createFakeToken(user);
    setToken(token);
    navigate("/profile");
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
    const user = { 
      name: googleUser.name, 
      email: googleUser.email,
      avatar: googleUser.picture,
      provider: "google",
    };
    const token = createFakeToken(user);
    setToken(token);
    navigate("/profile");
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin"
            />
          </Box>
          <Button
            onClick={() => navigate("/register")}
            color="inherit"
            fullWidth
            sx={{ mt: 1 }}
          >
            Create account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
