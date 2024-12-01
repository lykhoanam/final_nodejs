const fs = require("fs");
const path = require("path");

// Đường dẫn tới file JSON
const dataPath = path.join(__dirname, "../data/perfume.json");

// Lấy tất cả các mẫu nước hoa
const getAllPerfumes = () => {
    try {
        const data = fs.readFileSync(dataPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing the perfume data:", error);
        return [];
    }
};

// Lấy nước hoa theo ID
const getPerfumeById = (id) => {
    const perfumes = getAllPerfumes();
    return perfumes.find((perfume) => perfume.id === Number(id)); // Convert id to number
};

module.exports = {
    getAllPerfumes,
    getPerfumeById,
};
