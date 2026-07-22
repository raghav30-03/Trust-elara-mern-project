import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';

function CreateCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    longDescription: '',
    image: null,
    status: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, status: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Please select an image');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', String(formData.slug || '').trim());
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('longDescription', formData.longDescription);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('status', formData.status);

      await API.post('/categories/add', formDataToSend, {
        headers: {
          Authorization: token
        }
      });

      alert('Category Created Successfully!');
      navigate('/categories');
    } catch (error) {
      console.error('Category create error:', error);
      alert(error.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  return (
    <div className="container-fluid adminMainPage">
      <div className="row">
        <Sidebar />

        <div className="col-9 categoryContainer">
          {/* Top Navbar */}
          <CategoriesTopNavBar />

          {/* Form Content */}
          <div className="container py-4">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="bg-white rounded-3 border p-4 p-md-5 text-black">
                  <h4 className="fw-semibold mb-3">Category Create</h4>
                  <hr className="mb-4" />

                  <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="name" className="form-label fw-semibold m-0">Category Name</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter category name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="slug" className="form-label fw-semibold m-0">Slug</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="slug" name="slug" placeholder="Enter slug" value={formData.slug} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="row mb-3 align-items-start">
                      <div className="col-md-4">
                        <label htmlFor="shortDescription" className="form-label fw-semibold mt-2">Short Description</label>
                      </div>
                      <div className="col-md-8">
                        <textarea className="form-control" id="shortDescription" name="shortDescription" placeholder="Enter short category description" rows="3" value={formData.shortDescription} onChange={handleInputChange}></textarea>
                      </div>
                    </div>

                    {/* Long Description */}
                    <div className="row mb-3 align-items-start">
                      <div className="col-md-4">
                        <label htmlFor="longDescription" className="form-label fw-semibold mt-2">Long Description</label>
                      </div>
                      <div className="col-md-8">
                        <textarea className="form-control" id="longDescription" name="longDescription" placeholder="Enter detailed category description" rows="5" value={formData.longDescription} onChange={handleInputChange}></textarea>
                      </div>
                    </div>

                    {/* Category Image */}
                    <div className="row mb-4 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="image" className="form-label fw-semibold m-0">Category Image</label>
                      </div>
                      <div className="col-md-8">
                        <input type="file" className="form-control" id="image" name="image" accept="image/*" onChange={handleFileChange} />
                        <small className="text-muted d-block mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</small>
                      </div>
                    </div>

                    {/* 2. RESTRUCTURED TOGGLE SWITCH ROW */}
                    <div className="row mb-4 align-items-center">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold m-0">Status</label>
                      </div>
                      <div className="col-md-8">
                        <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitch"
                            name="status"
                            style={{ cursor: 'pointer', width: '2.5em', height: '1.25em' }}
                            checked={formData.status}
                            onChange={handleSwitchChange}
                          />
                          <label className="form-check-label text-muted small" htmlFor="flexSwitch" style={{ cursor: 'pointer' }}>
                            {formData.status ? "Active (Visible)" : "Inactive (Hidden)"}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-center gap-3">
                      <button type="submit" className="btn px-5" style={{ background: '#2d6a4f', color: 'white' }}>Create Category</button>
                      <button type="button" className="btn btn-outline-secondary px-5" onClick={handleCancel}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateCategory;