import React, { useEffect, useState } from "react";

const OrderManagement = () => {
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => { 
    if (user.user.email) {
      fetch('http://localhost:5000/api/perfumes/getOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.user.email }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          return response.json();
        })
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [user.user.email]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Quản lý đơn hàng</h2>
      {orders.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Ngày tạo</th>
              <th className="border border-gray-300 px-4 py-2">Phương thức thanh toán</th>
              <th className="border border-gray-300 px-4 py-2">Tổng tiền</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{order.paymentMethod}</td>
                <td className="border border-gray-300 px-4 py-2">{order.total.toLocaleString()} VND</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có đơn hàng nào được tìm thấy.</p>
      )}
    </div>
  );
};

export default OrderManagement;
