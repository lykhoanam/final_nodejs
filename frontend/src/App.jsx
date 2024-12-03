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
    const navigationItems = ["For Him", "Unisex", "Body Mist"];

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
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                          />

                            <ProductGrid category="For Her"/>
                          </>
                        }
                    />
                    <Route
                        path="/forhim"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                            />
                            <ProductGrid category="For Him"/>
                          </>
                        }
                    />
                    <Route
                        path="/unisex"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                            />
                            <ProductGrid category="Unisex"/>
                          </>
                        }
                    />
                    <Route
                        path="/bodymist"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                            />
                            <ProductGrid category="Body Mist"/>
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