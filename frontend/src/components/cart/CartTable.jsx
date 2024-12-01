import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "../../App";

function CartTable({ cartItems, setCartItems }) {
    const [cartCounter, setCartCounter] = useContext(Context);
    const user = JSON.parse(localStorage.getItem("user"));
    const [isLoading, setIsLoading] = useState(false);

    // State for each product's quantity
    const [localQuantities, setLocalQuantities] = useState(
        cartItems.reduce((acc, item) => {
            acc[item.id] = item.quantity; // Initialize with existing quantities
            return acc;
        }, {})
    );

    const handleRemoveFromCart = async (id) => {
        const userId = user.user.email;
        setIsLoading(true); // Show the loader
        // Remove the item locally first
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        setLocalStorage(updatedCart);
        setCartCounter(updatedCart.length); 
        
        try {
            // Send DELETE request to backend to remove the item from the cart
            const response = await fetch("http://localhost:5000/api/perfumes/remove-from-cart", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId: id }),
            });
    
            if (response.ok) {
                console.log('Item removed from cart successfully');
                toast.success('Xóa sản phẩm thành công!');
                
            } else {
                console.error('Error removing item from cart');
                toast.error('Error removing item from cart');

            }
        } catch (error) {
            console.error('Error:', error);
        } finally{
            setIsLoading(false);
        }
        
        if (updatedCart.length === 0) {
            localStorage.removeItem("cart"); 
        }
    };
    
    

    const handleQuantityChange = async (event, id) => {
        const quantity = event.target.value;
        const userId = user.user.email;

        // Ensure the quantity is a valid number
        if (isNaN(quantity) || quantity < 0) return;

        // Update the local state for the quantity of the specific product
        setLocalQuantities((prev) => ({ ...prev, [id]: quantity }));

        // Update the cart items state
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, quantity: Number(quantity) };
                updatedItem.total_price = (updatedItem.price * updatedItem.quantity).toFixed(2);
                return updatedItem;
            }
            return item;
        });

        setCartItems(updatedCart); // Update state locally
        setLocalStorage(updatedCart); // Update local storage

        try {
            // Call the backend to update the cart
            const response = await fetch("http://localhost:5000/api/perfumes/update-cart", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, id, quantity }),
            });

            if (response.ok) {
                console.log('Cart updated successfully');
            } else {
                console.error('Error updating cart');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const setLocalStorage = (updatedCart) => {
        let newItems = [];
        if (updatedCart.length !== 0) {
            newItems = updatedCart.map((product) => ({
                id: product.id,
                name:product.name,
                quantity: product.quantity,
                price:product.price,
            }));
            localStorage.setItem("cart", JSON.stringify(newItems));
        } else {
            localStorage.removeItem("cart");
        }
        calculateCartQuantity();
    };

    const calculateCartQuantity = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let counter = 0;
        cart.forEach((item) => (counter += item.quantity));
    };

    return (
        
        <table className="w-11/12 md:w-4/5 mx-auto">
            <thead className="border-b">
                <tr className="text-left">
                    <th className="py-3 font-normal">Sản phẩm</th>
                    <th className="py-3 font-normal pl-4 sm:pl-0">Số lượng</th>
                    <th className="py-3 font-normal text-right w-1/4">Tổng</th>
                </tr>
            </thead>

            <tbody className="border-b">
                {cartItems.map((product) => (
                    <tr key={product.id} className="border-b">
                        <td className="py-10">
                            <div className="flex items-center">
                                <a href={`products/${product.id}`}>
                                    <img
                                        src={product.image}
                                        alt=""
                                        width={150}
                                        height={150}
                                        className="mr-8"
                                    ></img>
                                </a>
                                <div className="hidden sm:flex flex-col mr-2">
                                    <a href={`products/${product.id}`}>
                                        <span className="text-lg font-medium text-gray-900">
                                            {product.name}
                                        </span>
                                    </a>
                                    <span className="pt-2">{product.price}₫</span>
                                </div>
                            </div>
                        </td>

                        <td className="py-10">
                            <input
                                type="number"
                                min={1}
                                value={localQuantities[product.id] || product.quantity} // Using local state to control the input value
                                onChange={(e) => handleQuantityChange(e, product.id)} // Handle changes
                                className="border border-gray-300 px-4 py-1 rounded text-center w-16"
                            />
                        </td>

                        <td className="py-10 text-right">
                            <span className="font-medium text-gray-900">
                                {product.quantity * product.price}₫
                            </span>
                        </td>

                        <td className="py-10 text-right">
                            <button
                                onClick={() => handleRemoveFromCart(product.id)}
                                className="text-red-600 ml-4"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CartTable;
