import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection

function AddToCartButton({ product }) {
    const [cartCounter, setCartCounter] = useContext(Context);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate(); // Hook for navigation

    // Initialize cartCounter when the component mounts
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCounter(cart.reduce((total, item) => total + item.quantity, 0));
    }, [setCartCounter]);

    const updateCartCounter = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartCounter(updatedCart.reduce((total, item) => total + item.quantity, 0));
    };

    const addProductToCart = async () => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            // Show a toast notification
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            // Redirect to login page if not logged in
            navigate("/login"); // Use your login page route here
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemIndex = cart.findIndex((item) => item.id === product.id);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += quantity;
        } else {
            cart.push({ id: product.id, quantity });
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/perfumes/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: product.id,
                    quantity,
                    userId: user ? user.user.email : null,
                }),
            });

            if (!response.ok) throw new Error("Failed to add to cart");

            const updatedCart = await response.json();
            displayCartNotification(product.name);
            updateCartCounter(updatedCart);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const displayCartNotification = (title) => {
        toast.success(`${title} đã được thêm vào giỏ hàng`, { position: "top-right" });
    };

    const handleQuantityChange = (event) => {
        const btnValue = event.currentTarget.textContent;
        setQuantity((prevQuantity) =>
            btnValue === "+" && prevQuantity < 99
                ? prevQuantity + 1
                : btnValue === "−" && prevQuantity > 1
                ? prevQuantity - 1
                : prevQuantity
        );
    };

    return (
        <>
            <label className="sr-only">Quantity</label>
            <div className="flex items-center border border-gray-200 rounded w-32 mt-4">
                <button
                    type="button"
                    className="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75 border-gray-200 border-r"
                    onClick={handleQuantityChange}
                >
                    &#8722;
                </button>

                <input
                    type="number"
                    id="Quantity"
                    className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none bg-white"
                    value={quantity}
                    disabled
                />

                <button
                    type="button"
                    className="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75 border-gray-200 border-l"
                    onClick={handleQuantityChange}
                >
                    &#43;
                </button>
            </div>

            <button
                className="w-full md:w-60 py-2 px-8 md:p-2 text-sm mt-4 transition ease-in duration-200 bg-white hover:bg-gray-800 hover:text-black text-black border hover:border-gray-800 border-gray-300"
                onClick={addProductToCart}
            >
                Add to Cart
            </button>
        </>
    );
}

export default AddToCartButton;
