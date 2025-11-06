import { ThemeProvider } from "@/components/ThemeProvider";
import LandingPage from "@/components/pages/LandingPage";
import DashboardPage from "@/components/pages/DashboardPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DashboardPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
