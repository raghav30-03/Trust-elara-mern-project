import { Routes, Route } from "react-router-dom";
import Home from "../Pages/home";
import Services from "../Pages/services";
import ServiceDetail from "../Pages/serviceDetail";
import Checkout from "../Pages/checkout";
import Cart from "../Pages/cart";
import CategoriesPage from "../Pages/categories";
import Login from "../Pages/login";
import SignUp from "../Pages/signUp";

function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/:categorySlug" element={<Services />} />
            <Route path="/service/:serviceSlug" element={<ServiceDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
        </Routes>
    );
}

export default Routing;
