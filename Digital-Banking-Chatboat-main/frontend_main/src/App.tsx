import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BankingProvider } from "@/contexts/BankingContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { BillsProvider } from "@/contexts/BillsContext";
import { RewardsProvider } from "@/contexts/RewardsContext";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import LinkBank from "./pages/LinkBank";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Bills from "./pages/Bills";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EditAccount from "./pages/EditAccount";
import Notifications from "./pages/Notifications";
import ChangePassword from "./pages/ChangePassword";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import Calculators from "./pages/Calculators";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <BankingProvider>
            <BillsProvider>
              <RewardsProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route element={<MainLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/accounts" element={<Accounts />} />
                      <Route path="/accounts/edit" element={<EditAccount />} />
                      <Route path="/link-bank" element={<LinkBank />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/bills" element={<Bills />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/calculators" element={<Calculators />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/change-password" element={<ChangePassword />} />
                      <Route path="/profile/two-factor" element={<TwoFactorAuth />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                </TooltipProvider>
              </RewardsProvider>
            </BillsProvider>
          </BankingProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
