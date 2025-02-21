import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import "./index.css";
import Home from "./home/Home.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AddProduct from "./home/AddProduct.tsx";
import Order from "./home/Order.tsx";
import Booked from "./home/Booked.tsx";
import SettingsPage from "./home/Setting.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/Authorization/index.tsx";
import Detail from "./home/Detail.tsx";
import HouseProperty from "./home/Myproperty.tsx";
import EditProduct from "./home/EditProperty.tsx";
import Booking from "./home/Booking.tsx";
// import "antd/dist/antd.css";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* authorized route */}
          <Route element={<ProtectedRoute />}> <Route path="/home" element={<Home />} /> </Route>
          <Route element={<ProtectedRoute />}> <Route path="/add-product" element={<AddProduct />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/my-order" element={<Order />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/booked" element={<Booked />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/detail/:id" element={<Detail />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/edit-property/:id" element={<EditProduct />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/booking/:id" element={<Booking />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/my-property" element={<HouseProperty />} /></Route>
          <Route element={<ProtectedRoute />}> <Route path="/setting" element={<SettingsPage />} /></Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
