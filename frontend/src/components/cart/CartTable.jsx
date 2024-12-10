import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "../../App";

function CartTable({ cartItems, setCartItems }) {
    const [cartCounter, setCartCounter] = useContext(Context);
    const user = JSON.parse(localStorage.getItem("user"));
 
    const [localQuantities, setLocalQuantities] = useState(() => {
        return cartItems.reduce((acc, item) => {
            const selectedVariant = Array.isArray(item.variants)
            ? item.variants.find(variant => variant.size === item.selectedSize) || item.variants[0]
            : null;            
            acc[item.id] = {
                quantity: item.quantity || 1, 
                selectedSize: item.selectedSize || selectedVariant?.size || '50ml', 
                price: selectedVariant?.price || item.price, 
                name: item.name, 
                image: item.image, 
            };
            return acc;
        }, {});
    });

    useEffect(() => {
        if (localQuantities) {
            localStorage.setItem("order", JSON.stringify(localQuantities));
        }
    }, [localQuantities]);

    const setLocalStorage = (updatedCart) => {
        const formattedCart = updatedCart.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            selectedSize: product.selectedSize,
            price: product.price,
            quantity: product.quantity,
        }));
        localStorage.setItem("cart", JSON.stringify(formattedCart));
    };

    const handleSizeChange = async (event, id) => {
        const selectedSize = event.target.value;
    
        // Update cartItems and localQuantities
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                const selectedVariant = item.variants.find((variant) => variant.size === selectedSize);
                return {
                    ...item,
                    selectedSize,
                    price: selectedVariant?.price || item.price, // Update price
                };
            }
            return item;
        });
        
        setCartItems(updatedCart);
        setLocalStorage(updatedCart);
    
        setLocalQuantities((prev) => {
            const updatedQuantities = {
                ...prev,
                [id]: {
                    ...prev[id],
                    selectedSize,
                    price: updatedCart.find(item => item.id === id)?.price, // Add price
                    name: updatedCart.find(item => item.id === id)?.name, // Add name
                    image: updatedCart.find(item => item.id === id)?.image, // Add image
                },
            };
            return updatedQuantities;
        });

        // Send request to backend to update selectedSize
        try {
            const response = await fetch("http://localhost:5000/api/perfumes/update-cart", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.user.email,
                    id,
                    quantity: localQuantities[id]?.quantity || 1,
                    selectedSize, // Pass selected size to backend
                }),
            });

            if (response.ok) {
                toast.success('Cart updated successfully!');

                setTimeout(() => {
                    window.location.reload();  // Reload the page after a delay
                }, 2000);
            } else {
                toast.error('Error updating cart');
            }
        } catch (error) {
            toast.error('Error while updating cart');
        }
    };

    const handleQuantityChange = async (event, id) => {
        const quantity = Math.max(Number(event.target.value), 1);
       
        // Update cartItems and localQuantities
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity,
                    price: item.variants.find((variant) => variant.size === item.selectedSize)?.price || item.price, // Update price based on selected size
                };
            }
            return item;
        });
    
        setCartItems(updatedCart);
        setLocalStorage(updatedCart);
    
        setLocalQuantities((prev) => {
            const updatedQuantities = {
                ...prev,
                [id]: {
                    ...prev[id],
                    quantity,
                    price: updatedCart.find(item => item.id === id)?.price, // Add price
                    name: updatedCart.find(item => item.id === id)?.name, // Add name
                    image: updatedCart.find(item => item.id === id)?.image, // Add image
                },
            };
            return updatedQuantities;
        });

        // Send request to backend to update quantity
        try {
            const response = await fetch("http://localhost:5000/api/perfumes/update-cart", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.user.email,
                    id,
                    quantity, // Send updated quantity
                }),
            });

            if (response.ok) {
                toast.success('Cart updated successfully!');

                setTimeout(() => {
                    window.location.reload();  // Reload the page after a delay
                }, 1000);
            } else {
                toast.error('Error updating cart');
            }
        } catch (error) {
            toast.error('Error while updating cart');
        }
    };

    const handleRemoveFromCart = async (id) => {
        const userId = user.user.email; // Assuming you have access to the user's email for identification
    
        const updatedCart = cartItems.filter((item) => item.id !== id);
        
        setCartItems(updatedCart); // Update cartItems
        setLocalQuantities((prev) => {
            const updatedQuantities = { ...prev };
            delete updatedQuantities[id]; // Remove product from localQuantities
            return updatedQuantities;
        });
    
        if (updatedCart.length === 0) {
            localStorage.setItem("cart", JSON.stringify([])); // Save empty cart
        } else {
            setLocalStorage(updatedCart); // Save cart after removal
        }
    
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/perfumes/remove-from-cart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId: id }),
            });
    
            if (response.ok) {
                toast.success('Item removed from cart successfully');
            } else {
                toast.error('Error removing item from cart');
            }
        } catch (error) {
            toast.error('Error while removing item');
        }
    
        setCartCounter(updatedCart.length);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <table className="w-11/12 md:w-4/5 mx-auto">
            <thead className="border-b">
                <tr className="text-left">
                    <th className="py-3 font-normal">Sản phẩm</th>
                    <th className="py-3 font-normal pl-4 sm:pl-0">Số lượng</th>
                    <th className="py-3 font-normal pl-4 sm:pl-0">Kích thước</th>
                    <th className="py-3 font-normal text-right w-1/4">Tổng</th>
                </tr>
            </thead>

            <tbody className="border-b">
                {cartItems.map((product) => {
                    const selectedVariant = product.variants?.find(
                        (variant) => variant.size === (localQuantities[product.id]?.selectedSize || '50ml')
                    );

                    return (
                        <tr key={product.id} className="border-b">
                            <td className="py-10">
                                <div className="flex items-center">
                                    <img
                                        src={product.image}
                                        alt="Product"
                                        width={150}
                                        height={150}
                                        className="mr-8"
                                    />
                                    <div className="hidden sm:flex flex-col">
                                        <span className="text-lg font-medium text-gray-900">{product.name}</span>
                                        <span className="pt-2">{formatPrice(selectedVariant?.price || product.price)}</span>
                                    </div>
                                </div>
                            </td>

                            <td className="py-10">
                                <input
                                    type="number"
                                    min={1}
                                    value={localQuantities[product.id]?.quantity || 1}
                                    onChange={(e) => handleQuantityChange(e, product.id)}
                                    className="border border-gray-300 px-4 py-1 rounded text-center w-16"
                                />
                            </td>

                            <td className="py-10">
                                <select
                                    value={localQuantities[product.id]?.selectedSize || '50ml'}
                                    onChange={(e) => handleSizeChange(e, product.id)}
                                    className="border border-gray-300 px-4 py-1 rounded"
                                >
                                    {product.variants?.map((variant) => (
                                        <option key={variant.size} value={variant.size}>
                                            {variant.size}
                                        </option>
                                    ))}
                                </select>
                            </td>

                            <td className="py-10 text-right">
                                <span className="font-medium text-gray-900">
                                    {formatPrice(
                                        (selectedVariant?.price || product.price) *
                                        (localQuantities[product.id]?.quantity || 1)
                                    )}
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
                    );
                })}
            </tbody>
        </table>
    );
}

export default CartTable;
