//tsx
import HomePage from "../pages/home/home";
import RegistrationPage from "../pages/registration/registration";
import LoginPage from "../pages/login/login";
import ProfilePage from "../pages/profile/profile";
//functionla components
import { BrowserRouter, Routes, Route } from "react-router-dom";
//styles
import "./global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
