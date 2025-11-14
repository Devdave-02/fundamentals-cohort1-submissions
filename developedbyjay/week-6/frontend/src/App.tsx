import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import { SignInForm } from "./pages/sign-in/_component/sign-in-form";
import { SignUpForm } from "./pages/sign-up/_components/sign-up-form";
import { TransactionTable } from "./pages/transaction/_components/transaction-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" />
          <Route path="dashboard/user" element={<div></div>} />
          <Route path="dashboard/transaction" element={<TransactionTable  />}/>
        </Route>

        <Route path="login" element={<SignInForm />} />
        <Route path="register" element={<SignUpForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
