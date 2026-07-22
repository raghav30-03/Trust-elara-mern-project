import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';

function EditCategory() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',  
    longDescription: '',   
    image: null,
    status: true
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get(`/categories/${encodeURIComponent(slug)}`, {
          headers: { 'Authorization': token }
        });

        const category = response.data?.category || response.data;

        setFormData({
          name: category?.name || '',
          slug: category?.slug || slug,
          shortDescription: category?.shortDescription || '',
          longDescription: category?.longDescription || '',
          image: null,
          status: category?.status === true || category?.status === 'true' || category?.status === 1
        });

        if (category.image) {
          const cleanPath = category.image.replaceAll('\\', '/');
          setImagePreview(`http://localhost:3000/${cleanPath}`);
        }

      } catch (error) {
        console.error("Error fetching category details:", error);
        alert(error.response?.data?.message || "Failed to load category details.");
        navigate('/categories');
      }
    };

    fetchCategoryDetails();
  }, [slug, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, status: e.target.checked });
  };


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('longDescription', formData.longDescription);
      formDataToSend.append('status', formData.status);

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await API.put(`/categories/edit/${encodeURIComponent(slug)}`, formDataToSend, {
        headers: {
          'Authorization': token
        }
      });

      alert('Category Updated Successfully!');
      navigate('/categories');
    } catch (error) {
      console.error('Category update error:', error);
      alert(error.response?.data?.message || 'Something went wrong updating. Try again.');
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
          {/* Top Navbar Section */}
          <CategoriesTopNavBar />

          {/* Edit Form Body Layout */}
          <div className="container py-4">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="bg-white rounded-3 border p-4 p-md-5 text-black">
                  <h4 className="fw-semibold mb-3">Category Edit</h4>
                  <hr className="mb-4" />

                  <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="name" className="form-label fw-semibold m-0">Category Name</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="slug" className="form-label fw-semibold m-0">Slug</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="shortDescription" className="form-label fw-semibold m-0">Short Description</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} placeholder="Enter brief overview" required />
                      </div>
                    </div>

                    {/* Long Description */}
                    <div className="row mb-3 align-items-start">
                      <div className="col-md-4">
                        <label htmlFor="longDescription" className="form-label fw-semibold mt-2">Long Description</label>
                      </div>
                      <div className="col-md-8">
                        <textarea className="form-control" id="longDescription" name="longDescription" rows="4" value={formData.longDescription} onChange={handleInputChange} placeholder="Enter detailed description"></textarea>
                      </div>
                    </div>

                    {/* Category Image Preview and Selection */}
                    <div className="row mb-4 align-items-start">
                      <div className="col-md-4">
                        <label htmlFor="image" className="form-label fw-semibold mt-2">Category Image</label>
                      </div>
                      <div className="col-md-8">
                        {imagePreview && (
                          <div className="mb-2">
                            <p className="text-muted small mb-1">Current Display Image:</p>
                            <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                          </div>
                        )}
                        <input type="file" className="form-control" id="image" name="image" accept="image/*" onChange={handleFileChange} />
                        <small className="text-muted d-block mt-1">Leave empty if you don't want to replace the current image.</small>
                      </div>
                    </div>

                    {/* Toggle Switch */}
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

                    {/* Action Execution Buttons */}
                    <div className="d-flex justify-content-center gap-3">
                      <button type="submit" className="btn px-5" style={{ background: '#2d6a4f', color: 'white' }}>Save Changes</button>
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

export default EditCategory;