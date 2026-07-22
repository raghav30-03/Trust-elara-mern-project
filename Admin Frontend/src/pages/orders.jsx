import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import CategoriesTopNavBar from '../components/categoriesTopNavBar';
import API from '../api/axios';
import '../components/ElaraAdminSideBar.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders/');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container-fluid adminMainPage">
      <div className="row">
        <Sidebar />

        <div className="col-9 serviceContainer">
          <CategoriesTopNavBar header="Customer Orders" />

          <div className="container bg-white rounded-4 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Recent customer orders</h5>
              <span className="text-muted">{orders.length} total</span>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5 text-muted">No orders found yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Sessions</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Preferred Date</th>
                      <th>Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order._id || index}>
                        <td>{index + 1}</td>
                        <td>{order.customerName}</td>
                        <td>{order.email}</td>
                        <td>{order.phone}</td>
                        <td>{order.serviceName}</td>
                        <td>{order.sessions || 1}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          <span className={`badge ${order.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td>{order.preferredDate || '—'}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
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

export default OrdersPage;
