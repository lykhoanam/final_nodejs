import React, { useState, useEffect } from "react";
import TotalPrice from "./TotalPrice";
import CartTable from "./CartTable";
import CheckOutButton from "./CheckOutButton.jsx";
import TitleMessage from "./TitleMessage";

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Fetch the cart data for the user
    useEffect(() => {
        const fetchCartData = async () => {
            if (!user) return; 
    
            try {
                const response = await fetch("http://localhost:5000/api/perfumes/cart", {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json", 
                    },
                    body: JSON.stringify({
                        userId: user.user.email,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch cart data");
                }
    
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCartItems(data); 
                } else {
                    throw new Error("Invalid data format"); 
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };
    
        fetchCartData();
    }, [user]); 
    

    return (
        <div className="max-w-screen-2xl mx-auto p-9 flex-col pt-24">
            <TitleMessage />

            {cartItems.length > 0 ? (
                <>
                    <CartTable cartItems={cartItems} setCartItems={setCartItems} />
                    <div className="flex flex-col items-end justify-between text-right w-11/12 md:w-4/5 mx-auto">
                        <TotalPrice cartItems={cartItems} />
                        <CheckOutButton cartItems={cartItems}/>
                    </div>
                </>
            ) : (
                <p className="text-center mb-32">
                    Your cart is empty. Please add items to the cart.
                </p>
            )}
        </div>
    );
}

export default Cart;
