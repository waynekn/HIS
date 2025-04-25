import { Routes, Route } from "react-router";

import HomePage from "./pages/home";
import LogInForm from "./components/loginForm";
import SignUpForm from "./components/signUpForm";
import ProfilePage from "./pages/profilePage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="login/" element={<LogInForm />} />
        <Route path="signup/" element={<SignUpForm />} />
      </Route>
      <Route path="user/:username/" element={<ProfilePage />} />
    </Routes>
  );
}

export default Router;
