import { Routes, Route } from "react-router-dom";

import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import CustomerHomePage from "./CustomerHomePage";
import CartPage from "./CartPage";
import OrderPage from "./OrderPage";
import Profile from "./Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/home" element={<CustomerHomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrderPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}