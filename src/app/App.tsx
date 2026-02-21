import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout";
import {
  ExplorePage,
  DailyPage,
  ProfilePage,
  RecipeDetailsPage,
  LoginPage,
  RegisterPage,
} from "../pages";
import { isAuthenticated } from "./auth";

export const App = () => {
  // using auth helper

  const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  const RedirectIfAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return isAuthenticated() ? <Navigate to="/profile" replace /> : children;
  };

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/profile" : "/login"} replace />} />
        <Route path="/explore" element={<RequireAuth><ExplorePage /></RequireAuth>} />
        <Route path="/daily" element={<RequireAuth><DailyPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/recipe/:id" element={<RequireAuth><RecipeDetailsPage /></RequireAuth>} />
        <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><RegisterPage /></RedirectIfAuth>} />
        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </AppLayout>
  );
};
