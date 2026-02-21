import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout";
import { ExplorePage, DailyPage, ProfilePage, RecipeDetailsPage } from "../pages";

export const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </AppLayout>
  );
};
