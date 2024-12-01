import React, { useState, useEffect } from "react";

function TotalPrice() {
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve the cart items from localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log(cart)
        calculateTotalPrice(cart);
    }, []);

    // Calculate total price of items in the cart
    const calculateTotalPrice = (cart) => {
        const total = cart.reduce((total, item) => {
            return total + (parseFloat(item.price) * parseFloat(item.quantity));
        }, 0);
        setTotalPrice(total.toFixed(0)); // Set the total price state with 2 decimal places
    };

    return (
        <div className="sticky bottom-0 w-full bg-white p-4 shadow-lg rounded-t-xl">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Tổng cộng:</h2>
                <span className="text-xl font-bold text-gray-900">{totalPrice}₫</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
                dsdsdsdsd
            </p>
        </div>
    );
}

export default TotalPrice;
