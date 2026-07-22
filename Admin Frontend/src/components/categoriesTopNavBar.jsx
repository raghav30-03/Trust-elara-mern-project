function CategoriesTopNavBar({ header, Header }) {
  const title = header || Header || 'Dashboard';

  return (
    <>
      <div className="top-navbar d-flex justify-content-between align-items-center mb-4 mt-4">
        <h6 className="m-0 fw-semibold text-dark">{title}</h6>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm px-3">English</button>
          <a href="#" className="text-dark position-relative fs-5"><i className="bi bi-bell"></i></a>
          <div className="dropdown">
            <a className="nav-link dropdown-toggle text-dark" href="#" role="button" data-bs-toggle="dropdown">Admin</a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><a className="dropdown-item" href="#">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoriesTopNavBar;