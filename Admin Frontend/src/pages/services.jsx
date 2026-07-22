import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import "../components/ElaraAdminSideBar.css";


function Services() {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const response = await API.get('/services/');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (slug) => {
    try {
      const token = localStorage.getItem('token');

      await API.delete(`/services/delete/${encodeURIComponent(slug)}`, {
        headers: {
          Authorization: token
        },
      });

      setServices((prev) => prev.filter((service) => service.slug !== slug));
      alert('Services Deleted Successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(error.response?.data?.message || 'Failed to delete Services.');
    }
  };

  return (
    <div className="container-fluid adminMainPage">
      <div className="row">
        <Sidebar />

        <div className="col-9 serviceContainer">
          <CategoriesTopNavBar header="Services" />

          <div className="container bg-white rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-3 pt-3 pb-3">
              <input type="text" className="form-control w-25" placeholder="Search" />
              <Link to="/create-service">
                <button className="btn" style={{ background: '#2d6a4f', color: 'white' }}>
                  Create New Service
                </button>
              </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pt-3 pb-3">
              <button className="btn btn-outline-secondary">Status Filter</button>
              <input type="date" className="form-control w-auto" />
              <span>-</span>
              <input type="date" className="form-control w-auto" />
              <button className="btn btn-outline-secondary">Clear Filters</button>
            </div>
            <div className="table-responsive mb-3">
              <table className="table table-bordered border-1">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Service ID</th>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Fasting</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => {
                    const imageUrl = `http://localhost:3000/${service.image}`.replaceAll('\\', '/');

                    return (
                      <tr key={service._id || index}>
                        <td>{index + 1}</td>
                        <td>{service._id}</td>
                        <td>{service.name}</td>
                        <td>{service.category}</td>
                        <td>{service.fasting ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-danger">No</span>
                        )}</td>
                        <td>{service.gender}</td>
                        <td>
                          {service.status ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Inactive</span>
                          )}
                        </td>
                        <td>
                          <div className='row'>
                            <div className='col-5'>
                              <button
                                type="button"
                                onClick={() => handleDelete(service.slug)}
                                className="btn btn-danger btn-sm m-0"
                              >
                                <i className="bi bi-trash w-50"></i>
                              </button>
                            </div>
                            <div className='col-5'>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm m-0"
                                onClick={() => navigate(`/services/edit/${encodeURIComponent(service.slug)}`)}
                              >
                                <i className="bi bi-pencil-square w-50"></i>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;