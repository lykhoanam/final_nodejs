import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "../product-grid/StarRatings";
import AddToCartButton from "./AddToCartButton";

import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import RelatedProducts from "./RelatedProducts";

function ProductPage() {
    const [product, setProduct] = useState(null); // Set initial state to null instead of an empty array
    const { id } = useParams();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/perfumes/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.log("Problem with API connectivity", error);
            }
        };

        fetchProductData();
    }, [id]); // Make sure the product data is fetched when the id changes

    return (
        <>
            <div className="max-w-screen-2xl mx-auto p-9 flex flex-col lg:flex-row mt-6 mb-8">
                {product ? (
                    <div
                        className="flex flex-col lg:flex-row w-full gap-x-24 justify-center"
                        key={product.id}
                    >
                        <div className="flex justify-center">
                            <LazyLoadImage
                                effect="blur"
                                src={product.image}
                                alt={product.description}
                                width={300}
                                height={300}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:max-w-lg">
                            <h1 className="text-3xl mb-1">{product.name}</h1>

                            <StarRatings rating={product.star} />

                            {product.discount ? (
                                <div className="float-left pt-3 pb-3 border-b mb-2">
                                    <span className="line-through pr-2 text-lg">
                                        {product.price}₫
                                    </span>

                                    <span className="text-emerald-600 text-xl">
                                        {product.discount}₫
                                    </span>
                                </div>
                            ) : (
                                <span className="pt-3 pb-3 border-b mb-2 text-xl">
                                    {product.price}₫
                                </span>
                            )}

                            <p className="pt-3 pb-3 w-full text-base">
                                {product.description}
                            </p>

                            <p className="pt-3 pb-3 w-full text-base">
                            </p>

                            <AddToCartButton product={product} />
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                <ToastContainer />
            </div>

            {/* Render related products once the product data is fetched */}
            {product && (
                <RelatedProducts category={product.category} />
            )}
        </>
    );
}

export default ProductPage;
