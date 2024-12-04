const perfumeModel = require("../models/perfumeModel");
const cartModel = require("../models/cartModel");  
const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(__dirname, '../data/cart.json');
const orderFilePath = path.join(__dirname, '../data/order.json');

// Controller to fetch all perfumes
const getPerfumes = async (req, res) => {
    try {
        const perfumes = await perfumeModel.getAllPerfumes();  // Ensure async if DB query
        res.status(200).json(perfumes);
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Controller to fetch a perfume by ID
const getPerfume = async (req, res) => {
    try {
        const perfumeId = req.params.id; // ID from URL
        const perfume = await perfumeModel.getPerfumeById(perfumeId);  // Ensure async if DB query

        if (!perfume) {
            return res.status(404).send("Perfume not found");
        }

        res.status(200).json(perfume);
    } catch (error) {
        console.error("Error fetching perfume:", error);
        res.status(500).send("Internal Server Error");
    }
};


const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId;  // Assuming you're using token authentication and user info is decoded
        const perfumeId = req.body.id;

        // Get the perfume by ID from the database (using perfumeModel)
        const perfume = await perfumeModel.getPerfumeById(perfumeId);
        if (!perfume) {
            return res.status(404).send("Perfume not found");
        }

        // Find the user's cart or create a new one if it doesn't exist
        let userCart = await cartModel.getCartByUserId(userId);

        if (!userCart) {
            // Create a new cart if it doesn't exist
            userCart = {
                userId: userId,
                items: []
            };
        }

        // Check if the product already exists in the cart
        const existingItem = userCart.items.find(item => item.id === perfume.id);

        if (existingItem) {
            // If the product exists, increase the quantity
            existingItem.quantity += 1;
        } else {
            // If the product doesn't exist, add it to the cart with quantity 1
            userCart.items.push({ ...perfume, quantity: 1 ,selectedSize: "50ml"});
        }

        await cartModel.updateCart(userId, userCart);

        res.status(200).json(userCart.items);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getCart = (req, res) => {
    const userId = req.body.userId; // Extract userId from query parameter

    try {
        const cart = cartModel.getCartByUserId(userId); // Get cart data by userId

        if (!cart || !cart.items) {
            return res.status(200).json([]); // Return an empty array if cart or items are not found
        }

        // If the cart has items, send the cart items as a response
        res.status(200).json(cart.items); 
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).send("Internal Server Error");
    }
};


const updateCart = (req, res) => {
    const { userId, id, quantity, selectedSize } = req.body; 

    fs.readFile(cartFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading cart file');
        }

        let cart = JSON.parse(data); 

        let userCart = cart.find(cart => cart.userId === userId);

        if (!userCart) {
            return res.status(404).send('User cart not found');
        }

        let productIndex = userCart.items.findIndex(item => item.id === id);

        if (productIndex !== -1) {
            // Update both quantity and selectedSize
            userCart.items[productIndex].quantity = quantity;
            userCart.items[productIndex].selectedSize = selectedSize; // Update selectedSize

            // Save the updated cart back to the file
            fs.writeFile(cartFilePath, JSON.stringify(cart, null, 2), 'utf8', (err) => {
                if (err) {
                    return res.status(500).send('Error writing to cart file');
                }
                res.status(200).send('Cart updated successfully');
            });
        } else {
            res.status(404).send('Product not found in user cart');
        }
    });
};


const removeItemFromCart = (req, res) => {
    const { userId, productId } = req.body;

    fs.readFile(cartFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read cart file' });
        }

        let cart;
        try {
            cart = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ message: 'Error parsing cart data' });
        }

        const userCart = cart.find(user => user.userId === userId);
        if (!userCart) {
            return res.status(404).json({ message: 'User cart not found' });
        }

        const updatedCartItems = userCart.items.filter(item => item.id !== productId);

        if (updatedCartItems.length === 0) {
            cart = cart.filter(user => user.userId !== userId); 
        } else {
            userCart.items = updatedCartItems;
        }

        fs.writeFile(cartFilePath, JSON.stringify(cart, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                return res.status(500).json({ message: 'Error writing to cart file' });
            }

            res.status(200).json({ message: 'Item removed from cart successfully' });
        });
    });
};

const order = async (req, res) => {
    try {
        const { user, paymentMethod, shippingMethod, shippingCost, cartItems, total } = req.body;

        const newOrder = {
            user,
            paymentMethod,
            shippingMethod,
            shippingCost,
            cartItems,
            total,
            status: 'pending', 
            createdAt: new Date(),
        };

        // Read existing orders
        let orders = [];
        try {
            const data = fs.readFileSync(orderFilePath, 'utf-8');
            orders = JSON.parse(data);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error reading order file:', err);
            }
        }

        // Add the new order to the orders array
        orders.push(newOrder);

        // Write orders back to the file
        fs.writeFileSync(orderFilePath, JSON.stringify(orders, null, 2));

        // Read the current cart data
        let cartData = [];
        try {
            const cartContent = fs.readFileSync(cartFilePath, 'utf-8');
            cartData = JSON.parse(cartContent);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error reading cart file:', err);
            }
        }

        // Remove the cart for the user who placed the order
        cartData = cartData.filter(cart => cart.userId !== user.email);

        // Write the updated cart data back to the file
        fs.writeFileSync(cartFilePath, JSON.stringify(cartData, null, 2));

        res.status(201).json({ message: 'Order submitted successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to submit order' });
    }
};

const getOrder = (req, res) => {
    const { email } = req.body; // Lấy email từ body request
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    fs.readFile(orderFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error("Không thể đọc file:", err);
        return res.status(500).json({ message: 'Lỗi server khi đọc file' });
      }
  
      try {
        const orders = JSON.parse(data);
  
        // Lọc đơn hàng theo email
        const filteredOrders = orders.filter(order => order.user.email === email);
        console.log(filteredOrders)
        res.json(filteredOrders);
      } catch (parseError) {
        console.error("Lỗi khi parse JSON:", parseError);
        res.status(500).json({ message: 'Lỗi server khi parse dữ liệu' });
      }
    });
  };

module.exports = {
    getPerfumes,
    getPerfume,
    addToCart,
    getCart,
    updateCart,
    removeItemFromCart,
    order,
    getOrder
};
