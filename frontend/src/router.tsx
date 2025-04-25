import { Routes, Route } from "react-router";

import HomePage from "./pages/home";
import LogInForm from "./components/loginForm";
import SignUpForm from "./components/signUpForm";
import ProfilePage from "./pages/profilePage";
import HealthProgramPage from "./pages/healthProgram";
import ClientListPage from "./pages/clientList";
import ClientCreationPage from "./pages/clientCreation";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="login/" element={<LogInForm />} />
        <Route path="signup/" element={<SignUpForm />} />
      </Route>
      <Route path="user/:username/" element={<ProfilePage />} />
      <Route path="programs/" element={<HealthProgramPage />} />
      <Route path="client/create/" element={<ClientCreationPage />} />
      <Route path="client/list/" element={<ClientListPage />} />
    </Routes>
  );
}

export default Router;
