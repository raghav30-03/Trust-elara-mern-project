import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../App.css';
import { getCartCount } from '../utils/cart';

const getStoredAuth = () => {
    if (typeof window === 'undefined') {
        return { isLoggedIn: false, user: null };
    }

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    return {
        isLoggedIn: Boolean(token),
        user: storedUser ? JSON.parse(storedUser) : null,
    };
};

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const syncAuthState = () => {
            const { isLoggedIn: loggedIn, user } = getStoredAuth();
            setIsLoggedIn(loggedIn);
            setAuthUser(user);
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                const items = Array.isArray(response.data) ? response.data : [];
                setCategories(items.filter((category) => category.status !== false).slice(0, 5));
            } catch (error) {
                setCategories([]);
            }
        };

        syncAuthState();
        fetchCategories();
        window.addEventListener('auth-state-changed', syncAuthState);
        window.addEventListener('storage', syncAuthState);

        return () => {
            window.removeEventListener('auth-state-changed', syncAuthState);
            window.removeEventListener('storage', syncAuthState);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setAuthUser(null);
        window.dispatchEvent(new Event('auth-state-changed'));
        window.location.href = '/';
    };

    const [cartCount, setCartCount] = useState(getCartCount());

    useEffect(() => {
        const updateCartCount = () => setCartCount(getCartCount());
        window.addEventListener('cart-updated', updateCartCount);
        window.addEventListener('storage', updateCartCount);
        return () => {
            window.removeEventListener('cart-updated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    return (
        <>
            <header className="headerWrapper">
                <div className="realHeader">
                    <div className="offerRow">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <div className="offerLine">
                                        <p> End this year strong! <span> Get 25% SITEWIDE with code NEWME</span></p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="headerDropdown">
                                        <div className="language">
                                            <select>
                                                <option value="en"> English</option>
                                                <option value="fr"> French</option>
                                            </select>
                                        </div>

                                        <div className="city">
                                            <select>
                                                <option value=""> Select city</option>
                                                <option value="ny"> New York</option>
                                                <option value="to"> Tokyo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="logo_with_search">
                        <div className="container">
                            <div className="logoSearch_flex">
                                <div className="logoContainer">
                                    <div className="logo">
                                        <Link to={'/'} >
                                            <img src="/Images/health-serve-logo.png" />
                                        </Link>
                                    </div>
                                    <div className="searchBar">
                                        <img className="search-icon" src="/Images/search-icon.svg" />
                                        <form>
                                            <input className="searchInput" type="search" name="query"
                                                placeholder="Search for Therapy , Nurse Care ..." />
                                        </form>
                                    </div>
                                </div>
                                <div className="profile_cart">
                                    <div className="cartIcon" style={{ position: "relative" }}>
                                        <Link to="/cart" className="btn no-arrow p-0" aria-label="Go to cart" style={{ position: "relative", display: "inline-flex" }}>
                                            <img src="/Images/cart-icon.svg" className="rounded-circle" width="40" height="40"
                                                alt="Cart" />
                                            {cartCount > 0 && (
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        top: "-6px",
                                                        right: "-6px",
                                                        minWidth: "20px",
                                                        height: "20px",
                                                        borderRadius: "999px",
                                                        backgroundColor: "#E63946",
                                                        color: "#fff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.75rem",
                                                        padding: "0 6px",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                    <div className="user_icon">
                                        <button className="btn no-arrow p-0" type="button" data-bs-toggle="dropdown"
                                            aria-label="User Menu">
                                            <img src="/Images/user-icon.svg" className="rounded-circle" width="40" height="40"
                                                alt="Profile" />
                                        </button>

                                        <ul className="dropdown-menu">
                                            {isLoggedIn ? (
                                                <>
                                                    <li><span className="dropdown-item-text px-3 py-2">Hi, {authUser?.name || 'there'}!</span></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button className="dropdown-item" type="button" onClick={handleLogout}>
                                                            Logout
                                                        </button>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                                    <li><Link className="dropdown-item" to="/register">Register</Link></li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="menus">
                        <div className="container">
                            <div className="menuContainer">
                                {categories.map((category) => (
                                    <div key={category._id || category.slug}>
                                        <Link
                                            className="btn menuDropdown"
                                            to={`/services/${category.slug || category._id}`}
                                        >
                                            {category.name}
                                        </Link>
                                    </div>
                                ))}
                                <div>
                                    <Link className="btn menuDropdown" to="/categories">Others</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;