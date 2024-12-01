import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function CheckOut() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phone: "",
        email: "",
        paymentMethod: "COD",
    });

    // Retrieve user and cart data passed via location state
    const location = useLocation();
    const { user: userData, cart: cartData } = location.state || {};  // Destructure user and cart data

    useEffect(() => {
        if (userData) {
            setUser(userData);
            setFormData({
                fullName: userData.user.fullName || "",
                address: userData.user.address || "",
                phone: userData.user.phone || "",
                email: userData.user.email || "",
                paymentMethod: "COD", // default payment method
            });
        } 

        if (cartData) {
            setCartItems(cartData);
        }
    }, [userData, cartData]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        alert("Order submitted successfully!");
        // Handle order logic here (e.g., send data to server)
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h2 className="text-3xl font-semibold text-center mb-8">Thanh toán</h2>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Information Section */}
                <div className="customer-info bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>

                    {/* Customer Full Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleFormChange}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            disabled={!!userData}  // Disable if userData exists
                        />
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            disabled={!!userData}  // Disable if userData exists
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            disabled={!!userData}  // Disable if userData exists
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            disabled={!!userData}  // Disable if userData exists
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Hình thức thanh toán</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="COD">Tiền mặt</option>
                            <option value="Bank">Momo</option>
                            <option value="CreditCard">Thẻ tín dụng</option>
                        </select>
                    </div>
                </div>

                {/* Cart Details Section */}
                <div className="cart-info bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Giỏ hàng</h3>
                    <ul className="list-none p-0 mb-4">
                        {cartItems.map((item) => (
                            <li key={item.id} className="mb-2 flex items-center justify-between">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="mr-8"
                                />
                                <span className="font-medium flex flex-col justify-center">{item.name} x {item.quantity}</span>
                                <span>{item.price * item.quantity} VND</span>
                            </li>
                        ))}
                    </ul>

                    <div className="total mb-4">
                        <p className="font-semibold text-lg">Tổng thanh toán: {calculateTotal()} VND</p>
                    </div>
                </div>
            </form>

            {/* Submit Button */}
            <div className="text-center mt-8">
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSubmitOrder}
                >
                    Đặt hàng
                </button>
            </div>
        </div>
    );
}

export default CheckOut;
