const fs = require("fs");
const path = require("path");

// Đường dẫn tới file JSON
const dataPath = path.join(__dirname, "../data/order.json");

const getAllOrders = () => {
    try {
        const data = fs.readFileSync(dataPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing the order data:", error);
        return [];
    }
};



module.exports = {
    getAllOrders,
};
