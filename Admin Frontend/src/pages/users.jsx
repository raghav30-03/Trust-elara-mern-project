import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';
import API from '../api/axios';
import '../components/ElaraAdminSideBar.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/user/');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid adminMainPage">
      <div className="row">
        <Sidebar />

        <div className="col-9 serviceContainer">
          <CategoriesTopNavBar header="Signed In Users" />

          <div className="container bg-white rounded-4 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Registered website users</h5>
              <span className="text-muted">{users.length} users</span>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-5 text-muted">No users found yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Last Login</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id || index}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNo}</td>
                        <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
