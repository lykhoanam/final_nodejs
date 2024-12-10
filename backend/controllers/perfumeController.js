const perfumeModel = require("../models/perfumeModel");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");  
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const cartFilePath = path.join(__dirname, '../data/cart.json');
const orderFilePath = path.join(__dirname, '../data/order.json');
const productFilePath = path.join(__dirname, '../data/perfume.json');
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

const addComment = async (req, res) => {
    try {
        const perfumeId = req.params.id; // ID from URL
        const updatedData = req.body; // Data sent from the client

        // Read the perfumes file
        fs.readFile(productFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading perfume file');
            }

            let perfumes = [];
            try {
                perfumes = JSON.parse(data); // Parse the existing perfumes data
            } catch (parseError) {
                return res.status(500).send('Error parsing perfume data');
            }

            // Find the perfume to update
            const perfumeIndex = perfumes.findIndex(perfume => perfume.id === parseInt(perfumeId));

            if (perfumeIndex === -1) {
                return res.status(404).send("Perfume not found");
            }

            // Update the perfume data
            const updatedPerfume = {
                ...perfumes[perfumeIndex],
                ...updatedData,
                comments: updatedData.comments || perfumes[perfumeIndex].comments, // Update comments if provided
            };

            // Replace the old perfume data with the updated one
            perfumes[perfumeIndex] = updatedPerfume;

            // Write the updated perfumes list back to the file
            fs.writeFile(productFilePath, JSON.stringify(perfumes, null, 2), 'utf8', (writeError) => {
                if (writeError) {
                    return res.status(500).send('Error writing to perfume file');
                }

                // Send the updated perfume as the response
                res.status(200).json(updatedPerfume);
            });
        });
    } catch (error) {
        console.error("Error updating perfume:", error);
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

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service like Gmail, SendGrid, etc.
    auth: {
        user: 'lykhoanamvn@gmail.com', // Your email
        pass: 'bujf flmy rhpa pfzs', // Your email password or app-specific password
    },
});

const sendOrderConfirmationEmail = (user, orderDetails) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: user.email,
        subject: `Order Confirmation - Order #${orderDetails.id}`,
        html: `
            <h1>Thank you for your order!</h1>
            <p>Dear ${user.fullName},</p>
            <p>Your order has been successfully placed. Here are the details:</p>
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <p><strong>Total:</strong> {new Intl.NumberFormat('vi-VN').format(orderDetails.total)} VND</p>
            <h4>Shipping Method: ${orderDetails.shippingMethod}</h4>
            <h4>Payment Method: ${orderDetails.paymentMethod}</h4>
            <p>We will notify you once your order is shipped.</p>
            <p>Best regards,</p>
            <p>Your Perfume Shop</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const order = async (req, res) => {
    try {
        const { user, paymentMethod, shippingMethod, shippingCost, cartItems, total } = req.body;

        // Create a new order ID
        let newOrderId = 1;
        let orders = [];
        try {
            const data = fs.readFileSync(orderFilePath, 'utf-8');
            orders = JSON.parse(data);
            if (orders.length > 0) {
                const maxId = Math.max(...orders.map(order => order.id));
                newOrderId = maxId + 1;
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error reading order file:', err);
            }
        }

        // Create a new order
        const newOrder = {
            id: newOrderId,
            user,
            paymentMethod,
            shippingMethod,
            shippingCost,
            cartItems,
            total,
            status: 'pending',
            createdAt: new Date(),
        };

        // Add the new order to the orders list
        orders.push(newOrder);

        // Write updated orders to file
        fs.writeFileSync(orderFilePath, JSON.stringify(orders, null, 2));

        // Read and update cart data
        let cartData = [];
        try {
            const cartContent = fs.readFileSync(cartFilePath, 'utf-8');
            cartData = JSON.parse(cartContent);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error reading cart file:', err);
            }
        }

        // Remove the user's cart after placing the order
        cartData = cartData.filter(cart => cart.userId !== user.email);
        fs.writeFileSync(cartFilePath, JSON.stringify(cartData, null, 2));

        // Send email notification to the user
        sendOrderConfirmationEmail(user, newOrder);

        // Respond with the order details
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


// Admin

  const addProduct = (req, res) => {
    try {
        // Get the product data from the request body
        const { name, description,quantity, category, image, variants } = req.body;


        // Read the existing products file
        fs.readFile(productFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading products file:', err);
                return res.status(500).json({ message: 'Failed to read products file' });
            }

            let products = [];
            try {
                products = JSON.parse(data); // Parse the existing products
            } catch (parseError) {
                console.error('Error parsing products data:', parseError);
            }

            const newProductId = (products.length + 1)

            const newProduct = {
                id: newProductId,
                name,
                description,
                quantity,
                category,
                image,
                variants,
                createdAt: new Date(),
            };

            // Add the new product to the list of products
            products.push(newProduct);

            // Write the updated products list back to the file
            fs.writeFile(productFilePath, JSON.stringify(products, null, 2), 'utf8', (writeError) => {
                if (writeError) {
                    console.error('Error writing to products file:', writeError);
                    return res.status(500).json({ message: 'Failed to write to products file' });
                }

                // Send success response
                res.status(201).json({ message: 'Product added successfully', product: newProduct });
            });
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product' });
    }
};

const deleteProduct = (req, res) => {
    const { id } = req.body; // Lấy productId từ body request

    // Đọc tệp sản phẩm
    fs.readFile(productFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading product file:', err);
            return res.status(500).json({ message: 'Lỗi khi đọc file sản phẩm' });
        }

        let products = [];
        try {
            products = JSON.parse(data); // Parse dữ liệu sản phẩm từ file
        } catch (parseError) {
            console.error('Error parsing product data:', parseError);
            return res.status(500).json({ message: 'Lỗi khi parse dữ liệu sản phẩm' });
        }

        // Kiểm tra nếu sản phẩm tồn tại trong danh sách
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        // Xóa sản phẩm khỏi danh sách
        products.splice(productIndex, 1);

        // Ghi lại danh sách sản phẩm đã cập nhật vào file
        fs.writeFile(productFilePath, JSON.stringify(products, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                console.error('Error writing to product file:', writeError);
                return res.status(500).json({ message: 'Lỗi khi ghi dữ liệu vào file sản phẩm' });
            }

            // Phản hồi thành công
            res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
        });
    });
};

const updateProduct = (req, res) => {
    const { id, name, description, quantity, category, image, variants } = req.body;

    // Read the existing products file
    fs.readFile(productFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading product file:', err);
            return res.status(500).json({ message: 'Failed to read product file' });
        }

        let products = [];
        try {
            products = JSON.parse(data); // Parse existing product data
        } catch (parseError) {
            console.error('Error parsing product data:', parseError);
            return res.status(500).json({ message: 'Error parsing product data' });
        }

        // Find the product to update
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product fields
        products[productIndex] = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            description: description || products[productIndex].description,
            quantity: quantity !== undefined ? quantity : products[productIndex].quantity,
            category: category || products[productIndex].category,
            image: image || products[productIndex].image,
            variants: variants || products[productIndex].variants,
            updatedAt: new Date(),
        };

        // Write the updated product list back to the file
        fs.writeFile(productFilePath, JSON.stringify(products, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                console.error('Error writing to product file:', writeError);
                return res.status(500).json({ message: 'Failed to write to product file' });
            }

            // Send success response
            res.status(200).json({ message: 'Product updated successfully', product: products[productIndex] });
        });
    });
};  



module.exports = {
    getPerfumes,
    getPerfume,
    addComment,
    addToCart,
    getCart,
    updateCart,
    removeItemFromCart,
    order,
    getOrder,
    addProduct,
    deleteProduct,
    updateProduct,
};
