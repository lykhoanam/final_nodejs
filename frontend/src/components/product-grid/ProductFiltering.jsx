import React, { useState, useEffect } from "react";

const ProductFiltering = ({ products, setFilteredProducts, selectedSize, setSelectedSize }) => {
    // User selected Min and max price values from filter
    const [price, setPrice] = useState({});
    // Search term for name filter
    const [searchTerm, setSearchTerm] = useState("");
    // Sets state for mobile menu
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        validate();
    }, [price, searchTerm, selectedSize]); // Only depend on price, searchTerm, and selectedSize

    const filterByPrice = () => {
        return products.filter((product) => {
            const variant = product.variants?.find((v) => v.size === selectedSize);
            const productPrice = variant ? variant.price : null;
            return productPrice && productPrice >= price.minValue && productPrice <= price.maxValue;
        });
    };

    const filterByName = () => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filterBySize = () => {
        return products.filter((product) =>
            product.variants?.some((variant) => variant.size === selectedSize)
        );
    };

    const validate = () => {
        let filtered = products;

        if (searchTerm) {
            filtered = filterByName();
        }

        if (price.maxValue) {
            filtered = filterByPrice().filter((product) => filtered.includes(product));
        }

        if (selectedSize) {
            filtered = filterBySize().filter((product) => filtered.includes(product));
        }

        setFilteredProducts({
            products: filtered,
            isFiltered: filtered.length < products.length,
        });
    };

    const handlePriceFilter = (event) => {
        setPrice({
            ...price,
            [event.target.name]: Number(event.target.value),
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSizeFilter = (event) => {
        setSelectedSize(event.target.value);  // Set selected size to the checked value
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getPrices = () => {
        return products.map((product) => {
            return product.variants?.map((variant) => variant.price);
        }).flat();
    };

    const getMaxProductPrice = () => {
        return Math.max(...getPrices());
    };

    const getMinProductPrice = () => {
        return Math.min(...getPrices());
    };

    return (
        <div className="sticky top-36 z-9">
            <div className="flex justify-between">
                <h2 className="text-2xl lg:text-4xl font-light mb-6">Tìm kiếm</h2>
                <div className="block lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400">
                        <svg className={`w-5 h-5 text-gray-800 ${isOpen ? "hidden" : "block"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1" />
                        </svg>
                        <svg className={`fill-current h-5 w-5 ${isOpen ? "block" : "hidden"}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`lg:flex lg:flex-col ${isOpen ? "block" : "hidden"}`}>
                <div className="border-t border-gray-200 p-3 pt-5 pb-5">
                    <span>Theo giá: </span>
                    <div className="mb-4 mt-4 grid gap-4 grid-flow-col md:w-60">
                        <div className="md:w-28">
                            <span className="block text-sm mb-2">Từ</span>
                            <input type="number" placeholder={formatPrice(getMinProductPrice())} className="border border-black w-full p-2 text-sm" name="minValue" onChange={handlePriceFilter} />
                        </div>
                        <div className="md:w-28">
                            <span className="block text-sm mb-2">Đến</span>
                            <input type="number" placeholder={formatPrice(getMaxProductPrice())} className="border border-black w-full p-2 text-sm" name="maxValue" onChange={handlePriceFilter} />
                        </div>
                    </div>

                    <span>Theo tên: </span>
                    <div className="mt-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search..." className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 mr-2 transition-all duration-300" />
                        </div>
                    </div>

                    <span>Theo kích thước: </span>
                    <div className="mt-4">
                        <div className="flex flex-col">
                            <label className="inline-flex items-center mb-2">
                                <input
                                    type="radio"
                                    value="50ml"
                                    checked={selectedSize === "50ml"}  // Check if 50ml is selected
                                    onChange={handleSizeFilter}
                                    className="form-radio"
                                />
                                <span className="ml-2">50ml</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="100ml"
                                    checked={selectedSize === "100ml"}  // Check if 100ml is selected
                                    onChange={handleSizeFilter}
                                    className="form-radio"
                                />
                                <span className="ml-2">100ml</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFiltering;
