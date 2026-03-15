import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import HomeLayout from "./pages/home-layout";
import Accounts from "./pages/accounts";
import Transactions from "./pages/transactions";
import Dashboard from "./pages/dashboard";
import Budget from "./pages/budget";
import Debts from "./pages/debts";
import Analytics from "./pages/analytics";
import Calendar from "./pages/calendar";
import Family from "./pages/family";
import Settings from "./pages/settings";
import ScrollToTop from "./components//scroll-top/";

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Dashboard layout */}
        <Route path="/home" element={<HomeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budget" element={<Budget />} />
          <Route path="debts" element={<Debts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="family" element={<Family />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
