import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';
import { useEffect, useState } from 'react';
import API from '../api/axios';

function Categories() {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (slug) => {
    try {
      const token = localStorage.getItem('token');

      await API.delete(`/categories/delete/${encodeURIComponent(slug)}`, {
        headers: {
          Authorization: token
        },
      });

      setCategories((prev) => prev.filter((category) => category.slug !== slug));
      alert('Category Deleted Successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="container-fluid adminMainPage">
      <div className="row">
        <Sidebar />

        <div className="col-9 categoryContainer">
          <CategoriesTopNavBar header="Categories" />

          <div className="container bg-white rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-3 pt-3 pb-3">
              <input type="text" className="form-control w-25" placeholder="Search" />
              <Link to="/create-category">
                <button className="btn" style={{ background: '#2d6a4f', color: 'white' }}>
                  Create New Category
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
                    <th>Category ID</th>
                    <th>Category Name</th>
                    <th>Category Image</th>
                    <th>Short Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => {
                    const imageUrl = `http://localhost:3000/${category.image}`.replaceAll('\\', '/');

                    return (
                      <tr key={category._id || index}>
                        <td>{index + 1}</td>
                        <td>{category._id}</td>
                        <td>{category.name}</td>
                        <td>
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="rounded-1"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                        </td>
                        <td>{category.shortDescription}</td>
                        <td>
                          {category.status ? (
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
                                onClick={() => handleDelete(category.slug)}
                                className="btn btn-danger btn-sm m-0"
                              >
                                <i className="bi bi-trash w-50"></i>
                              </button>
                            </div>
                            <div className='col-5'>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm m-0"
                                onClick={() => navigate(`/categories/edit/${encodeURIComponent(category.slug)}`)}
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

export default Categories;