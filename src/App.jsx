import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";

import Products from "./pages/Products";
import AdminDashboard from "./pages/AdminDashboard";

import CartPage from "./CartPage";
import OrderPage from "./OrderPage";
import Profile from "./Profile";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* ================= REGISTER ================= */}

        <Route
          path="/register"
          element={<RegistrationPage />}
        />


        {/* ================= CUSTOMER HOME ================= */}

        <Route
          path="/home"
          element={<Products />}
        />


        {/* ================= CART ================= */}

        <Route
          path="/cart"
          element={<CartPage />}
        />


        {/* ================= ORDERS ================= */}

        <Route
          path="/orders"
          element={<OrderPage />}
        />


        {/* ================= PROFILE ================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ================= INVALID URL ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;