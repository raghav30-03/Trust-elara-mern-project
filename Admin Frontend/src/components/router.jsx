import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/login.jsx";
import Categories from "../pages/categories.jsx";
import CreateCategory from "../pages/CreateCategory.jsx";
import EditCategory from "../pages/categoryEdit.jsx";
import Services from "../pages/services.jsx";
import CreateService from "../pages/serviceCreate.jsx";
import EditService from "../pages/serviceEdit.jsx";
import OrdersPage from "../pages/orders.jsx";
import UsersPage from "../pages/users.jsx";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/categories/edit/:slug" element={<EditCategory />} />
        <Route path="/create-service" element={<CreateService />} />
        <Route path="/services/edit/:slug" element={<EditService />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />

      </Routes>
    </Router>
  );
}

export default Routing;
