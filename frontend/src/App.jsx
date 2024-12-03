import React, { useState, createContext, useEffect} from "react";
import {gapi} from 'gapi-script';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import CategoryDescription from "./components/product-grid/CategoryDescription";
import ProductGrid from "./components/product-grid/ProductGrid.jsx";
import Footer from "./components/Footer";
import Cart from "./components/cart/Cart";
import Login from "./components/login/Login"
import Register from "./components/register/Register.jsx"
import ProductPage from "./components/product-page/ProductPage";
import Profile from "./components/profile/ProfilePage.jsx"
import Recovery from "./components/login/VerifyOTP.jsx"
import CheckOut from "./components/cart/CheckOut.jsx"

export const Context = createContext();

const clientId = "1074315812564-92s9klc0eos45ujtefj613bkualvulq0.apps.googleusercontent.com";

function App() {
    const [cartCounter, setCartCounter] = useState(0);
    const navigationItems = ["Shoes", "Bags", "Hats"];

    useEffect(() => {
      function start(){
        gapi.client.init({
          clientId: clientId,
          scope: ""
        })
      }

      gapi.load('client:auth2', start)
    });

    return (
        <Context.Provider value={[cartCounter, setCartCounter]}>
            {/* <AnnouncementBar title="Free Shipping in Europe" /> */}
            <Header navigationItems={navigationItems} />

            <Router>
                <Routes>
                    <Route path="/recovery" element={<Recovery/>}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/cart" element={<Cart />}></Route>
                    <Route path="/checkout" element={<CheckOut />}></Route>
                    <Route
                        path="/"
                        element={
                          <>
                            <CategoryDescription
                                desc="Experience the latest in fashion trends! Explore a curated collection of stylish shoes, trendy bags, and chic hats for a complete and elevated look. Shop now and define your personal style"
                                title="Products"
                            />
                            <ProductGrid />
                          </>
                        }
                    />
                    <Route
                        path="/shoes"
                        element={
                          <>
                            <CategoryDescription
                                title="Shoes"
                                desc="Using mostly recycled fibers, we create sustainable shoes that combine comfort with timeless style. Step into our shoes and experience the difference of artisanal craftsmanship and eco-conscious design."
                            />
                            <ProductGrid category="shoes" />
                          </>
                        }
                    />
                    <Route
                        path="/bags"
                        element={
                          <>
                            <CategoryDescription
                                title="Bags"
                                desc="Discover artisanal excellence in every bag. Our skilled artisans pour heart and soul into crafting each piece from concept to stitch, using eco-conscious materials for elegance with a greener conscience"
                            />
                            <ProductGrid category="bags" />
                          </>
                        }
                    />
                    <Route
                        path="/hats"
                        element={
                          <>
                            <CategoryDescription
                                title="Hats"
                                desc="Our remarkable assortment of hats, where artistry meets functionality. Handpicked materials are thoughtfully sourced, and each hat is crafted to bring you a stunning and versatile accessory. Designed to elevate your style and offer comfort."
                            />
                            <ProductGrid category="hats" />
                          </>
                        }
                    />
                    <Route path="/products/:id" element={<ProductPage />} />
                </Routes>
            </Router>

            <Footer />
        </Context.Provider>
    );
}

export default App;