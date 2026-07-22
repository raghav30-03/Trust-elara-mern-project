import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import "./ElaraAdminSideBar.css";

function Sidebar() {
    return (
        <div className="col-2 sideBarContainer">
            <div className="logoContainer d-flex justify-content-center pt-5">
                <img src="/Images/health-serve-logo.png" alt="logo" />
            </div>
            <div className="FD d-flex justify-content-center">
                <h4>FD</h4>
            </div>

            <ul className="nav flex-column list-unstyled pt-3 pb-5 mt-0 mb-0 listContainer">
                <div className="has-popout">
                    <a href="#" className="nav-link-custom">
                        <i className="bi bi-grid-fill me-3"></i> Category Management
                    </a>
                    <div className="popout-menu">
                        <a
                            href="/categories"
                            className="popout-item border-bottom border-secondary border-opacity-25"
                        >
                            <i className="bi bi-triangle-fill small me-2"></i>{" "}
                            Category
                        </a>
                        <a href="#" className="popout-item">
                            <i className="bi bi-arrow-return-right small me-2"></i>{" "}
                            Sub Category
                        </a>
                    </div>
                </div>

                <Link to="/services" className="nav-link-custom">
                    <i className="bi bi-geo-alt me-3"></i> Services
                </Link>
                <Link to="/orders" className="nav-link-custom">
                    <i className="bi bi-journal-text me-3"></i> Customer Orders
                </Link>
                <Link to="/users" className="nav-link-custom">
                    <i className="bi bi-people me-3"></i> Signed In Users
                </Link>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-people me-3"></i> Admin Roles
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-gear me-3"></i> Service Management
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-sliders me-3"></i> Service Allocation
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-person-check me-3"></i> Registered Users
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-journal-text me-3"></i> Bookings
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-cash-stack me-3"></i> Collected Cash
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-person-badge me-3"></i> Providers
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-person-workspace me-3"></i>{" "}
                    Practitioners
                </a>
                <a href="#" className="nav-link-custom">
                    <i className="bi bi-star me-3"></i> Manage Reviews
                </a>
                <a
                    href="#"
                    className="nav-link-custom d-flex justify-content-between align-items-center"
                >
                    <span>
                        <i className="bi bi-telephone me-3"></i>Manage Earnings
                    </span>
                    <i className="bi bi-chevron-down small text-white-50"></i>
                </a>
            </ul>
        </div>
    );
}

export default Sidebar;
