import { Routes, Route } from "react-router";

import HomePage from "./pages/home";
import LogInForm from "./components/loginForm";
import SignUpForm from "./components/signUpForm";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="login/" element={<LogInForm />} />
        <Route path="signup/" element={<SignUpForm />} />
      </Route>
    </Routes>
  );
}

export default Router;
