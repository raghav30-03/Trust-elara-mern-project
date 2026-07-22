import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';

function CreateService() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories/');
      setCategories(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const [formData, setFormData] = useState({
    name: '',
    category: '',
    fasting: false,
    ageGroup: '',
    gender: '',
    vitalSystem: '',
    preventiveWellness: '',
    slug: '',
    shortDescription: '',
    longDescription: '',
    mrp: '',
    sellingPrice: '',
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, status: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter service name');
      return;
    }
    if (!formData.slug.trim()) {
      alert('Please enter slug');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!formData.ageGroup) {
      alert('Please select age group');
      return;
    }
    if (!formData.gender) {
      alert('Please select gender');
      return;
    }
    if (!formData.vitalSystem) {
      alert('Please select vital system');
      return;
    }
    if (!formData.preventiveWellness) {
      alert('Please select preventive wellness');
      return;
    }
    if (!formData.shortDescription.trim()) {
      alert('Please enter short description');
      return;
    }
    if (!formData.longDescription.trim()) {
      alert('Please enter long description');
      return;
    }
    if (!formData.mrp) {
      alert('Please enter MRP');
      return;
    }
    if (!formData.sellingPrice) {
      alert('Please enter selling price');
      return;
    }
    if (!formData.image) {
      alert('Please select an image');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('fasting', formData.fasting);
      formDataToSend.append('ageGroup', formData.ageGroup);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('vitalSystem', formData.vitalSystem);
      formDataToSend.append('preventiveWellness', formData.preventiveWellness);
      formDataToSend.append('slug', String(formData.slug || '').trim());
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('longDescription', formData.longDescription);
      formDataToSend.append('mrp', formData.mrp);
      formDataToSend.append('sellingPrice', formData.sellingPrice);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('status', formData.status);

      await API.post('/services/add', formDataToSend, {
        headers: {
          Authorization: token
        }
      });

      alert('Service Created Successfully!');
      navigate('/services');
    } catch (error) {
      console.error('Service create error:', error);
      alert(error.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  const handleCancel = () => {
    navigate('/services');
  };


  return (
    <div className="container-fluid adminMainPage">
      <div className="row">
        <Sidebar />

        <div className="col-9 ServiceContainer">
          {/* Top Navbar */}
          <CategoriesTopNavBar />

          {/* Form Content */}
          <div className="container py-4">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="bg-white rounded-3 border p-4 p-md-5 text-black">
                  <h4 className="fw-semibold mb-3">Service Create</h4>
                  <hr className="mb-4" />

                  <form onSubmit={handleSubmit}>
                    {/* Service Name */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="name" className="form-label fw-semibold m-0">Service Name *</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter Service name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="slug" className="form-label fw-semibold m-0">Slug *</label>
                      </div>
                      <div className="col-md-8">
                        <input type="text" className="form-control" id="slug" name="slug" placeholder="Enter slug" value={formData.slug} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="category" className="form-label fw-semibold m-0">Category *</label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" id="category" name="category" value={formData.category} onChange={handleSelectChange} required>
                          <option value="">Select Category</option>
                          {categories.map((category, index) => {
                            return (
                              <option key={category._id || index} value={category.slug}>
                                {category.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Fasting */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold m-0">Fasting Required </label>
                      </div>
                      <div className="col-md-8">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="fasting" name="fasting" checked={formData.fasting} onChange={handleCheckboxChange} />
                          <label className="form-check-label" htmlFor="fasting">Yes, fasting is required</label>
                        </div>
                      </div>
                    </div>

                    {/* Age Group */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="ageGroup" className="form-label fw-semibold m-0">Age Group </label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" id="ageGroup" name="ageGroup" value={formData.ageGroup} onChange={handleSelectChange} required>
                          <option value="">Select Age Group</option>
                          <option value="0-18">0-18 years</option>
                          <option value="18-40">18-40 years</option>
                          <option value="41-65">41-65 years</option>
                          <option value="65+">65+ years</option>
                          <option value="all">All ages</option>
                        </select>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="gender" className="form-label fw-semibold m-0">Gender </label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleSelectChange} required>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    {/* Vital System */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="vitalSystem" className="form-label fw-semibold m-0">Vital System *</label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" id="vitalSystem" name="vitalSystem" value={formData.vitalSystem} onChange={handleSelectChange} required>
                          <option value="">Select Vital System</option>
                          <option value="heartHealth">Heart Health</option>
                          <option value="hormonal">Hormonal</option>
                          <option value="digestive">Digestive</option>
                          <option value="guts">Guts</option>
                          <option value="lungs">Lungs</option>
                          <option value="kidney">Kidney</option>
                          <option value="reproductiveHealth">Reproductive Health</option>
                          <option value="mentalHealth">Mental Health</option>
                          <option value="hair">Hair</option>
                          <option value="bone">Bone</option>
                          <option value="liver">Liver</option>
                        </select>
                      </div>
                    </div>

                    {/* Preventive Wellness */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="preventiveWellness" className="form-label fw-semibold m-0">Preventive Wellness *</label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" id="preventiveWellness" name="preventiveWellness" value={formData.preventiveWellness} onChange={handleSelectChange} required>
                          <option value="">Select Option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="row mb-3 align-items-start">
                      <div className="col-md-4">
                        <label htmlFor="shortDescription" className="form-label fw-semibold mt-2">Short Description *</label>
                      </div>
                      <div className="col-md-8">
                        <textarea className="form-control" id="shortDescription" name="shortDescription" placeholder="Enter short Service description" rows="3" value={formData.shortDescription} onChange={handleInputChange} required></textarea>
                      </div>
                    </div>

                    {/* Long Description */}
                    <div className="row mb-3 align-items-start">
                      <div className="col-md-4">
                        <label htmlFor="longDescription" className="form-label fw-semibold mt-2">Long Description *</label>
                      </div>
                      <div className="col-md-8">
                        <textarea className="form-control" id="longDescription" name="longDescription" placeholder="Enter detailed Service description" rows="5" value={formData.longDescription} onChange={handleInputChange} required></textarea>
                      </div>
                    </div>

                    {/* MRP */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="mrp" className="form-label fw-semibold m-0">MRP </label>
                      </div>
                      <div className="col-md-8">
                        <input type="number" step="0.01" className="form-control" id="mrp" name="mrp" placeholder="Enter MRP" value={formData.mrp} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Selling Price */}
                    <div className="row mb-3 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="sellingPrice" className="form-label fw-semibold m-0">Selling Price</label>
                      </div>
                      <div className="col-md-8">
                        <input type="number" step="0.01" className="form-control" id="sellingPrice" name="sellingPrice" placeholder="Enter Selling Price" value={formData.sellingPrice} onChange={handleInputChange} required />
                      </div>
                    </div>

                    {/* Service Image */}
                    <div className="row mb-4 align-items-center">
                      <div className="col-md-4">
                        <label htmlFor="image" className="form-label fw-semibold m-0">Service Image *</label>
                      </div>
                      <div className="col-md-8">
                        <input type="file" className="form-control" id="image" name="image" accept="image/*" onChange={handleFileChange} required />
                        <small className="text-muted d-block mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</small>
                      </div>
                    </div>

                    {/* Status Toggle Switch */}
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
                      <button type="submit" className="btn px-5" style={{ background: '#2d6a4f', color: 'white' }}>Create Service</button>
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


export default CreateService
