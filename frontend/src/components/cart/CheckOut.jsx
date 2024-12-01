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
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const [shippingMethod, setShippingMethod] = useState("Tiết kiệm"); // Default shipping method
    const [shippingCost, setShippingCost] = useState(20000); // Default shipping cost

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
            console.log(cartData)
            setCartItems(cartData);
        }
    }, [userData, cartData]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShippingChange = (e) => {
        const method = e.target.value;
        setShippingMethod(method);

        // Update shipping cost based on selected method
        const cost = method === "Nhanh" ? 40000 : 20000; // Example costs
        setShippingCost(cost);
    };

    const calculateTotal = () => {
        const itemsTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return itemsTotal + shippingCost;
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        alert("Đơn hàng đã được xác nhận!");
        // Handle order logic here (e.g., send data to server)
    };

    const goToNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const goToPreviousStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };  

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h2 className="text-3xl font-semibold text-center mb-8">Thanh toán</h2>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Customer Information / Shipping & Payment Information */}
                <div className="customer-info col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
                    {/* Step 1: Customer Info */}
                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>

                            {/* Full Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleFormChange}
                                    className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    disabled={!!userData}
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
                                    disabled={!!userData}
                                />
                            </div>

                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    disabled={!!userData}
                                />
                            </div>

                            {/* Next Button */}
                            <div className="text-center mt-8">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={goToNextStep}
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Shipping & Payment Info */}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Địa chỉ và Phương thức thanh toán</h3>

                            {/* Address */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
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
                                    <option value="Cash">Tiền mặt</option>
                                    <option value="Momo">Momo</option>
                                </select>
                            </div>

                            {/* Shipping Method */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phương thức vận chuyển</label>
                                <select
                                    name="shippingMethod"
                                    value={shippingMethod}
                                    onChange={handleShippingChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Tiết kiệm">Tiết kiệm (20,000 VND)</option>
                                    <option value="Nhanh">Nhanh (40,000 VND)</option>
                                </select>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    onClick={goToPreviousStep}
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={goToNextStep}
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review and Confirm Order */}
                    {currentStep === 3 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Xác nhận đơn hàng</h3>
                            {/* Display all data from steps 1 and 2 */}
                            <div className="mb-6">
                                <h4 className="text-lg font-medium">Thông tin khách hàng:</h4>
                                <p><strong>Họ tên:</strong> {formData.fullName}</p>
                                <p><strong>Email:</strong> {formData.email}</p>
                                <p><strong>Số điện thoại:</strong> {formData.phone}</p>
                                <p><strong>Địa chỉ:</strong> {formData.address}</p>
                                <p><strong>Phương thức thanh toán:</strong> {formData.paymentMethod}</p>
                                <p><strong>Phương thức vận chuyển:</strong> {shippingMethod}</p>
                            </div>

                            <div className="text-center mt-8">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Xác nhận thanh toán
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Cart Info */}
                <div className="cart-info col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
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
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="total mb-4">
                        <p className="font-semibold text-lg">Tổng thanh toán: {formatPrice(calculateTotal())} </p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckOut;
