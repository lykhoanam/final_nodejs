const perfumeModel = require("../models/perfumeModel");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");  
const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(__dirname, '../public/cart.json');
const orderFilePath = path.join(__dirname, '../public/order.json');
const productFilePath = path.join(__dirname, '../public/perfume.json');

 
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders();  // Ensure async if DB query
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        res.status(500).send("Internal Server Error");
    }
};

const updateOrderStatus = async (req, res) => {
    try {
      const { orderId, status, cartItems } = req.body;  
  
      let orders = [];
      try {
        const data = fs.readFileSync(orderFilePath, 'utf-8');
        orders = JSON.parse(data);
      } catch (err) {
        console.error('Error reading orders file:', err);
        return res.status(500).json({ message: 'Failed to read orders file' });
      }
  
      const order = orders.find(order => order.id === orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.status = status;  
      fs.writeFileSync(orderFilePath, JSON.stringify(orders, null, 2));
  
      let perfumes = [];
      try {
        const perfumeData = fs.readFileSync(productFilePath, 'utf-8');
        perfumes = JSON.parse(perfumeData);
      } catch (err) {
        console.error('Error reading perfumes file:', err);
        return res.status(500).json({ message: 'Failed to read perfumes file' });
      }
  
      cartItems.forEach(item => {
        const product = perfumes.find(p => p.id === item.productId);
        if (product) {
          if (product.quantity >= item.quantity) {
            product.quantity -= item.quantity;  
          } else {
            console.error(`Not enough stock for product ID ${item.productId}`);
          }
        }
      });
  
      fs.writeFileSync(productFilePath, JSON.stringify(perfumes, null, 2));
  
      res.status(200).json({ message: 'Order status updated and quantities adjusted', order });
  
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status and product quantities' });
    }
  };
  


module.exports = {
    getAllOrders,
    updateOrderStatus,
};
