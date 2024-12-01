import React, { useContext } from "react";
import { Context } from "../../App.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddToCartButton({ product }) {
    const [cartCounter, setCartCounter] = useContext(Context);

    const handleAddToCart = async () => {
        try {
    
            const user = JSON.parse(localStorage.getItem("user"));
    
            const response = await fetch("http://localhost:5000/api/perfumes/add-to-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: product.id,
                    userId: user ? user.user.email : null, 
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to add to cart");
            }
    
            const updatedCart = await response.json();
            console.log(updatedCart);
    
            if (Array.isArray(updatedCart)) {
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                setCartCounter(updatedCart.length);
            } else {
                
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    

    return (
        <button
            className="text-sm p-1 mt-2.5 w-32 transition ease-in duration-200 bg-white hover:bg-gray-800 text-black hover:text-white border border-gray-300"
            onClick={handleAddToCart}
        >
            Thêm vào giỏ
        </button>
    );
}

export default AddToCartButton;
