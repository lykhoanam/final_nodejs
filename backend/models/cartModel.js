const fs = require("fs");
const path = require("path");

// Define the path for cart data file (you can adjust it to your structure)
const cartDataPath = path.join(__dirname, "../data/cart.json");

// Read cart data or return an empty array if the file is empty or missing
const readCartData = () => {
    try {
        // Check if the file exists and has content
        if (!fs.existsSync(cartDataPath) || fs.readFileSync(cartDataPath, 'utf8').trim() === '') {
            return []; // Return an empty array if the file is empty
        }
        const data = fs.readFileSync(cartDataPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing the cart data:", error);
        return []; // Return empty array in case of error
    }
};

// Get cart by userId
const getCartByUserId = (userId) => {
    const carts = readCartData();
    return carts.find((cart) => cart.userId === userId); // Find the cart by userId
};

// Update or create cart for a user
const updateCart = (userId, cart) => {
    try {
        let carts = readCartData(); // Get current carts

        // Find and update the cart for the user, or add a new cart if not exists
        const existingCartIndex = carts.findIndex((c) => c.userId === userId);
        if (existingCartIndex !== -1) {
            carts[existingCartIndex] = cart;
        } else {
            carts.push(cart); // Add new cart if not found
        }

        // Write the updated carts array back to the file
        fs.writeFileSync(cartDataPath, JSON.stringify(carts, null, 2), "utf8");
    } catch (error) {
        console.error("Error updating the cart data:", error);
    }
};

module.exports = {
    getCartByUserId,
    updateCart,
};
