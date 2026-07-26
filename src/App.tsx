import { Amplify } from "aws-amplify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import awsexports from "./aws-exports";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { Index } from "./pages/Auth/Index";
import { Home } from "./pages/Home";
import { SessionExpired } from "./pages/SessionExpired";
Amplify.configure(awsexports);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Public routes */}
            <Route path="/verification" element={<Index />} />
            <Route path="/session-expired" element={<SessionExpired />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
