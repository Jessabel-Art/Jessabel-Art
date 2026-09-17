import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { appInitializer } from './persistence';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import MonthlyBudget from './pages/MonthlyBudget';
import DebtTracker from './pages/DebtTracker';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NetWorth from './pages/NetWorth';
import DebtPayoff from './pages/DebtPayoff';
import Envelopes from './pages/Envelopes';
import Buckets from './pages/Buckets';
import Accounts from './pages/Accounts';
import MortgageReadiness from './pages/MortgageReadiness';

export default function App() {
  useEffect(() => {
    void appInitializer.initialize();
  }, []);

  return (
    <BrowserRouter basename="/fmbl">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budget" element={<MonthlyBudget />} />
          <Route path="debt" element={<DebtTracker />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="networth" element={<NetWorth />} />
          <Route path="debt-payoff" element={<DebtPayoff />} />
          <Route path="envelopes" element={<Envelopes />} />
          <Route path="buckets" element={<Buckets />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="mortgage-readiness" element={<MortgageReadiness />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
